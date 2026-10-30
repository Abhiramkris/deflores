import { NextResponse } from "next/server";
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { getMasterSchema } from "../../../../../lib/cms";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "deflores_haute_couture_secret_secure_key_123"
);

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("admin_token");
  if (!tokenCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await jwtVerify(tokenCookie.value, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Failed to parse upload. The image file exceeds server limits or the upload was interrupted." },
      { status: 400 }
    );
  }

  try {
    const file = formData.get("file") as File;
    const sectionKey = (formData.get("sectionKey") as string) || "";
    const fieldKey = (formData.get("fieldKey") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);
    const originalSize = originalBuffer.length;

    const metadata = await sharp(originalBuffer).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    if (!width || !height) {
      return NextResponse.json({ error: "Unable to read image dimensions. Please provide a valid JPG, PNG, or WebP image." }, { status: 400 });
    }

    const schema = getMasterSchema();
    const fieldDef = schema.sections?.[sectionKey]?.fields?.[fieldKey];

    if (fieldDef && fieldDef.type === "image") {
      if (width < 200 || height < 200) {
        return NextResponse.json(
          {
            error: `Image resolution too low (${width}×${height}px). Minimum required is 200×200px.`,
          },
          { status: 400 }
        );
      }
    }

    const isHero = sectionKey === "hero";
    const targetQuality = isHero ? 95 : 90;

    const webpBuffer = await sharp(originalBuffer)
      .rotate()
      .webp({ quality: targetQuality, effort: 5, smartSubsample: true })
      .toBuffer();

    const compressedSize = webpBuffer.length;
    const savingsPercent = Math.max(0, Math.round((1 - compressedSize / originalSize) * 100));

    const filename = `cms_${sectionKey}_${fieldKey}_${Date.now()}.webp`;
    let fileUrl = "";

    if (supabase) {
      const { error } = await supabase.storage
        .from("deflores-bucket")
        .upload(`cms/${filename}`, webpBuffer, {
          contentType: "image/webp",
          upsert: true,
        });

      if (!error) {
        const { data: publicUrlData } = supabase.storage
          .from("deflores-bucket")
          .getPublicUrl(`cms/${filename}`);
        fileUrl = publicUrlData.publicUrl;
      }
    }

    if (!fileUrl) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "cms");
      await fs.mkdir(uploadsDir, { recursive: true });
      const filepath = path.join(uploadsDir, filename);
      await fs.writeFile(filepath, webpBuffer);
      fileUrl = `/uploads/cms/${filename}`;
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      width,
      height,
      aspect: parseFloat((width / height).toFixed(3)),
      originalSize,
      compressedSize,
      savingsPercent,
      quality: targetQuality,
    });
  } catch (error: unknown) {
    console.error("CMS Upload error:", error);
    const msg = error instanceof Error ? error.message : "Failed to process image";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
