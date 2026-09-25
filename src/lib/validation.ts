import { z } from "zod";
import { ORDER_TYPES, SPECIALTIES } from "./constants";

export const nameSchema = z.string().trim().min(2, "Мінімум 2 символи").max(45, "Максимум 45 символів");
export const emailSchema = z.string().trim().toLowerCase().max(150, "Задовга адреса").email("Невірний формат пошти");
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s()-]{9,20}$/, "Невірний номер телефону, наприклад +380XXXXXXXXX");
export const telegramSchema = z
  .string()
  .trim()
  .regex(/^@?[A-Za-z0-9_]{4,32}$/, "Нік у форматі @username")
  .transform((value) => (value.startsWith("@") ? value : `@${value}`));
export const passwordSchema = z.string().min(8, "Мінімум 8 символів").max(128, "Максимум 128 символів");
export const specialtySchema = z.string().trim().min(2, "Вкажіть спеціальність").max(150, "Максимум 150 символів");
export const aboutSchema = z.string().trim().max(2000, "Максимум 2000 символів");
export const bankCardSchema = z
  .string()
  .transform((value) => value.replace(/[\s-]/g, ""))
  .refine((value) => /^\d{16}$/.test(value), "Номер картки — 16 цифр")
  .refine(luhn, "Невірний номер картки");

function luhn(digits: string) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

export const typeCodes = Object.keys(ORDER_TYPES) as [keyof typeof ORDER_TYPES, ...(keyof typeof ORDER_TYPES)[]];
export const specialtyCodes = Object.keys(SPECIALTIES) as [keyof typeof SPECIALTIES, ...(keyof typeof SPECIALTIES)[]];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export const orderSchema = z.object({
  title: z.string().trim().min(3, "Мінімум 3 символи").max(45, "Максимум 45 символів"),
  type: z.enum(typeCodes, { message: "Оберіть тип роботи" }),
  specialty: z.enum(specialtyCodes, { message: "Оберіть спеціальність" }),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Вкажіть дату")
    .refine((value) => value >= today(), "Дедлайн не може бути в минулому"),
  price: z.coerce
    .number({ message: "Вкажіть ціну" })
    .positive("Ціна має бути більшою за 0")
    .max(99_999_999, "Занадто велика сума")
    .transform((value) => Math.round(value * 100) / 100),
  description: z.string().trim().min(10, "Мінімум 10 символів").max(500, "Максимум 500 символів"),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Оберіть оцінку").max(5, "Оберіть оцінку"),
  comment: z.string().trim().max(1000, "Максимум 1000 символів"),
});
