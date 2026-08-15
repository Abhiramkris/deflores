"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const mapAddressQuery = "de flores Haute Couture, AVRA 38, AVRA line, Near Airport Road, Athani, Cochin Pin 683585";
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapAddressQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="w-full bg-white/70 backdrop-blur-xs text-zinc-900 font-sans py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Breadcrumb */}
        <div className="mb-12 flex items-center gap-2 text-[10px] md:text-xs font-semibold tracking-widest uppercase text-zinc-400">
          <Link href="/" className="hover:text-zinc-950 transition-colors">Home</Link>
          <span>•</span>
          <span className="text-zinc-900">Contact</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
          
          {/* Left Column: Address, Phones, and Contact Form */}
          <div className="lg:col-span-5 space-y-10 text-left">
            
            {/* Header info */}
            <div className="space-y-4">
              <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 block">
                02 / Location
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight text-zinc-950">
                Connect With Us
              </h1>
              <div className="w-16 h-[1px] bg-zinc-300" />
            </div>

            {/* Address */}
            <div className="space-y-3">
              <h3 className="font-serif text-sm font-semibold tracking-wider text-zinc-950 uppercase">
                Atelier Location
              </h3>
              <p className="text-xs md:text-sm text-zinc-600 leading-relaxed font-light tracking-wide max-w-sm">
                de flores Haute Couture,<br />
                AVRA 38, AVRA line,<br />
                Near Airport Road, Athani,<br />
                Cochin, Kerala, Pin 683585
              </p>
            </div>

            {/* Phone numbers */}
            <div className="space-y-3">
              <h3 className="font-serif text-sm font-semibold tracking-wider text-zinc-950 uppercase">
                Inquiries & Appointments
              </h3>
              <div className="flex flex-col gap-1 text-xs md:text-sm text-zinc-600 font-semibold tracking-wider">
                <a href="tel:+918848200541" className="hover:text-zinc-950 transition-colors">+91 8848 200 541</a>
                <a href="tel:+918714274890" className="hover:text-zinc-950 transition-colors">+91 8714 274 890</a>
              </div>
            </div>

            {/* Business hours */}
            <div className="space-y-2 text-left">
              <h3 className="font-serif text-sm font-semibold tracking-wider text-zinc-950 uppercase">Atelier Hours</h3>
              <p className="text-[11px] font-medium text-zinc-400 tracking-wider">MONDAY - SATURDAY: 10:00 AM - 7:00 PM</p>
            </div>

            {/* Contact Form */}
            <div className="border-t border-zinc-200/50 pt-8 space-y-6">
              <h3 className="font-serif text-sm font-semibold tracking-wider text-zinc-950 uppercase">Send a Message</h3>
              
              {submitted ? (
                <div className="p-4 bg-zinc-950 text-white text-xs font-semibold tracking-widest uppercase text-center animate-pulse">
                  THANK YOU! WE WILL GET BACK TO YOU SHORLTLY.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="YOUR NAME"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                    />
                    <input
                      type="email"
                      required
                      placeholder="YOUR EMAIL"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                    />
                  </div>
                  <textarea
                    required
                    rows={4}
                    placeholder="YOUR MESSAGE"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-zinc-800 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Right Column: Google Maps Embed Card */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Map wrapper frame */}
            <div className="w-full aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200 shadow-lg bg-zinc-50 relative">
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="de flores Haute Couture Map Location"
              />
            </div>

            {/* Quick directions text */}
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest text-left font-semibold">
              * Located near Airport Road, Athani. Valet parking available on premise.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}
