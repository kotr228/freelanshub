import type { z } from "zod";

export type FormState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string>;
  /** Submitted values, so the form can be refilled after a failed submit (React resets forms). */
  values?: Record<string, string>;
  /** Changes on every submission so client components can reset themselves. */
  at?: number;
};

export function fail(error: string, formData?: FormData): FormState {
  return { error, values: valuesOf(formData), at: Date.now() };
}

export function ok(success: string): FormState {
  return { success, at: Date.now() };
}

export function fromZodError(error: z.ZodError, formData?: FormData): FormState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= issue.message;
  }
  return { error: "Перевірте правильність заповнення полів", fieldErrors, values: valuesOf(formData), at: Date.now() };
}

function valuesOf(formData?: FormData) {
  if (!formData) return undefined;
  const values: Record<string, string> = {};
  for (const [key, value] of formData) {
    // Never echo passwords back to the browser.
    if (typeof value === "string" && !key.startsWith("$") && !/password|current/i.test(key)) values[key] = value;
  }
  return values;
}

export function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function fileFrom(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}
