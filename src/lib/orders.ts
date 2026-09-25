import "server-only";
import { query, queryOne } from "./db";
import { orderStage, type OrderStage, type Role } from "./constants";
import type { Session } from "./session";

export type Order = {
  id: number;
  title: string;
  specialty: string;
  type: string;
  description: string;
  status: string;
  price: number;
  deadline: string | null;
  createdAt: string | null;
  clientId: number;
  clientName: string;
  freelancerId: number | null;
  freelancerName: string | null;
  stage: OrderStage;
};

type OrderRow = {
  id_j: number;
  lable: string;
  spacsalyty: string;
  tipe: string;
  description: string;
  status: string;
  price: number;
  date: string | null;
  created_at: string | null;
  id_c: number;
  client_name: string;
  id_f: number | null;
  freelancer_name: string | null;
};

const SELECT_ORDER = `
  SELECT j.id_j, j.lable, j.spacsalyty, j.tipe, j.description, j.status, j.price, j.date, j.created_at,
         j.id_c, c.name AS client_name, j.id_f, f.name AS freelancer_name
    FROM job j
    JOIN cliants_akks c ON c.id_c = j.id_c
    LEFT JOIN freelanser_akks f ON f.id_f = j.id_f`;

function toOrder(row: OrderRow): Order {
  return {
    id: row.id_j,
    title: row.lable,
    specialty: row.spacsalyty,
    type: row.tipe,
    description: row.description,
    status: row.status,
    price: Number(row.price),
    deadline: row.date,
    createdAt: row.created_at,
    clientId: row.id_c,
    clientName: row.client_name,
    freelancerId: row.id_f,
    freelancerName: row.freelancer_name,
    stage: orderStage(row.status, row.id_f),
  };
}

export async function getOrder(id: number) {
  const row = await queryOne<OrderRow>(`${SELECT_ORDER} WHERE j.id_j = ?`, [id]);
  return row ? toOrder(row) : null;
}

export const CLIENT_FILTERS = {
  active: { label: "Активні", where: "j.status = 'S1'" },
  free: { label: "Вільні", where: "j.status = 'S1' AND j.id_f IS NULL" },
  in_progress: { label: "На виконанні", where: "j.status = 'S1' AND j.id_f IS NOT NULL" },
  done: { label: "Очікують оплату", where: "j.status = 'S2'" },
  inactive: { label: "Завершені", where: "j.status IN ('S3', 'S4')" },
} as const;

export type ClientFilter = keyof typeof CLIENT_FILTERS;

export async function listClientOrders(clientId: number, filter: ClientFilter) {
  const rows = await query<OrderRow>(
    `${SELECT_ORDER} WHERE j.id_c = ? AND ${CLIENT_FILTERS[filter].where} ORDER BY j.id_j DESC`,
    [clientId],
  );
  return rows.map(toOrder);
}

