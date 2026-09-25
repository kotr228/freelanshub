import Link from "next/link";
import { RoleSwitch } from "@/components/role-switch";
import { LoginForm } from "./login-form";
import type { Role } from "@/lib/constants";

export const metadata = { title: "Вхід" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const role: Role = (await searchParams).role === "freelancer" ? "freelancer" : "client";
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight">З поверненням 👋</h1>
      <p className="mt-2 text-muted">Увійдіть, щоб продовжити роботу із замовленнями.</p>
      <div className="mt-8">
        <RoleSwitch role={role} base="/login" />
      </div>
      <LoginForm key={role} role={role} />
      <p className="mt-8 text-center text-sm text-muted">
        Ще немає акаунта?{" "}
        <Link href={`/register?role=${role}`} className="font-semibold text-brand hover:underline">
          Зареєструватися
        </Link>
      </p>
    </>
  );
}
