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

  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchHomeGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (data.success) {
          setGalleryImages(data.images.slice(0, 6));
        }
      } catch (err) {
        console.error("Home gallery fetch failed:", err);
      }
    };
    fetchHomeGallery();
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

  const marqueeItems = [
    "RHYTHM", "PULSE", "WHISPER", "RESONANCE", "BESPOKE COUTURE",
    "RHYTHM", "PULSE", "WHISPER", "RESONANCE", "BESPOKE COUTURE"
  ];

  return (
    <div className="w-full bg-[#fbfbfa] text-zinc-900 font-sans selection:bg-zinc-950 selection:text-white">
      
      {/* 1. HERO SECTION (Clean, Minimal, High-Fashion) */}
      <section className="relative w-full h-[95vh] bg-zinc-950 overflow-hidden flex items-end">
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-[0.82] transition-transform duration-[3s] scale-105"
          style={{ backgroundImage: "url('/newimages/IMG_1066.JPG')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent z-1" />

        {/* Floating Minimal Header Elements */}
        <div className="absolute top-8 left-8 right-8 z-20 flex justify-between items-center mix-blend-difference text-white">
          <span className="text-[10px] tracking-[0.25em] font-semibold uppercase">DEFLORES STUDIO</span>
          <span className="text-[10px] tracking-[0.25em] font-semibold uppercase">EST. 2024</span>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-24 relative z-10 grid grid-cols-1 md:grid-cols-2 items-end gap-12">
          <div className="space-y-6 text-white text-left">
            <p className="text-[10px] tracking-[0.3em] font-bold text-zinc-300 uppercase">THE INVISIBLE ECHO</p>
            <h1 className="font-serif text-5xl md:text-8xl font-light leading-[0.9] tracking-[-0.03em]">
              5 TALES OF <br />
              BEING
            </h1>
            <div className="pt-4">
              <Link 
                href="#tales" 
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-white pb-2 border-b border-white hover:text-zinc-200 hover:border-zinc-200 transition-colors"
              >
                DISCOVER THE CHAPTERS
              </Link>
            </div>
          </div>

          <div className="text-white md:text-right space-y-3">
            <div className="font-serif text-3xl md:text-5xl font-light tracking-wide">
              24/25
            </div>
            <div className="text-[9px] md:text-[10px] tracking-[0.25em] font-semibold uppercase text-zinc-300">
              HIGH VALUE WOMEN CUSTOM DRESS CATEGORIES
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE SCROLLING MARQUEE */}
      <div className="marquee-container bg-zinc-950 py-5 text-white border-y border-white/10">
        <div className="marquee-content">
          {marqueeItems.map((item, idx) => (
            <div key={idx} className="marquee-item font-serif tracking-[0.3em] text-[11px] font-light">
              <Image 
                src="/floral.svg" 
                alt="Ornament" 
                width={12} 
                height={14} 
                className="inline-block opacity-70 invert"
              />
              <span>{item}</span>
            </div>
          ))}
          {marqueeItems.map((item, idx) => (
            <div key={`dup-${idx}`} className="marquee-item font-serif tracking-[0.3em] text-[11px] font-light">
              <Image 
                src="/floral.svg" 
                alt="Ornament" 
                width={12} 
                height={14} 
                className="inline-block opacity-70 invert"
              />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TALES OF BEING (The 4 Women High Value Custom Dress Categories) */}
      <section id="tales" className="py-24 md:py-36 bg-[#f7f6f2] border-b border-zinc-200/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">
          
          <div className="max-w-xl mx-auto text-center space-y-6">
            <span className="text-[9px] tracking-[0.3em] font-bold text-zinc-400 uppercase">[ INTRODUCING ]</span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-zinc-900 tracking-wide uppercase">
              The Bespoke Chapters
            </h2>
            <p className="text-xs text-zinc-500 font-light leading-relaxed tracking-wide">
              Before the gesture, there is a silhouette. Before the stitch, an idea. We gather these custom stories and transform them into couture dress collections tailored perfectly to your body.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            
            {/* Category 1: Rhythm */}
            <div className="space-y-6 text-left group">
              <div className="relative aspect-[3/4] w-full bg-zinc-100 overflow-hidden rounded-xl">
                <Image 
                  src="/newimages/IMG_1058.JPG" 
                  alt="Rhythm Collection"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
                <div className="absolute top-6 left-6 text-white font-mono text-[10px] tracking-widest bg-zinc-950/40 backdrop-blur-xs px-3 py-1.5 rounded-full">
                  [ 01 ] RHYTHM
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl tracking-wide uppercase text-zinc-900 font-normal">
                  Rhythm
                </h3>
                <p className="text-[10px] tracking-[0.2em] font-bold text-zinc-400 uppercase">NOMADIC BESPOKE GOWNS</p>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                  Freedom dancing beyond boundaries. Flowing silk georgette, structured corsetry, and layered tiers for the modern high-value woman.
                </p>
              </div>
            </div>

            {/* Category 2: Pulse */}
            <div className="space-y-6 text-left group md:translate-y-12">
              <div className="relative aspect-[3/4] w-full bg-zinc-100 overflow-hidden rounded-xl">
                <Image 
                  src="/newimages/IMG_1060.JPG" 
                  alt="Pulse Collection"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
                <div className="absolute top-6 left-6 text-white font-mono text-[10px] tracking-widest bg-zinc-950/40 backdrop-blur-xs px-3 py-1.5 rounded-full">
                  [ 02 ] PULSE
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl tracking-wide uppercase text-zinc-900 font-normal">
                  Pulse
                </h3>
                <p className="text-[10px] tracking-[0.2em] font-bold text-zinc-400 uppercase">SACRED VELVET & SILK COUTURE</p>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                  A heavy heartbeat etched in fabric. Rich hand-embroidered velvet, structured silhouettes, and deep textures designed for custom bridal wear.
                </p>
              </div>
            </div>

            {/* Category 3: Whisper */}
            <div className="space-y-6 text-left group">
              <div className="relative aspect-[3/4] w-full bg-zinc-100 overflow-hidden rounded-xl">
                <Image 
                  src="/newimages/IMG_1062.JPG" 
                  alt="Whisper Collection"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
                <div className="absolute top-6 left-6 text-white font-mono text-[10px] tracking-widest bg-zinc-950/40 backdrop-blur-xs px-3 py-1.5 rounded-full">
                  [ 03 ] WHISPER
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl tracking-wide uppercase text-zinc-900 font-normal">
                  Whisper
                </h3>
                <p className="text-[10px] tracking-[0.2em] font-bold text-zinc-400 uppercase">FINE DRAPED SILKS & SAREES</p>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                  The poetry of living materials. Delicate satin drapes, liquid silk flows, and custom handloom weaves that change under light.
                </p>
              </div>
            </div>

            {/* Category 4: Resonance */}
            <div className="space-y-6 text-left group md:translate-y-12">
              <div className="relative aspect-[3/4] w-full bg-zinc-100 overflow-hidden rounded-xl">
                <Image 
                  src="/newimages/IMG_1064.JPG" 
                  alt="Resonance Collection"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
                <div className="absolute top-6 left-6 text-white font-mono text-[10px] tracking-widest bg-zinc-950/40 backdrop-blur-xs px-3 py-1.5 rounded-full">
                  [ 04 ] RESONANCE
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl tracking-wide uppercase text-zinc-900 font-normal">
                  Resonance
                </h3>
                <p className="text-[10px] tracking-[0.2em] font-bold text-zinc-400 uppercase">CONTEMPORARY INDO-WESTERN</p>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                  Sculpted forms that capture the eye. Innovative drapes, asymmetrical custom cuts, and high-fashion hybrid styling.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. READY-TO-WEAR DRESS CATALOG */}
      <section className="py-24 md:py-32 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="flex justify-between items-end mb-12 pb-4 border-b border-zinc-200">
            <h2 className="font-serif text-3xl tracking-widest uppercase text-zinc-950 font-normal">
              Signature Outfits
            </h2>
            <Link 
              href="#gallery" 
              className="group flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-zinc-900 hover:opacity-60 transition-all"
            >
              See Lookbook 
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { id: 1, img: "/newimages/IMG_1059.JPG", title: "MINT GLITTER SEQUIN LEHENGA", price: "₹28,500" },
              { id: 2, img: "/newimages/IMG_1061.JPG", title: "IVORY EMBROIDERED FESTIVE CHIC", price: "₹24,000" },
              { id: 3, img: "/newimages/IMG_1063.JPG", title: "SCARLET DRAPED GEORGETTE GOWN", price: "₹22,500" },
              { id: 4, img: "/newimages/IMG_1065.JPG", title: "EMERALD DESIGNER LEHENGA SET", price: "₹32,000" }
            ].map((item) => (
              <Link href={`/product/${item.id}`} key={item.id} className="product-card flex flex-col group cursor-pointer">
                <div className="product-image-container aspect-[3/4] w-full mb-4 bg-zinc-100 overflow-hidden relative rounded-lg">
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

      {/* 5. GALLERY SECTION */}
      <section id="gallery" className="py-24 bg-transparent border-t border-zinc-200/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="flex justify-between items-end mb-12 pb-4 border-b border-zinc-200">
            <h2 className="font-serif text-3xl tracking-widest uppercase text-zinc-950 font-normal">
              Editorial Exposé
            </h2>
            <div className="text-[9px] tracking-widest font-semibold uppercase text-zinc-400">
              DEFLORES LOOKBOOK
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {galleryImages.map((item) => (
                <div key={item.id} className="relative aspect-[3/4.5] w-full bg-zinc-100 overflow-hidden group rounded-lg">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.description || "Gallery Photo"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-95"
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[9px] tracking-widest uppercase text-white font-semibold">
                      {item.description || "HAUTE COUTURE"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="gallery-blur-overlay" />

            <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center">
              <Link 
                href="/gallery"
                className="px-8 py-3.5 bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-md active:scale-95"
              >
                Show More
                <svg className="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 6. METRICS */}
      <section className="py-24 bg-[#fbfbfa] border-t border-zinc-200/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { num: "98%", label: "CLIENT SATISFACTION" },
              { num: "500+", label: "BESPOKE FLORA & COUTURE DESIGNS" },
              { num: "10+", label: "YEARS OF ARTISANAL LEGACY" }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-3">
                <div className="font-serif text-5xl md:text-6xl font-light tracking-wide text-zinc-950">
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

      {/* 7. BESPOKE DESIGN CTA */}
      <section className="pb-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-[#eae3d8]/40 border border-[#eae3d8]/60 backdrop-blur-xs rounded-2xl p-8 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6 text-left animate-fade-in-up">
              <span className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500 block">
                Bespoke Design Service
              </span>
              <h3 className="font-serif text-3xl md:text-5xl font-light leading-tight text-zinc-950">
                Bespoke Fitting<br />For Every Silhouette
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

            <div className="lg:col-span-6 grid grid-cols-3 gap-3 md:gap-4">
              {[
                { img: "/newimages/IMG_1059.JPG", alt: "Mint Dress custom fit" },
                { img: "/newimages/IMG_1061.JPG", alt: "Ivory Dress custom fit" },
                { img: "/newimages/IMG_1063.JPG", alt: "Scarlet Dress custom fit" }
              ].map((item, idx) => (
                <div key={idx} className="relative aspect-[3/4.5] w-full bg-zinc-100 overflow-hidden shadow-sm rounded-lg">
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

      {/* 8. TESTIMONIALS */}
      <section className="py-24 bg-transparent border-t border-zinc-200/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center space-y-4 mb-16">
            <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 block">
              Testimonials
            </span>
            <h2 className="font-serif text-3xl md:text-4xl tracking-widest uppercase text-zinc-950 font-normal">
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
                    "{item.quote}"
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

      {/* POPUP DIALOG */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-zinc-200 p-8 md:p-10 shadow-2xl relative text-center rounded-xl">
            
            <button 
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-950 transition-colors"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

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
                      className="bg-white border border-zinc-950 text-zinc-950 text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-zinc-50 transition-colors flex items-center justify-center animate-pulse"
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
