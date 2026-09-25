"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/app/actions/auth";
import { initials } from "@/lib/format";
import { useDismiss } from "./use-dismiss";

export function UserMenu(props: {
  name: string;
  email: string;
  roleLabel: string;
  avatar: string | null;
  links: { href: string; label: string }[];
}) {
  const { open, setOpen, ref } = useDismiss<HTMLDivElement>();
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname, setOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-line py-1 pr-3 pl-1 transition hover:border-line-strong hover:bg-surface"
      >
        <span className="grid size-8 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-brand/80 to-orange-600/80 text-xs font-bold text-brand-ink">
          {props.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={props.avatar} alt="" className="size-full object-cover" />
          ) : (
            initials(props.name)
          )}
        </span>
        <span className="hidden max-w-32 truncate text-sm font-semibold sm:block">{props.name}</span>
        <span className="text-xs text-muted">▾</span>
      </button>

      {open && (
        <div role="menu" className="card absolute right-0 mt-2 w-64 overflow-hidden p-1.5 shadow-2xl shadow-black/50">
          <div className="px-3 py-2.5">
            <p className="truncate font-semibold">{props.name}</p>
            <p className="truncate text-xs text-muted">{props.email}</p>
            <p className="mt-1.5 inline-block rounded-md bg-brand/10 px-1.5 py-0.5 text-[11px] font-semibold text-brand">
              {props.roleLabel}
            </p>
          </div>
          <div className="my-1 h-px bg-line md:hidden" />
          {props.links.map((link) => (
            <MenuLink key={link.href} href={link.href} className="md:hidden">
              {link.label}
            </MenuLink>
          ))}
          <div className="my-1 h-px bg-line" />
          <MenuLink href="/settings">⚙️ Налаштування акаунта</MenuLink>
          <form action={logout}>
            <button
              type="submit"
              role="menuitem"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-rose-300 transition hover:bg-rose-500/10"
            >
              ↩ Вийти
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className={`block rounded-lg px-3 py-2 text-sm text-soft transition hover:bg-surface-2 hover:text-white ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}
