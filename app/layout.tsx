import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Tracker from "./components/Tracker";
import LuxuryEffects from "./components/LuxuryEffects";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeFlores - Modern Floral Architecture",
  description: "An interactive digital showcase of luxury and modern floral styling.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col luxury-pattern-bg text-zinc-900 selection:bg-zinc-950 selection:text-white">
        <Tracker />
        <LuxuryEffects />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
