import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { orderStage, type JobStatusCode, type OrderStage, type Role } from "./constants";
import { prisma } from "./prisma";
import type { Session } from "./session";

/** A job as the UI sees it: plain JSON (no Decimal / Date), safe to pass to Client Components. */
export type Order = {
  id: number;
  title: string;
  specialty: string;
  type: string;
  description: string;
  status: JobStatusCode;
  price: number;
  /** "YYYY-MM-DD" */
  deadline: string | null;
  createdAt: string;
  clientId: number;
  clientName: string;
  freelancerId: number | null;
  freelancerName: string | null;
  stage: OrderStage;
};

export const orderSelect = {
  id: true,
  title: true,
  specialty: true,
  type: true,
  description: true,
  status: true,
  price: true,
  deadline: true,
  createdAt: true,
  clientId: true,
  freelancerId: true,
  client: { select: { name: true } },
  freelancer: { select: { name: true } },
} satisfies Prisma.JobSelect;

type OrderRow = Prisma.JobGetPayload<{ select: typeof orderSelect }>;

export function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    title: row.title,
    specialty: row.specialty,
    type: row.type,
    description: row.description,
    status: row.status,
    price: row.price.toNumber(),
    deadline: row.deadline?.toISOString().slice(0, 10) ?? null,
    createdAt: row.createdAt.toISOString(),
    clientId: row.clientId,
    clientName: row.client.name,
    freelancerId: row.freelancerId,
    freelancerName: row.freelancer?.name ?? null,
    stage: orderStage(row.status),
  };
}

export async function getOrder(id: number) {
  if (!Number.isInteger(id) || id <= 0) return null;
  const row = await prisma.job.findUnique({ where: { id }, select: orderSelect });
  return row ? toOrder(row) : null;
}

// ------------------------------------------------------------------ lists per role

export const CLIENT_FILTERS = {
  active: { label: "Активні", where: { status: { in: ["OPEN", "IN_PROGRESS"] } } },
  free: { label: "Вільні", where: { status: "OPEN" } },
  in_progress: { label: "На виконанні", where: { status: "IN_PROGRESS" } },
  done: { label: "Очікують оплату", where: { status: "DONE" } },
  inactive: { label: "Завершені", where: { status: { in: ["PAID", "ARCHIVED"] } } },
} as const satisfies Record<string, { label: string; where: Prisma.JobWhereInput }>;

export type ClientFilter = keyof typeof CLIENT_FILTERS;

export const FREELANCER_FILTERS = {
  in_progress: { label: "На виконанні", where: { status: "IN_PROGRESS" } },
  done: { label: "Очікують оплату", where: { status: "DONE" } },
  paid: { label: "Сплачені", where: { status: { in: ["PAID", "ARCHIVED"] } } },
} as const satisfies Record<string, { label: string; where: Prisma.JobWhereInput }>;

export type FreelancerFilter = keyof typeof FREELANCER_FILTERS;

/** Number of the client's jobs per status, computed with a single GROUP BY. */
export async function clientOrderCounts(clientId: number): Promise<Record<ClientFilter, number>> {
  const groups = await prisma.job.groupBy({ by: ["status"], where: { clientId }, _count: { _all: true } });
  const n = (status: JobStatusCode) => groups.find((g) => g.status === status)?._count._all ?? 0;
  return {
    active: n("OPEN") + n("IN_PROGRESS"),
    free: n("OPEN"),
    in_progress: n("IN_PROGRESS"),
    done: n("DONE"),
    inactive: n("PAID") + n("ARCHIVED"),
  };
}

// ------------------------------------------------------------------ access

/**
 * Who may open an order: its client, its assigned freelancer, and — while the
 * order is still open — any freelancer browsing the catalog.
 */
export function canView(session: Session, order: Order) {
  if (session.role === "client") return order.clientId === session.userId;
  if (order.freelancerId === session.userId) return true;
  return order.stage === "free";
}

