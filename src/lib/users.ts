import "server-only";
import { cache } from "react";
import { DB_ROLE, roleFromDb, type Role } from "./constants";
import { prisma } from "./prisma";

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

const profileSelect = {
  id: true,
  role: true,
  name: true,
  email: true,
  telegram: true,
  phone: true,
  avatar: true,
  about: true,
  specialty: true,
  bankCard: true,
} as const;

/** Loads a user and checks that the account really has the expected role. */
export const getUser = cache(async (role: Role, id: number): Promise<UserProfile | null> => {
  const user = await prisma.user.findFirst({ where: { id, role: DB_ROLE[role] }, select: profileSelect });
  return user ? { ...user, role: roleFromDb(user.role) } : null;
});

export async function findUserByEmail(role: Role, email: string) {
  return prisma.user.findUnique({
    where: { email_role: { email, role: DB_ROLE[role] } },
    select: { id: true, passwordHash: true },
  });
}

export async function emailTaken(role: Role, email: string, exceptId?: number) {
  const user = await prisma.user.findUnique({
    where: { email_role: { email, role: DB_ROLE[role] } },
    select: { id: true },
  });
  return Boolean(user && user.id !== exceptId);
}
