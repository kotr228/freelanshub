import { queryOne } from "@/lib/db";
import { sendStored } from "@/lib/download";
import { canView, getOrder } from "@/lib/orders";
import { getSession } from "@/lib/session";

export async function GET(_request: Request, ctx: RouteContext<"/api/files/[id]">) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const file = await queryOne<{ orderId: number; name: string; path: string }>(
    "SELECT id_j AS orderId, file_name AS name, file_path AS path FROM files WHERE id_file = ?",
    [Number((await ctx.params).id) || 0],
  );
  const order = file ? await getOrder(file.orderId) : null;
  if (!file || !order || !canView(session, order)) return new Response("Not found", { status: 404 });

  return sendStored(file.path, file.name);
}