export function participantRole(session: Session, order: Order): Role | null {
  if (session.role === "client" && order.clientId === session.userId) return "client";
  if (session.role === "freelancer" && order.freelancerId === session.userId) return "freelancer";
  return null;
}

// ------------------------------------------------------------------ files

export type OrderFile = {
  id: number;
  name: string;
  uploadedBy: Role | null;
  uploadedAt: string;
};

/** Files attached to the order itself (chat attachments are listed with their messages). */
export async function listOrderFiles(order: Pick<Order, "id" | "clientId">): Promise<OrderFile[]> {
  const rows = await prisma.attachment.findMany({
    where: { jobId: order.id, messageId: null },
    orderBy: { id: "asc" },
    select: { id: true, fileName: true, uploaderId: true, createdAt: true },
  });
  return rows.map((row) => ({
    id: row.id,
    name: row.fileName,
    uploadedBy: row.uploaderId === null ? null : row.uploaderId === order.clientId ? "client" : "freelancer",
    uploadedAt: row.createdAt.toISOString(),
  }));
}

// ------------------------------------------------------------------ chat

export type ChatMessage = {
  id: number;
  sender: Role;
  message: string;
  createdAt: string;
  file: { id: number; name: string } | null;
};

export async function listMessages(order: Pick<Order, "id" | "clientId">, freelancerId: number, afterId = 0) {
  const rows = await prisma.message.findMany({
    where: { jobId: order.id, freelancerId, id: { gt: afterId } },
    orderBy: { id: "asc" },
    select: {
      id: true,
      senderId: true,
      body: true,
      createdAt: true,
      attachments: { select: { id: true, fileName: true }, take: 1 },
    },
  });
  return rows.map<ChatMessage>((row) => ({
    id: row.id,
    sender: row.senderId === order.clientId ? "client" : "freelancer",
    message: row.body,
    createdAt: row.createdAt.toISOString(),
    file: row.attachments[0] ? { id: row.attachments[0].id, name: row.attachments[0].fileName } : null,
  }));
}

export type ChatThread = { freelancerId: number; freelancerName: string; count: number; lastAt: string };

/** For the client: every freelancer who has written about this order, most recent first. */
export async function listThreads(orderId: number): Promise<ChatThread[]> {
  const groups = await prisma.message.groupBy({
    by: ["freelancerId"],
    where: { jobId: orderId },
    _count: { _all: true },
    _max: { createdAt: true },
    orderBy: { _max: { createdAt: "desc" } },
  });
  const names = await prisma.user.findMany({
    where: { id: { in: groups.map((g) => g.freelancerId) } },
    select: { id: true, name: true },
  });
  return groups.map((g) => ({
    freelancerId: g.freelancerId,
    freelancerName: names.find((u) => u.id === g.freelancerId)?.name ?? "—",
    count: g._count._all,
    lastAt: g._max.createdAt?.toISOString() ?? "",
  }));
}

// ------------------------------------------------------------------ reviews

export type OrderReview = {
  id: number;
  authorRole: Role;
  authorName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

export async function listReviews(order: Pick<Order, "id" | "clientId">): Promise<OrderReview[]> {
  const rows = await prisma.review.findMany({
    where: { jobId: order.id },
    orderBy: { id: "asc" },
    select: {
      id: true,
      authorId: true,
      rating: true,
      comment: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  });
  return rows.map((row) => ({
    id: row.id,
    authorRole: row.authorId === order.clientId ? "client" : "freelancer",
    authorName: row.author.name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.createdAt.toISOString(),
  }));
}

/** Average rating a user received, e.g. 4.7 from 12 reviews. */
export async function userRating(userId: number) {
  const agg = await prisma.review.aggregate({ where: { targetId: userId }, _avg: { rating: true }, _count: true });
  return { average: agg._avg.rating, count: agg._count };
}
