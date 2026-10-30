import type { Metadata } from "next";
import "./globals.css";
import LogoLoader from "../components/LogoLoader";

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
      <body className="min-h-screen bg-paper text-ink">
        <LogoLoader />
        {children}
      </body>
    </html>
  );
}
