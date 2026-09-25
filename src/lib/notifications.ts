import "server-only";
import { execute, query } from "./db";
import type { Role } from "./constants";
import type { PoolConnection } from "mysql2/promise";

export type Notification = {
  id: number;
  orderId: number | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export async function notify(role: Role, userId: number, orderId: number | null, message: string, db?: PoolConnection) {
  await execute(
    "INSERT INTO notifications (role, user_id, id_j, message) VALUES (?, ?, ?, ?)",
    [role, userId, orderId, message],
    db,
  );
}

export async function listNotifications(role: Role, userId: number) {
  const rows = await query<{ id: number; orderId: number | null; message: string; isRead: number; createdAt: string }>(
    `SELECT id_n AS id, id_j AS orderId, message, is_read AS isRead, created_at AS createdAt
       FROM notifications WHERE role = ? AND user_id = ?
      ORDER BY id_n DESC LIMIT 30`,
    [role, userId],
  );
  return rows.map<Notification>((row) => ({ ...row, isRead: Boolean(row.isRead) }));
}

export async function markAllRead(role: Role, userId: number) {
  await execute("UPDATE notifications SET is_read = TRUE WHERE role = ? AND user_id = ? AND is_read = FALSE", [
    role,
    userId,
  ]);
}
