"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import collectionsData from "./data/collections.json";

// Reusable scroll-reveal line-by-line text animation component
function AnimatedLineText({
  lines,
  className = "",
  tag = "div",
  delayOffset = 0,
}: {
  lines: (string | { text: string; className?: string })[];
  className?: string;
  tag?: "div" | "h1" | "h2" | "h3" | "p";
  delayOffset?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const Tag = tag as any;

  return (
    <Tag ref={ref} className={className}>
      {lines.map((lineObj, idx) => {
        const isString = typeof lineObj === "string";
        const text = isString ? lineObj : lineObj.text;
        const lineClass = isString ? "" : (lineObj.className || "");
        return (
          <span key={idx} className="block overflow-hidden py-1">
            <span
              className={`block transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform ${lineClass} ${
                (!isMounted || isVisible) ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
              }`}
              style={{ transitionDelay: `${delayOffset + (idx * 120)}ms` }}
            >
              {text}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(1); // 02. Men's Collection expanded by default
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [activeSwatch, setActiveSwatch] = useState<string | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const carouselImages = [
    "/new_images2/IMG_1076.JPG",
    "/new_images2/IMG_1077.JPG",
    "/new_images2/IMG_1078.JPG",
    "/new_images2/IMG_1080.JPG",
    "/new_images2/IMG_1081.JPG",
    "/new_images2/IMG_1082.JPG"
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      try {
        const deviceId = localStorage.getItem("device_id") || "";
        const res = await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailInput, deviceId })
        });
        if (res.ok) {
          localStorage.setItem("subscriber_email", emailInput.trim());
          setIsSubscribed(true);
          setTimeout(() => {
            setIsPopupOpen(false);
          }, 2000);
        }
      } catch (err) {
        console.error("Subscription failed:", err);
      }
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(videoRef.current.muted);
    }
  };

  const accordionItems = [
    {
      id: 0,
      num: "01.",
      title: "CELEB GOWN",
      content: "Red carpet designs, custom fit silhouettes, and hand-embroidered structures engineered to stand out."
    },
    {
      id: 1,
      num: "02.",
      title: "LEHENGA",
      content: "Bespoke bridal wear, flowing silk georgette lehengas, structured corsetry, and layered tiers tailored to your body."
    },
    {
      id: 2,
      num: "03.",
      title: "PAKISTANI",
      content: "Traditional hand-stitched borders, long flowy kurtas, intricate threads, and heritage artisanal craftsmanship."
    },
    {
      id: 3,
      num: "04.",
      title: "RECEPTION",
      content: "Contemporary Indo-Western silhouettes, liquid silk flows, and high-fashion hybrid styling for evening events."
    },
    {
      id: 4,
      num: "05.",
      title: "SAREE",
      content: "Delicate draped silks, satin gathers, and custom handloom weaves that catch light in a beautiful, natural rhythm."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#f4f2ee] text-zinc-950 font-sans selection:bg-zinc-950 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="w-full px-4 pt-4 md:px-6 md:pt-6">
        <div className="relative w-full h-[90vh] bg-zinc-950 overflow-hidden rounded-[2.5rem] flex flex-col justify-between p-8 md:p-12">
          {/* Carousel Background Images with scroll-driven Parallax translation */}
          {carouselImages.map((imgSrc, idx) => (
            <div 
              key={imgSrc}
              className={`absolute inset-x-0 h-[125%] top-[-15%] bg-cover bg-center brightness-[0.75] transition-opacity duration-[1.5s] ease-in-out ${
                idx === carouselIndex ? "opacity-100 z-0" : "opacity-0 pointer-events-none"
              }`}
              style={{ 
                backgroundImage: `url('${imgSrc}')`,
                transform: `translateY(${scrollY * 0.3}px)`,
                willChange: "transform"
              }}
            />
          ))}
          <div className="absolute inset-0 bg-black/25 z-0" />

          {/* Spacing element for flex-col layout inside hero */}
          <div className="h-16" />

          {/* Bottom content layout: Split Left / Right */}
          <div className="relative z-10 w-full mt-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-end text-white">
            
            {/* Left side: DEFINE YOUR LOOK */}
            <div className="md:col-span-7 text-left">
              <AnimatedLineText
                tag="h1"
                lines={["DEFINE", "YOUR LOOK"]}
                className="text-6xl sm:text-7xl md:text-9xl font-bold tracking-tight uppercase leading-[0.85]"
              />
            </div>

            {/* Right side: Description & shop CTA */}
            <div className="md:col-span-5 md:text-right space-y-6 flex flex-col md:items-end">
              <AnimatedLineText
                tag="p"
                lines={[
                  "Style, quality, craftsmanship, confidence. Premium",
                  "apparel designed for those who refuse to blend in."
                ]}
                className="text-xs md:text-sm text-zinc-200/90 font-light leading-relaxed max-w-sm tracking-wide"
                delayOffset={300}
              />
              
              <div>
                <Link 
                  href="/explore" 
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#d6b78e] hover:text-white transition-colors"
                >
                  SHOP COLLECTION <span>→</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. RECAP SECTION */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="space-y-12">
          <div className="text-[10px] tracking-[0.3em] font-bold text-zinc-400 uppercase">
            /2025 RECAP
          </div>

          <AnimatedLineText
            tag="h2"
            lines={[
              { text: "A PREMIUM FASHION HOUSE BUILT ON", className: "text-zinc-950" },
              { text: "REFINED DESIGN, SUSTAINABLE FABRICS,", className: "text-zinc-400" },
              { text: "AND CURATED COLLECTIONS.", className: "text-zinc-400" }
            ]}
            className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight uppercase leading-[1.05]"
          />


        </div>
      </section>

      {/* 3. EXPLORE COLLECTIONS */}
      <section className="py-12 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <AnimatedLineText
            tag="h2"
            lines={[
              { text: "EXPLORE • OUR COLLECTIONS", className: "text-zinc-950" },
              { text: "FIT, COMFORT, DESIGN", className: "text-zinc-400 mt-2 text-base md:text-lg tracking-[0.35em]" }
            ]}
            className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.25em] uppercase text-zinc-900 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {collectionsData.map((item) => (
            <Link 
              href="/explore"
              key={item.id}
              className="relative aspect-[3/4.2] w-full overflow-hidden rounded-[2rem] group shadow-lg bg-zinc-950 block"
            >
              {/* Parallax Background Image */}
              <div 
                className="absolute inset-x-0 h-[140%] top-[-20%] bg-cover bg-center brightness-[0.75] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-[0.55]"
                style={{ 
                  backgroundImage: `url('${item.image}')`,
                  transform: `translateY(${(scrollY - 1000) * 0.045}px)`,
                  willChange: "transform"
                }}
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 transition-opacity duration-500 group-hover:from-black/90" />

              {/* Number Tag on Top-Right */}
              <div className="absolute top-6 right-6 text-white/50 text-[10px] font-mono tracking-widest z-10">
                /{item.num}
              </div>

              {/* Content Panel (Bottom aligned) */}
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end text-left space-y-4 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 z-10">
                {/* Tag */}
                <span className="text-[10px] tracking-[0.3em] font-bold text-[#ca8a3a] uppercase">
                  {item.tag}
                </span>
                
                {/* Category Title - HIGHLY HIGHLIGHTED */}
                <h3 className="text-xl sm:text-2xl font-bold tracking-[0.15em] text-white uppercase leading-none">
                  {item.category}
                </h3>
                
                {/* Description - Fades in and slides up on hover */}
                <p className="text-[11px] sm:text-xs text-zinc-300 font-light leading-relaxed tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 max-w-sm">
                  {item.desc}
                </p>

                {/* Explore arrow link */}
                <div className="pt-1 flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#ca8a3a] uppercase">
                  EXPLORE CATEGORY 
                  <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. TAILORED FOR YOU Accordion */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-300/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column */}
          <div className="lg:col-span-4 flex flex-col justify-between items-start space-y-8">
            <div className="text-[10px] tracking-[0.3em] font-bold text-zinc-400 uppercase">
              @2025 - PRESENT
            </div>
            <button 
              onClick={() => setIsPopupOpen(true)}
              className="inline-flex items-center gap-3 px-6 py-3 border border-zinc-300 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-zinc-950 hover:text-white transition-all duration-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ca8a3a]" />
              OUR COLLECTIONS
            </button>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-8 text-left">
            <div className="space-y-2">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase text-zinc-900 leading-none">
                TAILORED FOR YOU
              </h3>
              <div className="text-xl sm:text-2xl font-semibold tracking-wide uppercase text-zinc-400">
                CATEGORIES & CRAFTSMANSHIP
              </div>
            </div>

            {/* Accordion / List */}
            <div className="border-t border-zinc-300/60 divide-y divide-zinc-300/60">
              {accordionItems.map((item) => {
                const isOpen = activeAccordion === item.id;
                return (
                  <div key={item.id} className="py-6 transition-all duration-300">
                    <button
                      onClick={() => setActiveAccordion(isOpen ? null : item.id)}
                      className="w-full flex items-center justify-between text-left group"
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-xs font-mono tracking-wider text-zinc-400">{item.num}</span>
                        <span className={`text-sm sm:text-base font-bold tracking-widest uppercase transition-colors ${isOpen ? "text-[#ca8a3a]" : "text-zinc-900 group-hover:text-zinc-600"}`}>
                          {item.title}
                        </span>
                      </div>
                      
                      {/* Arrow / Chevron Icon */}
                      <div className="w-6 h-6 flex items-center justify-center rounded-full border border-zinc-300 group-hover:border-zinc-500 transition-colors">
                        {isOpen ? (
                          <svg className="w-3.5 h-3.5 text-[#ca8a3a]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-zinc-600 transform -rotate-45" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                          </svg>
                        )}
                      </div>
                    </button>
                    
                    {/* Collapsible Content */}
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isOpen ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-xs sm:text-sm text-zinc-500 font-light leading-relaxed pl-12 max-w-2xl tracking-wide">
                        {item.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 5. BRAND HERITAGE SECTION */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-300/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Story Image */}
          <div className="lg:col-span-5 relative aspect-[3/4.2] w-full overflow-hidden rounded-[2rem] bg-zinc-200 shadow-lg group">
            <Image 
              src="/newimages/IMG_1061.JPG" 
              alt="Artisanal Legacy"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105 brightness-95"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute top-6 left-6 text-white text-[9px] tracking-widest uppercase bg-zinc-950/40 px-3.5 py-1.5 rounded-full backdrop-blur-xs">
              EST. 2024 — DE FLORA HERITAGE
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.3em] font-bold text-zinc-400 uppercase">[ OUR HERITAGE ]</span>
              <AnimatedLineText
                tag="h3"
                lines={["THE ATELIER LEGACY", "CRAFTING MODERN SILHOUETTES"]}
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase leading-none text-zinc-900"
              />
            </div>
            
            <AnimatedLineText
              tag="p"
              lines={[
                "Before the thread finds the canvas, there is a storyboard.",
                "Every single garment begins as an architectural silhouette mapped to",
                "natural body motion. We build custom fits designed to make you stand out."
              ]}
              className="text-xs sm:text-sm text-zinc-500 font-light leading-relaxed tracking-wide"
              delayOffset={150}
            />

            <div className="border-t border-zinc-300/60 pt-8 grid grid-cols-2 gap-8 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <div className="space-y-2">
                <div className="text-zinc-900 font-bold">100% TAILOR-MADE</div>
                <p className="text-[11px] text-zinc-400 font-light tracking-wide normal-case leading-relaxed">
                  Every gown is configured to your exact height, color choice, and measurement specifications.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-zinc-900 font-bold">LOCAL ARTISANS</div>
                <p className="text-[11px] text-zinc-400 font-light tracking-wide normal-case leading-relaxed">
                  Support traditional hand-loom communities across India with every premium purchase.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* NEW SECTION: CONSCIOUS LUXURY */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-zinc-950 text-white rounded-[2.5rem] mx-4 my-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Statement */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.3em] font-bold text-zinc-500 uppercase">[ SUSTAINABILITY ]</span>
              <AnimatedLineText
                tag="h3"
                lines={["CONSCIOUS COUTURE", "REDUCING TEXTILE WASTE"]}
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase leading-none text-white"
              />
            </div>
            
            <AnimatedLineText
              tag="p"
              lines={[
                "By embracing a rigorous made-to-order paradigm, we completely",
                "eliminate warehouse inventory waste. Every dress is fabricated",
                "only when requested, using biodegradable plant-sourced silks."
              ]}
              className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed tracking-wide"
              delayOffset={100}
            />
          </div>

          {/* Right Column: Stats */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8 text-left">
            <div className="space-y-2">
              <div className="text-4xl font-light tracking-tight text-white font-serif">0%</div>
              <div className="text-[9px] tracking-widest uppercase font-bold text-zinc-500">MASS OVERPRODUCTION</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-light tracking-tight text-white font-serif">100%</div>
              <div className="text-[9px] tracking-widest uppercase font-bold text-zinc-500">ORGANIC FIBERS SOURCED</div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. THE BESPOKE PROCESS */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#ebe9e4] border-t border-b border-zinc-300/40">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="text-[10px] tracking-[0.3em] font-bold text-zinc-400 uppercase">[ HOW WE WORK ]</span>
            <AnimatedLineText
              tag="h2"
              lines={["THE BESPOKE EXPERIENCE"]}
              className="text-3xl sm:text-4xl font-bold tracking-tight uppercase text-zinc-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "SILHOUETTE MAPPING", desc: "We map your precise dimensions and curate custom cuts to construct the primary outline." },
              { num: "02", title: "FABRIC SOURCING", desc: "Only premium, organically dyed, or hand-loomed fibers make it into our pattern drafts." },
              { num: "03", title: "HAND STITCHING", desc: "Our local artisans assemble the embroidery details, consuming up to 60 hours per gown." },
              { num: "04", title: "FITTING REVEAL", desc: "Private sessions guarantee structural perfection before the creation is finally complete." }
            ].map((step) => (
              <div key={step.num} className="bg-white/40 border border-zinc-300/40 rounded-[2rem] p-8 text-left space-y-6 hover:shadow-lg transition-all duration-300 group">
                <div className="text-3xl font-bold font-mono text-[#ca8a3a] group-hover:scale-110 transition-transform duration-300 inline-block">
                  {step.num}
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-zinc-900">{step.title}</h4>
                  <p className="text-[11px] text-zinc-500 font-light leading-relaxed tracking-wide">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ONLINE CUSTOMIZATION VIDEO WALKTHROUGH */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-300/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Custom Video Player Container */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full aspect-[16/9] bg-zinc-950 rounded-[2.5rem] overflow-hidden shadow-2xl group border border-zinc-200/10">
              <video
                ref={videoRef}
                src="/customization.mp4"
                autoPlay
                loop
                muted={isVideoMuted}
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />

              {/* Mute/Unmute absolute toggle button */}
              <div className="absolute bottom-6 right-6 z-20">
                <button
                  onClick={toggleVideoMute}
                  className="w-12 h-12 rounded-full bg-white/20 hover:bg-white backdrop-blur-md border border-white/20 text-white hover:text-zinc-950 flex items-center justify-center transition-all duration-300 shadow-md"
                  title={isVideoMuted ? "Unmute" : "Mute"}
                >
                  {isVideoMuted ? (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zm-11 5.77v6h4l5 5v-16l-5 5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Top Indicator */}
              <div className="absolute top-6 left-6 text-white text-[9px] tracking-widest uppercase bg-zinc-950/40 px-3.5 py-1.5 rounded-full backdrop-blur-xs">
                WALKTHROUGH DEMO
              </div>
            </div>
          </div>

          {/* Right Column: Descriptions & Detailed specs */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.3em] font-bold text-zinc-400 uppercase">[ VIRTUAL ATELIER ]</span>
              <AnimatedLineText
                tag="h3"
                lines={["ONLINE CUSTOMIZATION", "DESIGN YOUR SILHOUETTE"]}
                className="text-3xl sm:text-4xl font-bold tracking-tight uppercase leading-none text-zinc-900"
              />
            </div>
            
            <AnimatedLineText
              tag="p"
              lines={[
                "Embrace absolute creative control. Choose your exact",
                "necklines, select premium fabrics, configure sleeve styles,",
                "and preview embroidery details instantly in our virtual studio."
              ]}
              className="text-xs sm:text-sm text-zinc-500 font-light leading-relaxed tracking-wide"
              delayOffset={100}
            />

            <div className="pt-2">
              <Link
                href="/explore"
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-zinc-950 text-white border border-zinc-950 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-transparent hover:text-zinc-950 transition-all duration-300 shadow-md"
              >
                START DESIGNING <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* PARALLAX EDITORIAL BANNER */}
      <section className="relative w-full h-[60vh] overflow-hidden my-16 bg-zinc-950">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed brightness-[0.65]"
          style={{ backgroundImage: "url('/new_images2/IMG_1078.JPG')" }}
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          <div className="text-center text-white space-y-4 max-w-xl px-6">
            <span className="text-[10px] tracking-[0.3em] font-bold text-zinc-300 uppercase">[ EDITORIAL PARALLAX ]</span>
            <AnimatedLineText
              tag="h2"
              lines={["ARCHITECTURAL ALIGNMENT IN EVERY STITCH"]}
              className="text-2xl sm:text-4xl font-bold tracking-tight uppercase leading-tight"
            />
          </div>
        </div>
      </section>

      {/* 7. JOURNAL DIARIES / TESTIMONIALS */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="space-y-16">
          <div className="text-center space-y-3">
            <span className="text-[10px] tracking-[0.3em] font-bold text-zinc-400 uppercase">[ JOURNAL DIARIES ]</span>
            <AnimatedLineText
              tag="h2"
              lines={["WORDS FROM THE DIARIES"]}
              className="text-3xl sm:text-4xl font-bold tracking-tight uppercase text-zinc-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "“The bespoke fitting process was incredible. Every stitch has structural purpose and flatters the body outline perfectly.”",
                client: "AISHWARYA R.",
                city: "DELHI"
              },
              {
                quote: "“They balance organic silk weights and luxury drapes with scientific detail. Truly a standout dress in my wedding collection.”",
                client: "KAVYA S.",
                city: "MUMBAI"
              },
              {
                quote: "“A gorgeous mint gown tailor-made exactly to my occasion palette. The sequins catch light in a beautiful, natural rhythm.”",
                client: "DEVIKA N.",
                city: "BANGALORE"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/30 border border-zinc-300/40 rounded-[2rem] p-8 text-left flex flex-col justify-between min-h-[220px]">
                <p className="text-xs text-zinc-600 italic leading-relaxed tracking-wide font-light">
                  {item.quote}
                </p>
                <div className="border-t border-zinc-200/60 pt-4 flex justify-between items-center text-[10px] tracking-widest font-semibold uppercase text-zinc-400">
                  <span className="text-zinc-900 font-bold">{item.client}</span>
                  <span>{item.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BANNER / LOOKBOOK SECTION */}
      <section className="px-4 pb-16 md:px-6 md:pb-24">
        <div className="relative w-full h-[65vh] bg-zinc-950 overflow-hidden rounded-[2.5rem] flex flex-col justify-between p-8 md:p-12">
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center brightness-[0.8] hover:scale-105 transition-transform duration-[3s]"
            style={{ backgroundImage: "url('/newimages/IMG_1064.JPG')" }}
          />
          <div className="absolute inset-0 bg-black/10 z-0" />

          {/* Top-left pill button */}
          <div className="relative z-10 self-start">
            <Link 
              href="/gallery"
              className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold tracking-widest uppercase text-white hover:bg-white hover:text-zinc-950 transition-all duration-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ca8a3a]" />
              LOOKBOOK
            </Link>
          </div>

          {/* Bottom-left title and underline */}
          <div className="relative z-10 max-w-xl text-left space-y-6">
            <AnimatedLineText
              tag="h3"
              lines={["CURATED STYLE.", "ELEVATED EVERY DAY."]}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase leading-none"
            />
            <div className="w-24 h-[1.5px] bg-white opacity-80" />
          </div>
        </div>
      </section>

      {/* POPUP DIALOG */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#f4f2ee] border border-zinc-200 p-8 md:p-10 shadow-2xl relative text-center rounded-[2rem]">
            
            <button 
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-950 transition-colors"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-6">
              <h3 className="text-xl tracking-widest font-bold uppercase text-zinc-950">
                SUBSCRIBE
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed font-light tracking-wide">
                Join our newsletter list to receive seasonal curation updates, private runway launches, and exclusive offers.
              </p>

              {isSubscribed ? (
                <div className="py-4 text-emerald-600 font-semibold text-xs tracking-wider animate-pulse">
                  THANK YOU! REDIRECTING TO INSTAGRAM...
                </div>
              ) : (
                <form onSubmit={handleSubscribeSubmit} className="space-y-4">
                  <input
                     type="email"
                     required
                     placeholder="YOUR EMAIL ADDRESS"
                     value={emailInput}
                     onChange={(e) => setEmailInput(e.target.value)}
                     className="w-full border border-zinc-300 text-xs px-4 py-3 tracking-wider text-zinc-950 text-center placeholder:text-zinc-400 focus:outline-none focus:border-zinc-600 bg-transparent rounded-full"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="submit"
                      className="bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-zinc-800 transition-colors rounded-full"
                    >
                      Subscribe
                    </button>
                    <a 
                      href="https://www.instagram.com/de_flores_official"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-zinc-950 text-zinc-950 text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-zinc-50 transition-colors flex items-center justify-center rounded-full animate-pulse"
                    >
                      Instagram
                    </a>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
