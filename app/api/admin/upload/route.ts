import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "deflores_haute_couture_secret_secure_key_123"
);

async function processAndUploadFile(file: File, type: string, index: number): Promise<{ url: string; filename: string; aspect: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const metadata = await sharp(buffer).metadata();
  const width = metadata.width || 1000;
  const height = metadata.height || 1500;
  const aspect = parseFloat((width / height).toFixed(3));

  const webpBuffer = await sharp(buffer)
    .rotate()
    .webp({ quality: 88, effort: 5 })
    .toBuffer();

  const filename = `${type}_${Date.now()}_${index}.webp`;
  let fileUrl = "";

  if (supabase) {
    try {
      const { error } = await supabase.storage
        .from("deflores-bucket")
        .upload(filename, webpBuffer, {
          contentType: "image/webp",
          upsert: true,
        });

      if (!error) {
        const { data: publicUrlData } = supabase.storage
          .from("deflores-bucket")
          .getPublicUrl(filename);
        fileUrl = publicUrlData.publicUrl;
      }
    } catch {}
  }

  if (!fileUrl) {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, webpBuffer);
    fileUrl = `/uploads/${filename}`;
  }

  return { url: fileUrl, filename, aspect };
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("admin_token");
  if (!tokenCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let authEmail = "admin@deflores.com";
  try {
    const verified = await jwtVerify(tokenCookie.value, JWT_SECRET);
    if (verified.payload && typeof verified.payload.email === "string") {
      authEmail = verified.payload.email;
    }
  } catch {
    return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Failed to parse upload form data. The total file payload may exceed server limits or the upload was interrupted." },
      { status: 400 }
    );
  }

  try {
    const type = formData.get("type") as string;
    const email = (formData.get("email") as string) || authEmail;

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

    if (type === "product") {
      const pId = formData.get("id") as string;
      const title = formData.get("title") as string;
      const price = (formData.get("price") as string) || "Haute Couture";
      const category = (formData.get("category") as string) || "Bespoke";
      const subcategory = (formData.get("subcategory") as string) || "";
      const badge = (formData.get("badge") as string) || category || "Bespoke";
      const gender = (formData.get("gender") as string) || "Women";
      const occasionRaw = (formData.get("occasion") as string) || "[]";
      const fabric = (formData.get("fabric") as string) || "";
      const craft = (formData.get("craft") as string) || "";
      const isPatron = formData.get("isPatron") === "true" || formData.get("is_patron") === "true";
      const patronQuote = (formData.get("patronQuote") as string) || "";
      const patronAuthor = (formData.get("patronAuthor") as string) || "";
      const description = (formData.get("description") as string) || "";
      const colors = (formData.get("colors") as string) || "[]";
      const sizes = (formData.get("sizes") as string) || "[]";
      const details = (formData.get("details") as string) || "{}";

      const reviewAuthor = (formData.get("reviewAuthor") as string) || patronAuthor || "";
      const reviewRating = parseInt(formData.get("reviewRating") as string) || 5;
      const reviewQuote = (formData.get("reviewQuote") as string) || patronQuote || "";

      if (!pId || !title) {
        return NextResponse.json({ error: "Missing product fields (id, title)" }, { status: 400 });
      }

      const uploadUrls: string[] = [];
      for (let i = 0; i < 4; i++) {
        const file = formData.get(`file_${i}`) as File;
        const existingUrl = (formData.get(`existing_image_${i}`) as string) || "";

        if (file && typeof file.arrayBuffer === "function") {
          const res = await processAndUploadFile(file, "product", i);
          uploadUrls.push(res.url);
        } else if (existingUrl) {
          uploadUrls.push(existingUrl);
        } else if (uploadUrls[0]) {
          uploadUrls.push(uploadUrls[0]);
        }
      }

      if (uploadUrls.length === 0) {
        const fallbackExisting = await sql`
          SELECT image_url as imageUrl FROM product_images WHERE product_id = ${pId} AND (image_type = 'showcase' OR image_type IS NULL) ORDER BY id ASC
        `;
        if (fallbackExisting.length > 0) {
          fallbackExisting.forEach((img: any) => uploadUrls.push(img.imageUrl));
        } else {
          return NextResponse.json({ error: "At least one showcase photo is required." }, { status: 400 });
        }
      }

      while (uploadUrls.length < 4) {
        uploadUrls.push(uploadUrls[0]);
      }

      let occasionJson: string[] = [];
      try {
        occasionJson = typeof occasionRaw === "string" ? JSON.parse(occasionRaw) : occasionRaw;
      } catch {
        occasionJson = occasionRaw.split(",").map((o) => o.trim()).filter(Boolean);
      }

      let colorsJson = [];
      try {
        colorsJson = typeof colors === "string" ? JSON.parse(colors) : colors;
      } catch {
        colorsJson = colors.split(",").map((c) => ({ name: c.trim(), hex: "#ffffff" }));
      }

      let sizesJson = [];
      try {
        sizesJson = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
      } catch {
        sizesJson = sizes.split(",").map((s) => s.trim()).filter(Boolean);
      }

      let detailsJson = {};
      try {
        detailsJson = typeof details === "string" ? JSON.parse(details) : details;
      } catch {
        detailsJson = {};
      }

      await sql`
        INSERT INTO products (
          id, title, price, category, subcategory, badge, gender, occasion, fabric, craft,
          is_patron, patron_quote, patron_author, description,
          colors, sizes, details, review_author, review_quote, review_rating, deleted_at
        )
        VALUES (
          ${pId}, ${title}, ${price}, ${category}, ${subcategory}, ${badge}, ${gender}, ${JSON.stringify(occasionJson)}, ${fabric}, ${craft},
          ${isPatron}, ${patronQuote}, ${patronAuthor}, ${description},
          ${JSON.stringify(colorsJson)}, ${JSON.stringify(sizesJson)}, ${JSON.stringify(detailsJson)},
          ${reviewAuthor}, ${reviewQuote}, ${reviewRating}, NULL
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          price = EXCLUDED.price,
          category = EXCLUDED.category,
          subcategory = EXCLUDED.subcategory,
          badge = EXCLUDED.badge,
          gender = EXCLUDED.gender,
          occasion = EXCLUDED.occasion,
          fabric = EXCLUDED.fabric,
          craft = EXCLUDED.craft,
          is_patron = EXCLUDED.is_patron,
          patron_quote = EXCLUDED.patron_quote,
          patron_author = EXCLUDED.patron_author,
          description = EXCLUDED.description,
          colors = EXCLUDED.colors,
          sizes = EXCLUDED.sizes,
          details = EXCLUDED.details,
          review_author = EXCLUDED.review_author,
          review_quote = EXCLUDED.review_quote,
          review_rating = EXCLUDED.review_rating,
          deleted_at = NULL
      `;

      if (reviewAuthor && reviewQuote) {
        const existingReview = await sql`
          SELECT id FROM product_reviews WHERE product_id = ${pId} LIMIT 1
        `;
        if (existingReview.length > 0) {
          await sql`
            UPDATE product_reviews
            SET author = ${reviewAuthor}, rating = ${reviewRating}, quote = ${reviewQuote}
            WHERE id = ${existingReview[0].id}
          `;
        } else {
          await sql`
            INSERT INTO product_reviews (product_id, author, rating, quote)
            VALUES (${pId}, ${reviewAuthor}, ${reviewRating}, ${reviewQuote})
          `;
        }
      }

      const extraUrls: string[] = [];
      const existingLookbookRaw = formData.get("existing_lookbook_images") as string;
      if (existingLookbookRaw) {
        try {
          const parsed = JSON.parse(existingLookbookRaw);
          if (Array.isArray(parsed)) {
            parsed.forEach((url: string) => {
              if (url && typeof url === "string") extraUrls.push(url);
            });
          }
        } catch {}
      }

      const extraFilesCount = parseInt(formData.get("extraFilesCount") as string) || 0;
      for (let i = 0; i < extraFilesCount; i++) {
        const extraFile = formData.get(`extra_file_${i}`) as File;
        if (extraFile && typeof extraFile.arrayBuffer === "function") {
          const res = await processAndUploadFile(extraFile, "product_lookbook", i);
          extraUrls.push(res.url);
        }
      }

      await sql`
        DELETE FROM product_images WHERE product_id = ${pId}
      `;

      for (const url of uploadUrls) {
        await sql`
          INSERT INTO product_images (product_id, image_url, image_type)
          VALUES (${pId}, ${url}, 'showcase')
        `;
      }

      for (const url of extraUrls) {
        await sql`
          INSERT INTO product_images (product_id, image_url, image_type)
          VALUES (${pId}, ${url}, 'lookbook')
        `;
      }

      await sql`
        INSERT INTO action_logs (actor_email, action_type, description)
        VALUES (${email}, 'UPLOAD_PRODUCT', ${`Registered/updated product item: ${title} (${pId}) with ${uploadUrls.length} showcase and ${extraUrls.length} lookbook images`})
      `;

      return NextResponse.json({ success: true, urls: [...uploadUrls, ...extraUrls] });
    }

    return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin Upload API Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
