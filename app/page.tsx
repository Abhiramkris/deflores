"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Menu, X, ArrowRight, Play, Volume2, VolumeX } from "lucide-react";

const HERO_SLIDES = [
  {
    id: 1,
    image: "/hero/herosection1.png",
    tagline: "CROSS MOTION ——",
    titleLine1: "Every Brand.",
    titleLine2: "Every Moment.",
    blurBadge: "FASHION CONTENT ——",
    description:
      "Combining human creativity and AI innovation to create fashion content built for modern audiences.",
  },
  {
    id: 2,
    image: "/hero/herosection.png",
    tagline: "TIMELESS LUXURY ——",
    titleLine1: "Haute Couture.",
    titleLine2: "Pure Elegance.",
    blurBadge: "EDITORIAL ART ——",
    description:
      "Merging refined craftsmanship with contemporary digital narratives designed for discerning aesthetics.",
  },
  {
    id: 3,
    image: "/hero/herosection3.png",
    tagline: "AVANT-GARDE ——",
    titleLine1: "Next Genesis.",
    titleLine2: "Future Form.",
    blurBadge: "NEW HORIZONS ——",
    description:
      "Sculpting bold visuals and bespoke tactile expressions crafted for tomorrow's iconic culture.",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto carousel slide transition every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white select-none">
      {/* 1. HERO BACKGROUND CAROUSEL (Full Screen, NO Darkening Overlay) */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            } transition-transform duration-[7000ms] ease-out`}
            style={{
              backgroundImage: `url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}
      </div>

      {/* 2. TOP NAVIGATION BAR */}
      <header className="relative z-20 w-full pt-6 md:pt-8 px-6 sm:px-10 md:px-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-serif tracking-[0.25em] text-2xl sm:text-3xl font-light uppercase text-white hover:opacity-90 transition-opacity"
        >
          VÉLORA
        </Link>

        {/* Center Nav Links - Desktop */}
        <nav className="hidden md:flex items-center space-x-8 text-xs tracking-[0.2em] uppercase font-light text-white/90">
          <Link href="/collections" className="hover:text-white transition-colors">
            Collections
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/journal" className="hover:text-white transition-colors">
            Journal
          </Link>
          <Link href="/sustainability" className="hover:text-white transition-colors">
            Sustainability
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className="p-2 text-white/90 hover:text-white transition-colors"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
          </button>

          {/* Sign In Link - Desktop */}
          <Link
            href="/login"
            className="hidden sm:inline-block text-xs uppercase tracking-[0.2em] font-light text-white/90 hover:text-white transition-colors"
          >
            Sign In
          </Link>

          {/* Shop Now Pill Button */}
          <Link
            href="/collections"
            className="border border-white/80 rounded-full px-5 sm:px-7 py-2 sm:py-2.5 text-xs uppercase tracking-[0.2em] font-light text-white backdrop-blur-md bg-white/5 hover:bg-white hover:text-black transition-all duration-300"
          >
            Shop Now
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* 3. HERO CONTENT WRAPPER */}
      <div className="relative z-10 w-full h-[calc(100vh-80px)] px-6 sm:px-10 md:px-14 pb-8 sm:pb-12 flex flex-col justify-end">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-end">
          {/* LEFT COLUMN: Badge, Big Headline, Paragraph, Carousel Indicator */}
          <div className="lg:col-span-7 flex flex-col space-y-5 sm:space-y-6 max-w-2xl">
            {/* Tagline Badge */}
            <p className="text-xs tracking-[0.3em] uppercase font-light text-white drop-shadow-sm">
              {slide.tagline}
            </p>

            {/* Headline with Serif Italic font matching reference */}
            <h1 className="font-serif italic font-normal text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem] leading-[1.02] tracking-tight text-white drop-shadow-md">
              <span className="block">{slide.titleLine1}</span>
              <span className="block">{slide.titleLine2}</span>
            </h1>

            {/* Subtitle / Paragraph */}
            <p className="text-sm sm:text-base font-light text-white/90 max-w-lg leading-relaxed drop-shadow-sm">
              {slide.description}
            </p>

            {/* Slider Progress Indicator (01 ———— 03) */}
            <div className="pt-4 flex items-center space-x-4">
              <span className="font-serif text-sm tracking-widest text-white/90">
                0{slide.id}
              </span>
              <div className="w-32 sm:w-40 h-[2px] bg-white/30 rounded-full overflow-hidden relative">
                <div
                  key={currentSlide}
                  className="h-full bg-white rounded-full animate-progress"
                  style={{ animationDuration: "7000ms" }}
                />
              </div>
              <span className="font-serif text-sm tracking-widest text-white/60">
                0{HERO_SLIDES.length}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: The Frosted Blur Div Card matching reference */}
          <div className="lg:col-span-5 flex justify-start lg:justify-end">
            <div className="w-full max-w-md backdrop-blur-2xl bg-white/10 border border-white/25 rounded-[2.2rem] sm:rounded-[2.6rem] p-7 sm:p-9 shadow-2xl flex flex-col space-y-6">
              {/* Blur Card Badge */}
              <p className="text-xs tracking-[0.25em] uppercase font-medium text-white/90">
                {slide.blurBadge}
              </p>

              {/* Blur Card Body Text */}
              <p className="text-sm font-light text-white/85 leading-relaxed">
                {slide.description}
              </p>

              {/* Blur Card Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Explore Collections Button */}
                <Link
                  href="/collections"
                  className="inline-flex items-center space-x-2 bg-white text-black rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-200 transition-all duration-300 shadow-md"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {/* Watch Film CTA */}
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-light text-white hover:text-white/80 transition-colors group"
                >
                  <span className="w-10 h-10 rounded-full border border-white/60 flex items-center justify-center group-hover:border-white group-hover:bg-white/15 transition-all">
                    <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                  </span>
                  <span>Watch Film</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. VIDEO LIGHTBOX MODAL */}
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

      {/* 5. SEARCH MODAL OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/80 backdrop-blur-md px-6">
          <div className="relative w-full max-w-xl bg-neutral-900/90 border border-white/20 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3 w-full">
                <Search className="w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search collections, pieces, editorial..."
                  autoFocus
                  className="bg-transparent text-white placeholder-white/40 focus:outline-none w-full text-base font-light"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="pt-4 flex flex-wrap gap-2 text-xs uppercase tracking-wider text-white/60">
              <span>Trending:</span>
              <Link href="/collections" className="hover:text-white underline">
                Velora Silk
              </Link>
              <span>•</span>
              <Link href="/collections" className="hover:text-white underline">
                Couture Jackets
              </Link>
              <span>•</span>
              <Link href="/collections" className="hover:text-white underline">
                Autumn 2026
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 6. MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-8 md:hidden animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-serif tracking-[0.25em] text-2xl uppercase">VÉLORA</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-white"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-6 text-xl uppercase tracking-[0.2em] font-light">
            <Link
              href="/collections"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-neutral-400 transition-colors"
            >
              Collections
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-neutral-400 transition-colors"
            >
              About
            </Link>
            <Link
              href="/journal"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-neutral-400 transition-colors"
            >
              Journal
            </Link>
            <Link
              href="/sustainability"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-neutral-400 transition-colors"
            >
              Sustainability
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-neutral-400 transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex flex-col space-y-4 pt-6 border-t border-white/20">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center py-3 border border-white/40 rounded-full text-xs uppercase tracking-[0.2em]"
            >
              Sign In
            </Link>
            <Link
              href="/collections"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center py-3 bg-white text-black rounded-full text-xs uppercase tracking-[0.2em] font-medium"
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
