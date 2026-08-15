import Image from "next/image";
import Link from "next/link";

export default function FounderPage() {
  return (
    <div className="w-full bg-white/70 backdrop-blur-xs text-zinc-900 font-sans py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Breadcrumb */}
        <div className="mb-12 flex items-center gap-2 text-[10px] md:text-xs font-semibold tracking-widest uppercase text-zinc-400">
          <Link href="/" className="hover:text-zinc-950 transition-colors">Home</Link>
          <span>•</span>
          <span className="text-zinc-900">Founder</span>
        </div>

        {/* Founder Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
          
          {/* Left Column - Founder Image Frame */}
          <div className="lg:col-span-5 relative aspect-[3/4.5] w-full bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200/50 shadow-md">
            <Image
              src="/crop_white.png"
              alt="Anisree Sreeraj - Founder of de flores"
              fill
              className="object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 border border-zinc-200/40 rounded-lg text-left">
              <h2 className="font-serif text-lg font-bold text-zinc-950">Anisree Sreeraj</h2>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mt-1">Founder & Creative Head</p>
            </div>
          </div>

          {/* Right Column - Biography / Creative Statement */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-4">
              <span className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400 block">
                The Creative Visionary
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight text-zinc-950">
                Crafting Class,<br />Inspiring Royalty
              </h1>
              <div className="w-16 h-[1.5px] bg-zinc-300" />
            </div>

            <div className="space-y-6 text-xs md:text-sm text-zinc-600 leading-relaxed font-light tracking-wide">
              <p>
                Anisree Sreeraj is the founder and creative head of ‘de flores’ haute couture. An IT professional turned fashion designer took a plunge into the fashion entrepreneurship world, marking a significant presence in the world of fashion and customised dressmaking. After she quit her IT job, she debuted her career in the fashion industry with an eminent brand and dived into the formidable world of fashion by designing ensembles for various events and occasions.
              </p>
              <p>
                Later, she forayed into designing bespoke, customised bridal outfits and wedding attires. Her unstinted love and flair for fashion design, along with the wholehearted support of her family and friends, gave birth to the brand ‘de flores’.
              </p>
              <p>
                For Anisree, designing is no less than an art, and she really enjoys making exquisite apparel out of any fabric. Anisree’s unique designs, watchful eyes for trends, and keen attention to detail are the driving force behind her competent craftsmanship. She has become a known name for blending unique elegance and style into her designs, especially in creating bridal outfits that are in vogue today.
              </p>
              <p>
                Anisree, the fashion lover and designer, exhibits designs that are an eclectic mix of customised fashion wear as well. Her couture speaks of royalty and class. She visions to rank ‘de flores’ as a fashion brand for women who want to experience a unique aesthetic in fashion, style and dressmaking.
              </p>
            </div>

            {/* Social connection link */}
            <div className="pt-6 border-t border-zinc-100 flex items-center gap-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">Connect</span>
              <a 
                href="https://www.instagram.com/anisree.sreeraj" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-semibold uppercase tracking-widest text-zinc-950 underline hover:opacity-60 transition-opacity"
              >
                @anisree.sreeraj
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
