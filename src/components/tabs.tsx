import Link from "next/link";
import clsx from "clsx";

export function Tabs({
  items,
  active,
}: {
  items: { key: string; label: string; href: string; count?: number }[];
  active: string;
}) {
  return (
    <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="inline-flex gap-1 rounded-xl border border-line bg-surface p-1">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            scroll={false}
            className={clsx(
              "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition",
              active === item.key ? "bg-surface-2 text-white ring-1 ring-line-strong" : "text-muted hover:text-white",
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span
                className={clsx(
                  "rounded-md px-1.5 text-xs",
                  active === item.key ? "bg-brand/15 text-brand" : "bg-surface-2 text-muted",
                )}
              >
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
