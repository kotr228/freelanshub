"use client";

import { ActionForm, FormMessage, SubmitButton } from "@/components/form-controls";
import type { FormState } from "@/lib/forms";

export function FileUpload({ action }: { action: (state: FormState, formData: FormData) => Promise<FormState> }) {
  return (
    <ActionForm action={action} resetOnSuccess className="mt-4 space-y-3">
      {(state) => (
        <>
          <input
            name="file"
            type="file"
            required
            aria-label="Файл"
            className="input text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-zinc-100"
          />
          <SubmitButton variant="secondary" size="sm" className="w-full" pending="Завантаження…">
            Завантажити файл
          </SubmitButton>
          <FormMessage state={state} />
        </>
      )}
    </ActionForm>
  );
}
