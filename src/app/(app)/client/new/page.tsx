import { PageHeader } from "@/components/ui";
import { requireSession } from "@/lib/session";
import { NewOrderForm } from "./new-order-form";

export const metadata = { title: "Нове замовлення" };

export default async function NewOrderPage() {
  await requireSession("client");
  return (
    <>
      <PageHeader title="Нове замовлення" text="Чим детальніше опис, тим швидше знайдеться виконавець." />
      <NewOrderForm />
    </>
  );
}
