import { NextResponse, type NextRequest } from "next/server";
import { chatWritable, resolveThread } from "@/lib/access";
import { MAX_FILE_SIZE, ORDER_FILE_EXTENSIONS } from "@/lib/constants";
import { notify } from "@/lib/notifications";
import { listMessages } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
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

  const messages = await listMessages(thread.order, thread.freelancerId, intParam(search.get("after")) ?? 0);
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
  const stored = upload ? await saveUpload(upload, "chat") : null;
  const created = await prisma.message.create({
    data: {
      jobId: order.id,
      freelancerId,
      senderId: session.userId,
      body: message || "Файл",
      attachments:
        upload && stored
          ? {
              create: {
                jobId: order.id,
                uploaderId: session.userId,
                fileName: safeDisplayName(upload.name),
                filePath: stored,
                size: upload.size,
              },
            }
          : undefined,
    },
    select: { id: true },
  });

  // Tell the client about the first question from a new freelancer on an open order.
  if (session.role === "freelancer" && order.stage === "free") {
    const count = await prisma.message.count({ where: { jobId: order.id, freelancerId } });
    if (count === 1) await notify(order.clientId, order.id, `Нове запитання щодо замовлення «${order.title}»`);
  }

  return NextResponse.json({ id: created.id }, { status: 201 });
}
