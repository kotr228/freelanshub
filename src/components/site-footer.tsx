import Link from "next/link";
import { Logo } from "./logo";
import { PARTNER_TELEGRAM, SUPPORT_TELEGRAM } from "@/lib/constants";

function tg(handle: string) {
  return `https://t.me/${handle.replace(/^@/, "")}`;
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted">
            Біржа фрілансу, де оплата надходить виконавцю лише після того, як робота виконана.
          </p>
        </div>
        <FooterCol title="Платформа">
          <Link href="/#how">Як це працює</Link>
          <Link href="/#pricing">Цінова політика</Link>
          <Link href="/#privacy">Конфіденційність</Link>
        </FooterCol>
        <FooterCol title="Акаунт">
          <Link href="/login?role=client">Вхід для замовників</Link>
          <Link href="/login?role=freelancer">Вхід для фрілансерів</Link>
          <Link href="/register">Реєстрація</Link>
        </FooterCol>
        <FooterCol title="Зв'язок">
          <a href={tg(SUPPORT_TELEGRAM)} target="_blank" rel="noreferrer">
            Підтримка {SUPPORT_TELEGRAM}
          </a>
          <a href={tg(PARTNER_TELEGRAM)} target="_blank" rel="noreferrer">
            Реклама і партнерство
          </a>
        </FooterCol>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Freelanshub
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold">{title}</p>
      <div className="flex flex-col gap-2 text-sm text-muted [&_a]:transition [&_a:hover]:text-white">{children}</div>
    </div>
  );
}
