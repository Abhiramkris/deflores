"use client";

import { use, useState, useRef, useEffect, TouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  MessageCircle,
  Scissors,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Star,
} from "lucide-react";
import { getCouturePiece, COUTURE_PIECES, CouturePiece } from "../../data/coutureData";
import InstagramPostEmbed from "../../components/InstagramPostEmbed";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const pieceId = resolvedParams?.id || "lavender-couture-lehenga";

  const piece: CouturePiece = getCouturePiece(pieceId);

  // 5-Second Left-to-Right Auto Slideshow State
  const totalSlides = piece.images.length;
  const displayImages = [...piece.images, piece.images[0]]; // Append slide 0 clone for infinite loop

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isTouchActive, setIsTouchActive] = useState(false);

  // Auto-advance every 5 seconds (left-to-right swipe)
  useEffect(() => {
    // If user is currently dragging/swiping or at clone transition, pause interval
    if (isTouchActive || currentIndex >= totalSlides) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, [isTouchActive, currentIndex, totalSlides]);

  // Seamless instant snap back to slide 0 when clone is reached
  useEffect(() => {
    if (currentIndex >= totalSlides) {
      const snapTimer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
        // Re-enable smooth transition for subsequent slides
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        });
      }, 750); // Matches the 750ms transition duration

      return () => clearTimeout(snapTimer);
    }
  }, [currentIndex, totalSlides]);

  const handleTransitionEnd = () => {
    if (currentIndex >= totalSlides) {
      setIsTransitioning(false);
      setCurrentIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  };

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    if (currentIndex <= 0) {
      setCurrentIndex(totalSlides - 1);
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToSlide = (idx: number) => {
    setIsTransitioning(true);
    setCurrentIndex(idx);
  };

  const activeIndex = currentIndex >= totalSlides ? 0 : currentIndex;

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showWishlistToast, setShowWishlistToast] = useState(false);
  const [activeTab, setActiveTab] = useState<"craft" | "process" | "specs" | "care">("craft");
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  // Form State for Consultation Modal
  const [brideName, setBrideName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventCity, setEventCity] = useState("");
  const [consultType, setConsultType] = useState<"in-person" | "virtual">("in-person");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Touch Swipe Gesture State
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 45;

  const handleTouchStart = (e: TouchEvent) => {
    setIsTouchActive(true);
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      if (distance > minSwipeDistance) {
        // Swiped Left -> Next
        nextSlide();
      } else if (distance < -minSwipeDistance) {
        // Swiped Right -> Previous
        prevSlide();
      }
    }
    setIsTouchActive(false);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    setShowWishlistToast(true);
    setTimeout(() => setShowWishlistToast(false), 2400);
  };

  // WhatsApp Enquiry Link
  const encodedMessage = encodeURIComponent(
    `Hello De flores Atelier, I would love to inquire about "${piece.title}" (${piece.subtitle}). Could you please share bespoke bridal consultation availability and crafted lead times?`
  );
  const whatsappUrl = `https://wa.me/918848200541?text=${encodedMessage}`;

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      // Redirect to WhatsApp with filled enquiry
      const modalMessage = encodeURIComponent(
        `Bespoke Bridal Consultation Request\n\nEnsemble: ${piece.title}\nBride Name: ${brideName}\nWhatsApp: ${whatsappNumber}\nEvent Date: ${eventDate}\nCity / Venue: ${eventCity}\nFormat: ${consultType.toUpperCase()}\nNotes: ${notes || "None"}`
      );
      window.open(`https://wa.me/918848200541?text=${modalMessage}`, "_blank");
      setIsConsultationModalOpen(false);
      setIsSubmitted(false);
    }, 1200);
  };


  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] text-[#111111] font-sans pt-24 sm:pt-28 md:pt-32 pb-24 selection:bg-[#C5A059] selection:text-[#2B0A0E]">
      
      {/* Wishlist Toast Notification */}
      {showWishlistToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2B0A0E] text-[#FDFBF7] border border-[#C5A059] px-5 py-3 rounded-full text-xs font-medium tracking-wider shadow-2xl flex items-center gap-2.5 animate-fade-in-up">
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-white"}`} />
          <span>{isWishlisted ? "Added to your Bridal Wishlist" : "Removed from Bridal Wishlist"}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Top Breadcrumb & Back Link */}
        <div className="mb-6 md:mb-10 flex items-center justify-between text-[11px] font-semibold tracking-[0.2em] uppercase text-zinc-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-zinc-950 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#C5A059] font-bold">Haute Couture</span>
            <span>/</span>
            <span className="text-zinc-900 font-bold truncate max-w-[180px] sm:max-w-none">{piece.title}</span>
          </div>
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-zinc-600 hover:text-[#2B0A0E] transition-colors border-b border-transparent hover:border-[#2B0A0E] pb-0.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Atelier Home</span>
          </Link>
        </div>

        {/* Main Grid: Left Column = Showcase Card & Thumbnails (Matching Reference), Right Column = Details & Enquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start mb-20 md:mb-28">
          
          {/* ============================================================ */}
          {/* LEFT: Featured Showcase Card & Thumbnails (Matching Reference) */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-5">
            
            {/* Main Featured Showcase Card */}
            <div
              className="relative w-full aspect-[3/4] sm:aspect-[4/5] bg-zinc-200/60 rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-xl border border-black/5 select-none touch-pan-y group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Slides Track with Left-to-Right Animated Transition */}
              <div
                onTransitionEnd={handleTransitionEnd}
                className="flex w-full h-full will-change-transform"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: isTransitioning
                    ? "transform 750ms cubic-bezier(0.16, 1, 0.3, 1)"
                    : "none",
                }}
              >
                {displayImages.map((img, idx) => (
                  <div key={idx} className="relative w-full h-full shrink-0">
                    <Image
                      src={img}
                      alt={`${piece.title} angle ${(idx % totalSlides) + 1}`}
                      fill
                      priority={idx === 0}
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 55vw"
                    />
                  </div>
                ))}
              </div>

              {/* Top Right Tag Badge (Like "Hoodie" in Reference UI) */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
                <span className="inline-block bg-white/95 backdrop-blur-md text-[#111111] text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase px-4 sm:px-5 py-2 rounded-full shadow-md border border-white/60">
                  {piece.tag}
                </span>
              </div>

              {/* Top Left Slide Counter Pill */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
                <span className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-medium tracking-widest px-3 sm:px-4 py-1.5 rounded-full border border-white/20">
                  <span className="font-bold text-[#DFBE82]">0{activeIndex + 1}</span>
                  <span className="opacity-60">/</span>
                  <span>0{totalSlides}</span>
                </span>
              </div>

              {/* Floating Previous & Next Arrow Controls */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white text-zinc-900 shadow-lg backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border border-white/80"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Slide"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white text-zinc-900 shadow-lg backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border border-white/80"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              </button>

              {/* 5-Second Auto-Slide Interactive Progress Indicators */}
              <div className="absolute bottom-3 sm:bottom-4 inset-x-5 sm:inset-x-8 z-20 flex gap-2 items-center">
                {piece.images.map((_, idx) => {
                  const isCurrent = activeIndex === idx;
                  const isPast = idx < activeIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className="h-1.5 flex-1 bg-black/35 hover:bg-black/50 backdrop-blur-xs rounded-full overflow-hidden cursor-pointer p-0 transition-colors"
                    >
                      <div
                        key={`bar-${idx}-${activeIndex}`}
                        className="h-full bg-gradient-to-r from-[#C5A059] to-[#DFBE82] rounded-full origin-left"
                        style={{
                          transform: isCurrent ? undefined : isPast ? "scaleX(1)" : "scaleX(0)",
                          animation: isCurrent && !isTouchActive ? "coutureProgressFill 5000ms linear forwards" : undefined,
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row of Rounded Mini Thumbnails (Directly Matching Reference UI) */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 w-full">
              {piece.images.map((img, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    aria-label={`View angle ${idx + 1}`}
                    className={`relative aspect-[3/4] sm:aspect-square rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "ring-2 ring-[#C5A059] ring-offset-2 ring-offset-[#FAF9F6] shadow-md scale-[1.02]"
                        : "opacity-60 hover:opacity-100 hover:scale-[1.01] border border-black/5"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${piece.title} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 25vw, 15vw"
                    />
                    {isActive && (
                      <span className="absolute inset-0 bg-[#C5A059]/10 pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>

          </div>

          {/* ============================================================ */}
          {/* RIGHT: Silhouette Title, Ratings, Bespoke Enquiry CTAs */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 flex flex-col space-y-6 sm:space-y-8 text-left">
            
            {/* Title & Heart Wishlist Row */}
            <div className="flex items-start justify-between gap-4 pb-2">
              <div className="space-y-2">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase text-[#C5A059] block">
                  {piece.collection}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#111111] leading-[1.1]">
                  {piece.title}
                </h1>
                <p className="text-xs sm:text-sm font-medium tracking-wider text-zinc-500 uppercase">
                  {piece.subtitle}
                </p>
              </div>

              {/* Wishlist Heart Button (Matching reference circular wishlist) */}
              <button
                type="button"
                onClick={toggleWishlist}
                aria-label="Save to Bridal Wishlist"
                className={`p-3.5 sm:p-4 rounded-full border transition-all duration-300 shrink-0 shadow-xs hover:scale-105 active:scale-95 ${
                  isWishlisted
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "bg-white border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:border-zinc-400"
                }`}
              >
                <Heart
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isWishlisted ? "fill-rose-500 text-rose-500 scale-110" : ""
                  }`}
                />
              </button>
            </div>

            {/* Rating & Real Bride Reviews Line */}
            <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-600 pb-2 border-b border-zinc-200/80">
              <div className="flex items-center text-amber-500 gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-zinc-900">{piece.rating}</span>
              </div>
              <span className="text-zinc-300">•</span>
              <a
                href="#reviews"
                className="font-medium underline underline-offset-4 hover:text-[#C5A059] transition-colors"
              >
                ({piece.reviewCount}) Atelier Reviews & Real Brides
              </a>
            </div>

            {/* Editorial Description */}
            {/* Editorial Description */}
            <p className="text-sm sm:text-[15px] text-zinc-800 leading-[1.75] font-normal tracking-wide">
              {piece.description}
            </p>

            {/* Quick Atelier Specifications Pill Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
              <div className="bg-gradient-to-br from-[#FAF5EB] to-white p-3.5 sm:p-4 rounded-2xl border border-[#DFBE82]/60 shadow-[0_2px_10px_rgba(197,160,89,0.08)]">
                <span className="text-[10px] font-bold text-[#8F6B2A] tracking-[0.25em] uppercase block mb-1">
                  CRAFT TIME
                </span>
                <span className="font-semibold text-xs sm:text-[13px] text-zinc-950 uppercase tracking-wider block">
                  180+ Handcrafted Hours
                </span>
              </div>
              <div className="bg-gradient-to-br from-[#FAF5EB] to-white p-3.5 sm:p-4 rounded-2xl border border-[#DFBE82]/60 shadow-[0_2px_10px_rgba(197,160,89,0.08)]">
                <span className="text-[10px] font-bold text-[#8F6B2A] tracking-[0.25em] uppercase block mb-1">
                  FIT ARCHITECTURE
                </span>
                <span className="font-semibold text-xs sm:text-[13px] text-zinc-950 uppercase tracking-wider block">
                  Bespoke Calico Fitting
                </span>
              </div>
            </div>

            {/* ======================================================== */}
            {/* ENQUIRY CTA SUITE (MATCHING HOMEPAGE SIGNATURE BUTTONS)   */}
            {/* ======================================================== */}
            <div className="pt-3 space-y-3.5">
              
              {/* Primary CTA: Inquire via WhatsApp (Matching Homepage Royal Maroon & Gold Explore Button) */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="INQUIRE"
                className="group relative w-full inline-flex items-center justify-between gap-3.5 sm:gap-4 px-6 sm:px-8 py-4 sm:py-4.5 rounded-full bg-[#2B0A0E] hover:bg-[#3D0E14] text-[#FDFBF7] border border-[#C5A059] shadow-[0_12px_32px_rgba(43,10,14,0.35),0_0_22px_rgba(197,160,89,0.28)] overflow-hidden transition-all duration-500 hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                {/* Shimmer light sweep */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                {/* Left: Glowing radar beacon + Title */}
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C5A059]" />
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#FDFBF7] group-hover:text-[#C5A059] transition-colors whitespace-nowrap">
                    Inquire via WhatsApp
                  </span>
                </div>

                {/* Right: Circular Gold Badge with Arrow */}
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#2B0A0E] group-hover:translate-x-1 transition-all duration-300 shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </span>
              </a>

              {/* Secondary CTA: Book Bridal Consultation (Matching Homepage Editorial Luxury Pill) */}
              <button
                type="button"
                onClick={() => setIsConsultationModalOpen(true)}
                data-cursor="CONSULT"
                className="group relative w-full inline-flex items-center justify-between gap-3.5 sm:gap-4 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#FAF5EB] to-[#FDFBF7] hover:bg-[#FAF5EB] text-[#2B0A0E] border border-[#C5A059]/80 shadow-[0_4px_16px_rgba(197,160,89,0.12)] overflow-hidden transition-all duration-300 hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                {/* Shimmer light sweep */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                {/* Left: Calendar Icon + Title */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <Calendar className="w-4 h-4 text-[#8F6B2A] shrink-0" />
                  <span className="sm:hidden text-[11px] font-bold tracking-[0.2em] uppercase text-[#2B0A0E] group-hover:text-[#8F6B2A] transition-colors whitespace-nowrap">
                    Book
                  </span>
                  <span className="hidden sm:inline text-xs font-bold tracking-[0.22em] uppercase text-[#2B0A0E] group-hover:text-[#8F6B2A] transition-colors whitespace-nowrap">
                    Book Bridal Consultation
                  </span>
                </div>

                {/* Right: Circular Gold Accent Badge */}
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#2B0A0E] group-hover:bg-[#2B0A0E] group-hover:text-[#FDFBF7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </span>
              </button>

              {/* Reassurance Notice */}
              <div className="pt-1 text-center">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium leading-relaxed">
                  Every creation is made-to-measure · Bespoke pricing provided upon consultation
                </p>
              </div>

            </div>

            {/* Direct Stylist Hotline */}
            <div className="bg-gradient-to-r from-[#FAF5EB] via-[#FDFBF7] to-[#FAF5EB] p-4 sm:p-4.5 rounded-2xl border border-[#DFBE82]/60 shadow-[0_4px_16px_rgba(197,160,89,0.06)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#2B0A0E] text-[#C5A059] flex items-center justify-center shrink-0 shadow-xs">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#2B0A0E]">
                    Direct Bridal Concierge
                  </div>
                  <div className="text-xs text-zinc-600 font-medium">
                    Speak directly with Anisree & Head Stylists
                  </div>
                </div>
              </div>
              <a
                href="tel:+918848200541"
                className="text-[11px] font-bold text-[#2B0A0E] tracking-wider uppercase px-3.5 py-1.5 rounded-full bg-white border border-[#DFBE82]/60 hover:bg-[#2B0A0E] hover:text-[#FDFBF7] hover:border-[#2B0A0E] transition-all shadow-xs"
              >
                +91 88482 00541
              </a>
            </div>

          </div>

        </div>

        {/* ============================================================ */}
        {/* ATELIER TRUST SIGNALS (EDITORIAL & AUTHENTIC, NO AI SLOP)   */}
        {/* ============================================================ */}
        <div className="py-12 sm:py-16 border-t border-b border-zinc-200/80 mb-20 md:mb-28">
          
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <span className="text-[11px] font-bold tracking-[0.32em] uppercase text-[#8F6B2A] block mb-2">
              THE DE FLORES DISTINCTION
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-zinc-950 tracking-tight">
              Couture Craftsmanship Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {piece.trustPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-zinc-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-[#C5A059]/60 transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#FAF5EB] border border-[#DFBE82]/50 flex items-center justify-center text-[#8F6B2A] mb-4 shadow-[0_2px_8px_rgba(197,160,89,0.1)]">
                    <CheckCircle2 className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-[#8F6B2A] mb-1.5 block">
                    {pillar.subtitle}
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-zinc-950 mb-3 leading-snug tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-[13px] sm:text-sm text-zinc-700 leading-[1.65] font-normal tracking-[0.01em]">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE ATELIER TABS: SILHOUETTE, PROCESS, SPECS, CARE */}
        {/* ============================================================ */}
        <div className="max-w-4xl mx-auto mb-20 md:mb-28">
          
          {/* Tab Navigation */}
          <div className="flex items-center justify-center gap-2 sm:gap-6 border-b border-zinc-200 pb-px mb-8 overflow-x-auto">
            {[
              { id: "craft", label: "Craft & Silhouette" },
              { id: "process", label: "Bespoke Journey" },
              { id: "specs", label: "Specifications" },
              { id: "care", label: "Heirloom Care" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 sm:px-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] transition-all whitespace-nowrap cursor-pointer relative ${
                  activeTab === tab.id
                    ? "text-[#2B0A0E] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C5A059]"
                    : "text-zinc-400 hover:text-zinc-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Craft & Silhouette */}
          {activeTab === "craft" && (
            <div className="bg-white p-6 sm:p-10 rounded-2xl border border-zinc-200/80 shadow-xs space-y-6 text-left animate-fade-in-up">
              <div className="space-y-3">
                <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">
                  THE INSPIRATION
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-zinc-950 font-light">
                  Sculpted Architecture Meets Botanical Grandeur
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
                  {piece.craftStory}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Sweetheart Neckline & Full Sheer Sleeve</h4>
                  <p className="text-xs text-zinc-500 font-light leading-relaxed">
                    Sculpted corsetry with breathable Italian net sleeves adorned with tone-on-tone dabka embroidery that contours the arms gracefully.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">16-Kali Geometric Flow</h4>
                  <p className="text-xs text-zinc-500 font-light leading-relaxed">
                    Designed with an engineered weight distribution system so the skirt creates a majestic silhouette without fatigue during long receptions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Bespoke Process */}
          {activeTab === "process" && (
            <div className="bg-white p-6 sm:p-10 rounded-2xl border border-zinc-200/80 shadow-xs space-y-6 text-left animate-fade-in-up">
              <div className="space-y-2 mb-6">
                <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">
                  HOW IT IS CREATED
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-zinc-950 font-light">
                  The 5-Step Bridal Atelier Journey
                </h3>
              </div>

              <div className="space-y-6 divide-y divide-zinc-100">
                {piece.processSteps.map((step, idx) => (
                  <div key={idx} className={`flex items-start gap-4 sm:gap-6 ${idx > 0 ? "pt-5" : ""}`}>
                    <span className="font-serif text-2xl sm:text-3xl text-[#C5A059] font-light shrink-0">
                      {step.step}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-900">
                        {step.title}
                      </h4>
                      <p className="text-xs text-zinc-500 font-light leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Specifications */}
          {activeTab === "specs" && (
            <div className="bg-white p-6 sm:p-10 rounded-2xl border border-zinc-200/80 shadow-xs space-y-4 text-left animate-fade-in-up">
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#C5A059] block mb-2">
                TECHNICAL ATELIER SHEET
              </span>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs divide-y sm:divide-y-0 divide-zinc-100">
                <div className="p-3 bg-zinc-50 rounded-xl">
                  <dt className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-400">Pure Fabric</dt>
                  <dd className="font-medium text-zinc-900 mt-1">{piece.specifications.fabric}</dd>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl">
                  <dt className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-400">Embroidery Techniques</dt>
                  <dd className="font-medium text-zinc-900 mt-1">{piece.specifications.embroidery}</dd>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl">
                  <dt className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-400">Silhouette Structure</dt>
                  <dd className="font-medium text-zinc-900 mt-1">{piece.specifications.silhouette}</dd>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl">
                  <dt className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-400">Atelier Palette</dt>
                  <dd className="font-medium text-zinc-900 mt-1">{piece.specifications.color}</dd>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl">
                  <dt className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-400">Bespoke Lead Time</dt>
                  <dd className="font-medium text-zinc-900 mt-1">{piece.specifications.leadTime}</dd>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl">
                  <dt className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-400">Ensemble Components</dt>
                  <dd className="font-medium text-zinc-900 mt-1">{piece.specifications.includes}</dd>
                </div>
              </dl>
            </div>
          )}

          {/* Tab 4: Heirloom Care */}
          {activeTab === "care" && (
            <div className="bg-white p-6 sm:p-10 rounded-2xl border border-zinc-200/80 shadow-xs space-y-4 text-left animate-fade-in-up">
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#C5A059] block mb-2">
                HEIRLOOM PRESERVATION
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-zinc-950 font-light">
                Preserving Handcrafted Zardozi For Generations
              </h3>
              <ul className="space-y-3 text-xs text-zinc-600 font-light leading-relaxed pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span><strong>Professional Dry Clean Only:</strong> Never machine wash or soak. Inform dry-cleaners to protect the micro cutdana during chemical baths.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span><strong>Store in Pure Muslin:</strong> Keep wrapped in the complimentary unbleached cotton muslin pouch inside your wooden trunk to protect the real gold threads from oxidation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span><strong>Avoid Direct Perfume Contact:</strong> Spray fragrances and hair mists prior to donning the embellished blouse and dupatta.</span>
                </li>
              </ul>
            </div>
          )}

        </div>

        {/* ============================================================ */}
        {/* OFFICIAL INSTAGRAM EMBED ("As Seen On @de_flores_official")  */}
        {/* ============================================================ */}
        <div className="mb-20 md:mb-28">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 text-left">
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C5A059] block mb-1">
                AUTHENTIC ATELIER POST
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-zinc-950">
                As Seen on @de_flores_official
              </h2>
            </div>
            <a
              href="https://www.instagram.com/de_flores_official/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#2B0A0E] hover:text-[#C5A059] transition-colors"
            >
              <span>View On Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Official Instagram Embed Container */}
          <InstagramPostEmbed />

        </div>

        {/* ============================================================ */}
        {/* VERIFIED REAL BRIDE REVIEWS SECTION                          */}
        {/* ============================================================ */}
        <div id="reviews" className="mb-20 md:mb-28 scroll-mt-32">
          
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C5A059] block mb-2">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-zinc-950">
              Words From Our Bespoke Brides
            </h2>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium">
              <span className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </span>
              <span className="font-bold text-zinc-900">{piece.rating} / 5.0</span>
              <span>•</span>
              <span>Based on {piece.reviewCount} Bespoke Commissions</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {piece.reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between text-left space-y-4"
              >
                <div className="space-y-3">
                  {/* Stars */}
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-light italic">
                    "{rev.quote}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-zinc-100 flex items-center gap-3">
                  {rev.brideImage ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-200 shrink-0">
                      <Image
                        src={rev.brideImage}
                        alt={rev.author}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#2B0A0E] text-[#FDFBF7] flex items-center justify-center text-xs font-serif shrink-0">
                      {rev.author[0]}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-zinc-900">{rev.author}</div>
                    <div className="text-[10px] text-[#C5A059] font-medium uppercase tracking-wider">
                      {rev.role} · {rev.occasion}
                    </div>
                    <div className="text-[9px] text-zinc-400">{rev.city} · {rev.date}</div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>


      </div>

      {/* ============================================================ */}
      {/* BRIDAL CONSULTATION MODAL                                    */}
      {/* ============================================================ */}
      {isConsultationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="relative w-full max-w-lg bg-[#FAF9F6] text-[#111111] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#C5A059]/40 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsConsultationModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-zinc-200/60 hover:bg-zinc-300 text-zinc-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-left space-y-1 mb-6">
              <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#C5A059] block">
                HAUTE COUTURE APPOINTMENT
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-zinc-950">
                Book Atelier Consultation
              </h3>
              <p className="text-xs text-zinc-500 font-light">
                For "{piece.title}". Our couture liaison will contact you within 24 hours.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleConsultationSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">
                  Bride's Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  placeholder="e.g. Avantika Kapoor"
                  className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#C5A059] transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">
                  WhatsApp Number (with country code) *
                </label>
                <input
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#C5A059] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#C5A059] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">
                    City / Venue *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventCity}
                    onChange={(e) => setEventCity(e.target.value)}
                    placeholder="e.g. Udaipur / London"
                    className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#C5A059] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">
                  Consultation Preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultType("in-person")}
                    className={`py-2.5 px-3 rounded-xl border text-[11px] font-semibold tracking-wider uppercase transition-all ${
                      consultType === "in-person"
                        ? "bg-[#2B0A0E] text-white border-[#2B0A0E]"
                        : "bg-white text-zinc-600 border-zinc-300 hover:border-zinc-400"
                    }`}
                  >
                    In-Person Atelier
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultType("virtual")}
                    className={`py-2.5 px-3 rounded-xl border text-[11px] font-semibold tracking-wider uppercase transition-all ${
                      consultType === "virtual"
                        ? "bg-[#2B0A0E] text-white border-[#2B0A0E]"
                        : "bg-white text-zinc-600 border-zinc-300 hover:border-zinc-400"
                    }`}
                  >
                    Virtual Styling Call
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">
                  Customization Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Custom neckline, dupatta preference, wedding color palette..."
                  className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#C5A059] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitted}
                className="w-full bg-[#111111] hover:bg-[#2B0A0E] text-white py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-lg hover:shadow-xl mt-4 flex items-center justify-center gap-2"
              >
                {isSubmitted ? (
                  <span>Opening WhatsApp Concierge...</span>
                ) : (
                  <>
                    <span>Confirm Consultation Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
