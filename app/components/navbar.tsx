"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide navbar completely on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { name: "Explore", href: "/explore" },
    { name: "Founder", href: "/founder" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full z-50">
      {/* 1. Black announcement bar */}
      <div className="w-full bg-black text-white py-2 px-6 md:px-12 flex justify-between items-center text-[10px] tracking-widest uppercase font-medium">
        <div className="hidden sm:block">EN/INR</div>
        <div className="mx-auto sm:mx-0">5% discount when subscribing to news</div>
        <div className="hidden sm:flex gap-6">
          <Link href="#contact" className="hover:opacity-75 transition-opacity">Contact</Link>
          <Link href="#about" className="hover:opacity-75 transition-opacity">About</Link>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-zinc-200/40 py-4 shadow-xs"
            : "relative bg-white border-b border-zinc-100 py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Left Side: Desktop Links / Mobile Hamburger */}
          <div className="flex items-center">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden flex-col justify-center items-center w-6 h-6 space-y-1.5 focus:outline-none z-50"
              aria-label="Toggle Menu"
            >
              <span
                className={`block w-5 h-0.5 bg-zinc-900 transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-zinc-900 transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-zinc-900 transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[11px] font-semibold tracking-widest uppercase text-zinc-900 hover:opacity-60 transition-opacity"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Center Brand Logo (Always Centered) */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="font-serif text-xl sm:text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-zinc-950">
              DeFlores
            </Link>
          </div>

          {/* Right Menu Icons */}
          <div className="flex items-center gap-4 sm:gap-5 md:gap-6 text-zinc-800">
            {/* Profile Icon - Hidden on small mobile */}
            <button className="hidden sm:block hover:opacity-60 transition-opacity" aria-label="Account">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            {/* Wishlist Heart Icon - Hidden on small mobile */}
            <button className="hidden sm:block hover:opacity-60 transition-opacity" aria-label="Wishlist">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            {/* Shining Explore Button */}
            <Link href="/explore" className="shining-explore-btn hidden md:inline-flex ml-2">
              Explore
            </Link>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-zinc-200/50 shadow-md transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[11px] font-semibold tracking-widest uppercase text-zinc-900 hover:opacity-60 transition-opacity py-1 border-b border-zinc-50 last:border-0"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

      </nav>
    </header>
  );
}
