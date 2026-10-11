"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, X, ArrowRight, Play, Volume2, VolumeX, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";

const HERO_SLIDES = [
  {
    id: 1,
    image: "/hero/herosection1.png",
    tagline: "Cross Motion",
    titleLine1: "Every Brand.",
    titleLine2: "Every Moment.",
    year: "2026",
    description:
      "Combining human creativity and AI innovation to create fashion content built for modern audiences.",
  },
  {
    id: 2,
    image: "/hero/herosection2.png",
    tagline: "Timeless Luxury",
    titleLine1: "Every Brand.",
    titleLine2: "Every Moment.",
    year: "2026",
    description:
      "Combining human creativity and AI innovation to create fashion content built for modern audiences.",
  },
  {
    id: 3,
    image: "/hero/herosection3.png",
    tagline: "Haute Couture",
    titleLine1: "Every Brand.",
    titleLine2: "Every Moment.",
    year: "2026",
    description:
      "Combining human creativity and AI innovation to create fashion content built for modern audiences.",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isWhiteMode, setIsWhiteMode] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Preload all 3 hero images into memory on initial mount
  useEffect(() => {
    HERO_SLIDES.forEach((s) => {
      const img = new window.Image();
      img.src = s.image;
    });
  }, []);

  // Auto carousel cycling every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        isWhiteMode ? "bg-[#f8f9fa] text-zinc-900" : "bg-black text-white"
      }`}
    >
      {/* TOP LUXURY NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 py-5 flex items-center justify-between transition-colors duration-300 ${
          isWhiteMode
            ? "bg-white/80 backdrop-blur-md border-b border-zinc-200/80 text-zinc-900"
            : "bg-black/40 backdrop-blur-md border-b border-white/10 text-white"
        }`}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-serif tracking-[0.25em] text-2xl sm:text-3xl font-light uppercase hover:opacity-80 transition-opacity"
        >
          VÉLORA
        </Link>

        {/* Desktop Nav Links */}
        <nav
          className={`hidden md:flex items-center space-x-9 text-xs tracking-[0.22em] uppercase font-medium ${
            isWhiteMode ? "text-zinc-600" : "text-white/80"
          }`}
        >
          <Link href="/collections" className="hover:text-black dark:hover:text-white transition-colors">
            Collections
          </Link>
          <Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">
            About
          </Link>
          <Link href="/journal" className="hover:text-black dark:hover:text-white transition-colors">
            Journal
          </Link>
          <Link href="/sustainability" className="hover:text-black dark:hover:text-white transition-colors">
            Sustainability
          </Link>
          <Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        {/* Right Nav Utilities */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          {/* White / Dark Mode Toggle */}
          <button
            onClick={() => setIsWhiteMode(!isWhiteMode)}
            className={`p-2 rounded-full transition-all ${
              isWhiteMode
                ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title={isWhiteMode ? "Switch to Dark Mode" : "Switch to White Mode"}
            aria-label="Toggle Theme Mode"
          >
            {isWhiteMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className="p-2 hover:opacity-75 transition-opacity"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
          </button>

          {/* Sign In */}
          <Link
            href="/login"
            className={`hidden sm:inline-block text-xs uppercase tracking-[0.2em] font-medium hover:opacity-75 transition-opacity ${
              isWhiteMode ? "text-zinc-800" : "text-white/90"
            }`}
          >
            Sign In
          </Link>

          {/* Shop Now Pill */}
          <Link
            href="/collections"
            className={`rounded-full px-5 sm:px-6 py-2 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-sm ${
              isWhiteMode
                ? "bg-zinc-950 text-white hover:bg-zinc-800"
                : "border border-white/80 bg-white/10 text-white hover:bg-white hover:text-black"
            }`}
          >
            Shop Now
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* HERO SECTION CONTAINER */}
      <main className="relative w-full h-screen pt-20 px-3 sm:px-6 md:px-8 pb-4 flex flex-col justify-center items-center">
        {/* Full-bleed/Framed Hero Canvas matching latest reference */}
        <div className="relative w-full h-full rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl bg-black">
          {/* 3 PRELOADED HERO IMAGES WITH NEXT.JS IMAGE */}
          {HERO_SLIDES.map((item, idx) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={item.image}
                alt={`Hero Slide ${item.id}`}
                fill
                priority={true}
                sizes="100vw"
                quality={90}
                className="object-cover object-center"
              />
            </div>
          ))}

          {/* SOFT RADIAL TINT FOR FASHION TYPOGRAPHY READABILITY */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />

          {/* HERO CONTENT - MATCHING REFERENCE IMAGE PRECISELY */}
          <div className="relative z-20 w-full h-full p-6 sm:p-10 md:p-14 lg:p-16 flex flex-col justify-between text-white">
            {/* TOP BAR: Tagline */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm tracking-[0.25em] font-light uppercase text-white/90 drop-shadow-sm">
                {slide.tagline}
              </span>

              {/* SLIDE SWITCHERS (01 / 02 / 03) TO INSTANTLY VIEW ALL 3 IMAGES */}
              <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                  className="p-1 hover:text-white/70 transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {HERO_SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(i)}
                    className={`text-xs px-2 py-0.5 rounded-full transition-all ${
                      i === currentSlide
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    0{s.id}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                  className="p-1 hover:text-white/70 transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* MAIN ROW: LEFT HEADLINE & RIGHT DESCRIPTOR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
              {/* LEFT: Typography Headline */}
              <div className="lg:col-span-8 space-y-3">
                <h1 className="font-serif italic font-normal text-5xl sm:text-7xl md:text-8xl lg:text-[7.2rem] leading-[1.02] tracking-tight text-white drop-shadow-lg">
                  <span className="block">{slide.titleLine1}</span>
                  <span className="block font-sans not-italic font-light tracking-normal text-4xl sm:text-6xl md:text-7xl lg:text-[6.2rem]">
                    {slide.titleLine2}
                  </span>
                </h1>
              </div>

              {/* RIGHT: Minimalist Fashion Editorial Paragraph */}
              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <p className="text-sm sm:text-base font-light text-white/90 leading-relaxed max-w-sm drop-shadow-md">
                  {slide.description}
                </p>
              </div>
            </div>

            {/* CENTER 2 CTAS (NO EXTRA TEXT/CLUTTER) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
              {/* CTA 1: Explore Collections */}
              <Link
                href="/collections"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-white text-zinc-950 rounded-full px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium hover:bg-zinc-200 transition-all duration-300 shadow-xl hover:scale-[1.02]"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* CTA 2: Watch Film Lightbox */}
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 backdrop-blur-md bg-black/40 border border-white/40 text-white rounded-full px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium hover:bg-white hover:text-black transition-all duration-300 shadow-xl hover:scale-[1.02]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Watch Film</span>
              </button>
            </div>

            {/* BOTTOM BAR: YEAR */}
            <div className="flex items-center justify-between text-xs tracking-widest text-white/70">
              <span>{slide.year}</span>
              <div className="flex items-center space-x-2">
                <span className="w-12 h-[1px] bg-white/40" />
                <span className="uppercase text-[10px] tracking-[0.3em]">Couture Digital</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* VIDEO LIGHTBOX MODAL */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-neutral-950 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <div className="absolute top-4 right-4 z-20 flex items-center space-x-3">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = !videoRef.current.muted;
                    setIsMuted(videoRef.current.muted);
                  }
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
                aria-label="Toggle mute"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <video
                ref={videoRef}
                src="/customization.mp4"
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* SEARCH MODAL */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-md px-6">
          <div className="relative w-full max-w-xl bg-white text-zinc-900 border border-zinc-200 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <div className="flex items-center space-x-3 w-full">
                <Search className="w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search collections, pieces, editorial..."
                  autoFocus
                  className="bg-transparent text-zinc-900 placeholder-zinc-400 focus:outline-none w-full text-base font-light"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-zinc-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="pt-4 flex flex-wrap gap-2 text-xs uppercase tracking-wider text-zinc-500">
              <span>Trending:</span>
              <Link href="/collections" className="hover:text-black underline">
                Velora Silk
              </Link>
              <span>•</span>
              <Link href="/collections" className="hover:text-black underline">
                Couture Jackets
              </Link>
              <span>•</span>
              <Link href="/collections" className="hover:text-black underline">
                Autumn 2026
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div
          className={`fixed inset-0 z-50 flex flex-col justify-between p-8 md:hidden animate-fadeIn ${
            isWhiteMode ? "bg-white text-zinc-900" : "bg-black text-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-serif tracking-[0.25em] text-2xl uppercase">VÉLORA</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-6 text-xl uppercase tracking-[0.2em] font-light">
            <Link
              href="/collections"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:opacity-60 transition-opacity"
            >
              Collections
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:opacity-60 transition-opacity"
            >
              About
            </Link>
            <Link
              href="/journal"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:opacity-60 transition-opacity"
            >
              Journal
            </Link>
            <Link
              href="/sustainability"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:opacity-60 transition-opacity"
            >
              Sustainability
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:opacity-60 transition-opacity"
            >
              Contact
            </Link>
          </nav>

          <div className="flex flex-col space-y-4 pt-6 border-t border-zinc-200">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-center py-3 border rounded-full text-xs uppercase tracking-[0.2em] ${
                isWhiteMode ? "border-zinc-300" : "border-white/30"
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/collections"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-center py-3 rounded-full text-xs uppercase tracking-[0.2em] font-medium ${
                isWhiteMode ? "bg-zinc-950 text-white" : "bg-white text-black"
              }`}
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
