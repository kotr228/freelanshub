import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "./constants";

const COOKIE = "fh_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type Session = { role: Role; userId: number };

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("SESSION_SECRET must be set and at least 32 characters long");
  }
  return new TextEncoder().encode(value);
}

export async function createSession(session: Session, remember = true) {
  const token = await new SignJWT({ role: session.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(session.userId))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Without "remember me" the cookie lives until the browser is closed.
    ...(remember ? { maxAge: MAX_AGE } : {}),
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    const userId = Number(payload.sub);
    const role = payload.role;
    if (!Number.isInteger(userId) || (role !== "client" && role !== "freelancer")) return null;
    return { role, userId };
  } catch {
    return null;
  }
});

/** Returns the session or redirects to login. Pass a role to also enforce it. */
export async function requireSession(role?: Role): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(role ? `/login?role=${role}` : "/login");
  if (role && session.role !== role) redirect(homeFor(session.role));
  return session;
}

export function homeFor(role: Role) {
  return role === "client" ? "/client" : "/freelancer";
}
