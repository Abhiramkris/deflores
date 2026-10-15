"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, ArrowRight, Calendar } from "lucide-react";

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
    { name: "Lookbook", href: "/explore" },
    { name: "The Craft", href: "/#craft" },
    { name: "About", href: "/founder" },
    { name: "Journal", href: "/blog" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-zinc-200/80 text-zinc-900 py-3 sm:py-3.5 shadow-sm"
            : "bg-[#faf9f6]/95 backdrop-blur-md border-b border-zinc-200/70 text-zinc-900 py-4 sm:py-5"
        }`}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center group transition-transform duration-300 hover:scale-105"
          aria-label="De Flores Atelier"
        >
          <div
            className={`relative aspect-[5/6] transition-all duration-300 ${
              isScrolled
                ? "h-[50px] sm:h-[58px]"
                : "h-[62px] sm:h-[76px] md:h-[90px]"
            }`}
          >
            <Image
              src="/logo.svg"
              alt="De flores"
              fill
              priority
              className="object-contain brightness-0 transition-all duration-300"
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-9 text-xs tracking-[0.25em] uppercase font-medium transition-colors text-zinc-700">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors py-1 relative ${
                  isActive
                    ? "text-[#2B0A0E] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#C5A059]"
                    : "hover:text-[#2B0A0E] text-zinc-700 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C5A059] after:transition-all hover:after:w-full"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Nav Actions */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          {/* Search (Disabled) */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            aria-label="Search (Disabled)"
            className="p-2 opacity-40 cursor-not-allowed pointer-events-none text-zinc-500 transition-opacity"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
          </button>

          {/* Sign In */}
          <Link
            href="/login"
            className="hidden sm:inline-block text-xs uppercase tracking-[0.2em] font-medium transition-colors text-zinc-800 hover:text-black"
          >
            Sign In
          </Link>

          {/* Book Consultation Button */}
          <Link
            href="/contact"
            data-cursor="CONTACT"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-md bg-[#2B0A0E] text-[#FDFBF7] border border-[#C5A059] hover:bg-[#C5A059] hover:text-[#2B0A0E]"
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A059] shrink-0" />
            <span className="sm:hidden">Book</span>
            <span className="hidden sm:inline">Book Consultation</span>
          </Link>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-full text-zinc-900 hover:bg-zinc-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between p-8 md:hidden animate-fadeIn bg-[#faf9f6] text-zinc-900">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center group"
              aria-label="De Flores Atelier"
            >
              <div className="relative h-[68px] sm:h-[76px] aspect-[5/6]">
                <Image
                  src="/logo.svg"
                  alt="De flores"
                  fill
                  className="object-contain brightness-0"
                />
              </div>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-zinc-900"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-6 text-xl uppercase tracking-[0.2em] font-light">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-800 hover:text-[#C5A059] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col space-y-4 pt-6 border-t border-zinc-200">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center py-3 border border-zinc-300 text-zinc-800 rounded-full text-xs uppercase tracking-[0.2em] font-semibold"
            >
              Sign In
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center py-3.5 rounded-full text-xs uppercase tracking-[0.22em] font-bold bg-[#2B0A0E] text-[#FDFBF7] border border-[#C5A059] shadow-md hover:bg-[#C5A059] hover:text-[#2B0A0E] transition-colors"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      )}

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
