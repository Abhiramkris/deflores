import Placeholder from "./Placeholder";

interface InstagramGridProps {
  eyebrow?: string;
  headline?: string;
  profile_url?: string;
}

export default function InstagramGrid({
  eyebrow = "FOLLOW ALONG",
  headline = "@deflores.india",
  profile_url = "https://instagram.com/deflores.india",
}: InstagramGridProps) {
  const tiles = [
    { label: "ATELIER", id: "ig-1" },
    { label: "DRAPING", id: "ig-2" },
    { label: "DETAILS", id: "ig-3" },
    { label: "FITTING", id: "ig-4" },
    { label: "RUNWAY", id: "ig-5" },
    { label: "SILHOUETTE", id: "ig-6" },
  ];

  return (
    <section
      aria-labelledby="instagram-heading"
      className="w-full pt-12 sm:pt-16 min-[900px]:pt-24 pb-8 sm:pb-12 border-t border-line"
    >
      <div className="max-w-[1280px] mx-auto px-6 min-[900px]:px-12 flex flex-col items-center text-center gap-3 mb-8 sm:mb-12">
        <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-grey">
          {eyebrow}
        </span>
        <a
          id="instagram-heading"
          href={profile_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-serif text-[clamp(24px,3.5vw,36px)] font-normal text-ink hover:text-coral transition-colors duration-200"
        >
          {headline}
        </a>
      </div>

      <div className="w-full px-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 min-[900px]:grid-cols-6 gap-1">
          {tiles.map((tile) => (
            <a
              key={tile.id}
              href={profile_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${tile.label} on Instagram`}
              className="group block overflow-hidden bg-phBg transition-all duration-300 hover:brightness-110 select-none"
            >
              <Placeholder
                ratio="1/1"
                label={tile.label}
                className="w-full h-full transition-all duration-300 group-hover:brightness-110"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
