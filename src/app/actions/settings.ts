"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AVATAR_EXTENSIONS, MAX_AVATAR_SIZE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { fail, fileFrom, fromZodError, ok, str, type FormState } from "@/lib/forms";
import { markAllRead } from "@/lib/notifications";
import { requireSession } from "@/lib/session";
import { extensionOf, removeStored, saveUpload } from "@/lib/storage";
import { emailTaken, getUser } from "@/lib/users";
import {
  aboutSchema,
  bankCardSchema,
  emailSchema,
  nameSchema,
  passwordSchema,
  phoneSchema,
  specialtySchema,
  telegramSchema,
} from "@/lib/validation";

function done(message: string) {
  revalidatePath("/", "layout");
  return ok(message);
}

export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const parsed = z
    .object({
      name: nameSchema,
      phone: phoneSchema,
      telegram: telegramSchema,
      about: aboutSchema,
      specialty: session.role === "freelancer" ? specialtySchema : z.string().optional(),
    })
    .safeParse({
      name: str(formData, "name"),
      phone: str(formData, "phone"),
      telegram: str(formData, "telegram"),
      about: str(formData, "about"),
      specialty: str(formData, "specialty"),
    });
  if (!parsed.success) return fromZodError(parsed.error);

  const { name, phone, telegram, about, specialty } = parsed.data;
  await prisma.user.update({
    where: { id: session.userId },
    data: {
      name,
      phone,
      telegram,
      about: about || null,
      ...(session.role === "freelancer" && specialty ? { specialty } : {}),
    },
  });
  return done("Профіль збережено");
}

export async function updateEmail(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const parsed = emailSchema.safeParse(str(formData, "email"));
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  if (await emailTaken(session.role, parsed.data, session.userId)) return fail("Ця пошта вже використовується");

  await prisma.user.update({ where: { id: session.userId }, data: { email: parsed.data } });
  return done("Пошту оновлено");
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const current = String(formData.get("current") ?? "");
  const parsed = passwordSchema.safeParse(String(formData.get("password") ?? ""));
  if (!parsed.success)
    return {
      error: parsed.error.issues[0].message,
      fieldErrors: { password: parsed.error.issues[0].message },
      at: Date.now(),
    };
  if (parsed.data !== String(formData.get("passwordConfirm") ?? "")) {
    return { error: "Паролі не збігаються", fieldErrors: { passwordConfirm: "Паролі не збігаються" }, at: Date.now() };
  }

  const row = await prisma.user.findUnique({ where: { id: session.userId }, select: { passwordHash: true } });
  if (!row || !(await bcrypt.compare(current, row.passwordHash))) {
    return { error: "Поточний пароль невірний", fieldErrors: { current: "Невірний пароль" }, at: Date.now() };
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { passwordHash: await bcrypt.hash(parsed.data, 12) },
  });
  return ok("Пароль змінено");
}

export async function updateAvatar(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const file = fileFrom(formData, "avatar");
  if (!file) return fail("Оберіть зображення");
  if (!AVATAR_EXTENSIONS.includes(extensionOf(file.name))) return fail("Дозволені формати: JPG, PNG, GIF, WEBP");
  if (file.size > MAX_AVATAR_SIZE) return fail("Максимальний розмір — 2 МБ");

  const previous = (await getUser(session.role, session.userId))?.avatar;
  const stored = await saveUpload(file, "avatars");
  await prisma.user.update({ where: { id: session.userId }, data: { avatar: stored } });
  await removeStored(previous);
  return done("Аватар оновлено");
}

export async function removeAvatar(): Promise<FormState> {
  const session = await requireSession();
  const previous = (await getUser(session.role, session.userId))?.avatar;
  await prisma.user.update({ where: { id: session.userId }, data: { avatar: null } });
  await removeStored(previous);
  return done("Аватар видалено");
}

export async function updateBankCard(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession("freelancer");
  const parsed = bankCardSchema.safeParse(str(formData, "card"));
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  await prisma.user.update({ where: { id: session.userId }, data: { bankCard: parsed.data } });
  return done("Картку для виплат збережено");
}

export async function readNotifications() {
  const session = await requireSession();
  await markAllRead(session.userId);
}
