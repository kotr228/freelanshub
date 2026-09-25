import { NextResponse } from "next/server";
import { listNotifications } from "@/lib/notifications";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const notifications = await listNotifications(session.userId);
  return NextResponse.json({ notifications, unread: notifications.filter((n) => !n.isRead).length });
}
