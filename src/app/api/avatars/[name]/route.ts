import { sendStored } from "@/lib/download";

// Avatars are public, like on any profile page. Only files inside uploads/avatars are served.
export async function GET(_request: Request, ctx: RouteContext<"/api/avatars/[name]">) {
  const { name } = await ctx.params;
  if (!/^[\w.-]+\.(png|jpe?g|gif|webp)$/i.test(name)) return new Response("Not found", { status: 404 });
  return sendStored(`uploads/avatars/${name}`, name, { inline: true });
}
