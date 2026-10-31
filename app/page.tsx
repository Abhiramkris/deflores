import { Metadata } from "next";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Story from "../components/Story";
import FeaturedRelease from "../components/FeaturedRelease";
import RampVideoOne from "../components/RampVideoOne";
import Collections from "../components/Collections";
import Founder from "../components/Founder";
import FeaturedGallery from "../components/FeaturedGallery";
import RampVideoTwo from "../components/RampVideoTwo";
import Testimonials from "../components/Testimonials";
import Journal from "../components/Journal";
import InstagramGrid from "../components/InstagramGrid";
import StoreLocator from "../components/StoreLocator";
import Bespoke from "../components/Bespoke";
import Footer from "../components/Footer";
import BackgroundPrefetch from "../components/BackgroundPrefetch";
import { getHomepageData } from "../lib/cms";
import { getCategories } from "../lib/categories";
import { sql } from "./lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomepageData();
  const seo = data.seo || {};

  const metaTitle = typeof seo.meta_title === "string" ? seo.meta_title : undefined;
  const metaDesc = typeof seo.meta_description === "string" ? seo.meta_description : undefined;
  const ogImg = typeof seo.og_image === "string" ? seo.og_image : undefined;
  const canonical = typeof seo.canonical_url === "string" ? seo.canonical_url : undefined;

  return {
    title: metaTitle || "De Flores Haute Couture | Luxury Bridal & Bespoke Occasion Wear",
    description: metaDesc || "Cochin atelier crafting bespoke bridal heirlooms, lehengas, gowns, and contemporary luxury pret attire.",
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      images: ogImg ? [{ url: ogImg }] : [],
    },
    alternates: {
      canonical: canonical || "https://deflores.com",
    },
  };
}

export default async function HomePage() {
  const [data, categories] = await Promise.all([
    getHomepageData(),
    getCategories(),
  ]);

  const hero = data.hero || {};
  const story = data.story || {};
  const founder = data.founder || {};
  const featured = data.featured_release || {};
  const gallery = data.featured_gallery || {};
  const patrons = data.patrons || {};
  const journal = data.journal || {};
  const instagram = data.instagram_grid || {};
  const showroom = data.store_locator || {};
  const bespoke = data.bespoke || {};
  const rampVideos = (data.ramp_videos as Record<string, any>) || {};
  const video1 = (rampVideos.video_1 as Record<string, any>) || {};
  const video2 = (rampVideos.video_2 as Record<string, any>) || {};

  let featuredProducts: Array<{ id: string; name: string; price: string; image?: string; href: string }> = [];
  let patronItems = undefined;

  try {
    const rawProducts = await sql`
      SELECT p.id, p.title, p.price, p.is_patron as "isPatron",
             p.patron_quote as "patronQuote", p.patron_author as "patronAuthor",
             (
               SELECT image_url 
               FROM product_images 
               WHERE product_id = p.id AND (image_type = 'showcase' OR image_type IS NULL) 
               ORDER BY id ASC 
               LIMIT 1
             ) as "imageUrl"
      FROM products p
      WHERE p.deleted_at IS NULL
      ORDER BY p.is_patron DESC, p.created_at DESC
      LIMIT 12
    `;

    if (rawProducts && rawProducts.length > 0) {
      const patronOnly = rawProducts.filter((p) => Boolean(p.isPatron));
      const chosen = patronOnly.length > 0 ? patronOnly : rawProducts;

      featuredProducts = chosen.map((p) => ({
        id: String(p.id),
        name: p.title,
        price: p.price || "Haute Couture",
        image: p.imageUrl || undefined,
        href: `/product/${p.id}`,
      }));

      if (patronOnly.length > 0) {
        patronItems = patronOnly.map((p) => ({
          id: String(p.id),
          productId: String(p.id),
          title: p.title,
          quote: p.patronQuote || "“The silhouette and craftsmanship fit like a second skin.”",
          author: p.patronAuthor || "Patron of De Flores",
          image: p.imageUrl || "/crop_green.png",
        }));
      }
    }
  } catch (err) {
    console.warn("Patron / featured products query:", err);
  }

  return (
    <>
      <Nav categories={categories} />
      <main>
        {hero.is_visible !== false && <Hero {...hero} />}
        {story.is_visible !== false && <Story {...story} />}
        {featured.is_visible !== false && <FeaturedRelease {...featured} items={featuredProducts} />}
        <RampVideoOne {...video1} />
        <Collections categories={categories} />
        {founder.is_visible !== false && <Founder {...founder} />}
        {gallery.is_visible !== false && <FeaturedGallery {...gallery} />}
        <RampVideoTwo {...video2} />
        {patrons.is_visible !== false && (
          <Testimonials
            eyebrow={typeof patrons.eyebrow === "string" ? patrons.eyebrow : undefined}
            title={typeof patrons.title === "string" ? patrons.title : undefined}
            items={patronItems}
          />
        )}
        {journal.is_visible !== false && <Journal {...journal} />}
        {instagram.is_visible !== false && <InstagramGrid {...instagram} />}
        {showroom.is_visible !== false && <StoreLocator {...showroom} />}
        {bespoke.is_visible !== false && <Bespoke {...bespoke} />}
      </main>
      <Footer />
      <BackgroundPrefetch />
    </>
  );
}
