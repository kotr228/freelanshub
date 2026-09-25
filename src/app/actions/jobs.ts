"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { JobStatus, JobType, Prisma } from "@/generated/prisma/client";
import { SPECIALTIES } from "@/lib/constants";
import { fromZodError, str, type FormState } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { orderSchema } from "@/lib/validation";

// Form values (type1…type3) → database enum
const JOB_TYPE: Record<"type1" | "type2" | "type3", JobType> = {
  type1: JobType.ONE_TIME,
  type2: JobType.FIXED_PERIOD,
  type3: JobType.LONG_TERM,
};

// Fields safe to send to the browser (no client e-mail/phone, no Decimal objects).
const jobListSelect = {
  id: true,
  title: true,
  specialty: true,
  type: true,
  description: true,
  price: true,
  deadline: true,
  status: true,
  createdAt: true,
  client: { select: { id: true, name: true, avatar: true } },
  freelancer: { select: { id: true, name: true } },
} satisfies Prisma.JobSelect;

type JobRow = Prisma.JobGetPayload<{ select: typeof jobListSelect }>;

// Decimal and Date cannot cross the Server → Client Component boundary as-is.
function serialize(job: JobRow) {
  return {
    ...job,
    price: job.price.toNumber(),
    deadline: job.deadline?.toISOString().slice(0, 10) ?? null,
    createdAt: job.createdAt.toISOString(),
  };
}

export type JobListItem = ReturnType<typeof serialize>;

// ------------------------------------------------------------------ create

/**
 * Creates a job for the signed-in client.
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

  const { title, type, specialty, deadline, price, description } = parsed.data;

  let jobId: number;
  try {
    const job = await prisma.job.create({
      data: {
        title,
        type: JOB_TYPE[type],
        specialty,
        description,
        price: new Prisma.Decimal(price),
        deadline: new Date(`${deadline}T00:00:00Z`),
        client: { connect: { id: session.userId } },
      },
      select: { id: true },
    });
    jobId = job.id;
  } catch (error) {
    // P2025: the connected client row does not exist (stale session)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return { error: "Акаунт не знайдено. Увійдіть знову.", at: Date.now() };
    }
    console.error("createJob failed", error);
    return { error: "Не вдалося зберегти замовлення. Спробуйте ще раз.", at: Date.now() };
  }

  revalidatePath("/client");
  revalidatePath("/freelancer");
  redirect(`/orders/${jobId}`); // outside try/catch: redirect() works by throwing
}

// ------------------------------------------------------------------ read

const catalogSchema = z.object({
  q: z.string().trim().max(100).optional(),
  specialty: z.enum(Object.keys(SPECIALTIES) as [string, ...string[]]).optional(),
  type: z.enum(JobType).optional(),
  priceFrom: z.coerce.number().nonnegative().optional(),
  priceTo: z.coerce.number().nonnegative().optional(),
  sort: z.enum(["new", "price_desc", "price_asc", "deadline"]).default("new"),
  page: z.coerce.number().int().min(1).default(1),
});

export type CatalogQuery = z.input<typeof catalogSchema>;

const PAGE_SIZE = 20;

const ORDER_BY: Record<z.infer<typeof catalogSchema>["sort"], Prisma.JobOrderByWithRelationInput[]> = {
  new: [{ createdAt: "desc" }],
  price_desc: [{ price: "desc" }, { id: "desc" }],
  price_asc: [{ price: "asc" }, { id: "desc" }],
  deadline: [{ deadline: { sort: "asc", nulls: "last" } }, { id: "desc" }],
};

/**
 * Open jobs for the freelancer catalog, with filters and pagination.
 * Callable from a Server Component (`await getJobs(searchParams)`) or from a
 * Client Component as a Server Action.
 */
export async function getJobs(query: CatalogQuery = {}) {
  await requireSession("freelancer");
  const { q, specialty, type, priceFrom, priceTo, sort, page } = catalogSchema.parse(query);

  const where: Prisma.JobWhereInput = {
    status: JobStatus.OPEN,
    specialty,
    type,
    price: priceFrom !== undefined || priceTo !== undefined ? { gte: priceFrom, lte: priceTo } : undefined,
    OR: q
      ? [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }]
      : undefined,
  };

  // One round trip: page of rows + total count.
  const [rows, total] = await prisma.$transaction([
    prisma.job.findMany({
      where,
      select: jobListSelect,
      orderBy: ORDER_BY[sort],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.job.count({ where }),
  ]);

  return { jobs: rows.map(serialize), total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

/** Jobs of the signed-in user: posted ones for a client, taken ones for a freelancer. */
export async function getMyJobs(status?: JobStatus) {
  const session = await requireSession();
  const rows = await prisma.job.findMany({
    where: {
      ...(session.role === "client" ? { clientId: session.userId } : { freelancerId: session.userId }),
      status,
    },
    select: jobListSelect,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(serialize);
}
