"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { execute, query, queryOne, transaction } from "@/lib/db";
import { fail, fileFrom, fromZodError, ok, str, type FormState } from "@/lib/forms";
import { notify } from "@/lib/notifications";
import { getOrder, participantRole } from "@/lib/orders";
import { requireSession } from "@/lib/session";
import { extensionOf, removeStored, safeDisplayName, saveUpload } from "@/lib/storage";
import { MAX_FILE_SIZE, ORDER_FILE_EXTENSIONS, splitPayment } from "@/lib/constants";
import { orderSchema } from "@/lib/validation";

function checkUpload(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) return "Файл більший за 25 МБ";
  if (!ORDER_FILE_EXTENSIONS.includes(extensionOf(file.name))) {
    return `Тип файлу .${extensionOf(file.name) || "?"} не підтримується. Якщо це проєкт — заархівуйте його (zip, rar, 7z)`;
  }
  return null;
}

async function attachFile(orderId: number, file: File, role: "client" | "freelancer") {
  const stored = await saveUpload(file, "orders");
  await execute("INSERT INTO files (id_j, file_name, file_path, uploaded_by) VALUES (?, ?, ?, ?)", [
    orderId,
    safeDisplayName(file.name),
    stored,
    role,
  ]);
}

async function removeOrderFiles(orderId: number) {
  const stored = await query<{ path: string }>(
    `SELECT file_path AS path FROM files WHERE id_j = ?
     UNION ALL
     SELECT cf.file_path FROM chat_files cf JOIN chat ch ON ch.id_chat = cf.id_chat WHERE ch.id_j = ?`,
    [orderId, orderId],
  );
  await Promise.all(stored.map((row) => removeStored(row.path)));
}

function refresh(orderId: number) {
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/client");
  revalidatePath("/freelancer", "layout");
}

// ---------------------------------------------------------------- client

export async function createOrder(_prev: FormState, formData: FormData): Promise<FormState> {
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
    const problem = checkUpload(file);
    if (problem) return { ...fail(problem, formData), fieldErrors: { files: problem } };
  }

  const { title, type, specialty, deadline, price, description } = parsed.data;
  const result = await execute(
    `INSERT INTO job (lable, spacsalyty, tipe, description, id_c, status, price, date)
     VALUES (?, ?, ?, ?, ?, 'S1', ?, ?)`,
    [title, specialty, type, description, session.userId, price, `${deadline} 23:59:59`],
  );
  for (const file of files) await attachFile(result.insertId, file, "client");

  refresh(result.insertId);
  redirect(`/orders/${result.insertId}`);
}

export async function cancelOrder(orderId: number): Promise<FormState> {
  const session = await requireSession("client");
  const order = await getOrder(orderId);
  if (!order || order.clientId !== session.userId) return fail("Замовлення не знайдено");
  if (order.stage !== "free") return fail("Скасувати можна лише замовлення, яке ще ніхто не взяв");

  await removeOrderFiles(orderId);
  const result = await execute("DELETE FROM job WHERE id_j = ? AND id_c = ? AND status = 'S1' AND id_f IS NULL", [
    orderId,
    session.userId,
  ]);
  if (result.affectedRows === 0) return fail("Замовлення вже взяли в роботу");

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

  const card = await queryOne<{ card: string | null }>(
    "SELECT bank_cart AS card FROM freelanser_dod WHERE id_f = ? AND bank_cart IS NOT NULL ORDER BY id_fd DESC LIMIT 1",
    [order.freelancerId],
  );
  if (!card?.card) {
    await notify(
      "freelancer",
      order.freelancerId,
      orderId,
      `Замовник хоче сплатити «${order.title}», але у вас не вказана банківська картка. Додайте її в налаштуваннях.`,
    );
    return fail("Виконавець ще не вказав банківську картку для виплати. Ми надіслали йому нагадування.");
  }

  const { payout } = splitPayment(order.price);
  const freelancerId = order.freelancerId;
  const paid = await transaction(async (conn) => {
    // TODO: connect a real payment provider here. For now the payment is recorded as successful.
    const result = await execute("UPDATE job SET status = 'S3' WHERE id_j = ? AND status = 'S2'", [orderId], conn);
    if (result.affectedRows === 0) return false;
    await execute(
      "INSERT INTO `otrimani kohti` (id_c, id_j, price, date) VALUES (?, ?, ?, NOW())",
      [session.userId, orderId, order.price],
      conn,
    );
    await execute(
      "INSERT INTO viplsts (id_f, how_job, how_money, bank_card, date) VALUES (?, ?, ?, ?, CURDATE())",
      [freelancerId, orderId, payout, card.card],
      conn,
    );
    await notify(
      "freelancer",
      freelancerId,
      orderId,
      `Замовлення «${order.title}» сплачено. До виплати: ${payout.toFixed(2)} грн`,
      conn,
    );
    return true;
  });
  if (!paid) return fail("Статус замовлення змінився, оновіть сторінку");

  refresh(orderId);
  return ok("Оплату проведено");
}

