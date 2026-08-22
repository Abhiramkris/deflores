"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer completely on admin workspace pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full bg-white text-zinc-500 font-sans border-t border-zinc-100 py-16 md:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        
        {/* Brand Description */}
        <div className="md:col-span-6 flex flex-col items-start space-y-6 text-left animate-fade-in-up">
          <Link 
            href="/" 
            className="font-serif text-2xl tracking-[0.15em] uppercase text-zinc-950 hover:opacity-70 transition-opacity animate-text-reveal"
          >
            DeFlore
          </Link>
          <p className="text-zinc-500 text-xs leading-relaxed max-w-sm font-light tracking-wide">
            A digital showcase of minimal, high-concept metalwork and jewelry. Tailored with architectural alignment.
          </p>
        </div>

        {/* Links Column */}
        <div className="md:col-span-3 flex flex-col space-y-4 text-left animate-fade-in-up [animation-delay:300ms]">
          <h4 className="font-serif text-[11px] font-bold tracking-widest text-zinc-950 uppercase">
            DeFlore Studio
          </h4>
          <ul className="space-y-3 text-[10px] tracking-wider uppercase font-semibold">
            {["Chapters", "Founder", "Blog", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  href={`#${item.toLowerCase()}`}
                  className="text-zinc-500 hover:text-zinc-950 transition-all duration-300 hover:translate-x-1.5 inline-block"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact/Newsletter Column */}
        <div className="md:col-span-3 flex flex-col space-y-4 text-left animate-fade-in-up [animation-delay:450ms]">
          <h4 className="font-serif text-[11px] font-bold tracking-widest text-zinc-950 uppercase">
            Newsletter
          </h4>
          <p className="text-zinc-500 text-[10px] leading-relaxed font-light tracking-wide">
            Subscribe to receive updates on new chapters.
          </p>
          <div className="flex w-full items-center max-w-xs mt-2 border border-zinc-200 rounded-none bg-transparent p-1 focus-within:border-zinc-500 transition-all duration-300 hover-float">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="bg-transparent border-0 outline-0 text-[10px] px-2 py-1.5 w-full text-zinc-950 tracking-wider placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
            />
            <button className="bg-zinc-950 text-white text-[9px] font-bold tracking-widest uppercase px-4 py-1.5 hover:bg-zinc-800 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 md:mt-20 pt-8 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-medium tracking-wider uppercase text-zinc-400 animate-fade-in-up [animation-delay:600ms]">
        <p>© 2026 DeFlore. All rights reserved.</p>
        <div className="flex gap-6 items-center">
          <Link href="/admin/login" className="hover:text-zinc-950 transition-colors uppercase tracking-widest font-semibold border-r border-zinc-200 pr-6 mr-2">
            Admin Login
          </Link>
          <a href="#" className="hover:text-zinc-950 transition-all duration-300 hover:-translate-y-1 inline-block">Instagram</a>
          <a href="#" className="hover:text-zinc-950 transition-all duration-300 hover:-translate-y-1 inline-block">Pinterest</a>
        </div>
      </div>
    </footer>
  );
}
