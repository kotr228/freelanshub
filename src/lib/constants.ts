// Domain vocabulary. Codes (ONE_TIME, spec3, DONE…) are what the database stores,
// labels are what users see.

// Keys match the JobType enum in prisma/schema.prisma.
// (Plain strings here: this file is also imported by Client Components.)
export const ORDER_TYPES = {
  ONE_TIME: "Одноразова робота",
  FIXED_PERIOD: "Робота на певний період",
  LONG_TERM: "Робота на довгий період часу",
} as const;

export const SPECIALTIES = {
  spec1: "Кошторисна документація (інвесторська, договірна ціна тощо)",
  spec2: "Пояснювальна записка до проєктної документації",
  spec3: "Дистанційне ведення бухгалтерії",
  spec4: "Переклад та коригування текстів",
  spec5: "Статті для видань",
  spec6: "Рекламні макети та логотипи",
  spec7: "3D-дизайн",
  spec8: "2D-дизайн",
  spec9: "Фронтенд для сайтів",
  spec10: "Бекенд для сайтів",
  spec11: "Фулстек для сайтів",
  spec12: "Відеомонтаж",
  spec13: "Фотомонтаж",
  spec14: "Програмування",
  spec15: "Студентські роботи",
} as const;

export type OrderTypeCode = keyof typeof ORDER_TYPES;
export type SpecialtyCode = keyof typeof SPECIALTIES;

export function orderTypeLabel(code: string) {
  return ORDER_TYPES[code as OrderTypeCode] ?? code;
}

export function specialtyLabel(code: string) {
  return SPECIALTIES[code as SpecialtyCode] ?? code;
}

/** Mirrors the JobStatus enum in prisma/schema.prisma. */
export type JobStatusCode = "OPEN" | "IN_PROGRESS" | "DONE" | "PAID" | "ARCHIVED";

export type OrderStage = "free" | "in_progress" | "done" | "paid" | "archived";

const STAGE_BY_STATUS: Record<JobStatusCode, OrderStage> = {
  OPEN: "free",
  IN_PROGRESS: "in_progress",
  DONE: "done",
  PAID: "paid",
  ARCHIVED: "archived",
};

export function orderStage(status: JobStatusCode): OrderStage {
  return STAGE_BY_STATUS[status];
}

export const STAGE_META: Record<OrderStage, { label: string; tone: string }> = {
  free: { label: "Вільне", tone: "sky" },
  in_progress: { label: "На виконанні", tone: "amber" },
  done: { label: "Виконане — очікує оплату", tone: "violet" },
  paid: { label: "Сплачене", tone: "emerald" },
  archived: { label: "В архіві", tone: "zinc" },
};

/** Role as used in URLs, the session cookie and the UI. The database uses CLIENT / FREELANCER. */
export type Role = "client" | "freelancer";

export const DB_ROLE = { client: "CLIENT", freelancer: "FREELANCER" } as const;

export function roleFromDb(role: "CLIENT" | "FREELANCER"): Role {
  return role === "CLIENT" ? "client" : "freelancer";
}

export const ROLE_LABEL: Record<Role, string> = {
  client: "Замовник",
  freelancer: "Фрілансер",
};

/** Platform commission, by order price (UAH). Mirrors the published pricing policy. */
export const COMMISSION_TIERS = [
  { upTo: 1000, rate: 0.05, label: "До 1 000 грн / 25 USD" },
  { upTo: 42000, rate: 0.1, label: "1 000 – 42 000 грн / 25 – 1 000 USD" },
  { upTo: 84000, rate: 0.12, label: "42 000 – 84 000 грн / 1 000 – 2 000 USD" },
  { upTo: Infinity, rate: 0.15, label: "Понад 84 000 грн / 2 000 USD" },
] as const;

export function commissionRate(price: number) {
  return COMMISSION_TIERS.find((tier) => price <= tier.upTo)!.rate;
}

export function splitPayment(price: number) {
  const rate = commissionRate(price);
  const commission = Math.round(price * rate * 100) / 100;
  return { rate, commission, payout: Math.round((price - commission) * 100) / 100 };
}

export const ORDER_FILE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "md",
  "csv",
  "rtf",
  "odt",
  "html",
  "css",
  "js",
  "ts",
  "json",
  "py",
  "cpp",
  "c",
  "h",
  "php",
  "psd",
  "ai",
  "fig",
  "zip",
  "rar",
  "7z",
  "mp3",
  "mp4",
  "mov",
];
export const MAX_FILE_SIZE = 25 * 1024 * 1024;
export const AVATAR_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];
export const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

export const SUPPORT_TELEGRAM = "@freelansehub";
export const PARTNER_TELEGRAM = "@freelansehun_partner";
