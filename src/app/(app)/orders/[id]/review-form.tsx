"use client";

import { useState } from "react";
import clsx from "clsx";
import { ActionForm, FormMessage, SubmitButton } from "@/components/form-controls";
import type { FormState } from "@/lib/forms";

export function ReviewForm({
  action,
  target,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  target: string;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const shown = hover || rating;

  return (
    <ActionForm action={action} className="mt-5 space-y-3 border-t border-line pt-5">
      {(state) => (
        <>
          <p className="text-sm font-semibold">Оцініть {target}</p>
          <input type="hidden" name="rating" value={rating || ""} />
          <div className="flex gap-1" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Оцінка">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} з 5`}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                className={clsx("text-3xl leading-none transition", n <= shown ? "text-brand" : "text-line-strong")}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            name="comment"
            rows={3}
            maxLength={1000}
            defaultValue={state.values?.comment}
            placeholder="Як пройшла співпраця? (необов'язково)"
            aria-label="Коментар"
            className="input resize-y"
          />
          {state.fieldErrors?.rating && <p className="text-xs text-rose-400">{state.fieldErrors.rating}</p>}
          <FormMessage state={state} />
          <SubmitButton size="sm" disabled={rating === 0} pending="Надсилаємо…">
            Залишити відгук
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}
