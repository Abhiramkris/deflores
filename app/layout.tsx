import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DE FLORES HAUTE COUTURE",
  description: "Boutique specializing in custom outfits and ready-to-sell collections.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink">{children}</body>
    </html>
  );
}
