import "server-only";
import { getOrder, type Order } from "./orders";
import { prisma } from "./prisma";
import type { Session } from "./session";

/**
 * Resolves which conversation a user may use on an order.
 * A conversation is keyed by (order, freelancer):
 *  - a freelancer always talks in their own thread, while the order is open or assigned to them;
 *  - the client picks a thread: the assigned freelancer, or one who already wrote.
 */
export async function resolveThread(session: Session, orderId: number, requested: number | null) {
  const order = await getOrder(orderId);
  if (!order) return null;

  if (session.role === "freelancer") {
    const allowed = order.freelancerId === session.userId || order.stage === "free";
    return allowed ? { order, freelancerId: session.userId } : null;
  }

  if (order.clientId !== session.userId) return null;
  const freelancerId = requested ?? order.freelancerId;
  if (!freelancerId) return null;
  if (freelancerId !== order.freelancerId) {
    const exists = await prisma.message.findFirst({ where: { jobId: order.id, freelancerId }, select: { id: true } });
    if (!exists) return null;
  }
  return { order, freelancerId };
}

export function chatWritable(order: Order) {
  return order.stage !== "archived";
}
