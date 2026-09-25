import Link from "next/link";
import { Logo } from "@/components/logo";
import { SiteFooter } from "@/components/site-footer";
import { ButtonLink } from "@/components/ui";
import { COMMISSION_TIERS, PARTNER_TELEGRAM, SPECIALTIES, SUPPORT_TELEGRAM } from "@/lib/constants";
import { getSession, homeFor } from "@/lib/session";

const STEPS = [
  {
    title: "Опублікуйте замовлення",
    text: "Опишіть задачу, додайте файли, вкажіть дедлайн і бюджет. Це займає пару хвилин.",
  },
  {
    title: "Виконавець бере його в роботу",
    text: "Фрілансери бачать замовлення в каталозі, ставлять запитання в чаті й беруться за роботу.",
  },
  {
    title: "Робота здається через платформу",
    text: "Файли й обговорення зберігаються в замовленні. Виконавець позначає роботу виконаною.",
  },
  {
    title: "Оплата після результату",
    text: "Ви сплачуєте лише виконане замовлення — виплата виконавцю проходить автоматично.",
  },
];

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="relative overflow-x-clip">
      <header className="sticky top-0 z-30 border-b border-line/60 bg-ink/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-soft md:flex">
            <a href="#how" className="hover:text-white">
              Як це працює
            </a>
            <a href="#pricing" className="hover:text-white">
              Ціни
            </a>
            <a href="#privacy" className="hover:text-white">
              Конфіденційність
            </a>
            <a href="#support" className="hover:text-white">
              Підтримка
            </a>
          </nav>
          {session ? (
            <ButtonLink href={homeFor(session.role)} size="sm">
              Мій кабінет →
            </ButtonLink>
          ) : (
            <div className="flex items-center gap-2">
              <ButtonLink href="/login" variant="ghost" size="sm">
                Увійти
              </ButtonLink>
              <ButtonLink href="/register" size="sm">
                Реєстрація
              </ButtonLink>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand/15 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 text-xs font-medium text-soft">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Оплата лише після виконання роботи
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-6xl">
            Знаходьте виконавців і замовлення <span className="text-brand">без зайвого клопоту</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Freelanshub з&apos;єднує замовників і фрілансерів: від кошторисів і бухгалтерії до дизайну, монтажу й
            розробки сайтів.
          </p>

          <div className="mx-auto mt-12 grid max-w-3xl gap-4 text-left sm:grid-cols-2">
            <RoleCard
              href={session?.role === "client" ? "/client" : "/login?role=client"}
              emoji="💼"
              title="Я замовник"
              text="Опублікуйте задачу й отримайте результат від перевіреного виконавця."
              cta="Увійти як замовник"
            />
            <RoleCard
              href={session?.role === "freelancer" ? "/freelancer" : "/login?role=freelancer"}
              emoji="🧑‍💻"
              title="Я фрілансер"
              text="Обирайте замовлення за спеціальністю, бюджетом і дедлайном."
              cta="Увійти як фрілансер"
            />
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="mb-5 text-center text-sm font-medium text-muted">Спеціальності на платформі</p>
        <div className="flex flex-wrap justify-center gap-2">
          {Object.values(SPECIALTIES).map((label) => (
            <span key={label} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-soft">
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <SectionTitle eyebrow="Як це працює" title="Чотири кроки від ідеї до результату" />
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="card p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-brand/10 font-extrabold text-brand">
                {index + 1}
              </span>
              <h3 className="mt-5 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 border-y border-line bg-surface/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionTitle align="left" eyebrow="Цінова політика" title="Прозора комісія, лише з виконаних замовлень" />
            <p className="mt-5 text-muted">
              Платформа утримує частину платежу на розвиток і хостинг сайту. Відсоток залежить від ціни замовлення.
            </p>
            <div className="mt-6 rounded-2xl border border-brand/30 bg-brand/5 p-5 text-sm text-amber-100">
              <b className="text-brand">Важливо.</b> Замовник може сплатити замовлення лише після того, як виконавець
              повідомить про виконану роботу. Виплата виконавцю проходить автоматично після оплати.
            </div>
          </div>
          <div className="card divide-y divide-line overflow-hidden">
            {COMMISSION_TIERS.map((tier) => (
              <div key={tier.label} className="flex items-center justify-between gap-4 px-6 py-5">
                <span className="text-soft">{tier.label}</span>
                <span className="text-2xl font-extrabold text-brand">{Math.round(tier.rate * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <SectionTitle eyebrow="Конфіденційність" title="Що ми зберігаємо і як довго" />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <InfoCard title="Персональні дані">
            Ми зберігаємо лише пошту, телефон, Telegram і, для виконавців, банківську картку для виплат. Паролі
            зберігаються у вигляді хешу — навіть модератори не мають до них доступу. Змінити пароль можна в
            налаштуваннях акаунта.
          </InfoCard>
          <InfoCard title="Файли">
            Файли, прикріплені до замовлень і чатів, доступні лише учасникам замовлення. Ми не використовуємо їх і
            можемо допомогти відновити доступ. Проєкти з багатьма файлами варто архівувати.
          </InfoCard>
          <InfoCard title="Термін зберігання">
            Завершені замовлення разом з усіма файлами автоматично видаляються через рік. Вільні замовлення, дедлайн
            яких минув понад 30 днів тому, видаляються раніше.
          </InfoCard>
        </div>
      </section>

      {/* Support */}
      <section id="support" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-surface-2 to-surface p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-20 -bottom-24 size-80 rounded-full bg-brand/20 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Потрібна допомога?</h2>
              <p className="mt-3 text-muted">
                Служба підтримки відповідає в Telegram. З питань реклами та партнерства — окремий контакт.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <ButtonLink href={`https://t.me/${SUPPORT_TELEGRAM.slice(1)}`} target="_blank" size="lg">
                Підтримка {SUPPORT_TELEGRAM}
              </ButtonLink>
              <ButtonLink
                href={`https://t.me/${PARTNER_TELEGRAM.slice(1)}`}
                target="_blank"
                variant="secondary"
                size="lg"
              >
                Партнерство {PARTNER_TELEGRAM}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function RoleCard(props: { href: string; emoji: string; title: string; text: string; cta: string }) {
  return (
    <Link
      href={props.href}
      className="group card relative flex flex-col gap-3 overflow-hidden p-6 transition hover:-translate-y-1 hover:border-brand/50"
    >
      <div className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-brand/0 blur-2xl transition group-hover:bg-brand/20" />
      <span className="grid size-12 place-items-center rounded-2xl bg-surface-2 text-2xl">{props.emoji}</span>
      <h2 className="text-xl font-bold">{props.title}</h2>
      <p className="text-sm text-muted">{props.text}</p>
      <span className="mt-2 text-sm font-semibold text-brand">{props.cta} →</span>
    </Link>
  );
}

function SectionTitle({
  eyebrow,
  title,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="text-sm font-bold tracking-wider text-brand uppercase">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{children}</p>
    </div>
  );
}
