import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

// Stored paths look like "uploads/<folder>/<file>" and are relative to STORAGE_DIR.
// This matches the PHP-era layout, so old files can simply be copied over.
const ROOT = path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.STORAGE_DIR ?? "storage");

export function extensionOf(fileName: string) {
  const ext = path.extname(fileName).slice(1).toLowerCase();
  return ext;
}

export async function saveUpload(file: File, folder: "orders" | "chat" | "avatars") {
  const ext = extensionOf(file.name);
  const relative = path.posix.join("uploads", folder, `${randomUUID()}${ext ? `.${ext}` : ""}`);
  const absolute = resolveStored(relative);
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, Buffer.from(await file.arrayBuffer()));
  return relative;
}

/** Resolves a stored path, refusing anything that escapes the storage root. */
export function resolveStored(relative: string) {
  const absolute = path.resolve(ROOT, relative);
  if (absolute !== ROOT && !absolute.startsWith(ROOT + path.sep)) {
    throw new Error("Invalid storage path");
  }
  return absolute;
}

export async function removeStored(relative: string | null | undefined) {
  if (!relative) return;
  try {
    await rm(resolveStored(relative), { force: true });
  } catch {
    // Missing files are fine — the database row is what matters.
  }
}

/** Keeps only the file name part and strips characters that break headers. */
export function safeDisplayName(name: string) {
  const base = name.split(/[\\/]/).pop() ?? "file";
  return base.replace(/[\u0000-\u001f"]/g, "").slice(0, 200) || "file";
}
