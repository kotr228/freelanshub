import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { NotificationsBell } from "@/components/notifications-bell";
import { UserMenu } from "@/components/user-menu";
import { avatarUrl } from "@/components/avatar";
import { ROLE_LABEL } from "@/lib/constants";
import { homeFor, requireSession } from "@/lib/session";
import { getUser } from "@/lib/users";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const user = await getUser(session.role, session.userId);
  // The account was removed while the cookie was still valid.
  if (!user) redirect("/session-expired");

  const links =
    session.role === "client"
      ? [
          { href: "/client", label: "Мої замовлення" },
          { href: "/client/new", label: "Нове замовлення" },
        ]
      : [
          { href: "/freelancer", label: "Каталог" },
          { href: "/freelancer/orders", label: "Мої замовлення" },
        ];

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Logo href={homeFor(session.role)} />
          <MainNav links={links} />
          <div className="ml-auto flex items-center gap-2">
            <NotificationsBell />
            <UserMenu
              name={user.name}
              email={user.email}
              roleLabel={ROLE_LABEL[session.role]}
              avatar={avatarUrl(user.avatar)}
              links={links}
            />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      <footer className="border-t border-line py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Freelanshub ·{" "}
        <a href="/#pricing" className="hover:text-white">
          Ціни
        </a>{" "}
        ·{" "}
        <a href="/#privacy" className="hover:text-white">
          Конфіденційність
        </a>{" "}
        ·{" "}
        <a href="/#support" className="hover:text-white">
          Підтримка
        </a>
      </footer>
    </div>
  );
}
