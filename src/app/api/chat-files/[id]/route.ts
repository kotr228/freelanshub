import { resolveThread } from "@/lib/access";
import { queryOne } from "@/lib/db";
import { sendStored } from "@/lib/download";
import { getSession } from "@/lib/session";

export async function GET(_request: Request, ctx: RouteContext<"/api/chat-files/[id]">) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const file = await queryOne<{ orderId: number; freelancerId: number; name: string; path: string }>(
    `SELECT ch.id_j AS orderId, ch.id_f AS freelancerId, cf.file_name AS name, cf.file_path AS path
       FROM chat_files cf JOIN chat ch ON ch.id_chat = cf.id_chat
      WHERE cf.id_chat_file = ?`,
    [Number((await ctx.params).id) || 0],
  );
  const thread = file ? await resolveThread(session, file.orderId, file.freelancerId) : null;
  if (!file || !thread || thread.freelancerId !== file.freelancerId) return new Response("Not found", { status: 404 });

  return sendStored(file.path, file.name);
}
