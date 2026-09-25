import { PageHeader } from "@/components/ui";
import { requireSession } from "@/lib/session";
import { getUser } from "@/lib/users";
import { notFound } from "next/navigation";
import { AvatarForm, BankCardForm, EmailForm, PasswordForm, ProfileForm } from "./forms";

export const metadata = { title: "Налаштування" };

export default async function SettingsPage() {
  const session = await requireSession();
  const user = await getUser(session.role, session.userId);
  if (!user) notFound();

  return (
    <>
      <PageHeader
        title="Налаштування акаунта"
        text="Контакти бачить лише інша сторона замовлення після того, як його взяли в роботу."
      />
      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <div className="space-y-6">
          <Section title="Аватар">
            <AvatarForm name={user.name} avatar={user.avatar} />
          </Section>
          {session.role === "freelancer" && (
            <Section title="Картка для виплат" text="Сюди надходитимуть гроші за виконані замовлення.">
              <BankCardForm card={user.bankCard} />
            </Section>
          )}
        </div>
        <div className="space-y-6">
          <Section title="Профіль">
            <ProfileForm user={user} />
          </Section>
          <Section title="Електронна пошта" text="Використовується для входу.">
            <EmailForm email={user.email} />
          </Section>
          <Section title="Пароль">
            <PasswordForm />
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ title, text, children }: { title: string; text?: string; children: React.ReactNode }) {
  return (
    <section className="card p-6">
      <h2 className="font-bold">{title}</h2>
      {text && <p className="mt-1 text-sm text-muted">{text}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
