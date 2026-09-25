import clsx from "clsx";
import { initials } from "@/lib/format";

export function avatarUrl(path: string | null) {
  if (!path) return null;
  const name = path.split("/").pop();
  return name ? `/api/avatars/${encodeURIComponent(name)}` : null;
}

export function Avatar({ name, src, className }: { name: string; src: string | null; className?: string }) {
  const url = avatarUrl(src);
  return (
    <span
      className={clsx(
        "grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-brand/80 to-orange-600/80 font-bold text-brand-ink",
        className ?? "size-9 text-sm",
      )}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- served by our own route, sizes vary
        <img src={url} alt="" className="size-full object-cover" />
      ) : (
        initials(name) || "?"
      )}
    </span>
  );
}
