"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <footer className="w-full bg-[#f4f2ee] px-4 pb-4 md:px-6 md:pb-6 relative z-10">
      <div className="w-full bg-[#181716] text-white rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
        
        {/* Large Backdrop Text "De Flora" */}
        <div className="absolute bottom-12 left-8 md:left-16 text-[11vw] font-bold text-white/[0.025] tracking-tighter pointer-events-none select-none leading-none">
          De Flora
        </div>

        {/* Top Section */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: CTA & Newsletter */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="space-y-1">
              <span className="text-[10px] tracking-[0.25em] font-semibold uppercase text-zinc-500">DE FLORA</span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase leading-tight max-w-md">
                READY TO ELEVATE YOUR STYLE?
              </h2>
            </div>
            
            {/* Minimal Underline Input */}
            <div className="relative w-full max-w-sm border-b border-zinc-700 pb-3 flex items-center justify-between group focus-within:border-white transition-colors duration-300">
              <input
                type="email"
                placeholder="Join for new drops & offers..."
                className="bg-transparent border-none outline-none text-xs text-white placeholder:text-zinc-500 w-full focus:ring-0 pr-8"
              />
              <button 
                type="submit" 
                className="text-amber-300/80 hover:text-white transition-colors duration-300 pr-1"
                aria-label="Subscribe"
              >
                <span className="text-base font-bold">↗</span>
              </button>
            </div>

            <div className="text-[9px] tracking-wider uppercase text-zinc-500">
              @2026 DE FLORA – PREMIUM FASHION. ALL RIGHTS RESERVED.
            </div>
          </div>

          {/* Right Columns: Links & Info */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-left text-xs uppercase tracking-widest font-semibold">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-zinc-400 hover:text-white transition-colors">HOME</Link>
              <Link href="/explore" className="text-zinc-400 hover:text-white transition-colors">SHOP</Link>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <Link href="/explore" className="text-zinc-400 hover:text-white transition-colors">COLLECTIONS</Link>
              <Link href="/gallery" className="text-zinc-400 hover:text-white transition-colors">LOOKBOOK</Link>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4">
              <Link href="/founder" className="text-zinc-400 hover:text-white transition-colors">ABOUT BRAND</Link>
              <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">CONTACT</Link>
            </div>

            {/* Column 4: Flagship Info */}
            <div className="space-y-6 text-[10px] text-zinc-400 tracking-wider">
              <div className="space-y-1">
                <div className="font-bold text-white text-[11px] tracking-widest">FLAGSHIP</div>
                <p className="font-light leading-relaxed">
                  MUMBAI, INDIA<br />
                  COMING SOON
                </p>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-white text-[11px] tracking-widest">CONTACT</div>
                <a href="mailto:hello@deflora.co" className="hover:text-white transition-colors lowercase font-light">
                  hello@deflora.co
                </a>
              </div>

              <div className="space-y-1 font-light leading-relaxed">
                <span className="font-bold text-white tracking-widest">MON – SAT</span>
                <div>10:00 AM – 8:00 PM</div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative z-10 mt-20 pt-8 border-t border-zinc-800/60 flex items-center justify-between text-[10px] tracking-widest uppercase font-semibold text-zinc-500">
          <button 
            onClick={handleScrollToTop}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <span>↑</span> BACK TO TOP
          </button>
          
          <div className="flex items-center gap-6 text-zinc-400">
            {/* Inline SVGs for social media icons */}
            <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