export async function clientOrderCounts(clientId: number) {
  const entries = await Promise.all(
    (Object.keys(CLIENT_FILTERS) as ClientFilter[]).map(async (key) => {
      const row = await queryOne<{ n: number }>(
        `SELECT COUNT(*) AS n FROM job j WHERE j.id_c = ? AND ${CLIENT_FILTERS[key].where}`,
        [clientId],
      );
      return [key, Number(row?.n ?? 0)] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<ClientFilter, number>;
}

export const FREELANCER_FILTERS = {
  in_progress: { label: "На виконанні", where: "j.status = 'S1'" },
  done: { label: "Очікують оплату", where: "j.status = 'S2'" },
  paid: { label: "Сплачені", where: "j.status IN ('S3', 'S4')" },
} as const;

export type FreelancerFilter = keyof typeof FREELANCER_FILTERS;

export async function listFreelancerOrders(freelancerId: number, filter: FreelancerFilter) {
  const rows = await query<OrderRow>(
    `${SELECT_ORDER} WHERE j.id_f = ? AND ${FREELANCER_FILTERS[filter].where} ORDER BY j.id_j DESC`,
    [freelancerId],
  );
  return rows.map(toOrder);
}

export type CatalogFilters = {
  q?: string;
  type?: string;
  specialty?: string;
  deadlineFrom?: string;
  priceFrom?: number;
  priceTo?: number;
  sort?: "new" | "price_desc" | "price_asc" | "deadline";
};

const CATALOG_SORT = {
  new: "j.id_j DESC",
  price_desc: "j.price DESC",
  price_asc: "j.price ASC",
  deadline: "j.date IS NULL, j.date ASC",
} as const;

/** Free orders that any freelancer can take. */
export async function listCatalog(filters: CatalogFilters) {
  const where = ["j.status = 'S1'", "j.id_f IS NULL"];
  const params: (string | number)[] = [];

  if (filters.q) {
    where.push("(j.lable LIKE ? OR j.description LIKE ?)");
    params.push(`%${filters.q}%`, `%${filters.q}%`);
  }
  if (filters.type) {
    where.push("j.tipe = ?");
    params.push(filters.type);
  }
  if (filters.specialty) {
    where.push("j.spacsalyty = ?");
    params.push(filters.specialty);
  }
  if (filters.deadlineFrom) {
    where.push("j.date >= ?");
    params.push(filters.deadlineFrom);
  }
  if (filters.priceFrom !== undefined) {
    where.push("j.price >= ?");
    params.push(filters.priceFrom);
  }
  if (filters.priceTo !== undefined) {
    where.push("j.price <= ?");
    params.push(filters.priceTo);
  }

  const rows = await query<OrderRow>(
    `${SELECT_ORDER} WHERE ${where.join(" AND ")} ORDER BY ${CATALOG_SORT[filters.sort ?? "new"]} LIMIT 200`,
    params,
  );
  return rows.map(toOrder);
}

/**
 * Who may open an order: its client, its assigned freelancer, and — while the
 * order is still free — any freelancer browsing the catalog.
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

export type OrderFile = {
  id: number;
  name: string;
  uploadedBy: Role | null;
  uploadedAt: string | null;
};

export async function listOrderFiles(orderId: number) {
  return query<OrderFile>(
    `SELECT id_file AS id, file_name AS name, uploaded_by AS uploadedBy, uploaded_at AS uploadedAt
       FROM files WHERE id_j = ? ORDER BY id_file`,
    [orderId],
  );
}

export type ChatMessage = {
  id: number;
  sender: Role;
  message: string;
  createdAt: string;
  file: { id: number; name: string } | null;
};

export async function listMessages(orderId: number, freelancerId: number, afterId = 0) {
  const rows = await query<{
    id: number;
    sender: Role;
    message: string;
    createdAt: string;
    fileId: number | null;
    fileName: string | null;
  }>(
    `SELECT ch.id_chat AS id, ch.sender, ch.message, ch.created_at AS createdAt,
            cf.id_chat_file AS fileId, cf.file_name AS fileName
       FROM chat ch
       LEFT JOIN chat_files cf ON cf.id_chat = ch.id_chat
      WHERE ch.id_j = ? AND ch.id_f = ? AND ch.id_chat > ?
      ORDER BY ch.id_chat ASC`,
    [orderId, freelancerId, afterId],
  );
  return rows.map<ChatMessage>((row) => ({
    id: row.id,
    sender: row.sender,
    message: row.message,
    createdAt: row.createdAt,
    file: row.fileId ? { id: row.fileId, name: row.fileName ?? "file" } : null,
  }));
}

export type ChatThread = { freelancerId: number; freelancerName: string; count: number; lastAt: string };

/** For the client: every freelancer who has written about this order. */
export async function listThreads(orderId: number) {
  return query<ChatThread>(
    `SELECT ch.id_f AS freelancerId, f.name AS freelancerName, COUNT(*) AS count, MAX(ch.created_at) AS lastAt
       FROM chat ch
       JOIN freelanser_akks f ON f.id_f = ch.id_f
      WHERE ch.id_j = ?
      GROUP BY ch.id_f, f.name
      ORDER BY lastAt DESC`,
    [orderId],
  );
}
