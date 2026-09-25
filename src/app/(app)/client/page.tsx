import { OrderCard } from "@/components/order-card";
import { Tabs } from "@/components/tabs";
import { ButtonLink, EmptyState, PageHeader } from "@/components/ui";
import { getMyJobs } from "@/app/actions/jobs";
import { CLIENT_FILTERS, clientOrderCounts, type ClientFilter } from "@/lib/orders";
import { requireSession } from "@/lib/session";

export const metadata = { title: "Мої замовлення" };

export default async function ClientOrdersPage({ searchParams }: PageProps<"/client">) {
  const session = await requireSession("client");
  const requested = (await searchParams).filter;
  const filter: ClientFilter =
    typeof requested === "string" && requested in CLIENT_FILTERS ? (requested as ClientFilter) : "active";

  const [orders, counts] = await Promise.all([getMyJobs(filter), clientOrderCounts(session.userId)]);

  return (
    <>
      <PageHeader
        title="Мої замовлення"
        text="Керуйте замовленнями, спілкуйтеся з виконавцями та сплачуйте виконану роботу."
        action={<ButtonLink href="/client/new">+ Нове замовлення</ButtonLink>}
      />
      <Tabs
        active={filter}
        items={(Object.keys(CLIENT_FILTERS) as ClientFilter[]).map((key) => ({
          key,
          label: CLIENT_FILTERS[key].label,
          href: `/client?filter=${key}`,
          count: counts[key],
        }))}
      />
      {orders.length === 0 ? (
        <EmptyState
          title="Тут поки порожньо"
          text="Немає замовлень у цій категорії. Опублікуйте нове — виконавці побачать його в каталозі."
          action={<ButtonLink href="/client/new">Опублікувати замовлення</ButtonLink>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </>
  );
}
