import { resolveThread } from "@/lib/access";
import { sendStored } from "@/lib/download";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(_request: Request, ctx: RouteContext<"/api/chat-files/[id]">) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const id = Number((await ctx.params).id);
  const file = Number.isInteger(id)
    ? await prisma.attachment.findFirst({
        where: { id, messageId: { not: null } },
        select: { jobId: true, fileName: true, filePath: true, message: { select: { freelancerId: true } } },
      })
    : null;
  const freelancerId = file?.message?.freelancerId ?? null;
  const thread = file && freelancerId ? await resolveThread(session, file.jobId, freelancerId) : null;
  if (!file || !thread || thread.freelancerId !== freelancerId) return new Response("Not found", { status: 404 });

  return sendStored(file.filePath, file.fileName);
}
