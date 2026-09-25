import Link from "next/link";
import { RoleSwitch } from "@/components/role-switch";
import { RegisterForm } from "./register-form";
import type { Role } from "@/lib/constants";

export const metadata = { title: "Реєстрація" };

export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const role: Role = (await searchParams).role === "freelancer" ? "freelancer" : "client";
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight">Створіть акаунт</h1>
      <p className="mt-2 text-muted">
        {role === "client"
          ? "Публікуйте замовлення та знаходьте виконавців."
          : "Беріть замовлення за своєю спеціальністю."}
      </p>
      <div className="mt-8">
        <RoleSwitch role={role} base="/register" />
      </div>
      <RegisterForm key={role} role={role} />
      <p className="mt-8 text-center text-sm text-muted">
        Вже є акаунт?{" "}
        <Link href={`/login?role=${role}`} className="font-semibold text-brand hover:underline">
          Увійти
        </Link>
      </p>
    </>
  );
}