export async function archiveOrder(orderId: number): Promise<FormState> {
  const session = await requireSession("client");
  const result = await execute("UPDATE job SET status = 'S4' WHERE id_j = ? AND id_c = ? AND status = 'S3'", [
    orderId,
    session.userId,
  ]);
  if (result.affectedRows === 0) return fail("Архівувати можна лише сплачене замовлення");
  refresh(orderId);
  return ok("Замовлення перенесено в архів");
}

// ---------------------------------------------------------------- freelancer

export async function takeOrder(orderId: number): Promise<FormState> {
  const session = await requireSession("freelancer");
  const order = await getOrder(orderId);
  if (!order) return fail("Замовлення не знайдено");

  const result = await execute("UPDATE job SET id_f = ? WHERE id_j = ? AND status = 'S1' AND id_f IS NULL", [
    session.userId,
    orderId,
  ]);
  if (result.affectedRows === 0) return fail("Замовлення вже взяв інший виконавець");

  await notify("client", order.clientId, orderId, `Ваше замовлення «${order.title}» взяли в роботу`);
  refresh(orderId);
  return ok("Замовлення ваше! Узгодьте деталі із замовником у чаті");
}

export async function refuseOrder(orderId: number): Promise<FormState> {
  const session = await requireSession("freelancer");
  const order = await getOrder(orderId);
  if (!order || order.freelancerId !== session.userId) return fail("Замовлення не знайдено");

  const result = await execute("UPDATE job SET id_f = NULL WHERE id_j = ? AND id_f = ? AND status = 'S1'", [
    orderId,
    session.userId,
  ]);
  if (result.affectedRows === 0) return fail("Відмовитися можна лише від замовлення, яке ще виконується");

  await notify(
    "client",
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

  const result = await execute("UPDATE job SET status = 'S2' WHERE id_j = ? AND id_f = ? AND status = 'S1'", [
    orderId,
    session.userId,
  ]);
  if (result.affectedRows === 0) return fail("Замовлення вже позначене як виконане");

  await notify(
    "client",
    order.clientId,
    orderId,
    `Замовлення «${order.title}» виконано. Перевірте результат і сплатіть`,
  );
  refresh(orderId);
  return ok("Замовника повідомлено про виконання");
}

// ---------------------------------------------------------------- files (both roles)

export async function uploadOrderFile(orderId: number, _prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const order = await getOrder(orderId);
  const role = order ? participantRole(session, order) : null;
  if (!order || !role) return fail("Немає доступу до замовлення");
  if (order.stage === "archived") return fail("Замовлення в архіві");

  const file = fileFrom(formData, "file");
  if (!file) return fail("Оберіть файл");
  const problem = checkUpload(file);
  if (problem) return fail(problem);

  await attachFile(orderId, file, role);
  refresh(orderId);
  return ok("Файл завантажено");
}

export async function deleteOrderFile(fileId: number): Promise<FormState> {
  const session = await requireSession();
  const file = await queryOne<{ orderId: number; path: string; uploadedBy: string | null }>(
    "SELECT id_j AS orderId, file_path AS path, uploaded_by AS uploadedBy FROM files WHERE id_file = ?",
    [fileId],
  );
  const order = file ? await getOrder(file.orderId) : null;
  if (!file || !order || participantRole(session, order) !== file.uploadedBy) {
    return fail("Видалити можна лише власний файл");
  }
  if (order.stage === "paid" || order.stage === "archived")
    return fail("Файли сплаченого замовлення не можна видаляти");

  await execute("DELETE FROM files WHERE id_file = ?", [fileId]);
  await removeStored(file.path);
  refresh(order.id);
  return ok("Файл видалено");
}
