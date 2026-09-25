"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { fail, fromZodError, str, type FormState } from "@/lib/forms";
import { createSession, destroySession, homeFor } from "@/lib/session";
import { emailTaken, findUserByEmail } from "@/lib/users";
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  phoneSchema,
  specialtySchema,
  telegramSchema,
} from "@/lib/validation";
import { DB_ROLE, type Role } from "@/lib/constants";

function roleFrom(formData: FormData): Role {
  return str(formData, "role") === "freelancer" ? "freelancer" : "client";
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const role = roleFrom(formData);
  const parsed = z
    .object({ email: emailSchema, password: z.string().min(1, "Введіть пароль") })
    .safeParse({ email: str(formData, "email"), password: String(formData.get("password") ?? "") });
  if (!parsed.success) return fromZodError(parsed.error, formData);

  const user = await findUserByEmail(role, parsed.data.email);
  const valid = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
  if (!user || !valid) return fail("Невірна пошта або пароль", formData);

  await createSession({ role, userId: user.id }, formData.get("remember") === "on");
  redirect(homeFor(role));
}

const registerSchema = (role: Role) =>
  z
    .object({
      name: nameSchema,
      specialty: role === "freelancer" ? specialtySchema : z.string().optional(),
      email: emailSchema,
      phone: phoneSchema,
      telegram: telegramSchema,
      password: passwordSchema,
      passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      path: ["passwordConfirm"],
      message: "Паролі не збігаються",
    });

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const role = roleFrom(formData);
  const parsed = registerSchema(role).safeParse({
    name: str(formData, "name"),
    specialty: str(formData, "specialty"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    telegram: str(formData, "telegram"),
    password: String(formData.get("password") ?? ""),
    passwordConfirm: String(formData.get("passwordConfirm") ?? ""),
  });
  if (!parsed.success) return fromZodError(parsed.error, formData);

  const { name, email, phone, telegram, password } = parsed.data;
  const specialty = parsed.data.specialty ?? "";
  if (await emailTaken(role, email)) {
    return {
      ...fail("Користувач з такою поштою вже існує", formData),
      fieldErrors: { email: "Пошта вже зареєстрована" },
    };
  }

  const hash = await bcrypt.hash(password, 12);
  let userId: number;
  try {
    const user = await prisma.user.create({
      data: {
        role: DB_ROLE[role],
        name,
        email,
        passwordHash: hash,
        phone,
        telegram,
        specialty: role === "freelancer" ? specialty : null,
      },
      select: { id: true },
    });
    userId = user.id;
  } catch (error) {
    // P2002: unique (email, role) — someone registered the same e-mail in parallel
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        ...fail("Користувач з такою поштою вже існує", formData),
        fieldErrors: { email: "Пошта вже зареєстрована" },
      };
    }
    throw error;
  }

  await createSession({ role, userId });
  redirect(homeFor(role));
}

export async function logout() {
  await destroySession();
  redirect("/");
}
