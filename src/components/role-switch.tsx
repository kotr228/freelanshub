import Link from "next/link";
import clsx from "clsx";
import type { Role } from "@/lib/constants";

export function RoleSwitch({ role, base }: { role: Role; base: string }) {
  const tabs: { role: Role; label: string }[] = [
    { role: "client", label: "💼 Замовник" },
    { role: "freelancer", label: "🧑‍💻 Фрілансер" },
  ];
  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-surface p-1">
      {tabs.map((tab) => (
        <Link
          key={tab.role}
          href={`${base}?role=${tab.role}`}
          replace
          className={clsx(
            "rounded-lg py-2 text-center text-sm font-semibold transition",
            role === tab.role
              ? "bg-surface-2 text-white shadow ring-1 ring-line-strong"
              : "text-muted hover:text-white",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
