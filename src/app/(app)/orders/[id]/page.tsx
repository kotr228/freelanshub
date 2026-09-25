import Link from "next/link";
import { notFound } from "next/navigation";
import clsx from "clsx";
import {
  archiveOrder,
  cancelOrder,
  completeOrder,
  deleteOrderFile,
  payOrder,
  refuseOrder,
  takeOrder,
  uploadOrderFile,
} from "@/app/actions/orders";
import { Avatar } from "@/components/avatar";
import { ActionButton } from "@/components/form-controls";
import { Deadline, StageBadge } from "@/components/order-card";
import { Alert } from "@/components/ui";
import { orderTypeLabel, specialtyLabel, splitPayment, type OrderStage } from "@/lib/constants";
import { formatDate, formatDateTime, formatPrice } from "@/lib/format";
import { canView, getOrder, listOrderFiles, listThreads, participantRole } from "@/lib/orders";
import { requireSession } from "@/lib/session";
import { getUser } from "@/lib/users";
import { Chat } from "./chat";
import { FileUpload } from "./file-upload";

export async function generateMetadata({ params }: PageProps<"/orders/[id]">) {
  const order = await getOrder(Number((await params).id) || 0);
  return { title: order ? order.title : "Замовлення" };
}

const STEPS: { stage: OrderStage; label: string }[] = [
  { stage: "free", label: "Опубліковано" },
  { stage: "in_progress", label: "В роботі" },
  { stage: "done", label: "Виконано" },
  { stage: "paid", label: "Сплачено" },
];

