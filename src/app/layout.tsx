import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Freelanshub — біржа фрілансу", template: "%s · Freelanshub" },
  description: "Публікуйте замовлення, знаходьте виконавців і працюйте з безпечною оплатою після виконання.",
};

export const viewport: Viewport = { themeColor: "#0d0f14" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={manrope.variable}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
