import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { getSession, homeFor } from "@/lib/session";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session) redirect(homeFor(session.role));

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden overflow-hidden border-r border-line bg-surface lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-[28rem] rounded-full bg-brand/20 blur-[100px]" />
        <Logo className="relative" />
        <div className="relative">
          <p className="text-3xl leading-tight font-extrabold tracking-tight">
            Замовлення, чат, файли й оплата — <span className="text-brand">в одному місці.</span>
          </p>
          <ul className="mt-8 space-y-3 text-soft">
            <li>✓ Оплата лише після виконання</li>
            <li>✓ Чат і файли прямо в замовленні</li>
            <li>✓ Сповіщення про кожен крок</li>
          </ul>
        </div>
        <p className="relative text-sm text-muted">© {new Date().getFullYear()} Freelanshub</p>
      </aside>
      <main className="flex flex-col px-4 py-8 sm:px-8">
        <Logo className="mb-10 lg:hidden" />
        <div className="m-auto w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
