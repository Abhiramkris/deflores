"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, MessageCircle, ChevronLeft, ShieldCheck, Scissors } from "lucide-react";

export default function ComingSoonPage() {
  const whatsappUrl = `https://wa.me/918848200541?text=${encodeURIComponent(
    "Hello De flores Atelier, I would like to inquire about early bespoke bookings and preview access for the upcoming Kids Wear collection."
  )}`;

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] text-[#111111] font-sans pt-28 sm:pt-36 pb-24 selection:bg-[#C5A059] selection:text-[#2B0A0E]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        
        {/* Top Breadcrumb */}
        <div className="mb-8 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-zinc-500">
          <Link href="/" className="hover:text-zinc-950 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#C5A059] font-bold">Collections</span>
          <span>/</span>
          <span className="text-zinc-900 font-bold">Kids Wear</span>
        </div>

        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5EB] border border-[#DFBE82]/60 text-[#8F6B2A] text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase mb-6 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A059]" />
          </span>
          <span>Atelier Preview · Coming Soon 2026</span>
        </div>

        {/* Main Editorial Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-zinc-950 tracking-tight leading-[1.1] mb-4">
          Couture Petite
          <span className="block font-serif italic font-bold text-3xl sm:text-4xl md:text-5xl text-[#2B0A0E] mt-2">
            Kids Wear & Ceremonial Attire
          </span>
        </h1>

        {/* Editorial Narrative */}
        <p className="text-sm sm:text-base font-normal text-zinc-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Our master artisans are weaving miniature silhouettes, bespoke kid lehengas, tiny sherwanis, and handcrafted ceremonial occasion wear with the exact same heirloom craftsmanship and pure mulberry silks as our signature bridal atelier.
        </p>

        {/* 3 Craft Pillars for Children's Couture */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 text-left">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#FAF5EB] border border-[#DFBE82]/50 flex items-center justify-center text-[#8F6B2A] mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-base font-bold text-zinc-900 mb-1">Gentle Muslin Linings</h2>
            <p className="text-xs text-zinc-600 leading-relaxed font-light">
              100% hypoallergenic organic cotton inner toiles crafted specifically for delicate young skin.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#FAF5EB] border border-[#DFBE82]/50 flex items-center justify-center text-[#8F6B2A] mb-3">
              <Scissors className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-base font-bold text-zinc-900 mb-1">Growth Seam Architecture</h2>
            <p className="text-xs text-zinc-600 leading-relaxed font-light">
              Generous internal seam margins to let each cherished heirloom gown adapt as your child grows.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#FAF5EB] border border-[#DFBE82]/50 flex items-center justify-center text-[#8F6B2A] mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-base font-bold text-zinc-900 mb-1">Artisanal Zardozi Details</h2>
            <p className="text-xs text-zinc-600 leading-relaxed font-light">
              Lightweight micro-cutdana and thread work balanced to offer regal luxury without garment weight.
            </p>
          </div>
        </div>

        {/* Early Access Action Bar */}
        <div className="bg-gradient-to-r from-[#FAF5EB] via-white to-[#FAF5EB] p-6 sm:p-8 rounded-3xl border border-[#DFBE82]/70 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8F6B2A] block">
              Bespoke Early Access
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950">
              Need custom kids wear before the official launch?
            </h2>
            <p className="text-xs text-zinc-600 font-light">
              Our master atelier is accepting early custom orders for weddings and festive milestones.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative shrink-0 inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#2B0A0E] hover:bg-[#3D0E14] text-[#FDFBF7] border border-[#C5A059] shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-[#C5A059]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap">
              Inquire via WhatsApp
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Back Link to Collection */}
        <div className="mt-12 flex items-center justify-center gap-6 text-xs uppercase tracking-[0.2em] font-semibold">
          <Link
            href="/explore"
            className="text-zinc-600 hover:text-[#2B0A0E] transition-colors inline-flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Explore Bridal Couture</span>
          </Link>
          <span className="text-zinc-300">•</span>
          <Link
            href="/"
            className="text-zinc-600 hover:text-[#2B0A0E] transition-colors"
          >
            Back to Atelier Home
          </Link>
        </div>

      </div>
    </div>
  );
}