export default async function OrderPage({ params, searchParams }: PageProps<"/orders/[id]">) {
  const session = await requireSession();
  const orderId = Number((await params).id);
  const order = Number.isInteger(orderId) ? await getOrder(orderId) : null;
  if (!order || !canView(session, order)) notFound();

  const role = participantRole(session, order);
  const isClient = session.role === "client";
  const [files, threads] = await Promise.all([listOrderFiles(order.id), isClient ? listThreads(order.id) : []]);

  // The other side of the deal (contacts are shown once the order is assigned).
  const counterpart = isClient
    ? order.freelancerId
      ? await getUser("freelancer", order.freelancerId)
      : null
    : await getUser("client", order.clientId);
  const showContacts = Boolean(role && order.freelancerId);

  // Which conversation to show.
  const requestedThread = Number((await searchParams).thread) || null;
  let threadId: number | null = null;
  if (!isClient) threadId = session.userId;
  else if (requestedThread && threads.some((t) => t.freelancerId === requestedThread)) threadId = requestedThread;
  else threadId = order.freelancerId ?? threads[0]?.freelancerId ?? null;

  const split = splitPayment(order.price);
  const stepIndex = order.stage === "archived" ? STEPS.length - 1 : STEPS.findIndex((s) => s.stage === order.stage);
  const backHref = isClient ? "/client" : role ? "/freelancer/orders" : "/freelancer";

  return (
    <div className="space-y-6">
      <Link href={backHref} className="inline-flex items-center gap-1 text-sm text-muted hover:text-white">
        ← Назад
      </Link>

      {/* Header */}
      <section className="card p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StageBadge order={order} />
              <span className="text-sm text-muted">#{order.id}</span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{order.title}</h1>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
              <span>{specialtyLabel(order.specialty)}</span>
              <span>{orderTypeLabel(order.type)}</span>
              <Deadline value={order.deadline} />
            </div>
          </div>
          <div className="shrink-0 rounded-2xl bg-ink px-5 py-4 md:text-right">
            <p className="text-xs text-muted">Бюджет</p>
            <p className="text-3xl font-extrabold text-brand">{formatPrice(order.price)}</p>
            {role === "freelancer" && (
              <p className="mt-1 text-xs text-muted">Ви отримаєте {formatPrice(split.payout)}</p>
            )}
          </div>
        </div>

        {/* Progress */}
        <ol className="mt-8 grid grid-cols-4 gap-2">
          {STEPS.map((step, index) => (
            <li key={step.stage}>
              <div className={clsx("h-1.5 rounded-full", index <= stepIndex ? "bg-brand" : "bg-line")} />
              <p className={clsx("mt-2 text-xs font-medium", index <= stepIndex ? "text-zinc-100" : "text-muted")}>
                {step.label}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-6">
          {/* Description */}
          <section className="card p-6">
            <h2 className="font-bold">Опис замовлення</h2>
            <p className="mt-3 leading-relaxed whitespace-pre-line text-soft">{order.description}</p>
            {order.createdAt && <p className="mt-4 text-xs text-muted">Опубліковано {formatDate(order.createdAt)}</p>}
          </section>

          {/* Chat */}
          <section className="card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
              <h2 className="font-bold">{isClient ? "Чат з виконавцем" : "Чат із замовником"}</h2>
              {isClient && threads.length > 1 && (
                <div className="flex flex-wrap gap-1">
                  {threads.map((thread) => (
                    <Link
                      key={thread.freelancerId}
                      href={`/orders/${order.id}?thread=${thread.freelancerId}`}
                      scroll={false}
                      className={clsx(
                        "rounded-lg px-2.5 py-1 text-xs font-semibold",
                        thread.freelancerId === threadId
                          ? "bg-brand/15 text-brand"
                          : "text-muted hover:bg-surface-2 hover:text-white",
                      )}
                    >
                      {thread.freelancerName}
                      {thread.freelancerId === order.freelancerId && " ✓"}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {threadId ? (
              <Chat
                key={threadId}
                orderId={order.id}
                thread={threadId}
                me={session.role}
                readOnly={order.stage === "archived"}
                hint={
                  !isClient && order.stage === "free"
                    ? "Поставте замовнику запитання перед тим, як братися за роботу."
                    : undefined
                }
              />
            ) : (
              <p className="px-6 py-12 text-center text-sm text-muted">
                Поки що ніхто з виконавців не писав. Чат з&apos;явиться, щойно фрілансер поставить запитання або візьме
                замовлення.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          {/* Actions */}
          <OrderActions orderId={order.id} stage={order.stage} role={role} isClient={isClient} />

          {/* People */}
          <section className="card space-y-4 p-6">
            <Person label="Замовник" name={order.clientName} avatar={isClient ? null : (counterpart?.avatar ?? null)} />
            {order.freelancerId ? (
              <Person
                label="Виконавець"
                name={order.freelancerName ?? "—"}
                avatar={isClient ? (counterpart?.avatar ?? null) : null}
              />
            ) : (
              <p className="text-sm text-muted">Виконавця ще не обрано</p>
            )}
            {showContacts && counterpart && (
              <dl className="space-y-2 rounded-xl bg-ink p-4 text-sm">
                <Contact
                  label="Telegram"
                  value={counterpart.telegram}
                  href={`https://t.me/${counterpart.telegram.replace(/^@/, "")}`}
                />
                <Contact
                  label="Телефон"
                  value={counterpart.phone}
                  href={`tel:${counterpart.phone.replace(/[^\d+]/g, "")}`}
                />
                <Contact label="Пошта" value={counterpart.email} href={`mailto:${counterpart.email}`} />
              </dl>
            )}
            {counterpart?.about && showContacts && (
              <p className="text-sm whitespace-pre-line text-muted">{counterpart.about}</p>
            )}
          </section>

          {/* Files */}
          <section className="card p-6">
            <h2 className="font-bold">Файли</h2>
            {files.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Файлів немає</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {files.map((file) => (
                  <li key={file.id} className="flex items-center gap-3 rounded-xl bg-ink px-3 py-2.5">
                    <span className="text-lg">📄</span>
                    <a href={`/api/files/${file.id}`} className="min-w-0 flex-1 text-sm hover:text-brand">
                      <span className="block truncate font-medium">{file.name}</span>
                      <span className="block text-xs text-muted">
                        {file.uploadedBy === "client"
                          ? "замовник"
                          : file.uploadedBy === "freelancer"
                            ? "виконавець"
                            : ""}
                        {file.uploadedAt && ` · ${formatDateTime(file.uploadedAt)}`}
                      </span>
                    </a>
                    {role && role === file.uploadedBy && order.stage !== "paid" && order.stage !== "archived" && (
                      <DeleteFile fileId={file.id} />
                    )}
                  </li>
                ))}
              </ul>
            )}
            {role && order.stage !== "archived" && <FileUpload action={uploadOrderFile.bind(null, order.id)} />}
          </section>
        </aside>
      </div>
    </div>
  );
}

function OrderActions({
  orderId,
  stage,
  role,
  isClient,
}: {
  orderId: number;
  stage: OrderStage;
  role: "client" | "freelancer" | null;
  isClient: boolean;
}) {
  let content: React.ReactNode = null;

  if (isClient) {
    if (stage === "free")
      content = (
        <>
          <p className="text-sm text-muted">Замовлення в каталозі й чекає на виконавця.</p>
          <ActionButton
            action={cancelOrder.bind(null, orderId)}
            variant="danger"
            className="w-full"
            confirm="Скасувати й видалити замовлення?"
          >
            Скасувати замовлення
          </ActionButton>
        </>
      );
    else if (stage === "in_progress")
      content = (
        <p className="text-sm text-muted">
          Виконавець працює над замовленням. Ви отримаєте сповіщення, коли робота буде готова.
        </p>
      );
    else if (stage === "done")
      content = (
        <>
          <Alert tone="info">Виконавець позначив роботу виконаною. Перевірте файли та сплатіть замовлення.</Alert>
          <ActionButton
            action={payOrder.bind(null, orderId)}
            size="lg"
            className="w-full"
            confirm="Підтвердити оплату замовлення?"
          >
            Сплатити замовлення
          </ActionButton>
        </>
      );
    else if (stage === "paid")
      content = (
        <>
          <p className="text-sm text-muted">Замовлення сплачене. Дякуємо, що користуєтеся Freelanshub!</p>
          <ActionButton action={archiveOrder.bind(null, orderId)} variant="secondary" className="w-full">
            Перенести в архів
          </ActionButton>
        </>
      );
    else content = <p className="text-sm text-muted">Замовлення в архіві.</p>;
  } else if (!role) {
    content = (
      <>
        <p className="text-sm text-muted">
          Уважно прочитайте опис. Після того як ви візьмете замовлення, інші виконавці його не побачать.
        </p>
        <ActionButton action={takeOrder.bind(null, orderId)} size="lg" className="w-full">
          Взятися за замовлення
        </ActionButton>
      </>
    );
  } else if (stage === "in_progress") {
    content = (
      <>
        <p className="text-sm text-muted">
          Коли робота буде готова, завантажте результат у файли та позначте замовлення виконаним.
        </p>
        <ActionButton
          action={completeOrder.bind(null, orderId)}
          size="lg"
          className="w-full"
          confirm="Позначити замовлення як виконане?"
        >
          Позначити як виконане
        </ActionButton>
        <ActionButton
          action={refuseOrder.bind(null, orderId)}
          variant="ghost"
          size="sm"
          className="w-full"
          confirm="Відмовитися від замовлення? Воно повернеться в каталог."
        >
          Відмовитися від замовлення
        </ActionButton>
      </>
    );
  } else if (stage === "done") {
    content = (
      <p className="text-sm text-muted">Очікуємо на оплату від замовника. Виплата прийде на вашу картку автоматично.</p>
    );
  } else {
    content = <p className="text-sm text-muted">Замовлення сплачене. Гарна робота! 🎉</p>;
  }

  return (
    <section className="card space-y-4 p-6">
      <h2 className="font-bold">Дії</h2>
      {content}
    </section>
  );
}

function Person({ label, name, avatar }: { label: string; name: string; avatar: string | null }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={name} src={avatar} className="size-10 text-sm" />
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="truncate font-semibold">{name}</p>
      </div>
    </div>
  );
}

function Contact({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="truncate">
        <a
          href={href}
          className="hover:text-brand"
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
        >
          {value}
        </a>
      </dd>
    </div>
  );
}

function DeleteFile({ fileId }: { fileId: number }) {
  async function remove() {
    "use server";
    await deleteOrderFile(fileId);
  }
  return (
    <form action={remove}>
      <button
        type="submit"
        aria-label="Видалити файл"
        className="rounded-lg px-2 py-1 text-muted transition hover:bg-rose-500/10 hover:text-rose-300"
      >
        ✕
      </button>
    </form>
  );
}
