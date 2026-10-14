import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Scissors, Crown, Gem } from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function FounderPage() {
  const PILLARS = [
    {
      number: "01",
      tag: "ORIGIN",
      title: "Tech to Haute Couture",
      subtitle: "The Bold Transition",
      description:
        "Leaving a structured IT career to pursue an unconditional passion for bespoke textile architecture and haute couture dressmaking.",
      icon: Sparkles,
    },
    {
      number: "02",
      tag: "HERITAGE",
      title: "Handloom Mastery",
      subtitle: "Varanasi & Kanchipuram",
      description:
        "Curating authentic South Indian pure zaris, antique silks, and centuries-old weaving lineages tailored to contemporary bridal fantasies.",
      icon: Gem,
    },
    {
      number: "03",
      tag: "DISCIPLINE",
      title: "Bespoke Artistry",
      subtitle: "Handcrafted Zardozi",
      description:
        "Each bridal creation commands hundreds of hours of precision needlework, French wire embroidery, and sculptured silhouettes.",
      icon: Scissors,
    },
    {
      number: "04",
      tag: "ROYALTY",
      title: "Regal Distinction",
      subtitle: "The De flores Signature",
      description:
        "Sculpting bridal wear and red-carpet couture that exude poise, dignity, and an unmistakable aristocratic aura.",
      icon: Crown,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#faf9f6] text-zinc-900 font-sans pt-36 sm:pt-44 pb-24 md:pb-32 selection:bg-[#2B0A0E] selection:text-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Luxury Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10 sm:mb-14">
          <ol className="flex items-center gap-2.5 text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-zinc-400">
            <li>
              <Link href="/" className="hover:text-zinc-950 transition-colors">
                Home
              </Link>
            </li>
            <li className="text-[#C5A059]">•</li>
            <li className="text-zinc-500">About</li>
            <li className="text-[#C5A059]">•</li>
            <li className="text-zinc-950 font-bold">The Founder</li>
          </ol>
        </nav>

        {/* Founder Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Architectural Grey Box Placeholder (matching Homepage Section 8) */}
          <div className="lg:col-span-5 relative aspect-[3/4.2] w-full rounded-[2rem] bg-zinc-200/90 border border-zinc-300/80 p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl group transition-all duration-500 hover:border-[#C5A059]/40">
            
            {/* Top Badges */}
            <div className="flex items-center justify-between z-10">
              <span className="font-mono text-xs tracking-widest px-3.5 py-1 font-semibold rounded-full border bg-white/90 text-[#2B0A0E] border-zinc-300/80 shadow-xs">
                01
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase font-bold px-3 py-1 rounded-full border bg-white/70 text-zinc-600 border-zinc-300/60">
                Portrait Placeholder
              </span>
            </div>

            {/* Center Monogram Emblem Watermark & Placeholder Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pointer-events-none select-none text-center">
              <div className="relative w-28 h-32 opacity-15 mb-4 transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/logo.svg"
                  alt="De flores"
                  fill
                  className="object-contain brightness-0"
                />
              </div>
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-zinc-600 font-semibold">
                [ Image Placeholder ]
              </p>
              <p className="font-serif italic text-xs sm:text-sm text-zinc-400 mt-1">
                Founder & Creative Head Portrait
              </p>
            </div>

            {/* Bottom Identity Card inside Grey Box */}
            <div className="relative z-10 bg-white/95 backdrop-blur-md p-6 rounded-[1.5rem] border border-zinc-200/80 shadow-lg text-left">
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.25em] mb-1">
                Founder & Creative Head
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                Anisree Sreeraj
              </h2>
              <p className="text-xs text-zinc-500 font-light tracking-wide mt-1">
                de flores Haute Couture Atelier · Est. 2026
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Biography & Artistic Vision */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-3">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-[#C5A059] block">
                The Creative Visionary
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-zinc-900 leading-[1.15]">
                Crafting Class,
                <span className="block font-serif italic font-bold text-4xl sm:text-5xl lg:text-6xl mt-2 text-[#2B0A0E]">
                  Inspiring Royalty.
                </span>
              </h1>
              <div className="w-20 h-[2px] bg-gradient-to-r from-[#C5A059] via-[#2B0A0E] to-transparent my-6" />
            </div>

            {/* Editorial Pull Quote */}
            <blockquote className="font-serif text-lg sm:text-xl lg:text-2xl italic text-[#2B0A0E] border-l-2 border-[#C5A059] pl-6 py-2 my-6 leading-relaxed bg-[#f5f3ec]/60 rounded-r-2xl pr-4">
              “For Anisree, designing is no less than an art — sculpturing exquisite, regal attires that honor ancient handloom traditions and celebrate modern silhouettes.”
            </blockquote>

            {/* Biography Copy */}
            <div className="space-y-5 text-sm sm:text-base text-zinc-700 leading-relaxed font-light tracking-wide">
              <p>
                Anisree Sreeraj is the founder and creative head of <strong className="font-medium text-zinc-950">‘de flores’ haute couture</strong>. An IT professional turned fashion designer, she took a visionary plunge into high-fashion entrepreneurship, marking an indelible presence in bespoke bridal couture and architectural dressmaking.
              </p>
              <p>
                After departing the corporate tech arena, Anisree debuted her career alongside eminent industry couturiers, mastering the nuances of rare textiles, pure weaves, and hand-embroidery. Driven by an innate passion for regal aesthetics and the unwavering support of her family, she founded <strong className="font-medium text-zinc-950">de flores</strong> — translating to &ldquo;flowers&rdquo; in Spanish, celebrating chastity, blossoming elegance, and loveliness in every stitch.
              </p>
              <p>
                Anisree&apos;s watchful eye for evolving bridal silhouettes and uncompromising attention to detail are the driving forces behind the atelier&apos;s competent craftsmanship. Her repertoire blends heritage Varanasi weaves and Kanchipuram silks with contemporary European cuts, ensuring every bride experiences unmatched majesty on her landmark day.
              </p>
            </div>

            {/* Action Buttons & Social Link */}
            <div className="pt-6 border-t border-zinc-200/80 flex flex-wrap items-center gap-4 sm:gap-6">
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-md bg-[#2B0A0E] text-[#FDFBF7] border border-[#C5A059] hover:bg-[#C5A059] hover:text-[#2B0A0E]"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href="https://www.instagram.com/anisree.sreeraj"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 border border-zinc-300 bg-white hover:border-[#2B0A0E] text-zinc-900 shadow-xs"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-[#2B0A0E]" />
                <span>@anisree.sreeraj</span>
              </a>
            </div>

          </div>

        </div>

        {/* The Four Pillars of Her Craft Section */}
        <section className="border-t border-zinc-200/80 pt-20 mt-20 sm:pt-28 sm:mt-28">
          <div className="text-center mb-14 sm:mb-18">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-[#C5A059] block mb-3">
              Philosophy & Mastery
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-zinc-900">
              The Four Pillars of
              <span className="block font-serif italic font-bold text-3xl sm:text-4xl lg:text-5xl mt-2 text-[#2B0A0E]">
                Her Atelier Craft
              </span>
            </h2>
            <p className="text-sm sm:text-base font-light text-zinc-600 max-w-xl mx-auto mt-4 leading-relaxed">
              Every de flores ensemble is anchored in four foundational principles of precision, heritage, and timeless royal aesthetics.
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar) => {
              const IconComponent = pillar.icon;
              return (
                <div
                  key={pillar.number}
                  className="rounded-[2rem] p-6 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-300/80 hover:border-zinc-400/80 transition-all duration-500 hover:-translate-y-2 shadow-sm flex flex-col justify-between group text-left"
                >
                  <div>
                    {/* Top Architectural Grey Box in place of image */}
                    <div className="relative aspect-[4/3] w-full rounded-[1.5rem] bg-zinc-200/80 group-hover:bg-zinc-300/80 border border-zinc-300/70 p-4 mb-5 flex flex-col justify-between transition-colors duration-500 overflow-hidden">
                      
                      <div className="flex items-center justify-between z-10">
                        <span className="font-mono text-xs tracking-widest px-3 py-1 font-semibold rounded-full border bg-white/90 text-[#2B0A0E] border-zinc-300/80 shadow-xs">
                          {pillar.number}
                        </span>
                        <span className="text-[9px] tracking-[0.2em] uppercase font-bold px-2.5 py-0.5 rounded-full border bg-white/70 text-zinc-600 border-zinc-300/60">
                          {pillar.tag}
                        </span>
                      </div>

                      {/* Center Icon/Emblem Watermark */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                        <IconComponent className="w-12 h-12 text-zinc-400/30 transition-transform duration-500 group-hover:scale-110" />
                      </div>

                      <div className="relative z-10">
                        <p className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-wider">
                          {pillar.subtitle}
                        </p>
                        <h3 className="font-serif text-lg font-bold text-zinc-950 group-hover:text-[#2B0A0E] transition-colors leading-tight">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>

                    {/* Pillar Description */}
                    <p className="text-xs sm:text-sm font-light text-zinc-600 leading-relaxed px-1">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-200/70 flex items-center justify-between text-[11px] font-semibold tracking-widest uppercase text-zinc-400 group-hover:text-[#2B0A0E] transition-colors">
                    <span>Atelier Pillar</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
