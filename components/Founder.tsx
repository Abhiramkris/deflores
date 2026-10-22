import Link from "next/link";
import Placeholder from "./Placeholder";

interface FounderProps {
  eyebrow?: string;
  name?: string;
  bio?: string;
  signature?: string;
  cta_text?: string;
  cta_link?: string;
  image?: string;
}

export default function Founder({
  eyebrow = "THE FOUNDER",
  name = "Anisree Sreeraj",
  bio = "A designer by instinct and a perfectionist by craft. Anisree founded De Flores to give every woman a wardrobe that feels like her own — designed, not selected. From bridal heirlooms to contemporary pret, each commission carries her signature: thoughtful silhouettes, refined colour, and embroidery that tells a story.",
  signature = "— Founder, De Flores Haute Couture",
  cta_text = "EXPLORE DE FLORES →",
  cta_link = "/explore",
  image = "",
}: FounderProps) {
  return (
    <section
      aria-labelledby="founder-heading"
      className="w-full py-12 sm:py-16 min-[900px]:py-24 border-t border-line"
    >
      <div className="max-w-[1280px] mx-auto px-6 min-[900px]:px-12">
        <div className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-12 min-[900px]:gap-16 items-center">
          <div className="flex flex-col items-start gap-6">
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey">
              {eyebrow}
            </span>

            <h2
              id="founder-heading"
              className="font-serif text-[clamp(32px,5vw,56px)] leading-tight text-ink font-normal"
            >
              {name}
            </h2>

            <p className="text-[15px] min-[900px]:text-[16px] leading-[1.7] text-grey max-w-[54ch]">
              {bio}
            </p>

            <span className="font-serif italic text-[14px] text-grey pt-1">
              {signature}
            </span>

            <div className="pt-2">
              <Link
                href={cta_link}
                className="bg-coral text-white hover:bg-ink text-[12px] uppercase tracking-[0.18em] font-medium px-8 py-3.5 transition-colors duration-200 inline-flex items-center gap-2 select-none"
              >
                {cta_text}
              </Link>
            </div>
          </div>

          <div className="hidden min-[900px]:block w-full">
            <Placeholder ratio="3/4" label="ANISREE SREERAJ" src={image} />
          </div>
        </div>
      </div>
    </section>
  );
}
