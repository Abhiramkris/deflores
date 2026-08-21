import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

// Helper function to compress and upload a single file buffer
async function processAndUploadFile(file: File, type: string, index: number): Promise<{ url: string; filename: string; aspect: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Compute aspect ratio
  const metadata = await sharp(buffer).metadata();
  const width = metadata.width || 1000;
  const height = metadata.height || 1500;
  const aspect = parseFloat((width / height).toFixed(3));

  // Convert to WebP
  const webpBuffer = await sharp(buffer)
    .webp({ quality: 80 })
    .toBuffer();

  const filename = `${type}_${Date.now()}_${index}.webp`;
  let fileUrl = "";

  if (supabase) {
    const { error } = await supabase.storage
      .from("deflores-bucket")
      .upload(filename, webpBuffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase Storage Upload Error: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("deflores-bucket")
      .getPublicUrl(filename);
    fileUrl = publicUrlData.publicUrl;
  } else {
    // Local fallback
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, webpBuffer);
    fileUrl = `/uploads/${filename}`;
  }

  return { url: fileUrl, filename, aspect };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const type = formData.get("type") as string; // 'product' or 'gallery'
    const email = (formData.get("email") as string) || "admin@deflores.com";

    // ----------------------------------------------------
    // Action A: Upload to editorial Gallery Lookbook
    // ----------------------------------------------------
    if (type === "gallery") {
      const file = formData.get("file") as File;
      const description = (formData.get("description") as string) || "";

      if (!file) {
        return NextResponse.json({ error: "No image file provided" }, { status: 400 });
      }

      const uploadResult = await processAndUploadFile(file, "gallery", 0);

      await sql`
        INSERT INTO gallery_images (image_url, description, filename, aspect_ratio)
        VALUES (${uploadResult.url}, ${description}, ${uploadResult.filename}, ${uploadResult.aspect})
      `;

      await sql`
        INSERT INTO action_logs (actor_email, action_type, description)
        VALUES (${email}, 'UPLOAD_GALLERY', ${`Uploaded and optimized gallery image: ${uploadResult.filename}`})
      `;

      return NextResponse.json({ success: true, url: uploadResult.url });
    }

    // ----------------------------------------------------
    // Action B: Upload Product Item (4 photos required)
    // ----------------------------------------------------
    if (type === "product") {
      const pId = formData.get("id") as string;
      const title = formData.get("title") as string;
      const description = (formData.get("description") as string) || "";
      const colors = (formData.get("colors") as string) || "[]";
      
      const reviewAuthor = formData.get("reviewAuthor") as string;
      const reviewRating = parseInt(formData.get("reviewRating") as string) || 5;
      const reviewQuote = formData.get("reviewQuote") as string;

      if (!pId || !title) {
        return NextResponse.json({ error: "Missing product fields (id, title)" }, { status: 400 });
      }

      // Check if all 4 files are selected
      const files: File[] = [];
      for (let i = 0; i < 4; i++) {
        const file = formData.get(`file_${i}`) as File;
        if (!file) {
          return NextResponse.json({ error: `Showcase photo ${i + 1} is missing. Exactly 4 images are required.` }, { status: 400 });
        }
        files.push(file);
      }

      // Upload all 4 images
      const uploadUrls: string[] = [];
      for (let i = 0; i < 4; i++) {
        const res = await processAndUploadFile(files[i], "product", i);
        uploadUrls.push(res.url);
      }

      // Parse colors list safely
      let colorsJson = [];
      try {
        colorsJson = JSON.parse(colors);
      } catch (err) {
        colorsJson = colors.split(",").map(c => ({ name: c.trim(), hex: "#ffffff" }));
      }

      // Upsert product configuration (using blank price and sizes lists to satisfy SQL schema checks)
      await sql`
        INSERT INTO products (id, title, price, description, colors, sizes, review_author, review_quote, review_rating)
        VALUES (${pId}, ${title}, '', ${description}, ${JSON.stringify(colorsJson)}, '[]'::jsonb, ${reviewAuthor}, ${reviewQuote}, ${reviewRating})
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          colors = EXCLUDED.colors,
          review_author = EXCLUDED.review_author,
          review_quote = EXCLUDED.review_quote,
          review_rating = EXCLUDED.review_rating
      `;

      // Insert customer review to product_reviews table if provided
      if (reviewAuthor && reviewQuote) {
        await sql`
          INSERT INTO product_reviews (product_id, author, rating, quote)
          VALUES (${pId}, ${reviewAuthor}, ${reviewRating}, ${reviewQuote})
        `;
      }

      // Retrieve extra lookbook files
      const extraFilesCount = parseInt(formData.get("extraFilesCount") as string) || 0;
      const extraUrls: string[] = [];
      for (let i = 0; i < extraFilesCount; i++) {
        const extraFile = formData.get(`extra_file_${i}`) as File;
        if (extraFile) {
          const res = await processAndUploadFile(extraFile, "product_lookbook", i);
          extraUrls.push(res.url);
        }
      }

      // Clear previous mapped product images and insert the new ones
      await sql`
        DELETE FROM product_images WHERE product_id = ${pId}
      `;

      // 1. Insert 4 main showcase images (image_type = 'showcase')
      for (const url of uploadUrls) {
        await sql`
          INSERT INTO product_images (product_id, image_url, image_type)
          VALUES (${pId}, ${url}, 'showcase')
        `;
      }

      // 2. Insert extra lookbook images (image_type = 'lookbook')
      for (const url of extraUrls) {
        await sql`
          INSERT INTO product_images (product_id, image_url, image_type)
          VALUES (${pId}, ${url}, 'lookbook')
        `;
      }

      await sql`
        INSERT INTO action_logs (actor_email, action_type, description)
        VALUES (${email}, 'UPLOAD_PRODUCT', ${`Uploaded product item, 4 showcase photos and ${extraFilesCount} lookbook photos: ${title} (${pId})`})
      `;

      return NextResponse.json({ success: true, urls: [...uploadUrls, ...extraUrls] });
    }

    return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin Upload API Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
