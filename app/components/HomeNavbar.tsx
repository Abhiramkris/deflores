"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomeNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "SHOP", href: "/explore" },
    { name: "COLLECTIONS", href: "/explore" },
    { name: "LOOKBOOK", href: "/gallery" },
    { name: "ABOUT BRAND", href: "/founder" },
    { name: "CONTACT", href: "/contact" }
  ];

  return (
    <nav
      className={`fixed top-4 left-4 right-4 z-40 rounded-[1.5rem] transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-zinc-950/80 backdrop-blur-md border border-white/10 py-4 px-8 shadow-lg"
          : "bg-transparent py-6 px-8"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand/Logo */}
        <div className="flex flex-col text-left leading-tight text-white select-none">
          <span className="text-[9px] tracking-[0.25em] font-semibold uppercase opacity-85">EST. 2025</span>
          <Link href="/" className="text-sm font-bold tracking-[0.2em] uppercase mt-0.5 hover:opacity-80 transition-opacity">
            DE FLORA
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[10px] tracking-[0.25em] font-semibold uppercase text-white hover:text-zinc-300 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all hover:after:w-full"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Explore CTA Button & Mobile Menu controls */}
        <div className="flex items-center gap-4">
          <Link
            href="/explore"
            className="hidden md:inline-flex items-center justify-center bg-white text-zinc-950 hover:bg-transparent hover:text-white hover:border-white border border-transparent rounded-full px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-md"
          >
            EXPLORE
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden flex-col justify-center items-center w-6 h-6 space-y-1.5 focus:outline-none z-50 text-white"
            aria-label="Toggle Navigation Menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 mt-2 bg-zinc-950/95 backdrop-blur-lg border border-white/10 rounded-[1.5rem] p-6 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[10px] tracking-[0.25em] font-bold uppercase text-white/90 hover:text-white hover:pl-2 transition-all py-1.5 border-b border-white/5 last:border-0"
            >
              {link.name}
            </Link>
          ))}
          {/* Mobile Explore CTA Button */}
          <Link
            href="/explore"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 flex items-center justify-center bg-white text-zinc-950 rounded-full py-3.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 active:scale-95 shadow-md"
          >
            EXPLORE
          </Link>
        </div>
      </div>
    </nav>
  );
}
