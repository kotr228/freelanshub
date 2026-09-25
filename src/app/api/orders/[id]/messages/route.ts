import { NextResponse, type NextRequest } from "next/server";
import { chatWritable, resolveThread } from "@/lib/access";
import { MAX_FILE_SIZE, ORDER_FILE_EXTENSIONS } from "@/lib/constants";
import { execute, queryOne } from "@/lib/db";
import { notify } from "@/lib/notifications";
import { listMessages } from "@/lib/orders";
import { getSession } from "@/lib/session";
import { extensionOf, safeDisplayName, saveUpload } from "@/lib/storage";

function intParam(value: string | null) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function GET(request: NextRequest, ctx: RouteContext<"/api/orders/[id]/messages">) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orderId = intParam((await ctx.params).id);
  const search = request.nextUrl.searchParams;
  const thread = orderId ? await resolveThread(session, orderId, intParam(search.get("thread"))) : null;
  if (!thread) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const messages = await listMessages(thread.order.id, thread.freelancerId, intParam(search.get("after")) ?? 0);
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest, ctx: RouteContext<"/api/orders/[id]/messages">) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orderId = intParam((await ctx.params).id);
  const form = await request.formData();
  const thread = orderId ? await resolveThread(session, orderId, intParam(String(form.get("thread") ?? ""))) : null;
  if (!thread) return NextResponse.json({ error: "Немає доступу до чату" }, { status: 404 });
  if (!chatWritable(thread.order)) return NextResponse.json({ error: "Замовлення в архіві" }, { status: 409 });

  // The client may only write into a thread the freelancer started, or to the assigned freelancer.
  if (session.role === "client" && thread.freelancerId !== thread.order.freelancerId) {
    const exists = await queryOne("SELECT 1 FROM chat WHERE id_j = ? AND id_f = ? LIMIT 1", [
      thread.order.id,
      thread.freelancerId,
    ]);
    if (!exists) return NextResponse.json({ error: "Немає такого діалогу" }, { status: 404 });
  }

  const message = String(form.get("message") ?? "")
    .trim()
    .slice(0, 4000);
  const file = form.get("file");
  const upload = file instanceof File && file.size > 0 ? file : null;
  if (!message && !upload) return NextResponse.json({ error: "Порожнє повідомлення" }, { status: 400 });
  if (upload) {
    if (upload.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Файл більший за 25 МБ" }, { status: 400 });
    if (!ORDER_FILE_EXTENSIONS.includes(extensionOf(upload.name))) {
      return NextResponse.json({ error: "Тип файлу не підтримується" }, { status: 400 });
    }
  }

  const { order, freelancerId } = thread;
  const inserted = await execute("INSERT INTO chat (id_j, id_f, id_c, sender, message) VALUES (?, ?, ?, ?, ?)", [
    order.id,
    freelancerId,
    order.clientId,
    session.role,
    message || "Файл",
  ]);
  if (upload) {
    const stored = await saveUpload(upload, "chat");
    await execute("INSERT INTO chat_files (id_chat, file_name, file_path) VALUES (?, ?, ?)", [
      inserted.insertId,
      safeDisplayName(upload.name),
      stored,
    ]);
  }

  // Tell a client about the first question from a new freelancer on a free order.
  if (session.role === "freelancer" && order.stage === "free") {
    const count = await queryOne<{ n: number }>("SELECT COUNT(*) AS n FROM chat WHERE id_j = ? AND id_f = ?", [
      order.id,
      freelancerId,
    ]);
    if (Number(count?.n) === 1) {
      await notify("client", order.clientId, order.id, `Нове запитання щодо замовлення «${order.title}»`);
    }
  }

  return NextResponse.json({ id: inserted.insertId }, { status: 201 });
}
