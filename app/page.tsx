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
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Sparkles,
  ZoomIn,
  MapPin,
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
    number: "01",
    tag: "HAUTE COUTURE",
    name: "Lehenga",
    image: "/hero/herosection1.png",
  },
  {
    id: "gown",
    number: "02",
    tag: "RED CARPET",
    name: "Gown",
    image: "/hero/herosection3.png",
  },
  {
    id: "saree",
    number: "03",
    tag: "TIMELESS DRAPES",
    name: "Saree",
    image: "/new_images2/IMG_1077.webp",
  },
  {
    id: "mens-wear",
    number: "04",
    tag: "ROYAL COUTURE",
    name: "Mens Wear",
    image: "/new_images2/IMG_1078.webp",
  },
  {
    id: "party-wear",
    number: "05",
    tag: "COCKTAIL EDIT",
    name: "Party Wear",
    image: "/newimages/IMG_1064.webp",
  },
];


const TEAM_MEMBERS = [
  {
    name: "Sofia Marchetti",
    role: "Founder & CEO",
    image: "/newimages/IMG_1060.webp",
  },
  {
    name: "Elena Valois",
    role: "Creative Director",
    image: "/new_images2/IMG_1081.webp",
  },
  {
    name: "Amara Diallo",
    role: "VP, Production & Talent",
    image: "/new_images2/IMG_1082.webp",
  },
  {
    name: "James Okafor",
    role: "Head of Innovation",
    image: "/new_images2/IMG_1078.webp",
  },
  {
    name: "Daniel Picard",
    role: "VP, AI Content Engineering",
    image: "/new_images2/IMG_1080.webp",
  },
];

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Heritage Bridal Lehenga",
    category: "Bridal Couture",
    image: "/hero/herosection1.png",
    aspect: "aspect-[3/4]",
  },
  {
    id: 2,
    title: "Temple Courtyard Silk Ensemble",
    category: "Pret Apparel",
    image: "/hero/herosection2.png",
    aspect: "aspect-[4/3] md:col-span-2",
  },
  {
    id: 3,
    title: "Sunset Chiffon & Tulle Gown",
    category: "Evening Gown",
    image: "/hero/herosection3.png",
    aspect: "aspect-[3/4]",
  },
  {
    id: 4,
    title: "Zardozi Embroidered Royal Drape",
    category: "Haute Couture",
    image: "/newimages/IMG_1058.webp",
    aspect: "aspect-[3/4]",
  },
  {
    id: 5,
    title: "Mirror Reflection Fitting",
    category: "Atelier Backstage",
    image: "/newimages/IMG_1060.webp",
    aspect: "aspect-[4/5]",
  },
  {
    id: 6,
    title: "Courtyard Swing Duo",
    category: "Festive Occasion",
    image: "/newimages/IMG_1062.webp",
    aspect: "aspect-[3/4]",
  },
  {
    id: 7,
    title: "Lakeside Contemporary Gowns",
    category: "Western Ensembles",
    image: "/newimages/IMG_1064.webp",
    aspect: "aspect-[3/4]",
  },
  {
    id: 8,
    title: "Sacred Ceremonial Silk Saree",
    category: "Heritage Weaves",
    image: "/new_images2/IMG_1076.webp",
    aspect: "aspect-[3/4]",
  },
  {
    id: 9,
    title: "Peacock Jewel Handcrafted Details",
    category: "Bespoke Jewelry & Blouse",
    image: "/new_images2/IMG_1077.webp",
    aspect: "aspect-[3/4]",
  },
  {
    id: 10,
    title: "Celebration Sherwani & Anarkali",
    category: "Mens & Bridal",
    image: "/new_images2/IMG_1078.webp",
    aspect: "aspect-[4/5]",
  },
  {
    id: 11,
    title: "Lakeside Couple Embrace",
    category: "Occasion Wear",
    image: "/new_images2/IMG_1080.webp",
    aspect: "aspect-[3/4]",
  },
  {
    id: 12,
    title: "Radiant Sheer Veil Drape",
    category: "Bridal Veil",
    image: "/new_images2/IMG_1081.webp",
    aspect: "aspect-[3/4]",
  },
  {
    id: 13,
    title: "Embellished Peach Organza Saree",
    category: "Pret Collection",
    image: "/new_images2/IMG_1082.webp",
    aspect: "aspect-[3/4]",
  },
  {
    id: 14,
    title: "Royal Violet Scalloped Blouse",
    category: "Handcrafted Zardozi",
    image: "/gallery_purple.jpg",
    aspect: "aspect-[4/5]",
  },
  {
    id: 15,
    title: "Pastel Mirror-Work Lehenga",
    category: "Party Wear",
    image: "/crop_green.png",
    aspect: "aspect-[3/4]",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isWhiteMode, setIsWhiteMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Track scroll position to toggle navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className={`min-h-screen w-full transition-colors duration-500 font-sans ${isWhiteMode ? "bg-[#faf9f6] text-zinc-900" : "bg-black text-white"
        }`}
    >
      {/* 1. TOP LUXURY NAVBAR: TRANSPARENT AT TOP, WHITE ON SCROLL */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 flex items-center justify-between transition-all duration-300 ${isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-zinc-200/80 text-zinc-900 py-4 shadow-sm"
            : "bg-transparent border-b border-transparent text-white py-6 sm:py-7"
          }`}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className={`font-serif tracking-[0.25em] text-2xl sm:text-3xl font-light uppercase hover:opacity-80 transition-all ${isScrolled ? "text-zinc-950" : "text-white drop-shadow-sm"
            }`}
        >
          VÉLORA
        </Link>

        {/* Desktop Nav Links */}
        <nav
          className={`hidden md:flex items-center space-x-9 text-xs tracking-[0.22em] uppercase font-medium transition-colors ${isScrolled ? "text-zinc-600" : "text-white/90"
            }`}
        >
          <Link
            href="/collections"
            className={isScrolled ? "hover:text-black transition-colors" : "hover:text-white transition-colors"}
          >
            Collections
          </Link>
          <Link
            href="/about"
            className={isScrolled ? "hover:text-black transition-colors" : "hover:text-white transition-colors"}
          >
            About
          </Link>
          <Link
            href="/journal"
            className={isScrolled ? "hover:text-black transition-colors" : "hover:text-white transition-colors"}
          >
            Journal
          </Link>
          <Link
            href="/sustainability"
            className={isScrolled ? "hover:text-black transition-colors" : "hover:text-white transition-colors"}
          >
            Sustainability
          </Link>
          <Link
            href="/contact"
            className={isScrolled ? "hover:text-black transition-colors" : "hover:text-white transition-colors"}
          >
            Contact
          </Link>
        </nav>

        {/* Right Nav Actions */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          {/* Mode Toggle */}
          <button
            onClick={() => setIsWhiteMode(!isWhiteMode)}
            className={`p-2 rounded-full transition-all ${isScrolled
                ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
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
            className={`p-2 transition-opacity hover:opacity-75 ${isScrolled ? "text-zinc-800" : "text-white"
              }`}
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
          </button>

          {/* Sign In */}
          <Link
            href="/login"
            className={`hidden sm:inline-block text-xs uppercase tracking-[0.2em] font-medium transition-colors ${isScrolled ? "text-zinc-800 hover:text-black" : "text-white/90 hover:text-white"
              }`}
          >
            Sign In
          </Link>

          {/* Shop Now */}
          <Link
            href="/collections"
            className={`rounded-full px-5 sm:px-6 py-2 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-sm ${isScrolled
                ? "bg-zinc-950 text-white hover:bg-zinc-800"
                : "border border-white/80 bg-white/10 text-white hover:bg-white hover:text-black backdrop-blur-sm"
              }`}
          >
            Shop Now
          </Link>

          {/* Mobile Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${isScrolled ? "text-zinc-900" : "text-white"
              }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* 2. TRUE FULL SCREEN HERO SECTION (Pinned Sticky Background Canvas) */}
      <section className="sticky top-0 w-full h-screen overflow-hidden bg-black select-none z-0">
        {/* Preloaded Background Images */}
        {HERO_SLIDES.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
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
                  className={`text-xs px-2.5 py-0.5 rounded-full transition-all ${i === currentSlide
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

          {/* Middle Row: Left Headline & Right Paragraph (Hidden on Mobile view) */}
          <div className="hidden sm:grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
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

          {/* Bottom Area: 2 CTAs In Same Row Below + Year Bar */}
          <div className="mt-auto pt-6 flex flex-col space-y-5 sm:space-y-6">
            {/* 2 CTAs Side-by-Side in Same Row */}
            <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-lg mx-auto">
              <Link
                href="/collections"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-white text-zinc-950 rounded-full px-4 sm:px-8 py-3 sm:py-3.5 text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.25em] font-medium hover:bg-zinc-200 transition-all duration-300 shadow-2xl hover:scale-[1.02] whitespace-nowrap"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 sm:space-x-3 backdrop-blur-md bg-black/40 border border-white/40 text-white rounded-full px-4 sm:px-8 py-3 sm:py-3.5 text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.25em] font-medium hover:bg-white hover:text-black transition-all duration-300 shadow-2xl hover:scale-[1.02] whitespace-nowrap"
              >
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                <span>Watch Film</span>
              </button>
            </div>

            {/* Year & Tag Bar */}
            <div className="flex items-center justify-between text-xs tracking-widest text-white/70 pt-2">
              <span>{slide.year}</span>
              <div className="flex items-center space-x-2">
                <span className="w-12 h-[1px] bg-white/40" />
                <span className="uppercase text-[10px] tracking-[0.3em]">Couture Digital</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NEW SECTION: "WHERE BRANDS SHINE" CATEGORIES (Glides smoothly on top of Hero) */}
      <section
        className={`relative z-10 w-full py-16 sm:py-28 px-5 sm:px-10 lg:px-16 transition-colors duration-500 rounded-t-[2.5rem] sm:rounded-t-[3.5rem] shadow-[0_-25px_60px_rgba(0,0,0,0.35)] border-t border-zinc-200/80 dark:border-white/10 ${
          isWhiteMode ? "bg-[#faf9f6]" : "bg-zinc-950"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Title Matching Reference */}
          <div className="text-center mb-12 sm:mb-20">
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

          {/* Category Cards: Responsive 2-2-1 on Mobile, 5-Column Editorial on Desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6 items-center">
            {CATEGORIES.map((cat, index) => {
              const isLastOnMobile = index === 4;

              return (
                <Link
                  key={cat.id}
                  href={`/collections?category=${cat.id}`}
                  className={`group relative flex flex-col overflow-hidden rounded-[2rem] sm:rounded-[2.4rem] lg:rounded-[2.8rem] border border-black/5 dark:border-white/10 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                    isLastOnMobile ? "col-span-2 md:col-span-1" : ""
                  }`}
                >
                  {/* Card Container: 2-2-1 responsive aspect ratio */}
                  <div
                    className={`relative w-full overflow-hidden bg-zinc-900 ${
                      isLastOnMobile ? "aspect-[16/10] md:aspect-[3/4.4]" : "aspect-[3/4.2] sm:aspect-[3/4.4]"
                    }`}
                  >
                    {/* Background Image with Hover Scale */}
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                    />

                    {/* Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 transition-opacity duration-300 group-hover:from-black/90" />

                    {/* Card Content Overlay */}
                    <div className="absolute inset-0 p-4 sm:p-5 lg:p-6 flex flex-col justify-between z-10">
                      {/* Top Bar: Pill Tag & Number matching reference media_1791864535086.png */}
                      <div className="flex items-center justify-between">
                        {/* Pill Tag with Glowing Dot matching reference */}
                        <span className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#242831]/90 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs tracking-[0.16em] uppercase font-semibold text-white shadow-lg">
                          <span className="w-2 h-2 rounded-full bg-white shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                          <span>{cat.tag}</span>
                        </span>

                        {/* Line & 2-Digit Number matching reference */}
                        <div className="flex items-center gap-2 sm:gap-2.5 text-white/95 text-xs sm:text-sm font-medium tracking-widest font-mono">
                          <span className="w-5 sm:w-8 h-[1.5px] bg-white/70" />
                          <span>{cat.number}</span>
                        </div>
                      </div>

                      {/* Bottom Bar: Clean Category Title & Circular Arrow CTA */}
                      <div className="flex items-end justify-between pt-4">
                        <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide text-white leading-none drop-shadow-md">
                          {cat.name}
                        </h3>

                        <span className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black group-hover:scale-105 transition-all duration-300 shadow-xl shrink-0">
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 stroke-[2] group-hover:translate-x-0.5 transition-transform" />
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

      {/* 4. NEW SECTION: "WHAT WE DELIVER" (Matching Reference Design) */}
      <section
        className={`relative z-10 w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 transition-colors duration-500 ${
          isWhiteMode ? "bg-[#f5f3ec] text-zinc-900" : "bg-black text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top Metadata Bar */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-zinc-400 mb-10 border-b border-zinc-300/60 dark:border-white/10 pb-4">
            <span>Capabilities & Values</span>
            <span>Our Craft</span>
            <span>02 / 2026</span>
          </div>

          {/* Section Heading */}
          <div className="mb-12 sm:mb-16">
            <h2
              className={`text-4xl sm:text-6xl md:text-7xl font-light tracking-tight ${
                isWhiteMode ? "text-zinc-950" : "text-white"
              }`}
            >
              What We Deliver
            </h2>
          </div>

          {/* Main 2-Column Grid: Image Left, Deliverables Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column: Portrait Editorial Image */}
            <div className="lg:col-span-5">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-black/5 dark:border-white/10">
                <Image
                  src="/gallery_purple.jpg"
                  alt="What We Deliver - Couture Craftsmanship"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            </div>

            {/* Right Column: 4 Editorial Deliverables */}
            <div className="lg:col-span-7 flex flex-col space-y-7 sm:space-y-9">
              {/* Item 1 */}
              <div className="flex items-start space-x-4 sm:space-x-5">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-zinc-800 dark:bg-white mt-2.5 shrink-0" />
                <p className={`text-sm sm:text-base leading-relaxed font-light ${isWhiteMode ? "text-zinc-700" : "text-zinc-300"}`}>
                  <strong className={`font-semibold ${isWhiteMode ? "text-zinc-950" : "text-white"}`}>
                    Bespoke Artisanal Tailoring
                  </strong>{" "}
                  — Every garment is meticulously designed and sculpted to your exact measurements, incorporating hand-guided zardozi embroidery, bespoke draping, and personalized fit consultations for a silhouette made exclusively for you.
                </p>
              </div>

              {/* Item 2 */}
              <div className="flex items-start space-x-4 sm:space-x-5">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-zinc-800 dark:bg-white mt-2.5 shrink-0" />
                <p className={`text-sm sm:text-base leading-relaxed font-light ${isWhiteMode ? "text-zinc-700" : "text-zinc-300"}`}>
                  <strong className={`font-semibold ${isWhiteMode ? "text-zinc-950" : "text-white"}`}>
                    Heritage Craftsmanship Meets Modern Form
                  </strong>{" "}
                  — Revitalizing centuries-old handloom weaves and regal heritage techniques, re-engineered for contemporary global wardrobes and modern red-carpet occasions without compromising authenticity.
                </p>
              </div>

              {/* Item 3 */}
              <div className="flex items-start space-x-4 sm:space-x-5">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-zinc-800 dark:bg-white mt-2.5 shrink-0" />
                <p className={`text-sm sm:text-base leading-relaxed font-light ${isWhiteMode ? "text-zinc-700" : "text-zinc-300"}`}>
                  <strong className={`font-semibold ${isWhiteMode ? "text-zinc-950" : "text-white"}`}>
                    Bridal & Occasion Trousseau Concierge
                  </strong>{" "}
                  — Full bridal concierge styling from statement reception lehengas and pure silk sarees to coordinated groom's sherwanis and festive party wear collections.
                </p>
              </div>

              {/* Item 4 */}
              <div className="flex items-start space-x-4 sm:space-x-5">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-zinc-800 dark:bg-white mt-2.5 shrink-0" />
                <p className={`text-sm sm:text-base leading-relaxed font-light ${isWhiteMode ? "text-zinc-700" : "text-zinc-300"}`}>
                  <strong className={`font-semibold ${isWhiteMode ? "text-zinc-950" : "text-white"}`}>
                    Global White-Glove Delivery & Consultations
                  </strong>{" "}
                  — Seamless express insured delivery worldwide, paired with private video styling appointments, custom fabric swatches, and lifetime aftercare support.
                </p>
              </div>

              {/* Section CTA */}
              <div className="pt-4">
                <Link
                  href="/about"
                  className={`inline-flex items-center space-x-3 text-xs uppercase tracking-[0.25em] font-medium border-b pb-1.5 transition-colors ${
                    isWhiteMode
                      ? "border-zinc-900 text-zinc-950 hover:text-zinc-600 hover:border-zinc-400"
                      : "border-white text-white hover:text-white/70 hover:border-white/50"
                  }`}
                >
                  <span>Discover Our Atelier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FULL-SCREEN EDITORIAL IMAGE (Pure visual canvas without text) */}
      <div className="relative h-[130vh] z-20">
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          <Image
            src="/newimages/IMG_1058.webp"
            alt="Editorial Campaign"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* 6. THE TEAM BEHIND SECTION (Glides smoothly above the full-screen image) */}
      <section
        className={`relative z-30 w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 rounded-t-[2.5rem] sm:rounded-t-[3.5rem] shadow-[0_-25px_60px_rgba(0,0,0,0.25)] border-t border-zinc-200/80 dark:border-white/10 transition-colors duration-500 ${
          isWhiteMode ? "bg-[#faf9f6] text-zinc-900" : "bg-zinc-950 text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top Metadata Bar */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-zinc-400 mb-8 border-b border-zinc-200/60 dark:border-white/10 pb-4">
            <span>Leadership & Culture</span>
            <span>VÉLORA Atelier</span>
            <span>03 / 2026</span>
          </div>

          {/* Heading matching reference */}
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className={`text-4xl sm:text-6xl md:text-7xl font-light tracking-tight ${
                isWhiteMode ? "text-zinc-900" : "text-white"
              }`}
            >
              The Team Behind
              <span className="block font-serif italic font-normal mt-1 sm:mt-2 text-5xl sm:text-7xl md:text-8xl">
                Gloss Motion
              </span>
            </h2>
            <p className="text-sm sm:text-base font-light text-zinc-600 dark:text-zinc-400 text-center max-w-xl mx-auto mt-4 sm:mt-6 leading-relaxed">
              Creatives, strategists, and engineers united by one vision: fashion content that moves at the speed of culture.
            </p>
          </div>

          {/* 5 Team Members Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 items-start">
            {TEAM_MEMBERS.map((member, index) => {
              const isLast = index === 4;
              return (
                <div
                  key={member.name}
                  className={`group flex flex-col ${
                    isLast ? "col-span-2 md:col-span-1 max-w-[calc(50%-0.5rem)] mx-auto md:max-w-none w-full" : "w-full"
                  }`}
                >
                  <div className="relative w-full aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-200 dark:bg-zinc-800 shadow-sm border border-zinc-200/60 dark:border-white/10">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-106"
                    />
                  </div>

                  <div className="mt-3.5 sm:mt-4 text-center sm:text-left">
                    <h3 className="font-medium text-sm sm:text-base text-zinc-950 dark:text-white tracking-tight">
                      {member.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-light mt-0.5 tracking-wide">
                      {member.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. DE FLORES STORY / OUR VISION SECTION (Matching Reference Design) */}
      <section className="relative z-30 w-full py-16 sm:py-24 px-4 sm:px-8 md:px-14 overflow-hidden">
        {/* Full-width container with background photo */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl min-h-[640px] sm:min-h-[720px] lg:min-h-[800px] flex items-center justify-end p-6 sm:p-10 md:p-16">
          {/* Cinematic Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/newimages/IMG_1064.webp"
              alt="de flores Haute Couture Story"
              fill
              sizes="100vw"
              className="object-cover object-center brightness-95"
            />
            {/* Soft Sunlit Tint & Vignette */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/60 sm:to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-sky-950/20 mix-blend-multiply pointer-events-none" />
          </div>

          {/* Elevated Floating Story Card on the Right (Matching Reference) */}
          <div className="relative z-10 w-full max-w-xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl md:rounded-[2.4rem] p-7 sm:p-10 md:p-12 shadow-2xl border border-white/50 dark:border-white/10 my-auto">
            {/* Upper Badge */}
            <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase font-semibold text-amber-800 dark:text-amber-400 mb-3 block">
              CONTENT WITHOUT LIMITS · ATELIER HERITAGE
            </span>

            {/* Title */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-zinc-950 dark:text-white mb-6">
              Our Vision & <span className="italic">de flores Story</span>
            </h2>

            {/* Full Story Copy */}
            <div className="space-y-4 text-xs sm:text-sm font-light text-zinc-700 dark:text-zinc-300 leading-relaxed max-h-[360px] sm:max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              <p>
                <strong className="font-medium text-zinc-950 dark:text-white">‘de flores’</strong> stemmed from a young fashion designer’s passion for crafting unique and novel style statements—to create a distinction. <strong className="font-medium text-zinc-950 dark:text-white">‘de flores’</strong> translates to <span className="italic font-serif">‘flowers’</span> in Spanish, which symbolises elegance, chastity and loveliness in every attire we design.
              </p>
              <p>
                With a profusion of colours, high-calibre fabric and aesthetic appeal, this exquisite haute couture is a one-stop designer boutique for every woman who wants to flaunt an enchanting style. For those who don't fancy off-the-peg shopping, <strong className="font-medium text-zinc-950 dark:text-white">‘de flores’</strong> is a perfect choice for any occasion.
              </p>
              <p>
                Whether you wish to keep it simple or add a pop of colour, or go all out and be a showstopper, we tailor-make apparel just the way you fantasize. <strong className="font-medium text-zinc-950 dark:text-white">‘de flores’</strong> specialises in pret apparel, designer bridal clothing, occasion wear and western ensembles. Our fabrics and designs come as a fresh breeze with no trade-off on quality and trust.
              </p>
              <p>
                You can explore sublime and serene costumes designed with enchanting styles, exquisite fabrics, and elegant embroidery masterfully detailed by dexterous artisans. Our carefully curated customised merchandise is bound to make an indelible mark on the fashion world.
              </p>
              <p className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-start gap-2 text-zinc-900 dark:text-white font-normal">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Visit our spacious showroom located near the <strong className="font-semibold">Cochin International Airport</strong>, and get your hands on some contemporary fashion. Turn your dream attire into reality with your forever fashion friend in <strong className="font-semibold">‘de flores’</strong>.
                </span>
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-6 sm:pt-8 flex flex-wrap items-center gap-3.5 border-t border-zinc-200/80 dark:border-white/10 mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2.5 bg-zinc-950 text-white dark:bg-white dark:text-black rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:opacity-90 transition-all shadow-md"
              >
                <span>Visit Showroom</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/collections"
                className="inline-flex items-center space-x-2 border border-zinc-300 dark:border-zinc-700 rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium text-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                <span>Explore Pret & Bridal</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. ATELIER GALLERY LOOKBOOK SECTION (Fluid Grid With Show More Button) */}
      <section
        id="gallery-section"
        className={`relative z-30 w-full py-20 sm:py-28 px-5 sm:px-10 lg:px-16 transition-colors duration-500 border-t ${
          isWhiteMode
            ? "bg-[#faf9f6] text-zinc-900 border-zinc-200/80"
            : "bg-black text-white border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top Metadata Bar */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-zinc-400 mb-8 border-b border-zinc-200/60 dark:border-white/10 pb-4">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
              Lookbook Archive
            </span>
            <span>The Haute Edit</span>
            <span>2026 Collection</span>
          </div>

          {/* Gallery Heading */}
          <div className="text-center mb-14 sm:mb-18">
            <h2
              className={`text-4xl sm:text-6xl md:text-7xl font-light tracking-tight ${
                isWhiteMode ? "text-zinc-900" : "text-white"
              }`}
            >
              Atelier Gallery
              <span className="block font-serif italic font-normal mt-1 sm:mt-2 text-5xl sm:text-7xl md:text-8xl">
                The Curated Edit
              </span>
            </h2>
            <p className="text-sm sm:text-base font-light text-zinc-600 dark:text-zinc-400 text-center max-w-xl mx-auto mt-4 sm:mt-6 leading-relaxed">
              A fluid lookbook of bespoke pret apparel, handcrafted bridal heirlooms, and backstage couture captures detailed by dexterous artisans.
            </p>
          </div>

          {/* Responsive Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 items-start">
            {(showAllGallery ? GALLERY_ITEMS : GALLERY_ITEMS.slice(0, 8)).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedGalleryImage(item.image)}
                className={`group relative overflow-hidden rounded-[1.75rem] sm:rounded-[2.2rem] bg-zinc-200 dark:bg-zinc-800 shadow-md cursor-pointer transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl border border-black/5 dark:border-white/10 ${item.aspect}`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top Category Badge with Glowing Dot */}
                <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#242831]/90 backdrop-blur-md border border-white/15 text-[9px] sm:text-[10px] tracking-[0.16em] uppercase font-semibold text-white shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
                    <span>{item.category}</span>
                  </span>
                </div>

                {/* Hover Action / Zoom Indicator */}
                <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-lg">
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </div>

                {/* Bottom Title Content on Hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10 flex items-end justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="pr-3">
                    <h3 className="font-serif text-base sm:text-lg font-normal tracking-wide drop-shadow">
                      {item.title}
                    </h3>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 mt-0.5 block">
                      Atelier Lookbook
                    </span>
                  </div>
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Show More / Show Less Button */}
          <div className="mt-14 sm:mt-18 text-center">
            <button
              onClick={() => setShowAllGallery(!showAllGallery)}
              className={`inline-flex items-center space-x-3 rounded-full px-9 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 shadow-md hover:scale-105 ${
                isWhiteMode
                  ? "bg-zinc-950 text-white hover:bg-zinc-800"
                  : "bg-white text-zinc-950 hover:bg-zinc-200"
              }`}
            >
              <span>{showAllGallery ? "Show Less Looks" : `Show More (${GALLERY_ITEMS.length} Looks)`}</span>
              {showAllGallery ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 9. GALLERY IMAGE LIGHTBOX MODAL */}
      {selectedGalleryImage && (
        <div
          onClick={() => setSelectedGalleryImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8 animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black"
          >
            <button
              onClick={() => setSelectedGalleryImage(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all"
              aria-label="Close image"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full h-[80vh]">
              <Image
                src={selectedGalleryImage}
                alt="Enlarged Atelier Look"
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* 10. VIDEO LIGHTBOX MODAL */}
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
          className={`fixed inset-0 z-50 flex flex-col justify-between p-8 md:hidden animate-fadeIn ${isWhiteMode ? "bg-white text-zinc-900" : "bg-black text-white"
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
              className={`text-center py-3 border rounded-full text-xs uppercase tracking-[0.2em] ${isWhiteMode ? "border-zinc-300" : "border-white/30"
                }`}
            >
              Sign In
            </Link>
            <Link
              href="/collections"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-center py-3 rounded-full text-xs uppercase tracking-[0.2em] font-medium ${isWhiteMode ? "bg-zinc-950 text-white" : "bg-white text-black"
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
