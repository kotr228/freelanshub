"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { Button } from "@/components/ui";
import { ORDER_TYPES, SPECIALTIES } from "@/lib/constants";

const FIELDS = ["q", "specialty", "type", "deadline", "priceFrom", "priceTo", "sort"] as const;

export function CatalogFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [pending, start] = useTransition();

  useEffect(() => () => clearTimeout(timer.current), []);

  function apply(delay: number) {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const data = new FormData(formRef.current!);
      const next = new URLSearchParams();
      for (const key of FIELDS) {
        const value = String(data.get(key) ?? "").trim();
        if (value) next.set(key, value);
      }
      start(() => router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false }));
    }, delay);
  }

  function reset() {
    formRef.current?.reset();
    for (const el of Array.from(formRef.current?.elements ?? [])) {
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) el.value = "";
    }
    start(() => router.replace(pathname, { scroll: false }));
  }

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          apply(0);
        }}
        onChange={(e) => apply((e.target as HTMLElement).tagName === "SELECT" ? 0 : 400)}
        className="card space-y-4 p-5"
        aria-busy={pending}
      >
        <div className="flex items-center justify-between">
          <p className="font-bold">Фільтри</p>
          {pending && <span className="text-xs text-muted">оновлення…</span>}
        </div>
        <div>
          <label htmlFor="q" className="label">
            Пошук
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={params.get("q") ?? ""}
            placeholder="Назва або опис"
            className="input"
          />
        </div>
        <div>
          <label htmlFor="specialty" className="label">
            Спеціальність
          </label>
          <select id="specialty" name="specialty" defaultValue={params.get("specialty") ?? ""} className="input">
            <option value="">Усі</option>
            {Object.entries(SPECIALTIES).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="type" className="label">
            Тип роботи
          </label>
          <select id="type" name="type" defaultValue={params.get("type") ?? ""} className="input">
            <option value="">Усі</option>
            {Object.entries(ORDER_TYPES).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="deadline" className="label">
            Дедлайн не раніше
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            defaultValue={params.get("deadline") ?? ""}
            className="input"
          />
        </div>
        <div>
          <span className="label">Бюджет, грн</span>
          <div className="grid grid-cols-2 gap-2">
            <input
              aria-label="Від"
              name="priceFrom"
              type="number"
              min={0}
              defaultValue={params.get("priceFrom") ?? ""}
              placeholder="від"
              className="input"
            />
            <input
              aria-label="До"
              name="priceTo"
              type="number"
              min={0}
              defaultValue={params.get("priceTo") ?? ""}
              placeholder="до"
              className="input"
            />
          </div>
        </div>
        <div>
          <label htmlFor="sort" className="label">
            Сортування
          </label>
          <select id="sort" name="sort" defaultValue={params.get("sort") ?? ""} className="input">
            <option value="">Спочатку нові</option>
            <option value="price_desc">Спочатку дорожчі</option>
            <option value="price_asc">Спочатку дешевші</option>
            <option value="deadline">Найближчий дедлайн</option>
          </select>
        </div>
        <Button type="button" variant="secondary" className="w-full" onClick={reset}>
          Скинути фільтри
        </Button>
      </form>
    </aside>
  );
}
