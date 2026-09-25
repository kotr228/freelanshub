import Link from "next/link";
import clsx from "clsx";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={clsx("shrink-0", className)}>
      <rect width="32" height="32" rx="9" className="fill-brand" />
      <path d="M9 7.5h15l-3 4H9z M9 14h9l-3 4H13v7.5l-4-4z" className="fill-brand-ink" />
    </svg>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={clsx("flex items-center gap-2.5 font-extrabold tracking-tight", className)}>
      <LogoMark className="size-8" />
      <span className="text-lg">
        Freelans<span className="text-brand">hub</span>
      </span>
    </Link>
  );
}
