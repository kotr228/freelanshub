const money = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 2 });

export function formatPrice(value: number) {
  return `${money.format(value)} ₴`;
}

/** Accepts ISO timestamps and date-only "YYYY-MM-DD" (read as local midnight, not UTC). */
function parse(value: string) {
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);
}

export function formatDate(value: string | null) {
  if (!value) return "—";
  return parse(value).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
}

export function formatDateTime(value: string) {
  return parse(value).toLocaleString("uk-UA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function daysLeft(value: string | null) {
  if (!value) return null;
  const end = parse(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) end.setHours(23, 59, 59); // a deadline lasts the whole day
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / 86_400_000);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
