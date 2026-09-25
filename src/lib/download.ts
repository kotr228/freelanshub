import "server-only";
import { readFile } from "node:fs/promises";
import { resolveStored } from "./storage";

const IMAGE_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
};

/**
 * Sends a stored file. Anything that is not a plain raster image is forced to
 * download, so uploaded HTML/SVG can never run in the site's origin.
 */
export async function sendStored(relativePath: string, displayName: string, opts: { inline?: boolean } = {}) {
  let body: Buffer;
  try {
    body = await readFile(resolveStored(relativePath));
  } catch {
    return new Response("Файл не знайдено", { status: 404 });
  }
  const ext = displayName.split(".").pop()?.toLowerCase() ?? "";
  const image = IMAGE_TYPES[ext];
  const inline = opts.inline && image;
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": inline ? image : "application/octet-stream",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(displayName)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
