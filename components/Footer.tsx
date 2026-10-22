import Link from "next/link";

export default function Footer() {
  const quickLinks = [
    { label: "Shop", href: "/collections/all" },
    { label: "Appointments", href: "#bespoke" },
    { label: "Stores", href: "/contact" },
    { label: "About", href: "/about" },
  ];

  const legalLinks = [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
  ];

  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/de_flores_official" },
    { label: "Facebook", href: "https://www.facebook.com" },
    { label: "YouTube", href: "https://www.youtube.com" },
  ];

  return (
    <footer className="w-full bg-ink text-paper">
      <div className="max-w-[1280px] mx-auto px-6 min-[900px]:px-12 py-12 sm:py-16 min-[900px]:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 min-[900px]:grid-cols-4 gap-10 min-[900px]:gap-12">
          <div className="flex flex-col gap-4">
            <span className="text-[14px] tracking-[0.2em] font-serif uppercase text-paper">
              DE FLORES<span className="text-coral">.</span>
            </span>
            <p className="text-[14px] leading-relaxed text-paper/80 max-w-[32ch]">
              De Flores Haute Couture — custom craft, contemporary form.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-paper/50">
              Navigation
            </span>
            <div className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-paper/80 hover:text-coral transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-paper/50">
              Information
            </span>
            <div className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-paper/80 hover:text-coral transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-paper/50">
              Social
            </span>
            <div className="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-paper/80 hover:text-coral transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] tracking-[0.1em] text-paper/60 uppercase">
          <span>© 2026 De Flores Haute Couture</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
