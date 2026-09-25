"use client";

import { useTransition } from "react";
import {
  changePassword,
  removeAvatar,
  updateAvatar,
  updateBankCard,
  updateEmail,
  updateProfile,
} from "@/app/actions/settings";
import { Avatar } from "@/components/avatar";
import { ActionForm, FormMessage, SubmitButton } from "@/components/form-controls";
import { Button, Field } from "@/components/ui";
import type { UserProfile } from "@/lib/users";

export function ProfileForm({ user }: { user: UserProfile }) {
  return (
    <ActionForm action={updateProfile} className="space-y-4">
      {(state) => (
        <>
          <FormMessage state={state} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ім'я" htmlFor="name" error={state.fieldErrors?.name}>
              <input
                id="name"
                name="name"
                defaultValue={state.values?.name ?? user.name}
                required
                maxLength={45}
                className="input"
              />
            </Field>
            {user.role === "freelancer" && (
              <Field label="Спеціальність" htmlFor="specialty" error={state.fieldErrors?.specialty}>
                <input
                  id="specialty"
                  name="specialty"
                  defaultValue={state.values?.specialty ?? user.specialty ?? ""}
                  required
                  maxLength={150}
                  className="input"
                />
              </Field>
            )}
            <Field label="Телефон" htmlFor="phone" error={state.fieldErrors?.phone}>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={state.values?.phone ?? user.phone}
                required
                className="input"
              />
            </Field>
            <Field label="Telegram" htmlFor="telegram" error={state.fieldErrors?.telegram}>
              <input
                id="telegram"
                name="telegram"
                defaultValue={state.values?.telegram ?? user.telegram}
                required
                className="input"
              />
            </Field>
          </div>
          <Field
            label="Про себе"
            htmlFor="about"
            error={state.fieldErrors?.about}
            hint="Досвід, навички, як з вами краще працювати"
          >
            <textarea
              id="about"
              name="about"
              rows={5}
              maxLength={2000}
              defaultValue={state.values?.about ?? user.about ?? ""}
              className="input resize-y"
            />
          </Field>
          <SubmitButton pending="Зберігаємо…">Зберегти профіль</SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

export function EmailForm({ email }: { email: string }) {
  return (
    <ActionForm action={updateEmail} className="space-y-4">
      {(state) => (
        <>
          <FormMessage state={state} />
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              name="email"
              type="email"
              aria-label="Електронна пошта"
              defaultValue={state.values?.email ?? email}
              required
              className="input"
            />
            <SubmitButton variant="secondary" pending="…">
              Змінити пошту
            </SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}

export function PasswordForm() {
  return (
    <ActionForm action={changePassword} resetOnSuccess className="space-y-4">
      {(state) => (
        <>
          <FormMessage state={state} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Поточний пароль" htmlFor="current" error={state.fieldErrors?.current}>
              <input
                id="current"
                name="current"
                type="password"
                autoComplete="current-password"
                required
                className="input"
              />
            </Field>
            <Field label="Новий пароль" htmlFor="password" error={state.fieldErrors?.password}>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="input"
              />
            </Field>
            <Field label="Повторіть новий" htmlFor="passwordConfirm" error={state.fieldErrors?.passwordConfirm}>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                autoComplete="new-password"
                required
                className="input"
              />
            </Field>
          </div>
          <SubmitButton variant="secondary" pending="Змінюємо…">
            Змінити пароль
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

export function AvatarForm({ name, avatar }: { name: string; avatar: string | null }) {
  const [removing, startRemove] = useTransition();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar name={name} src={avatar} className="size-20 text-2xl" />
        {avatar && (
          <Button
            variant="ghost"
            size="sm"
            disabled={removing}
            onClick={() => startRemove(async () => void (await removeAvatar()))}
          >
            Видалити
          </Button>
        )}
      </div>
      <ActionForm action={updateAvatar} resetOnSuccess className="space-y-3">
        {(state) => (
          <>
            <input
              name="avatar"
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              required
              aria-label="Новий аватар"
              className="input text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-zinc-100"
            />
            <p className="text-xs text-muted">JPG, PNG, GIF або WEBP, до 2 МБ</p>
            <SubmitButton variant="secondary" size="sm" className="w-full" pending="Завантаження…">
              Оновити аватар
            </SubmitButton>
            <FormMessage state={state} />
          </>
        )}
      </ActionForm>
    </div>
  );
}

export function BankCardForm({ card }: { card: string | null }) {
  return (
    <ActionForm action={updateBankCard} className="space-y-3">
      {(state) => (
        <>
          {card && (
            <p className="rounded-xl bg-ink px-4 py-3 font-mono text-sm tracking-widest">
              •••• •••• •••• {card.slice(-4)}
            </p>
          )}
          <input
            name="card"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="0000 0000 0000 0000"
            aria-label="Номер картки"
            required
            className="input font-mono"
          />
          <SubmitButton variant="secondary" size="sm" className="w-full" pending="…">
            {card ? "Змінити картку" : "Зберегти картку"}
          </SubmitButton>
          <FormMessage state={state} />
        </>
      )}
    </ActionForm>
  );
}
