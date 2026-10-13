"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide navbar on homepage (which has its own integrated hero header) and admin pages
  if (pathname === "/" || pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: "Collections", href: "/explore" },
    { name: "About", href: "/founder" },
    { name: "Journal", href: "/blog" },
    { name: "Sustainability", href: "/explore" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? "bg-zinc-950/85 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-2xl"
            : "bg-transparent py-5 md:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between text-white">
          
          {/* Left: Brand Logo & Desktop Nav Links */}
          <div className="flex items-center gap-8 lg:gap-12">
            <Link
              href="/"
              className="font-serif text-2xl md:text-3xl tracking-[0.22em] uppercase font-light text-white hover:opacity-90 transition-opacity drop-shadow-sm"
            >
              De flores
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-normal tracking-wide text-zinc-200">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-white transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all hover:after:w-full"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Icon button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-zinc-200 hover:text-white transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            </button>

            {/* Mobile Shopping Bag icon */}
            <Link
              href="/explore"
              className="md:hidden p-1.5 text-zinc-200 hover:text-white transition-colors"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>

            {/* Desktop Sign In */}
            <Link
              href="/admin/login"
              className="hidden md:inline-block text-xs text-zinc-200 hover:text-white transition-colors font-normal tracking-wide"
            >
              Sign In
            </Link>

            {/* Desktop Shop Now Pill Button */}
            <Link
              href="/explore"
              className="hidden md:inline-flex items-center justify-center rounded-full border border-white/60 px-5 py-2 text-xs font-normal tracking-wide text-white hover:bg-white hover:text-zinc-950 transition-all duration-300 backdrop-blur-xs"
            >
              Shop Now
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-zinc-200 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            {/* Wishlist Heart Icon - Hidden on small mobile */}
            <button className="hidden sm:block hover:opacity-60 transition-opacity" aria-label="Wishlist">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen / Drawer Overlay */}
        <div
          className={`md:hidden fixed inset-x-0 top-full transition-all duration-500 ease-in-out bg-zinc-950/95 backdrop-blur-2xl border-b border-white/10 px-6 py-8 overflow-hidden ${
            isMobileMenuOpen ? "max-h-screen opacity-100 visible" : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="flex flex-col gap-5 text-white">
            <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400 font-medium">Navigation</span>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-serif tracking-widest text-zinc-100 hover:text-white hover:translate-x-1 transition-all py-1 border-b border-white/5"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 flex flex-col gap-3">
              <Link
                href="/explore"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-white text-zinc-950 py-3 text-xs tracking-widest uppercase font-semibold hover:bg-zinc-200 transition-colors"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs tracking-widest uppercase text-zinc-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md transition-opacity">
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-white/20 rounded-2xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3 w-full">
                <Search className="w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search collections, lehengas, sarees, gowns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-sm md:text-base text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 hover:text-zinc-300 text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-2">
              <p className="text-[10px] tracking-widest uppercase text-zinc-400 font-semibold">Suggested Searches</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["Bridal Lehenga", "Celeb Gown", "Silk Saree", "Reception Edit", "Haute Couture"].map((tag) => (
                  <Link
                    key={tag}
                    href={`/explore?q=${encodeURIComponent(tag)}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white hover:text-zinc-950 transition-colors text-zinc-300"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
