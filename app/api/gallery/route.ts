import { NextResponse } from "next/server";
import { sql } from "../../lib/db";

export async function GET() {
  try {
    // Fetch all gallery image references sorted by uploaded timestamp
    const images = await sql`
      SELECT id, image_url as imageUrl, description, filename, aspect_ratio as aspectRatio, uploaded_at as uploadedAt
      FROM gallery_images 
      ORDER BY uploaded_at DESC
    `;

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error("Public Gallery API Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
