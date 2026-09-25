"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { FormMessage, SubmitButton } from "@/components/form-controls";
import { Field } from "@/components/ui";
import type { Role } from "@/lib/constants";

export function LoginForm({ role }: { role: Role }) {
  const [state, action] = useActionState(login, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="role" value={role} />
      <FormMessage state={state} />
      <Field label="Електронна пошта" htmlFor="email" error={state.fieldErrors?.email}>
        <input
          id="email"
          name="email"
          defaultValue={state.values?.email}
          type="email"
          autoComplete="email"
          required
          className="input"
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Пароль" htmlFor="password" error={state.fieldErrors?.password}>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="input"
        />
      </Field>
      <label className="flex items-center gap-2 text-sm text-soft">
        <input type="checkbox" name="remember" defaultChecked className="size-4 accent-[#f0ad4e]" />
        Запам&apos;ятати мене
      </label>
      <SubmitButton className="w-full" size="lg" pending="Входимо…">
        Увійти як {role === "client" ? "замовник" : "фрілансер"}
      </SubmitButton>
    </form>
  );
}
