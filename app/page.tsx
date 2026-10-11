"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  ArrowRight,
  Play,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";

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

const CATEGORIES = [
  {
    id: "lehenga",
    name: "Lehenga",
    subtitle: "Bridal & Heritage",
    image: "/hero/herosection1.png",
    tag: "Haute Couture",
    offset: "lg:translate-y-4",
  },
  {
    id: "gown",
    name: "Gown",
    subtitle: "Evening Silhouettes",
    image: "/hero/herosection3.png",
    tag: "Red Carpet",
    offset: "lg:-translate-y-6",
  },
  {
    id: "saree",
    name: "Saree",
    subtitle: "Pure Silk Weaves",
    image: "/new_images2/IMG_1077.webp",
    tag: "Timeless Drapes",
    offset: "lg:translate-y-8",
  },
  {
    id: "mens-wear",
    name: "Mens Wear",
    subtitle: "Bespoke Royal Tailoring",
    image: "/new_images2/IMG_1078.webp",
    tag: "Sherwanis & Blazers",
    offset: "lg:-translate-y-3",
  },
  {
    id: "party-wear",
    name: "Party Wear",
    subtitle: "Contemporary Glamour",
    image: "/newimages/IMG_1064.webp",
    tag: "Cocktail Edit",
    offset: "lg:translate-y-6",
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

  // Preload hero images into browser cache
  useEffect(() => {
    HERO_SLIDES.forEach((s) => {
      const img = new window.Image();
      img.src = s.image;
    });
  }, []);

  // Auto carousel cycling
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 font-sans ${
        isWhiteMode ? "bg-[#faf9f6] text-zinc-900" : "bg-black text-white"
      }`}
    >
      {/* 1. TOP LUXURY NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 py-5 flex items-center justify-between transition-all duration-300 ${
          isWhiteMode
            ? "bg-white/85 backdrop-blur-md border-b border-zinc-200/80 text-zinc-900 shadow-sm"
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
          <Link href="/collections" className="hover:text-black transition-colors">
            Collections
          </Link>
          <Link href="/about" className="hover:text-black transition-colors">
            About
          </Link>
          <Link href="/journal" className="hover:text-black transition-colors">
            Journal
          </Link>
          <Link href="/sustainability" className="hover:text-black transition-colors">
            Sustainability
          </Link>
          <Link href="/contact" className="hover:text-black transition-colors">
            Contact
          </Link>
        </nav>

        {/* Right Nav Actions */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          {/* Mode Toggle */}
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

          {/* Search */}
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

          {/* Shop Now */}
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

          {/* Mobile Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* 2. TRUE FULL SCREEN HERO SECTION (100vh Edge-to-Edge) */}
      <section className="relative w-full h-screen overflow-hidden bg-black select-none">
        {/* Preloaded Background Images */}
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

        {/* Soft Contrast Gradient */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Hero Content Overlay */}
        <div className="relative z-20 w-full h-full pt-28 sm:pt-32 px-6 sm:px-12 md:px-16 pb-12 flex flex-col justify-between text-white">
          {/* Top Row: Tagline & Carousel Switcher */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm tracking-[0.3em] font-light uppercase text-white/90 drop-shadow">
              {slide.tagline}
            </span>

            {/* Quick Slide Switcher (01 / 02 / 03) */}
            <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
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
                  className={`text-xs px-2.5 py-0.5 rounded-full transition-all ${
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

          {/* Middle Row: Left Headline & Right Paragraph */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
            {/* Left Headline */}
            <div className="lg:col-span-8 space-y-2">
              <h1 className="font-serif italic font-normal text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[1.02] tracking-tight text-white drop-shadow-lg">
                <span className="block">{slide.titleLine1}</span>
                <span className="block font-sans not-italic font-light tracking-normal text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem]">
                  {slide.titleLine2}
                </span>
              </h1>
            </div>

            {/* Right Paragraph */}
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <p className="text-sm sm:text-base font-light text-white/90 leading-relaxed max-w-sm drop-shadow-md">
                {slide.description}
              </p>
            </div>
          </div>

          {/* Center 2 CTAs (Explore Collections & Watch Film) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
            <Link
              href="/collections"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-white text-zinc-950 rounded-full px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium hover:bg-zinc-200 transition-all duration-300 shadow-2xl hover:scale-[1.02]"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 backdrop-blur-md bg-black/40 border border-white/40 text-white rounded-full px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium hover:bg-white hover:text-black transition-all duration-300 shadow-2xl hover:scale-[1.02]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Film</span>
            </button>
          </div>

          {/* Bottom Bar: Year & Tag */}
          <div className="flex items-center justify-between text-xs tracking-widest text-white/70">
            <span>{slide.year}</span>
            <div className="flex items-center space-x-2">
              <span className="w-12 h-[1px] bg-white/40" />
              <span className="uppercase text-[10px] tracking-[0.3em]">Couture Digital</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NEW SECTION: "WHERE BRANDS SHINE" CATEGORIES (Responsive 2*2 on Mobile) */}
      <section
        className={`w-full py-20 sm:py-28 px-5 sm:px-10 lg:px-16 transition-colors duration-500 ${
          isWhiteMode ? "bg-[#faf9f6]" : "bg-zinc-950"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header Top Indicator */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-zinc-400 mb-8 border-b border-zinc-200/60 pb-4">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
              Curated Edit
            </span>
            <span>Five Core Silhouettes</span>
            <span>2026 Collection</span>
          </div>

          {/* Section Title Matching Reference */}
          <div className="text-center mb-16 sm:mb-20">
            <h2
              className={`text-4xl sm:text-6xl md:text-7xl font-light tracking-tight ${
                isWhiteMode ? "text-zinc-900" : "text-white"
              }`}
            >
              Where Brands
              <span className="block font-serif italic font-normal mt-1 sm:mt-2 text-5xl sm:text-7xl md:text-8xl">
                Shine
              </span>
            </h2>
          </div>

          {/* Category Cards: Responsive 2x2 in Mobile, 5-col Masonry Stagger on Desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6 items-center">
            {CATEGORIES.map((cat, index) => {
              // 5th item on mobile spans across 2 columns to complete the 2x2 + 1 layout
              const isLastOnMobile = index === 4;

              return (
                <Link
                  key={cat.id}
                  href={`/collections?category=${cat.id}`}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                    cat.offset
                  } ${isLastOnMobile ? "col-span-2 md:col-span-1" : ""}`}
                >
                  {/* Card Image Container */}
                  <div
                    className={`relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-zinc-200 ${
                      isLastOnMobile ? "aspect-[16/9] sm:aspect-[3/4]" : "aspect-[3/4]"
                    }`}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                    />

                    {/* Gradient Overlay on Card */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity group-hover:from-black/85" />

                    {/* Card Top Tag */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                      <span className="text-[10px] tracking-[0.2em] uppercase font-medium bg-black/40 backdrop-blur-md text-white/90 border border-white/20 px-2.5 py-1 rounded-full">
                        {cat.tag}
                      </span>
                    </div>

                    {/* Card Bottom Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10 flex flex-col justify-end text-white">
                      <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70 mb-1">
                        {cat.subtitle}
                      </p>
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-lg sm:text-2xl font-light tracking-wide">
                          {cat.name}
                        </h3>
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Section Bottom CTA Pill */}
          <div className="mt-16 sm:mt-20 text-center">
            <Link
              href="/collections"
              className={`inline-flex items-center space-x-3 rounded-full px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 shadow-md ${
                isWhiteMode
                  ? "bg-zinc-950 text-white hover:bg-zinc-800"
                  : "bg-white text-zinc-950 hover:bg-zinc-200"
              }`}
            >
              <span>Explore All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

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

      {/* 5. SEARCH MODAL */}
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
              <Link href="/collections?category=lehenga" className="hover:text-black underline">
                Lehenga
              </Link>
              <span>•</span>
              <Link href="/collections?category=gown" className="hover:text-black underline">
                Gown
              </Link>
              <span>•</span>
              <Link href="/collections?category=saree" className="hover:text-black underline">
                Saree
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 6. MOBILE DRAWER */}
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
