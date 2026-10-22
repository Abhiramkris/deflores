import Placeholder from "./Placeholder";
import StoryWordCarousel from "./StoryWordCarousel";

interface StoryProps {
  title?: string;
  connector?: string;
  word_1?: string;
  word_2?: string;
  word_3?: string;
  word_4?: string;
  word1?: string;
  word2?: string;
  word3?: string;
  word4?: string;
  location_tag?: string;
  locationTag?: string;
  description?: string;
  image?: string;
}

export default function Story(props: StoryProps) {
  const title = props.title || "THE DE FLORES STORY";
  const connector = props.connector || "for";
  const word_1 = props.word_1 || props.word1 || "EVERY WOMAN";
  const word_2 = props.word_2 || props.word2 || "EVERY MAN";
  const word_3 = props.word_3 || props.word3 || "EVERY COUPLE";
  const word_4 = props.word_4 || props.word4 || "EVERY ACHIEVER";
  const location_tag = props.location_tag || props.locationTag || "COCHIN · EST. 2025";
  const description =
    props.description ||
    "De Flores stemmed from a young fashion designer's passion for crafting unique and novel style statements — to create a distinction. Translating to 'flowers' in Spanish, the name symbolises elegance, chastity, and loveliness in every attire we design. With a profusion of colours, high-calibre fabric, and aesthetic appeal, De Flores is a one-stop designer boutique for every woman who wants to flaunt an enchanting style.";
  const image = props.image || "";

  const words = [word_1, word_2, word_3, word_4].filter(Boolean);

  return (
    <section
      aria-labelledby="story-heading"
      className="w-full py-12 sm:py-16 min-[900px]:py-24 border-t border-line"
    >
      <div className="max-w-[1280px] mx-auto px-6 min-[900px]:px-12">
        <div className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-8 min-[900px]:gap-16 items-center">
          <div className="w-full order-2 min-[900px]:order-1">
            <Placeholder ratio="4/5" label="ATELIER STORY" src={image} />
          </div>

          <div className="story-column flex flex-col items-start gap-8 order-1 min-[900px]:order-2">
            <div className="w-full">
              <h2 id="story-heading" className="static-title text-ink">
                {title}
              </h2>
              <span aria-hidden="true" className="italic-for text-grey">
                {connector}
              </span>
              <StoryWordCarousel words={words} />
              <span className="location-tag font-sans text-[11px] uppercase tracking-[0.18em] font-medium text-grey pt-3 block">
                {location_tag}
              </span>
            </div>

            <p className="body-text text-[15px] min-[900px]:text-[16px] leading-[1.7] text-grey max-w-[58ch]">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
