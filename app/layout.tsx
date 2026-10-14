import type { Metadata } from "next";
import { Bodoni_Moda, Montserrat } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Tracker from "./components/Tracker";
import LuxuryEffects from "./components/LuxuryEffects";
import Preloader from "./components/Preloader";
import SmoothScroll from "./components/SmoothScroll";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "De flores - Haute Couture & Bespoke Atelier",
  description: "Bespoke Indian bridal couture, timeless occasion wear, and contemporary western ensembles tailored to your fantasy.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${bodoni.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0d0d0f] text-white selection:bg-[#C5A059] selection:text-[#2B0A0E]">
        <SmoothScroll>
          <Preloader />
          <Tracker />
          <LuxuryEffects />
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
