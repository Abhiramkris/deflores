"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface GalleryImage {
  id: number;
  imageUrl: string;
  description: string;
  aspectRatio: number;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (data.success) {
          setImages(data.images);
        }
      } catch (err) {
        console.error("Error loading gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="w-full min-h-screen bg-white/70 backdrop-blur-xs text-zinc-900 font-sans py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Breadcrumb */}
        <div className="mb-12 flex items-center gap-2 text-[10px] md:text-xs font-semibold tracking-widest uppercase text-zinc-400">
          <Link href="/" className="hover:text-zinc-950 transition-colors">Home</Link>
          <span>•</span>
          <span className="text-zinc-900">Gallery</span>
        </div>

        {/* Heading */}
        <div className="text-left space-y-4 mb-16">
          <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 block">
            04 / Editorial
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-zinc-950">
            Atelier Gallery
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm font-light max-w-lg leading-relaxed tracking-wide mt-2">
            A fluid, dynamic lookbook of bespoke gown fittings, textile drapes, and backstage editorial captures. Sorted by uploaded date.
          </p>
          <div className="w-16 h-[1px] bg-zinc-300" />
        </div>

        {loading ? (
          <div className="text-center font-serif text-lg py-24">Syncing gallery lookbook...</div>
        ) : (
          /* Pinterest-style Masonry Column Layout */
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((item) => (
              <div 
                key={item.id} 
                className="break-inside-avoid relative w-full overflow-hidden rounded-xl border border-zinc-200/40 bg-zinc-100 group shadow-xs hover:shadow-md transition-all p-1"
              >
                <div 
                  className="relative w-full overflow-hidden rounded-lg"
                  style={{ aspectRatio: item.aspectRatio || 0.667 }}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.description || "Gallery Photo"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-95"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="text-[10px] tracking-widest uppercase text-white font-bold">
                      {item.description || "HAUTE COUTURE"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
