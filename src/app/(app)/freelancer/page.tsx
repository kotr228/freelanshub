import { OrderCard } from "@/components/order-card";
import { EmptyState, PageHeader } from "@/components/ui";
import { ORDER_TYPES, SPECIALTIES } from "@/lib/constants";
import { listCatalog, type CatalogFilters } from "@/lib/orders";
import { requireSession } from "@/lib/session";
import { CatalogFilterBar } from "./catalog-filters";

export const metadata = { title: "Каталог замовлень" };

function one(value: string | string[] | undefined) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function num(value: string | string[] | undefined) {
  const n = Number(one(value));
  return Number.isFinite(n) && n >= 0 && one(value) ? n : undefined;
}

export default async function CatalogPage({ searchParams }: PageProps<"/freelancer">) {
  await requireSession("freelancer");
  const params = await searchParams;
  const sort = one(params.sort);
  const filters: CatalogFilters = {
    q: one(params.q)?.slice(0, 100),
    type: one(params.type) && one(params.type)! in ORDER_TYPES ? one(params.type) : undefined,
    specialty: one(params.specialty) && one(params.specialty)! in SPECIALTIES ? one(params.specialty) : undefined,
    deadlineFrom: /^\d{4}-\d{2}-\d{2}$/.test(one(params.deadline) ?? "") ? one(params.deadline) : undefined,
    priceFrom: num(params.priceFrom),
    priceTo: num(params.priceTo),
    sort: sort === "price_desc" || sort === "price_asc" || sort === "deadline" ? sort : "new",
  };
  const orders = await listCatalog(filters);

  return (
    <>
      <PageHeader title="Каталог замовлень" text="Вільні замовлення, які чекають на виконавця." />
      <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
        <CatalogFilterBar />
        <section>
          <p className="mb-4 text-sm text-muted">Знайдено замовлень: {orders.length}</p>
          {orders.length === 0 ? (
            <EmptyState title="Нічого не знайдено" text="Спробуйте змінити або скинути фільтри." />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} showClient />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
