"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { readNotifications } from "@/app/actions/settings";
import { formatDateTime } from "@/lib/format";
import type { Notification } from "@/lib/notifications";
import { useDismiss } from "./use-dismiss";

const POLL_MS = 20_000;

export function NotificationsBell() {
  const { open, setOpen, ref } = useDismiss<HTMLDivElement>();
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async () => {
    const response = await fetch("/api/notifications", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as { notifications: Notification[]; unread: number };
    setItems(data.notifications);
    setUnread(data.unread);
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(() => document.visibilityState === "visible" && load(), POLL_MS);
    return () => clearInterval(timer);
  }, [load]);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      setUnread(0);
      readNotifications();
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={`Сповіщення${unread ? `: ${unread} нових` : ""}`}
        className="relative grid size-10 place-items-center rounded-full border border-line transition hover:border-line-strong hover:bg-surface"
      >
        <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2 text-soft" aria-hidden>
          <path
            d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-brand-ink">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="card absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden shadow-2xl shadow-black/50">
          <p className="border-b border-line px-4 py-3 text-sm font-bold">Сповіщення</p>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-muted">Поки що немає сповіщень</p>
            ) : (
              items.map((item) => {
                const body = (
                  <>
                    <span
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${item.isRead ? "bg-transparent" : "bg-brand"}`}
                    />
                    <span>
                      <span className="block text-sm text-zinc-100">{item.message}</span>
                      <span className="mt-0.5 block text-xs text-muted">{formatDateTime(item.createdAt)}</span>
                    </span>
                  </>
                );
                const className = "flex gap-3 border-b border-line/60 px-4 py-3 last:border-0";
                return item.orderId ? (
                  <Link
                    key={item.id}
                    href={`/orders/${item.orderId}`}
                    onClick={() => setOpen(false)}
                    className={`${className} transition hover:bg-surface-2`}
                  >
                    {body}
                  </Link>
                ) : (
                  <div key={item.id} className={className}>
                    {body}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
