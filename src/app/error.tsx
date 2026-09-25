"use client";

import { Button } from "@/components/ui";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-[70dvh] place-items-center px-4 text-center">
      <div>
        <p className="text-5xl">⚠️</p>
        <h1 className="mt-4 text-2xl font-bold">Щось пішло не так</h1>
        <p className="mt-2 text-muted">Спробуйте ще раз. Якщо помилка повторюється — напишіть у підтримку.</p>
        <Button onClick={reset} className="mt-8">
          Спробувати знову
        </Button>
      </div>
    </div>
  );
}
