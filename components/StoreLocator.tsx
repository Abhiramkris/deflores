import Link from "next/link";
import Placeholder from "./Placeholder";

interface StoreLocatorProps {
  eyebrow?: string;
  headline?: string;
  address?: string;
  hours?: string;
  directions_text?: string;
  directions_url?: string;
  cta_button_text?: string;
  cta_button_link?: string;
  map_image?: string;
}

export default function StoreLocator({
  eyebrow = "THE SHOWROOM",
  headline = "Visit the Atelier.",
  address = "Near Cochin International Airport, Kerala.",
  hours = "Mon – Sat · 10:00 AM – 7:00 PM (By Appointment Only)",
  directions_text = "GET DIRECTIONS →",
  directions_url = "https://maps.google.com/?q=Cochin+International+Airport+Kerala",
  cta_button_text = "BOOK APPOINTMENT",
  cta_button_link = "/#bespoke",
  map_image = "",
}: StoreLocatorProps) {
  return (
    <section
      aria-labelledby="showroom-heading"
      className="w-full py-12 sm:py-16 min-[900px]:py-24 border-t border-line"
    >
      <div className="max-w-[1280px] mx-auto px-6 min-[900px]:px-12">
        <div className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-8 sm:gap-12 min-[900px]:gap-16 items-center">
          <div className="w-full bg-phBg border border-line overflow-hidden">
            <Placeholder ratio="1/1" label="MAP" src={map_image} />
          </div>

          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey">
                {eyebrow}
              </span>
              <h2
                id="showroom-heading"
                className="font-serif text-[clamp(28px,4vw,44px)] font-normal text-ink leading-tight"
              >
                {headline}
              </h2>
            </div>

            <div className="flex flex-col gap-5 border-y border-line py-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-grey">
                  ADDRESS
                </span>
                <p className="text-[15px] sm:text-[16px] text-ink leading-relaxed">
                  {address}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-grey">
                  HOURS
                </span>
                <p className="text-[14px] sm:text-[15px] text-ink leading-relaxed">
                  {hours}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-1">
              <Link
                href={cta_button_link}
                className="bg-coral text-white hover:bg-ink text-[12px] uppercase tracking-[0.18em] font-medium px-8 py-3.5 transition-colors duration-200 select-none text-center"
              >
                {cta_button_text}
              </Link>
              <a
                href={directions_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] uppercase tracking-[0.18em] font-medium text-ink hover:text-coral transition-colors duration-200 inline-flex items-center gap-1.5"
              >
                {directions_text}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
