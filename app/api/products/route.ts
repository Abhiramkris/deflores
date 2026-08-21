import { NextResponse } from "next/server";
import { sql } from "../../lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // 1. Fetch single product details
    if (id) {
      const product = await sql`
        SELECT id, title, price, description, colors, sizes, rating, review_count as review_count,
               review_author as review_author, review_quote as review_quote, review_rating as review_rating
        FROM products 
        WHERE id = ${id} AND deleted_at IS NULL
      `;

      if (product.length === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      const images = await sql`
        SELECT image_url as imageUrl, image_type as imageType 
        FROM product_images 
        WHERE product_id = ${id}
      `;

      // Map DB snake_case response to format expected by detail client template
      const item = product[0];
      
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

      const formattedProduct = {
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        colors: item.colors || [],
        sizes: item.sizes || [],
        rating: parseFloat(item.rating || "5.0"),
        reviewCount: reviews.length > 0 ? reviews.length : 1,
        images: showcaseImages.length > 0 ? showcaseImages : ["/crop_green.png"],
        lookbookImages: lookbookImages,
        reviews: reviews.length > 0 ? reviews.map((r: any) => ({
          id: r.id,
          author: r.author,
          date: new Date(r.createdAt || Date.now()).toLocaleDateString('en-GB'),
          rating: r.rating,
          quote: r.quote,
          images: showcaseImages.slice(0, 3)
        })) : [
          {
            author: item.review_author || "Alexander Stewart",
            date: "13/12/2024",
            rating: item.review_rating || 5,
            quote: item.review_quote || "Spectacular hand loom work. Stitched perfectly, fitting details are flawless.",
            images: showcaseImages.slice(0, 3)
          }
        ]
      };

      return NextResponse.json({ success: true, product: formattedProduct });
    }

    // 2. Fetch all catalog listings (for /explore catalog)
    const list = await sql`
      SELECT id, title, price, description, colors, sizes, rating, review_count
      FROM products
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    const listWithImages = [];
    for (const item of list) {
      const images = await sql`
        SELECT image_url FROM product_images WHERE product_id = ${item.id} LIMIT 1
      `;
      listWithImages.push({
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        images: [images[0]?.imageUrl || "/crop_green.png"]
      });
    }

    return NextResponse.json({ success: true, products: listWithImages });
  } catch (error: any) {
    console.error("Products Public API Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
