import { NextResponse } from "next/server";
import { sql } from "../../lib/db";
import defaultProducts from "../../data/products.json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const product = await sql`
        SELECT id, title, price, description, category, subcategory, badge, details, colors, sizes, rating, review_count as review_count,
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

      const formattedProduct = {
        id: item.id,
        title: item.title,
        price: item.price || "Haute Couture",
        category: item.category || "Bespoke",
        subcategory: item.subcategory || "",
        badge: item.badge || item.category || "Bespoke",
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

    const list = await sql`
      SELECT id, title, price, category, subcategory, badge, description, colors, sizes, rating, review_count
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
      listWithImages.push({
        id: item.id,
        title: item.title,
        price: item.price || "Haute Couture",
        category: item.category || "Bespoke",
        subcategory: item.subcategory || "",
        badge: item.badge || item.category || "Bespoke",
        description: item.description,
        images: dbImgs.length > 0 ? dbImgs : fallbackImgs,
        thumbnail: primary
      });
    }

    return NextResponse.json({ success: true, products: listWithImages });
  } catch (error: any) {
    console.error("Products Public API Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
