import { NextResponse } from "next/server";
import { sql } from "../../lib/db";
import defaultProducts from "../../data/products.json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const product = await sql`
        SELECT id, title, price, description, category, subcategory, badge, gender, occasion, fabric, craft,
               is_patron as is_patron, patron_quote as patron_quote, patron_author as patron_author,
               details, colors, sizes, rating, review_count as review_count,
               review_author as review_author, review_quote as review_quote, review_rating as review_rating
        FROM products 
        WHERE id = ${id} AND deleted_at IS NULL
      `;

      let item = product[0];
      if (!item) {
        const fallback = (defaultProducts as any[]).find((p: any) => p.id === id);
        if (!fallback) {
          return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        item = fallback;
      }

      const images = await sql`
        SELECT image_url as imageUrl, image_type as imageType 
        FROM product_images 
        WHERE product_id = ${id}
        ORDER BY id ASC
      `;

      const showcaseImages = images
        .filter((img: any) => img.imageType === "showcase" || !img.imageType)
        .map((img: any) => img.imageUrl);

      const lookbookImages = images
        .filter((img: any) => img.imageType === "lookbook")
        .map((img: any) => img.imageUrl);

      const reviews = await sql`
        SELECT id, author, rating, quote, created_at as createdAt
        FROM product_reviews
        WHERE product_id = ${id}
        ORDER BY created_at DESC
      `;

      const fallbackShowcase = (item.images && Array.isArray(item.images) && item.images.length > 0)
        ? item.images
        : ["/crop_green.png"];

      const primaryImg = showcaseImages[0] || fallbackShowcase[0] || "/crop_green.png";
      const fourImages = [
        showcaseImages[0] || fallbackShowcase[0] || primaryImg,
        showcaseImages[1] || fallbackShowcase[1] || primaryImg,
        showcaseImages[2] || fallbackShowcase[2] || primaryImg,
        showcaseImages[3] || fallbackShowcase[3] || primaryImg,
      ];

      const parsedOccasion = Array.isArray(item.occasion)
        ? item.occasion
        : typeof item.occasion === "string"
        ? (() => {
            try {
              const parsed = JSON.parse(item.occasion);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          })()
        : [];

      const formattedProduct = {
        id: item.id,
        title: item.title,
        price: item.price || "Haute Couture",
        category: item.category || "Bespoke",
        subcategory: item.subcategory || "",
        badge: item.badge || item.category || "Bespoke",
        gender: item.gender || "Women",
        occasion: parsedOccasion,
        fabric: item.fabric || "",
        craft: item.craft || "",
        isPatron: Boolean(item.is_patron ?? item.isPatron),
        patronQuote: item.patron_quote || item.patronQuote || "",
        patronAuthor: item.patron_author || item.patronAuthor || "",
        description: item.description || "",
        details: item.details || {},
        colors: item.colors || [],
        sizes: item.sizes && item.sizes.length > 0 ? item.sizes : ["XS", "S", "M", "L", "XL", "Custom"],
        rating: parseFloat(item.rating || "5.0"),
        reviewCount: reviews.length > 0 ? reviews.length : (item.reviewCount || item.review_count || 1),
        images: fourImages,
        lookbookImages: lookbookImages.length > 0 ? lookbookImages : (item.lookbookImages || [fourImages[2], fourImages[3]]),
        shipping: (item.details && item.details.shipping) || item.shipping || {
          discount: "Complimentary Delivery",
          package: "Atelier Silk Protective Packaging",
          deliveryTime: "5-7 Working Days",
          estimationArrive: "Made to Measure & Dispatched"
        },
        reviews: reviews.length > 0 ? reviews.map((r: any) => ({
          id: r.id,
          author: r.author,
          date: new Date(r.createdAt || Date.now()).toLocaleDateString("en-GB"),
          rating: r.rating,
          quote: r.quote,
          images: fourImages.slice(0, 3)
        })) : [
          {
            author: item.review_author || item.reviewAuthor || "Alexander Stewart",
            date: "13/12/2024",
            rating: item.review_rating || item.reviewRating || 5,
            quote: item.review_quote || item.reviewQuote || "Spectacular hand loom work. Stitched perfectly, fitting details are flawless.",
            images: fourImages.slice(0, 3)
          }
        ]
      };

      return NextResponse.json({ success: true, product: formattedProduct });
    }

    const genderParam = searchParams.get("gender");
    const categoryParam = searchParams.get("category");
    const occasionParam = searchParams.get("occasion");
    const fabricParam = searchParams.get("fabric");
    const searchParam = searchParams.get("search");
    const patronOnly = searchParams.get("patron") === "true";

    const list = await sql`
      SELECT id, title, price, category, subcategory, badge, gender, occasion, fabric, craft,
             is_patron as is_patron, patron_quote as patron_quote, patron_author as patron_author,
             description, colors, sizes, rating, review_count
      FROM products
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    const activeList: any[] = list.length > 0 ? list : (defaultProducts as any[]);

    const listWithImages = [];
    for (const item of activeList) {
      const images = await sql`
        SELECT image_url as imageUrl FROM product_images WHERE product_id = ${item.id} AND (image_type = 'showcase' OR image_type IS NULL) ORDER BY id ASC LIMIT 4
      `;
      const fallbackImgs = item.images || ["/crop_green.png"];
      const dbImgs = images.map((img: any) => img.imageUrl);
      const primary = dbImgs[0] || fallbackImgs[0] || "/crop_green.png";

      const parsedOccasion = Array.isArray(item.occasion)
        ? item.occasion
        : typeof item.occasion === "string"
        ? (() => {
            try {
              const parsed = JSON.parse(item.occasion);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          })()
        : [];

      listWithImages.push({
        id: item.id,
        title: item.title,
        price: item.price || "Haute Couture",
        category: item.category || "Bespoke",
        subcategory: item.subcategory || "",
        badge: item.badge || item.category || "Bespoke",
        gender: item.gender || "Women",
        occasion: parsedOccasion,
        fabric: item.fabric || "",
        craft: item.craft || "",
        isPatron: Boolean(item.is_patron ?? item.isPatron),
        patronQuote: item.patron_quote || item.patronQuote || "",
        patronAuthor: item.patron_author || item.patronAuthor || "",
        description: item.description,
        images: dbImgs.length > 0 ? dbImgs : fallbackImgs,
        thumbnail: primary
      });
    }

    let filtered = listWithImages;

    if (patronOnly) {
      filtered = filtered.filter((p) => p.isPatron);
    }

    if (genderParam && genderParam.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (p) => (p.gender || "").toLowerCase() === genderParam.toLowerCase()
      );
    }

    if (categoryParam && categoryParam.toLowerCase() !== "all") {
      const target = categoryParam.toLowerCase();
      filtered = filtered.filter((p) => {
        const c = (p.category || "").toLowerCase();
        const s = (p.subcategory || "").toLowerCase();
        return c === target || c.includes(target) || s.includes(target);
      });
    }

    if (occasionParam && occasionParam.toLowerCase() !== "all") {
      const target = occasionParam.toLowerCase();
      filtered = filtered.filter(
        (p) => Array.isArray(p.occasion) && p.occasion.some((occ: string) => occ.toLowerCase() === target)
      );
    }

    if (fabricParam && fabricParam.toLowerCase() !== "all") {
      const target = fabricParam.toLowerCase();
      filtered = filtered.filter((p) => (p.fabric || "").toLowerCase().includes(target));
    }

    if (searchParam) {
      const q = searchParam.toLowerCase();
      filtered = filtered.filter((p) =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.fabric || "").toLowerCase().includes(q) ||
        (p.craft || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, products: filtered });
  } catch (error: any) {
    console.error("Products Public API Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
