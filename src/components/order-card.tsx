import Link from "next/link";
import { Badge } from "./ui";
import { STAGE_META, orderTypeLabel, specialtyLabel } from "@/lib/constants";
import { daysLeft, formatDate, formatPrice } from "@/lib/format";
import type { Order } from "@/lib/orders";

export function StageBadge({ order }: { order: Pick<Order, "stage"> }) {
  const meta = STAGE_META[order.stage];
  return (
    <Badge tone={meta.tone}>
      <span className="size-1.5 rounded-full bg-current" />
      {meta.label}
    </Badge>
  );
}

export function Deadline({ value }: { value: string | null }) {
  const left = daysLeft(value);
  return (
    <span className="text-muted">
      до {formatDate(value)}
      {left !== null && left >= 0 && left <= 3 && (
        <span className="ml-1.5 font-semibold text-rose-300">· {left === 0 ? "сьогодні" : `${left} дн.`}</span>
      )}
    </span>
  );
}

export function OrderCard({ order, showClient }: { order: Order; showClient?: boolean }) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="group card flex flex-col gap-4 p-5 transition hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">{specialtyLabel(order.specialty)}</p>
          <h3 className="mt-1 truncate text-lg font-bold group-hover:text-brand">{order.title}</h3>
        </div>
        <p className="shrink-0 text-lg font-extrabold text-brand">{formatPrice(order.price)}</p>
      </div>
      <p className="line-clamp-2 text-sm text-soft">{order.description}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <StageBadge order={order} />
        <span className="text-muted">{orderTypeLabel(order.type)}</span>
        <Deadline value={order.deadline} />
        {showClient && <span className="text-muted">· {order.clientName}</span>}
      </div>
    </Link>
  );
}
