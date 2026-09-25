"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { MAX_FILE_SIZE, ORDER_FILE_EXTENSIONS, splitPayment } from "@/lib/constants";
import { fail, fileFrom, fromZodError, ok, str, type FormState } from "@/lib/forms";
import { notify } from "@/lib/notifications";
import { getOrder, participantRole } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { extensionOf, removeStored, safeDisplayName, saveUpload } from "@/lib/storage";
import { reviewSchema } from "@/lib/validation";

// ------------------------------------------------------------------ helpers (not exported: this is a "use server" file)

function checkUpload(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) return "Файл більший за 25 МБ";
  if (!ORDER_FILE_EXTENSIONS.includes(extensionOf(file.name))) {
    return `Тип файлу .${extensionOf(file.name) || "?"} не підтримується. Якщо це проєкт — заархівуйте його (zip, rar, 7z)`;
  }
  return null;
}

function refresh(orderId: number) {
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/client");
  revalidatePath("/freelancer", "layout");
}

// ------------------------------------------------------------------ client

export async function cancelOrder(orderId: number): Promise<FormState> {
  const session = await requireSession("client");
  const files = await prisma.attachment.findMany({
    where: { jobId: orderId, job: { clientId: session.userId, status: "OPEN" } },
    select: { filePath: true },
  });

  // Conditional delete: only the owner, and only while nobody has taken the job.
  const { count } = await prisma.job.deleteMany({ where: { id: orderId, clientId: session.userId, status: "OPEN" } });
  if (count === 0) return fail("Скасувати можна лише замовлення, яке ще ніхто не взяв");

  await Promise.all(files.map((file) => removeStored(file.filePath)));
  refresh(orderId);
  redirect("/client");
}

export async function payOrder(orderId: number): Promise<FormState> {
  const session = await requireSession("client");
  const order = await getOrder(orderId);
  if (!order || order.clientId !== session.userId) return fail("Замовлення не знайдено");
  if (order.stage !== "done" || !order.freelancerId) {
    return fail("Сплатити можна лише після того, як виконавець позначить роботу виконаною");
  }

  const freelancerId = order.freelancerId;
  const freelancer = await prisma.user.findUnique({ where: { id: freelancerId }, select: { bankCard: true } });
  if (!freelancer?.bankCard) {
    await notify(
      freelancerId,
      orderId,
      `Замовник хоче сплатити «${order.title}», але у вас не вказана банківська картка. Додайте її в налаштуваннях.`,
    );
    return fail("Виконавець ще не вказав банківську картку для виплати. Ми надіслали йому нагадування.");
  }

  const { commission, payout } = splitPayment(order.price);
  // TODO: call a real payment provider here. For now the payment is recorded as successful.
  const paid = await prisma.$transaction(async (tx) => {
    const { count } = await tx.job.updateMany({ where: { id: orderId, status: "DONE" }, data: { status: "PAID" } });
    if (count === 0) return false;
    await tx.payment.create({
      data: {
        jobId: orderId,
        clientId: session.userId,
        freelancerId,
        amount: new Prisma.Decimal(order.price),
        commission: new Prisma.Decimal(commission),
        payout: new Prisma.Decimal(payout),
        bankCard: freelancer.bankCard!,
      },
    });
    await notify(
      freelancerId,
      orderId,
      `Замовлення «${order.title}» сплачено. До виплати: ${payout.toFixed(2)} грн`,
      tx,
    );
    return true;
  });
  if (!paid) return fail("Статус замовлення змінився, оновіть сторінку");

  refresh(orderId);
  return ok("Оплату проведено");
}

export async function archiveOrder(orderId: number): Promise<FormState> {
  const session = await requireSession("client");
  const { count } = await prisma.job.updateMany({
    where: { id: orderId, clientId: session.userId, status: "PAID" },
    data: { status: "ARCHIVED" },
  });
  if (count === 0) return fail("Архівувати можна лише сплачене замовлення");
  refresh(orderId);
  return ok("Замовлення перенесено в архів");
}

// ------------------------------------------------------------------ freelancer

export async function takeOrder(orderId: number): Promise<FormState> {
  const session = await requireSession("freelancer");
  const order = await getOrder(orderId);
  if (!order) return fail("Замовлення не знайдено");

  // Atomic: two freelancers clicking at once — only one update matches.
  const { count } = await prisma.job.updateMany({
    where: { id: orderId, status: "OPEN", freelancerId: null },
    data: { status: "IN_PROGRESS", freelancerId: session.userId },
  });
  if (count === 0) return fail("Замовлення вже взяв інший виконавець");

  await notify(order.clientId, orderId, `Ваше замовлення «${order.title}» взяли в роботу`);
  refresh(orderId);
  return ok("Замовлення ваше! Узгодьте деталі із замовником у чаті");
}

