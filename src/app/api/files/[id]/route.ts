import { sendStored } from "@/lib/download";
import { canView, getOrder } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

/** Files attached to an order (not chat attachments — see /api/chat-files). */
export async function GET(_request: Request, ctx: RouteContext<"/api/files/[id]">) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const id = Number((await ctx.params).id);
  const file = Number.isInteger(id)
    ? await prisma.attachment.findFirst({
        where: { id, messageId: null },
        select: { jobId: true, fileName: true, filePath: true },
      })
    : null;
  const order = file ? await getOrder(file.jobId) : null;
  if (!file || !order || !canView(session, order)) return new Response("Not found", { status: 404 });

  return sendStored(file.filePath, file.fileName);
}
