import Link from "next/link";
import { getJobs } from "@/app/actions/jobs";
import { OrderCard } from "@/components/order-card";
import { EmptyState, PageHeader, buttonClass } from "@/components/ui";
import { CatalogFilterBar } from "./catalog-filters";

export const metadata = { title: "Каталог замовлень" };

export default async function CatalogPage({ searchParams }: PageProps<"/freelancer">) {
  const params = await searchParams;
  const { jobs, total, page, pageCount } = await getJobs(params);

  function pageHref(n: number) {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string" && value && key !== "page") next.set(key, value);
    }
    if (n > 1) next.set("page", String(n));
    return `/freelancer${next.size ? `?${next}` : ""}`;
  }

  return (
    <>
      <PageHeader title="Каталог замовлень" text="Вільні замовлення, які чекають на виконавця." />
      <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
        <CatalogFilterBar />
        <section>
          <p className="mb-4 text-sm text-muted">Знайдено замовлень: {total}</p>
          {jobs.length === 0 ? (
            <EmptyState title="Нічого не знайдено" text="Спробуйте змінити або скинути фільтри." />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {jobs.map((order) => (
                <OrderCard key={order.id} order={order} showClient />
              ))}
            </div>
          )}
          {pageCount > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Сторінки">
              {page > 1 ? (
                <Link href={pageHref(page - 1)} className={buttonClass("secondary", "sm")}>
                  ← Назад
                </Link>
              ) : null}
              <span className="text-sm text-muted">
                {page} / {pageCount}
              </span>
              {page < pageCount ? (
                <Link href={pageHref(page + 1)} className={buttonClass("secondary", "sm")}>
                  Далі →
                </Link>
              ) : null}
            </nav>
          )}
        </section>
      </div>
    </>
  );
}
