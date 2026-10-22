interface BespokeProps {
  eyebrow?: string;
  headline?: string;
  description?: string;
  cta_text?: string;
  note?: string;
}

export default function Bespoke({
  eyebrow = "BESPOKE",
  headline = "Made to your measure.",
  description = "Every De Flores commission begins with a conversation. Choose your silhouette, fabric, and finish — we tailor the rest.",
  cta_text = "BOOK A CONSULTATION",
  note = "Consultations available in-studio and virtually.",
}: BespokeProps) {
  return (
    <section
      id="bespoke"
      aria-labelledby="bespoke-heading"
      className="w-full py-12 sm:py-16 min-[900px]:py-24 border-t border-line"
    >
      <div className="max-w-[1280px] mx-auto px-6 min-[900px]:px-12 flex justify-center">
        <div className="max-w-[52ch] text-center flex flex-col items-center gap-6">
          <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey">
            {eyebrow}
          </span>

          <h2
            id="bespoke-heading"
            className="text-[clamp(28px,4vw,48px)] font-serif font-normal text-ink leading-tight"
          >
            {headline}
          </h2>

          <p className="text-[15px] min-[900px]:text-[16px] leading-[1.7] text-ink">
            {description}
          </p>

          <div className="pt-2">
            <button
              type="button"
              className="bg-ink text-white hover:bg-coral text-[14px] uppercase tracking-[0.18em] font-medium px-8 py-4 transition-colors duration-200"
            >
              {cta_text}
            </button>
          </div>

          <div className="w-full border-t border-line mt-4 pt-6">
            <p className="text-[14px] text-grey">
              {note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
