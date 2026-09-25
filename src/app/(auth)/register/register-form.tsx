"use client";

import { useActionState } from "react";
import { register } from "@/app/actions/auth";
import { FormMessage, SubmitButton } from "@/components/form-controls";
import { Field } from "@/components/ui";
import type { Role } from "@/lib/constants";

export function RegisterForm({ role }: { role: Role }) {
  const [state, action] = useActionState(register, {});
  const errors = state.fieldErrors ?? {};
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="role" value={role} />
      <FormMessage state={state} />
      <Field label="Ім'я" htmlFor="name" error={errors.name}>
        <input
          id="name"
          name="name"
          defaultValue={state.values?.name}
          autoComplete="name"
          required
          maxLength={45}
          className="input"
          aria-invalid={!!errors.name}
        />
      </Field>
      {role === "freelancer" && (
        <Field
          label="Спеціальність"
          htmlFor="specialty"
          error={errors.specialty}
          hint="Наприклад: фронтенд-розробник, 3D-дизайнер"
        >
          <input
            id="specialty"
            name="specialty"
            defaultValue={state.values?.specialty}
            required
            maxLength={150}
            className="input"
            aria-invalid={!!errors.specialty}
          />
        </Field>
      )}
      <Field label="Електронна пошта" htmlFor="email" error={errors.email}>
        <input
          id="email"
          name="email"
          defaultValue={state.values?.email}
          type="email"
          autoComplete="email"
          required
          className="input"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Телефон" htmlFor="phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            defaultValue={state.values?.phone}
            type="tel"
            autoComplete="tel"
            required
            className="input"
            placeholder="+380XXXXXXXXX"
            aria-invalid={!!errors.phone}
          />
        </Field>
        <Field label="Telegram" htmlFor="telegram" error={errors.telegram}>
          <input
            id="telegram"
            name="telegram"
            defaultValue={state.values?.telegram}
            required
            className="input"
            placeholder="@username"
            aria-invalid={!!errors.telegram}
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Пароль" htmlFor="password" error={errors.password} hint="Мінімум 8 символів">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="input"
            aria-invalid={!!errors.password}
          />
        </Field>
        <Field label="Повторіть пароль" htmlFor="passwordConfirm" error={errors.passwordConfirm}>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            required
            className="input"
            aria-invalid={!!errors.passwordConfirm}
          />
        </Field>
      </div>
      <SubmitButton className="w-full" size="lg" pending="Створюємо акаунт…">
        Зареєструватися
      </SubmitButton>
    </form>
  );
}
