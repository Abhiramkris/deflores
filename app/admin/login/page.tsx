"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setSuccess(true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white/70 backdrop-blur-xs flex items-center justify-center py-24 px-6">
      <div className="w-full max-w-md bg-white border border-zinc-200 p-8 md:p-12 shadow-2xl relative text-center">
        
        {/* Close Button back to home */}
        <Link 
          href="/" 
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-950 transition-colors"
          aria-label="Back to home"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        {/* Heading */}
        <div className="space-y-3 mb-8">
          <span className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400 block">
            System Access
          </span>
          <h1 className="font-serif text-3xl font-light tracking-wide text-zinc-950">
            Admin Login
          </h1>
          <div className="w-12 h-[1px] bg-zinc-300 mx-auto" />
        </div>

        {/* Form fields (Email and Password only) */}
        {success ? (
          <div className="py-8 space-y-4 text-center">
            <div className="text-emerald-600 font-semibold text-xs tracking-wider animate-pulse uppercase">
              Access Approved. Entering Workspace...
            </div>
            <Link href="/" className="inline-block text-[10px] font-bold tracking-widest uppercase text-zinc-400 hover:text-zinc-950 transition-colors underline pt-4">
              Return to storefront
            </Link>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6 text-left">
            
            {/* Email field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@deflores.com"
                className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
              />
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-zinc-800 transition-colors pt-4"
            >
              Sign In
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
