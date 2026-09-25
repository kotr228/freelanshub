import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="grid min-h-[70dvh] place-items-center px-4 text-center">
      <div>
        <p className="text-7xl font-extrabold text-brand">404</p>
        <h1 className="mt-4 text-2xl font-bold">Сторінку не знайдено</h1>
        <p className="mt-2 text-muted">Можливо, замовлення видалене або у вас немає до нього доступу.</p>
        <ButtonLink href="/" className="mt-8">
          На головну
        </ButtonLink>
      </div>
    </div>
  );
}
