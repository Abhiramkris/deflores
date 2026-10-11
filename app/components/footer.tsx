"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer completely on admin workspace pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#0d0d0f] text-zinc-400 font-sans border-t border-white/10 py-16 md:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        
        {/* Brand Description */}
        <div className="md:col-span-5 flex flex-col items-start space-y-6 text-left">
          <Link 
            href="/" 
            className="font-serif text-3xl tracking-[0.2em] uppercase font-light text-white hover:opacity-80 transition-opacity"
          >
            VÉLORA
          </Link>
          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-sm font-light tracking-wide">
            Combining human creativity and AI innovation to create fashion content built for modern audiences. Haute couture, bridal lehengas, and contemporary silhouettes.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest text-zinc-300 font-medium">Bespoke Atelier Open</span>
          </div>
        </div>

        {/* Collections Column */}
        <div className="md:col-span-2 flex flex-col space-y-4 text-left">
          <h4 className="text-[11px] font-bold tracking-[0.25em] text-white uppercase">
            Collections
          </h4>
          <ul className="space-y-3 text-xs tracking-wider font-light">
            {[
              { name: "Bridal Lehenga", href: "/explore?category=lehenga" },
              { name: "Celeb Gown", href: "/explore?category=gown" },
              { name: "Draped Saree", href: "/explore?category=saree" },
              { name: "Reception Edit", href: "/explore?category=reception" },
              { name: "Pakistani Silhouettes", href: "/explore?category=pakistani" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-zinc-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Studio Column */}
        <div className="md:col-span-2 flex flex-col space-y-4 text-left">
          <h4 className="text-[11px] font-bold tracking-[0.25em] text-white uppercase">
            Maison
          </h4>
          <ul className="space-y-3 text-xs tracking-wider font-light">
            {[
              { name: "About the Founder", href: "/founder" },
              { name: "Editorial Journal", href: "/blog" },
              { name: "Lookbook Exposé", href: "/#lookbook" },
              { name: "Contact & Bespoke", href: "/contact" }
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-zinc-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact/Newsletter Column */}
        <div className="md:col-span-3 flex flex-col space-y-4 text-left">
          <h4 className="text-[11px] font-bold tracking-[0.25em] text-white uppercase">
            Private Access
          </h4>
          <p className="text-zinc-400 text-xs leading-relaxed font-light tracking-wide">
            Receive private runway invites, bespoke preview links, and seasonal curations.
          </p>
          <div className="flex w-full items-center mt-2 border border-white/20 rounded-full bg-white/5 px-2 py-1 focus-within:border-white transition-all">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="bg-transparent border-0 outline-0 text-xs px-3 py-1.5 w-full text-white tracking-wider placeholder:text-zinc-500 focus:outline-none"
            />
            <button className="bg-white text-zinc-950 text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors shrink-0">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-light tracking-wider text-zinc-500">
        <p>© {new Date().getFullYear()} VÉLORA / DeFlores Atelier. All rights reserved.</p>
        <div className="flex gap-6 items-center">
          <Link href="/admin/login" className="hover:text-white transition-colors uppercase tracking-widest font-semibold border-r border-white/10 pr-6 mr-2 text-[10px]">
            Admin
          </Link>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
            Instagram <ArrowUpRight className="w-3 h-3" />
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
            Pinterest <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

      </div>
    </footer>
  );
}
