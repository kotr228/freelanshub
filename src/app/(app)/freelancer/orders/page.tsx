import { OrderCard } from "@/components/order-card";
import { Tabs } from "@/components/tabs";
import { ButtonLink, EmptyState, PageHeader } from "@/components/ui";
import { FREELANCER_FILTERS, listFreelancerOrders, type FreelancerFilter } from "@/lib/orders";
import { requireSession } from "@/lib/session";

export const metadata = { title: "Мої замовлення" };

export default async function FreelancerOrdersPage({ searchParams }: PageProps<"/freelancer/orders">) {
  const session = await requireSession("freelancer");
  const requested = (await searchParams).filter;
  const filter: FreelancerFilter =
    typeof requested === "string" && requested in FREELANCER_FILTERS ? (requested as FreelancerFilter) : "in_progress";
  const orders = await listFreelancerOrders(session.userId, filter);

  return (
    <>
      <PageHeader
        title="Мої замовлення"
        text="Замовлення, які ви взяли в роботу."
        action={
          <ButtonLink href="/freelancer" variant="secondary">
            Знайти нові замовлення
          </ButtonLink>
        }
      />
      <Tabs
        active={filter}
        items={(Object.keys(FREELANCER_FILTERS) as FreelancerFilter[]).map((key) => ({
          key,
          label: FREELANCER_FILTERS[key].label,
          href: `/freelancer/orders?filter=${key}`,
        }))}
      />
      {orders.length === 0 ? (
        <EmptyState
          title="Тут поки порожньо"
          text="Візьміть замовлення з каталогу — воно з'явиться тут."
          action={<ButtonLink href="/freelancer">Перейти до каталогу</ButtonLink>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} showClient />
          ))}
        </div>
      )}
    </>
  );
}
