"use client";

import { useActionState, useState } from "react";
import { createJob } from "@/app/actions/jobs";
import { FormMessage, SubmitButton } from "@/components/form-controls";
import { Field } from "@/components/ui";
import { ORDER_TYPES, SPECIALTIES, splitPayment } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

export function NewOrderForm() {
  const [state, action] = useActionState(createJob, {});
  const [price, setPrice] = useState(state.values?.price ?? "");
  const [description, setDescription] = useState(state.values?.description ?? "");
  const errors = state.fieldErrors ?? {};
  const v = state.values ?? {};
  const amount = Number(price);
  const split = amount > 0 ? splitPayment(amount) : null;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="card space-y-5 p-6">
        <FormMessage state={state} />
        <Field label="Назва" htmlFor="title" error={errors.title}>
          <input
            id="title"
            name="title"
            defaultValue={v.title}
            required
            maxLength={45}
            className="input"
            placeholder="Напр.: Дизайн логотипу для кав'ярні"
            aria-invalid={!!errors.title}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Спеціальність" htmlFor="specialty" error={errors.specialty}>
            <select
              id="specialty"
              name="specialty"
              defaultValue={v.specialty ?? ""}
              required
              className="input"
              aria-invalid={!!errors.specialty}
            >
              <option value="" disabled>
                Оберіть спеціальність
              </option>
              {Object.entries(SPECIALTIES).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Тип роботи" htmlFor="type" error={errors.type}>
            <select
              id="type"
              name="type"
              defaultValue={v.type ?? ""}
              required
              className="input"
              aria-invalid={!!errors.type}
            >
              <option value="" disabled>
                Оберіть тип
              </option>
              {Object.entries(ORDER_TYPES).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field
          label="Опис"
          htmlFor="description"
          error={errors.description}
          hint={`${description.length}/500 · Що саме потрібно зробити, у якому форматі здати результат`}
        >
          <textarea
            id="description"
            name="description"
            required
            maxLength={500}
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input resize-y"
            aria-invalid={!!errors.description}
          />
        </Field>
        <Field
          label="Файли (необов'язково)"
          htmlFor="files"
          error={errors.files}
          hint="До 25 МБ кожен. Проєкти архівуйте в zip/rar/7z."
        >
          <input
            id="files"
            name="files"
            type="file"
            multiple
            className="input file:mr-3 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-zinc-100"
          />
        </Field>
      </div>

      <aside className="space-y-5">
        <div className="card space-y-5 p-6">
          <Field label="Дедлайн" htmlFor="deadline" error={errors.deadline}>
            <input
              id="deadline"
              name="deadline"
              type="date"
              min={today}
              defaultValue={v.deadline}
              required
              className="input"
              aria-invalid={!!errors.deadline}
            />
          </Field>
          <Field label="Бюджет, грн" htmlFor="price" error={errors.price}>
            <input
              id="price"
              name="price"
              type="number"
              min={1}
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input"
              placeholder="1000"
              aria-invalid={!!errors.price}
            />
          </Field>
          {split && (
            <dl className="space-y-1.5 rounded-xl bg-ink p-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Комісія ({Math.round(split.rate * 100)}%)</dt>
                <dd>{formatPrice(split.commission)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Виконавець отримає</dt>
                <dd className="font-bold text-brand">{formatPrice(split.payout)}</dd>
              </div>
            </dl>
          )}
          <SubmitButton size="lg" className="w-full" pending="Публікуємо…">
            Опублікувати замовлення
          </SubmitButton>
        </div>
        <p className="px-1 text-xs text-muted">
          Ви сплачуєте замовлення лише після того, як виконавець позначить його виконаним.
        </p>
      </aside>
    </form>
  );
}