export async function refuseOrder(orderId: number): Promise<FormState> {
  const session = await requireSession("freelancer");
  const order = await getOrder(orderId);
  if (!order || order.freelancerId !== session.userId) return fail("Замовлення не знайдено");

  const { count } = await prisma.job.updateMany({
    where: { id: orderId, freelancerId: session.userId, status: "IN_PROGRESS" },
    data: { status: "OPEN", freelancerId: null },
  });
  if (count === 0) return fail("Відмовитися можна лише від замовлення, яке ще виконується");

  await notify(
    order.clientId,
    orderId,
    `Виконавець відмовився від замовлення «${order.title}». Воно знову у вільному доступі`,
  );
  refresh(orderId);
  redirect("/freelancer/orders");
}

export async function completeOrder(orderId: number): Promise<FormState> {
  const session = await requireSession("freelancer");
  const order = await getOrder(orderId);
  if (!order || order.freelancerId !== session.userId) return fail("Замовлення не знайдено");

  const { count } = await prisma.job.updateMany({
    where: { id: orderId, freelancerId: session.userId, status: "IN_PROGRESS" },
    data: { status: "DONE" },
  });
  if (count === 0) return fail("Замовлення вже позначене як виконане");

  await notify(order.clientId, orderId, `Замовлення «${order.title}» виконано. Перевірте результат і сплатіть`);
  refresh(orderId);
  return ok("Замовника повідомлено про виконання");
}

// ------------------------------------------------------------------ files (both roles)

export async function uploadOrderFile(orderId: number, _prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const order = await getOrder(orderId);
  if (!order || !participantRole(session, order)) return fail("Немає доступу до замовлення");
  if (order.stage === "archived") return fail("Замовлення в архіві");

  const file = fileFrom(formData, "file");
  if (!file) return fail("Оберіть файл");
  const problem = checkUpload(file);
  if (problem) return fail(problem);

  const stored = await saveUpload(file, "orders");
  await prisma.attachment.create({
    data: {
      jobId: orderId,
      uploaderId: session.userId,
      fileName: safeDisplayName(file.name),
      filePath: stored,
      size: file.size,
    },
  });
  refresh(orderId);
  return ok("Файл завантажено");
}

export async function deleteOrderFile(fileId: number): Promise<FormState> {
  const session = await requireSession();
  const file = await prisma.attachment.findUnique({
    where: { id: fileId },
    select: { jobId: true, messageId: true, uploaderId: true, filePath: true, job: { select: { status: true } } },
  });
  if (!file || file.messageId !== null || file.uploaderId !== session.userId) {
    return fail("Видалити можна лише власний файл");
  }
  if (file.job.status === "PAID" || file.job.status === "ARCHIVED") {
    return fail("Файли сплаченого замовлення не можна видаляти");
  }

  await prisma.attachment.delete({ where: { id: fileId } });
  await removeStored(file.filePath);
  refresh(file.jobId);
  return ok("Файл видалено");
}

// ------------------------------------------------------------------ reviews

export async function leaveReview(orderId: number, _prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const order = await getOrder(orderId);
  const role = order ? participantRole(session, order) : null;
  if (!order || !role || !order.freelancerId) return fail("Немає доступу до замовлення");
  if (order.stage !== "paid" && order.stage !== "archived") return fail("Відгук можна залишити після оплати");

  const parsed = reviewSchema.safeParse({ rating: str(formData, "rating"), comment: str(formData, "comment") });
  if (!parsed.success) return fromZodError(parsed.error, formData);

  const targetId = role === "client" ? order.freelancerId : order.clientId;
  try {
    await prisma.review.create({
      data: {
        jobId: orderId,
        authorId: session.userId,
        targetId,
        rating: parsed.data.rating,
        comment: parsed.data.comment || null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return fail("Ви вже залишили відгук до цього замовлення");
    }
    throw error;
  }

  await notify(targetId, orderId, `Новий відгук (${parsed.data.rating}★) за замовлення «${order.title}»`);
  refresh(orderId);
  return ok("Дякуємо за відгук!");
}
