"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (hasAutoOpened) return;
      const scrollPos = window.innerHeight + window.scrollY;
      const totalHeight = document.documentElement.scrollHeight;
      if (scrollPos >= totalHeight - 600) {
        setIsPopupOpen(true);
        setHasAutoOpened(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasAutoOpened]);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        // Redirect to Instagram after a short delay
        window.location.href = "https://www.instagram.com/de_flores_official";
      }, 1500);
    }
  };

  const marqueeItems = [
    "PRET", "WESTERN", "BRIDAL", "INDO WESTERN", "OCCASIONAL WEAR",
    "PRET", "WESTERN", "BRIDAL", "INDO WESTERN", "OCCASIONAL WEAR",
    "PRET", "WESTERN", "BRIDAL", "INDO WESTERN", "OCCASIONAL WEAR"
  ];

  return (
    <div className="w-full bg-transparent text-zinc-900 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[85vh] bg-zinc-100 overflow-hidden flex items-end">
        {/* Clean full screen image backdrop */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero/herosection.png')" }}
        />
        {/* Subtle vignette gradient to preserve text readability */}
        <div className="absolute inset-0 bg-black/15 z-1" />

        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-16 relative z-10 grid grid-cols-1 md:grid-cols-2 items-end gap-8">
          
          {/* Left Column Text */}
          <div className="space-y-6 text-white text-left animate-fade-in-up">
            <h1 className="font-serif text-5xl md:text-7xl font-light leading-none tracking-wide text-white drop-shadow-xs animate-text-reveal">
              NEW <br />
              COLLECTION
            </h1>
            <div className="pt-2">
              <Link 
                href="#ready-to-wear" 
                className="text-xs font-semibold tracking-widest uppercase text-white pb-1.5 border-b border-white hover:opacity-85 transition-opacity"
              >
                Shop now
              </Link>
            </div>
          </div>

          {/* Right Column Text */}
          <div className="text-white md:text-right space-y-2 animate-fade-in-up [animation-delay:200ms]">
            <div className="font-serif text-4xl md:text-6xl font-light tracking-wide text-white drop-shadow-xs">
              24/25
            </div>
            <div className="text-[10px] md:text-xs tracking-[0.2em] font-semibold uppercase text-zinc-200">
              SUMMER-FALL DRESS & SWIMSUITS
            </div>
          </div>

        </div>
      </section>

      {/* 2. INFINITE SCROLLING MARQUEE (Below Hero) */}
      <div className="marquee-container">
        <div className="marquee-content">
          {marqueeItems.map((item, idx) => (
            <div key={idx} className="marquee-item">
              <Image 
                src="/floral.svg" 
                alt="Floral ornament" 
                width={14} 
                height={16} 
                className="inline-block opacity-80"
              />
              <span>{item}</span>
            </div>
          ))}
          {/* Repeat once more for infinite scrolling seamless look */}
          {marqueeItems.map((item, idx) => (
            <div key={`dup-${idx}`} className="marquee-item">
              <Image 
                src="/floral.svg" 
                alt="Floral ornament" 
                width={14} 
                height={16} 
                className="inline-block opacity-80"
              />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>


      {/* 3. READY-TO-WEAR SECTION */}
      <section id="ready-to-wear" className="py-20 md:py-28 bg-transparent border-b border-zinc-200/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header Row */}
          <div className="flex justify-between items-end mb-12 pb-4 border-b border-zinc-100 animate-fade-in-up">
            <h2 className="font-serif text-2xl md:text-3xl tracking-widest uppercase text-zinc-950 font-normal">
              Ready-To-Wear
            </h2>
            <Link 
              href="#gallery" 
              className="group flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-zinc-900 hover:opacity-60 transition-all"
            >
              See more 
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* 4-Column Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { id: 1, img: "/crop_green.png", title: "MINT GLITTER SEQUIN LEHENGA", price: "₹28,500" },
              { id: 2, img: "/crop_white.png", title: "IVORY EMBROIDERED FESTIVE CHIC", price: "₹24,000" },
              { id: 3, img: "/crop_red.png", title: "SCARLET DRAPED GEORGETTE GOWN", price: "₹22,500" },
              { id: 4, img: "/crop_green.png", title: "EMERALD DESIGNER LEHENGA SET", price: "₹32,000" }
            ].map((item) => (
              <Link href={`/product/${item.id}`} key={item.id} className="product-card flex flex-col group cursor-pointer">
                <div className="product-image-container aspect-[3/4] w-full mb-4 bg-zinc-50 relative">
                  <Image 
                    src={item.img} 
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <h3 className="text-[10px] tracking-widest font-semibold uppercase text-zinc-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-medium text-zinc-500 tracking-wider">
                    {item.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>


      {/* 4. NEW COLLECTIONS SECTION */}
      <section className="py-16 md:py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header Row */}
          <div className="flex justify-between items-end mb-12 pb-4 border-b border-zinc-100">
            <h2 className="font-serif text-2xl md:text-3xl tracking-widest uppercase text-zinc-950 font-normal">
              New Collections
            </h2>
            <Link 
              href="#gallery" 
              className="group flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-zinc-900 hover:opacity-60 transition-all"
            >
              See more 
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Editorial Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
            
            {/* Left tall image */}
            <div className="lg:col-span-5 relative aspect-[3/4.5] w-full bg-zinc-50 overflow-hidden">
              <Image
                src="/crop_white.png"
                alt="Tall Editorial Model Shot"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            {/* Right block */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              
              {/* Inside Medium Image */}
              <div className="md:col-span-6 relative aspect-[3/4] w-full bg-zinc-50 overflow-hidden">
                <Image
                  src="/crop_red.png"
                  alt="Detail Model Gown Shot"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />
              </div>

              {/* Inside description text block */}
              <div className="md:col-span-6 flex flex-col justify-center space-y-6 py-4 text-left">
                <p className="text-xs md:text-sm text-zinc-800 leading-relaxed font-light tracking-wide">
                  A strictly elegance, you might call it. White summer dresses blowing voluminous in the arctic world.
                </p>
                <p className="text-xs md:text-sm text-zinc-500 leading-relaxed font-light tracking-wide">
                  Oversized hybrids of romantic summer dresses and white lacy gowns; one-piece swimsuit that turn out to be made from DeFlores new mycelium-derived lace-mimicking alternative.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* 5. GALLERY SECTION (Replaces Shoes for Women) */}
      <section id="gallery" className="py-20 md:py-28 bg-transparent border-t border-zinc-200/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header Row */}
          <div className="flex justify-between items-end mb-12 pb-4 border-b border-zinc-100 animate-fade-in-up">
            <h2 className="font-serif text-2xl md:text-3xl tracking-widest uppercase text-zinc-950 font-normal">
              Gallery
            </h2>
            <div className="text-[10px] tracking-widest font-semibold uppercase text-zinc-400">
              Editorial Exposé
            </div>
          </div>

          {/* 6-Column Placeholder Gallery Grid (Fades out at the bottom) */}
          <div className="relative animate-fade-in-up">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { id: 1, img: "/gallery_purple.jpg", title: "HAUTE COUTURE" },
                { id: 2, img: "/gallery_purple.jpg", title: "PINK SHADOW" },
                { id: 3, img: "/gallery_purple.jpg", title: "MUSTARD SHADOW" },
                { id: 4, img: "/gallery_purple.jpg", title: "DETAIL FOCUS" },
                { id: 5, img: "/gallery_purple.jpg", title: "DETAIL LACE" },
                { id: 6, img: "/gallery_purple.jpg", title: "EMBROIDERED BACK" }
              ].map((item) => (
                <div key={item.id} className="relative aspect-[3/4.5] w-full bg-zinc-100 overflow-hidden group">
                  <Image 
                    src={item.img} 
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-95"
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[9px] tracking-widest uppercase text-white font-semibold">
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Blurring Line Overlay */}
            <div className="gallery-blur-overlay" />

            {/* Centered Show More Button */}
            <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center">
              <button 
                onClick={() => setIsPopupOpen(true)}
                className="px-8 py-3.5 bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-md active:scale-95"
              >
                Show More
                <svg className="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* 6. METRICS & MARQUEE OF STATS */}
      <section className="py-16 md:py-24 bg-transparent border-t border-zinc-200/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { num: "98%", label: "CLIENT SATISFACTION" },
              { num: "500+", label: "BESPOKE FLORA & COUTURE DESIGNS" },
              { num: "10+", label: "YEARS OF ARTISANAL LEGACY" }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-3">
                <div className="font-serif text-5xl md:text-6xl font-light tracking-wide text-zinc-950 animate-text-reveal">
                  {stat.num}
                </div>
                <div className="text-[10px] tracking-widest font-semibold uppercase text-zinc-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 7. CUSTOM DESIGN CTA BANNER (Ref 1 Lookbook Style) */}
      <section className="pb-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-[#eae3d8]/40 border border-[#eae3d8]/60 backdrop-blur-xs rounded-2xl p-8 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left description text */}
            <div className="lg:col-span-6 space-y-6 text-left animate-fade-in-up">
              <span className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500 block">
                Bespoke Design Service
              </span>
              <h3 className="font-serif text-3xl md:text-5xl font-light leading-tight text-zinc-950 animate-text-reveal">
                Timeless Designs<br />For Every Moment
              </h3>
              <p className="text-zinc-600 text-xs md:text-sm leading-relaxed font-light tracking-wide max-w-md">
                Collaborate with our head designers to craft a bespoke couture creation tailored specifically to your measurements, palette choice, and occasion silhouette.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase px-8 py-3.5 hover:bg-zinc-800 transition-all flex items-center gap-2"
                >
                  Get Free Quote
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Right overlapping images block */}
            <div className="lg:col-span-6 grid grid-cols-3 gap-3 md:gap-4">
              {[
                { img: "/crop_green.png", alt: "Mint dress model" },
                { img: "/crop_white.png", alt: "White dress model" },
                { img: "/crop_red.png", alt: "Red dress model" }
              ].map((item, idx) => (
                <div key={idx} className="relative aspect-[3/4.5] w-full bg-zinc-100 overflow-hidden shadow-sm">
                  <Image
                    src={item.img}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 30vw, 15vw"
                  />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* 8. TESTIMONIALS SECTION */}
      <section className="py-20 md:py-28 bg-transparent border-t border-zinc-200/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center space-y-4 mb-16 animate-fade-in-up">
            <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 block">
              Testimonials
            </span>
            <h2 className="font-serif text-3xl md:text-4xl tracking-widest uppercase text-zinc-950 font-normal animate-text-reveal">
              Client Diaries
            </h2>
            <div className="w-12 h-[1px] bg-zinc-300 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The bridal lehenga exceeded every expectation. The lace detail was architectural and drew compliments all evening. Absolutely bespoke perfection.",
                author: "Ananya Sharma",
                location: "Delhi"
              },
              {
                quote: "Collaborating on the custom mint gown was seamless. They balanced mathematics and textile drape in a way that feels organic and luxury.",
                author: "Priya Patel",
                location: "Mumbai"
              },
              {
                quote: "DeFlores creates structures, not just garments. The silhouette mapping fits flawlessly and the material textures feel incredibly premium.",
                author: "Meera Sen",
                location: "Kolkata"
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white/30 border border-zinc-200/40 backdrop-blur-xs p-8 md:p-10 shadow-xs flex flex-col justify-between text-left rounded-xl transition-all duration-300 hover:border-zinc-300"
              >
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-500/80">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xs">★</span>
                    ))}
                  </div>
                  <p className="font-serif italic text-zinc-700 text-xs md:text-sm leading-relaxed">
                    \"{item.quote}\"
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-zinc-200/30 flex justify-between items-center">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-950">
                    {item.author}
                  </span>
                  <span className="text-[9px] tracking-wider uppercase text-zinc-400">
                    {item.location}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 9. B&W EDITORIAL SPLIT SECTION (Ref 2 Style) */}
      <section className="py-16 md:py-24 bg-transparent border-t border-zinc-200/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-8 md:space-y-12">
          
          {/* Banner Row 1: Left Model (B&W) / Right Text */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden rounded-xl border border-zinc-200/40 shadow-xs bg-white/40 backdrop-blur-xs animate-fade-in-up">
            {/* Image (B&W) */}
            <div className="md:col-span-7 relative aspect-video md:aspect-auto md:h-[350px] bg-zinc-100 overflow-hidden">
              <Image
                src="/crop_white.png"
                alt="Model Portrait in Black & White"
                fill
                className="object-cover filter grayscale contrast-125 brightness-90 hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
            {/* Text */}
            <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-center items-start text-left space-y-4">
              <h3 className="font-serif text-3xl font-light text-zinc-950 tracking-wide animate-text-reveal">
                Style Stories
              </h3>
              <p className="text-zinc-500 text-xs tracking-wider uppercase font-semibold">
                How to Style a Bridal Silhouette
              </p>
              <p className="text-zinc-600 text-xs leading-relaxed font-light tracking-wide">
                Discover custom layering techniques to elevate traditional drapes into contemporary masterpieces.
              </p>
            </div>
          </div>

          {/* Banner Row 2: Left Text / Right Detail texture (B&W) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden rounded-xl border border-zinc-200/40 shadow-xs bg-white/40 backdrop-blur-xs animate-fade-in-up [animation-delay:200ms]">
            {/* Text (on left on desktop) */}
            <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-center items-start text-left space-y-4 order-2 md:order-1">
              <h3 className="font-serif text-3xl font-light text-zinc-950 tracking-wide animate-text-reveal">
                Fabric & Craftsmanship
              </h3>
              <p className="text-zinc-500 text-xs tracking-wider uppercase font-semibold">
                Quality and tradition in weave
              </p>
              <p className="text-zinc-600 text-xs leading-relaxed font-light tracking-wide">
                Every thread is selected for structure and density, ensuring the signature DeFlores silhouette remains intact.
              </p>
            </div>
            {/* Image (on right on desktop) */}
            <div className="md:col-span-7 relative aspect-video md:aspect-auto md:h-[350px] bg-zinc-100 overflow-hidden order-1 md:order-2">
              <Image
                src="/gallery_purple.jpg"
                alt="Fabric Detail Close-Up in Black & White"
                fill
                className="object-cover filter grayscale contrast-150 brightness-95 hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          </div>

        </div>
      </section>


      {/* 6. POPUP DIALOG / INTERSTITIAL MODAL */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-zinc-200 p-8 md:p-10 shadow-2xl relative text-center">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-950 transition-colors"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl tracking-widest uppercase text-zinc-950">
                Subscribe
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed font-light">
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
                    className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 text-center placeholder:text-zinc-300 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="submit"
                      className="bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-zinc-800 transition-colors"
                    >
                      Subscribe
                    </button>
                    <a 
                      href="https://www.instagram.com/de_flores_official"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-zinc-950 text-zinc-950 text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-zinc-50 transition-colors flex items-center justify-center"
                    >
                      Continue
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
