"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { MAX_FILE_SIZE, ORDER_FILE_EXTENSIONS } from "@/lib/constants";
import { fail, fromZodError, str, type FormState } from "@/lib/forms";
import {
  CLIENT_FILTERS,
  FREELANCER_FILTERS,
  orderSelect,
  toOrder,
  type ClientFilter,
  type FreelancerFilter,
} from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { extensionOf, removeStored, safeDisplayName, saveUpload } from "@/lib/storage";
import { orderSchema, specialtyCodes, typeCodes } from "@/lib/validation";

// ------------------------------------------------------------------ create

/**
 * Creates a job (with optional attachments) for the signed-in client.
 * Usage in a Client Component: const [state, action] = useActionState(createJob, {});
 */
export async function createJob(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession("client");

  const parsed = orderSchema.safeParse({
    title: str(formData, "title"),
    type: str(formData, "type"),
    specialty: str(formData, "specialty"),
    deadline: str(formData, "deadline"),
    price: str(formData, "price"),
    description: str(formData, "description"),
  });
  if (!parsed.success) return fromZodError(parsed.error, formData);

  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of files) {
    const problem =
      file.size > MAX_FILE_SIZE
        ? "Файл більший за 25 МБ"
        : !ORDER_FILE_EXTENSIONS.includes(extensionOf(file.name))
          ? `Тип файлу .${extensionOf(file.name) || "?"} не підтримується. Проєкти архівуйте в zip, rar або 7z`
          : null;
    if (problem) return { ...fail(problem, formData), fieldErrors: { files: problem } };
  }

  const { title, type, specialty, deadline, price, description } = parsed.data;

  // Files go to disk first; if the database write fails they are removed again.
  const stored = await Promise.all(files.map((file) => saveUpload(file, "orders")));
  let jobId: number;
  try {
    const job = await prisma.job.create({
      data: {
        title,
        type,
        specialty,
        description,
        price: new Prisma.Decimal(price),
        deadline: new Date(`${deadline}T00:00:00Z`),
        client: { connect: { id: session.userId } },
        attachments: {
          create: files.map((file, i) => ({
            uploaderId: session.userId,
            fileName: safeDisplayName(file.name),
            filePath: stored[i],
            size: file.size,
          })),
        },
      },
      select: { id: true },
    });
    jobId = job.id;
  } catch (error) {
    await Promise.all(stored.map((path) => removeStored(path)));
    // P2025: the connected client row does not exist (stale session)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return fail("Акаунт не знайдено. Увійдіть знову.");
    }
    console.error("createJob failed", error);
    return fail("Не вдалося зберегти замовлення. Спробуйте ще раз.", formData);
  }

  revalidatePath("/client");
  revalidatePath("/freelancer");
  redirect(`/orders/${jobId}`); // outside try/catch: redirect() works by throwing
}

// ------------------------------------------------------------------ catalog

// Search params arrive as untrusted strings: anything invalid is simply ignored.
const catalogSchema = z.object({
  q: z.string().trim().max(100).optional().catch(undefined),
  specialty: z.enum(specialtyCodes).optional().catch(undefined),
  type: z.enum(typeCodes).optional().catch(undefined),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .catch(undefined),
  priceFrom: z.coerce.number().nonnegative().optional().catch(undefined),
  priceTo: z.coerce.number().nonnegative().optional().catch(undefined),
  sort: z.enum(["new", "price_desc", "price_asc", "deadline"]).catch("new"),
  page: z.coerce.number().int().min(1).catch(1),
});

export type CatalogQuery = Record<string, string | string[] | undefined>;

const PAGE_SIZE = 20;

const ORDER_BY: Record<z.infer<typeof catalogSchema>["sort"], Prisma.JobOrderByWithRelationInput[]> = {
  new: [{ createdAt: "desc" }],
  price_desc: [{ price: "desc" }, { id: "desc" }],
  price_asc: [{ price: "asc" }, { id: "desc" }],
  deadline: [{ deadline: { sort: "asc", nulls: "last" } }, { id: "desc" }],
};

/**
 * Open jobs for the freelancer catalog, with filters and pagination.
 * Pass the page's searchParams straight in: `await getJobs(await searchParams)`.
 */
export async function getJobs(query: CatalogQuery = {}) {
  await requireSession("freelancer");
  const first = (key: string) => {
    const value = query[key];
    return (Array.isArray(value) ? value[0] : value) || undefined;
  };
  const { q, specialty, type, deadline, priceFrom, priceTo, sort, page } = catalogSchema.parse({
    q: first("q"),
    specialty: first("specialty"),
    type: first("type"),
    deadline: first("deadline"),
    priceFrom: first("priceFrom"),
    priceTo: first("priceTo"),
    sort: first("sort"),
    page: first("page"),
  });

  const where: Prisma.JobWhereInput = {
    status: "OPEN",
    specialty,
    type,
    deadline: deadline ? { gte: new Date(`${deadline}T00:00:00Z`) } : undefined,
    price: priceFrom !== undefined || priceTo !== undefined ? { gte: priceFrom, lte: priceTo } : undefined,
    OR: q
      ? [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }]
      : undefined,
  };

  // One round trip: page of rows + total count.
  const [rows, total] = await prisma.$transaction([
    prisma.job.findMany({
      where,
      select: orderSelect,
      orderBy: ORDER_BY[sort],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.job.count({ where }),
  ]);

  return { jobs: rows.map(toOrder), total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

// ------------------------------------------------------------------ my jobs

/** Jobs of the signed-in user: posted ones for a client, taken ones for a freelancer. */
export async function getMyJobs(filter: ClientFilter | FreelancerFilter) {
  const session = await requireSession();
  const where: Prisma.JobWhereInput =
    session.role === "client"
      ? { clientId: session.userId, ...(CLIENT_FILTERS[filter as ClientFilter]?.where ?? CLIENT_FILTERS.active.where) }
      : {
          freelancerId: session.userId,
          ...(FREELANCER_FILTERS[filter as FreelancerFilter]?.where ?? FREELANCER_FILTERS.in_progress.where),
        };

  const rows = await prisma.job.findMany({ where, select: orderSelect, orderBy: { createdAt: "desc" } });
  return rows.map(toOrder);
}
