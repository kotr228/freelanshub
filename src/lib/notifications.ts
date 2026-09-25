import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "./prisma";

export type Notification = {
  id: number;
  orderId: number | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type Db = Prisma.TransactionClient | typeof prisma;

export async function notify(userId: number, orderId: number | null, message: string, db: Db = prisma) {
  await db.notification.create({ data: { userId, jobId: orderId, message: message.slice(0, 500) } });
}

export async function listNotifications(userId: number): Promise<Notification[]> {
  const rows = await prisma.notification.findMany({
    where: { userId },
    orderBy: { id: "desc" },
    take: 30,
    select: { id: true, jobId: true, message: true, isRead: true, createdAt: true },
  });
  return rows.map((row) => ({
    id: row.id,
    orderId: row.jobId,
    message: row.message,
    isRead: row.isRead,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function markAllRead(userId: number) {
  await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
}
