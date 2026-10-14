"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#0d0d0f] text-zinc-400 font-sans border-t border-white/10 py-16 md:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        
        {/* Brand Description */}
        <div className="md:col-span-5 flex flex-col items-start space-y-6 text-left">
          <Link 
            href="/" 
            className="flex items-center group transition-transform duration-300 hover:scale-105"
            aria-label="De Flores Atelier"
          >
            <div className="relative h-16 sm:h-20 aspect-[5/6]">
              <Image
                src="/logo.svg"
                alt="De flores"
                fill
                className="object-contain brightness-0 invert drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)] transition-all duration-300"
              />
            </div>
          </Link>
          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-sm font-light tracking-wide">
            ‘de flores’ translates to ‘flowers’ in Spanish — symbolizing elegance, chastity, and loveliness in every attire we sculpt. Bespoke bridal couture, Varanasi & Kanchipuram handlooms, and red-carpet ensembles tailored to your fantasy.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest text-[#C5A059] font-semibold">
              Bespoke Showroom · Cochin Int&apos;l Airport
            </span>
          </div>
        </div>

        {/* Collections Column */}
        <div className="md:col-span-2 flex flex-col space-y-4 text-left">
          <h4 className="text-[11px] font-bold tracking-[0.25em] text-[#C5A059] uppercase">
            Lookbook
          </h4>
          <ul className="space-y-3 text-xs tracking-wider font-light">
            {[
              { name: "Bridal Lehenga", href: "/collections?category=lehenga" },
              { name: "Red Carpet Gown", href: "/collections?category=gown" },
              { name: "Draped Silk Saree", href: "/collections?category=saree" },
              { name: "Royal Menswear", href: "/collections?category=mens-wear" },
              { name: "Cocktail Edit", href: "/collections?category=party-wear" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-zinc-400 hover:text-[#FDFBF7] transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Studio Column */}
        <div className="md:col-span-2 flex flex-col space-y-4 text-left">
          <h4 className="text-[11px] font-bold tracking-[0.25em] text-[#C5A059] uppercase">
            Maison
          </h4>
          <ul className="space-y-3 text-xs tracking-wider font-light">
            {[
              { name: "About Founder", href: "/founder" },
              { name: "Atelier Journal", href: "/blog" },
              { name: "Behind the Seams", href: "/#craft" },
              { name: "Book Consultation", href: "/contact" }
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-zinc-400 hover:text-[#FDFBF7] transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact/Newsletter Column */}
        <div className="md:col-span-3 flex flex-col space-y-4 text-left">
          <h4 className="text-[11px] font-bold tracking-[0.25em] text-[#C5A059] uppercase">
            Private Access
          </h4>
          <p className="text-zinc-400 text-xs leading-relaxed font-light tracking-wide">
            Receive private runway invites, bespoke preview links, and seasonal curations.
          </p>
          <div className="flex w-full items-center mt-2 border border-white/20 rounded-full bg-white/5 pl-4 pr-1.5 py-1.5 focus-within:border-[#C5A059] transition-all">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="bg-transparent border-0 outline-0 text-xs px-2 py-1 w-full text-white tracking-wider placeholder:text-zinc-500 focus:outline-none"
            />
            <button className="bg-[#C5A059] text-[#2B0A0E] text-[10px] font-bold tracking-widest uppercase px-5 py-2 rounded-full hover:bg-[#FDFBF7] transition-colors shrink-0">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-light tracking-wider text-zinc-500">
        <p>© {new Date().getFullYear()} De flores Haute Couture. All rights reserved.</p>
        <div className="flex gap-6 items-center">
          <Link href="/admin/login" className="hover:text-white transition-colors uppercase tracking-widest font-semibold border-r border-white/10 pr-6 mr-2 text-[10px]">
            Admin
          </Link>
          <a href="https://www.instagram.com/de_flores_official/" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors flex items-center gap-1">
            Instagram <ArrowUpRight className="w-3 h-3" />
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors flex items-center gap-1">
            Pinterest <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

      </div>
    </footer>
  );
}
