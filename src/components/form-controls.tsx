"use client";

import { useActionState, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Alert, Button } from "./ui";
import type { FormState } from "@/lib/forms";

export function SubmitButton({
  children,
  pending: pendingLabel = "Зачекайте…",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "type"> & { pending?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? pendingLabel : children}
    </Button>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (state.error) return <Alert tone="error">{state.error}</Alert>;
  if (state.success) return <Alert tone="success">{state.success}</Alert>;
  return null;
}

/** A small form bound to a server action; resets its inputs after a successful submit. */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  children: (state: FormState) => ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction] = useActionState(action, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (resetOnSuccess && state.success) ref.current?.reset();
  }, [state, resetOnSuccess]);
  return (
    <form ref={ref} action={formAction} className={className}>
      {children(state)}
    </form>
  );
}

/** A one-click action (take, pay, archive…) with optional confirmation. */
export function ActionButton({
  action,
  confirm,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick" | "action"> & {
  action: () => Promise<FormState | void>;
  confirm?: string;
}) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<FormState>({});
  return (
    <div className="flex flex-col gap-2">
      <Button
        {...props}
        disabled={pending || props.disabled}
        onClick={() => {
          if (confirm && !window.confirm(confirm)) return;
          start(async () => setResult((await action()) ?? {}));
        }}
      >
        {pending ? "Зачекайте…" : children}
      </Button>
      <FormMessage state={result} />
    </div>
  );
}
