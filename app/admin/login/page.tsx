"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep("otp");
      } else {
        setErrorMsg(data.error || "Failed to request verification code.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", email, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500);
      } else {
        setErrorMsg(data.error || "Invalid verification code.");
      }
    } catch (err) {
      setErrorMsg("Verification failed. Please try again.");
    } finally {
      setLoading(false);
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
            Admin Portal
          </h1>
          <div className="w-12 h-[1px] bg-zinc-300 mx-auto" />
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-xs font-semibold tracking-wider rounded-md">
            {errorMsg}
          </div>
        )}

        {success ? (
          <div className="py-8 space-y-4 text-center">
            <div className="text-emerald-600 font-semibold text-xs tracking-wider animate-pulse uppercase">
              Access Approved. Entering Workspace...
            </div>
          </div>
        ) : step === "email" ? (
          /* Step 1: Input Email */
          <form onSubmit={handleRequestOtp} className="space-y-6 text-left">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Requesting Code..." : "Request Login OTP"}
            </button>
          </form>
        ) : (
          /* Step 2: Input OTP */
          <form onSubmit={handleVerifyOtp} className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                Enter Verification OTP
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent font-mono text-center text-lg"
              />
              <p className="text-[10px] text-zinc-400 text-center pt-1 font-light">
                A verification code was requested for {email}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>

            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-center text-[9px] font-bold tracking-widest uppercase text-zinc-400 hover:text-zinc-950 transition-colors pt-2"
            >
              Change Email
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
