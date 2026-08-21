import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, deviceId, actionType, pageUrl, scrollPercentage, targetElement, browserMeta, productId, email } = body;

    if (!sessionId || !deviceId || !actionType) {
      return NextResponse.json({ error: "Missing tracking keys" }, { status: 400 });
    }

    const cleanEmail = email ? email.trim().toLowerCase() : null;

    // 1. Insert user activity tracking log
    await sql`
      INSERT INTO user_activity_logs (session_id, device_id, action_type, page_url, scroll_percentage, target_element, browser_meta, product_id, email)
      VALUES (${sessionId}, ${deviceId}, ${actionType}, ${pageUrl || null}, ${scrollPercentage || null}, ${targetElement || null}, ${JSON.stringify(browserMeta || {})}, ${productId || null}, ${cleanEmail})
    `;

    // 2. Link email and device ID if both are available
    if (cleanEmail) {
      await sql`
        INSERT INTO user_devices (email, device_id)
        VALUES (${cleanEmail}, ${deviceId})
        ON CONFLICT (email, device_id) DO NOTHING
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "ECONNREFUSED" || error.message?.includes("connect")) {
      console.warn("⚠️ [Database Offline] Client tracking event received but SQL server is unreachable.");
      return NextResponse.json({ success: false, warning: "Database connection offline" }, { status: 200 });
    }
    console.error("Tracking API Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
