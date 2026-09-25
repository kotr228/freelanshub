"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui";
import type { Role } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import type { ChatMessage } from "@/lib/orders";

const POLL_MS = 3000;

export function Chat({
  orderId,
  thread,
  me,
  readOnly,
  hint,
}: {
  orderId: number;
  thread: number;
  me: Role;
  readOnly?: boolean;
  hint?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const lastId = useRef(0);

  const poll = useCallback(async () => {
    const response = await fetch(`/api/orders/${orderId}/messages?thread=${thread}&after=${lastId.current}`, {
      cache: "no-store",
    });
    if (!response.ok) return;
    const data = (await response.json()) as { messages: ChatMessage[] };
    setLoaded(true);
    if (data.messages.length === 0) return;
    lastId.current = data.messages[data.messages.length - 1].id;
    setMessages((prev) => {
      const known = new Set(prev.map((m) => m.id));
      return [...prev, ...data.messages.filter((m) => !known.has(m.id))];
    });
  }, [orderId, thread]);

  useEffect(() => {
    poll();
    const timer = setInterval(() => document.visibilityState === "visible" && poll(), POLL_MS);
    return () => clearInterval(timer);
  }, [poll]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages.length]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (sending || (!text.trim() && !file)) return;
    setSending(true);
    setError(null);
    const body = new FormData();
    body.set("message", text);
    body.set("thread", String(thread));
    if (file) body.set("file", file);
    try {
      const response = await fetch(`/api/orders/${orderId}/messages`, { method: "POST", body });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Не вдалося надіслати повідомлення");
        return;
      }
      setText("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      await poll();
    } catch {
      setError("Немає з'єднання із сервером");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <div ref={listRef} className="h-[26rem] space-y-3 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
        {!loaded ? (
          <p className="pt-10 text-center text-sm text-muted">Завантаження…</p>
        ) : messages.length === 0 ? (
          <div className="pt-10 text-center text-sm text-muted">
            <p>Напишіть перше повідомлення 💬</p>
            {hint && <p className="mt-1">{hint}</p>}
          </div>
        ) : (
          messages.map((message) => {
            const mine = message.sender === me;
            return (
              <div key={message.id} className={clsx("flex", mine ? "justify-end" : "justify-start")}>
                <div
                  className={clsx(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                    mine ? "rounded-br-md bg-brand text-brand-ink" : "rounded-bl-md bg-surface-2 text-zinc-100",
                  )}
                >
                  <p className="break-words whitespace-pre-wrap">{message.message}</p>
                  {message.file && (
                    <a
                      href={`/api/chat-files/${message.file.id}`}
                      className={clsx(
                        "mt-2 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold",
                        mine ? "bg-black/10 hover:bg-black/20" : "bg-ink hover:bg-line",
                      )}
                    >
                      📎 <span className="truncate">{message.file.name}</span>
                    </a>
                  )}
                  <p className={clsx("mt-1 text-[11px]", mine ? "text-brand-ink/60" : "text-muted")}>
                    {formatDateTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {readOnly ? (
        <p className="border-t border-line px-6 py-4 text-center text-sm text-muted">
          Замовлення в архіві — чат лише для читання.
        </p>
      ) : (
        <form onSubmit={send} className="border-t border-line p-3 sm:p-4">
          {error && <p className="mb-2 text-sm text-rose-400">{error}</p>}
          {file && (
            <div className="mb-2 flex items-center gap-2 text-xs text-soft">
              📎 <span className="truncate">{file.name}</span>
              <button
                type="button"
                className="text-muted hover:text-white"
                onClick={() => {
                  setFile(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <label
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl border border-line text-lg transition hover:bg-surface-2"
              title="Прикріпити файл"
            >
              📎
              <input
                ref={fileRef}
                type="file"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              rows={1}
              maxLength={4000}
              placeholder="Напишіть повідомлення…"
              aria-label="Повідомлення"
              className="input max-h-40 min-h-10 resize-none"
            />
            <Button type="submit" disabled={sending || (!text.trim() && !file)} className="shrink-0">
              {sending ? "…" : "Надіслати"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
