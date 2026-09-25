import "server-only";
import { cache } from "react";
import { execute, query, queryOne } from "./db";
import type { Role } from "./constants";

export const USER_TABLE = {
  client: { table: "cliants_akks", id: "id_c" },
  freelancer: { table: "freelanser_akks", id: "id_f" },
} as const;

export type UserProfile = {
  id: number;
  role: Role;
  name: string;
  email: string;
  telegram: string;
  phone: string;
  avatar: string | null;
  about: string | null;
  specialty: string | null;
  bankCard: string | null;
};

type UserRow = {
  id: number;
  name: string;
  email: string;
  telegram: string;
  phone: string;
  avatar: string | null;
  about: string | null;
  specialty?: string | null;
  bank_card?: string | null;
};

export const getUser = cache(async (role: Role, id: number): Promise<UserProfile | null> => {
  const row =
    role === "client"
      ? await queryOne<UserRow>(
          "SELECT id_c AS id, name, email, telegram, phone, avatar, about FROM cliants_akks WHERE id_c = ?",
          [id],
        )
      : await queryOne<UserRow>(
          `SELECT f.id_f AS id, f.name, f.email, f.telegram, f.phone, f.avatar, f.about,
                  f.spacialty AS specialty, d.bank_cart AS bank_card
             FROM freelanser_akks f
             LEFT JOIN freelanser_dod d ON d.id_f = f.id_f
            WHERE f.id_f = ?
            ORDER BY d.id_fd DESC
            LIMIT 1`,
          [id],
        );
  if (!row) return null;
  return {
    id: row.id,
    role,
    name: row.name,
    email: row.email,
    telegram: row.telegram,
    phone: row.phone,
    avatar: row.avatar,
    about: row.about,
    specialty: row.specialty ?? null,
    bankCard: row.bank_card ?? null,
  };
});

export async function findUserByEmail(role: Role, email: string) {
  const { table, id } = USER_TABLE[role];
  return queryOne<{ id: number; password: string }>(
    `SELECT ${id} AS id, password FROM ${table} WHERE email = ? LIMIT 1`,
    [email],
  );
}

export async function emailTaken(role: Role, email: string, exceptId?: number) {
  const { table, id } = USER_TABLE[role];
  const rows = await query<{ n: number }>(`SELECT 1 AS n FROM ${table} WHERE email = ? AND ${id} <> ? LIMIT 1`, [
    email,
    exceptId ?? 0,
  ]);
  return rows.length > 0;
}

const EDITABLE = {
  name: "name",
  email: "email",
  telegram: "telegram",
  phone: "phone",
  about: "about",
  avatar: "avatar",
  password: "password",
  specialty: "spacialty",
} as const;

export async function updateUserField(role: Role, userId: number, field: keyof typeof EDITABLE, value: string | null) {
  if (field === "specialty" && role !== "freelancer") throw new Error("Only freelancers have a specialty");
  const { table, id } = USER_TABLE[role];
  await execute(`UPDATE ${table} SET ${EDITABLE[field]} = ? WHERE ${id} = ?`, [value, userId]);
}

export async function setBankCard(freelancerId: number, card: string) {
  const result = await execute("UPDATE freelanser_dod SET bank_cart = ? WHERE id_f = ?", [card, freelancerId]);
  if (result.affectedRows === 0) {
    await execute("INSERT INTO freelanser_dod (id_f, bank_cart) VALUES (?, ?)", [freelancerId, card]);
  }
}
