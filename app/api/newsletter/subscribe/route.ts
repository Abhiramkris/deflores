import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

export async function POST(request: Request) {
  try {
    const { email, deviceId } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Insert subscriber email (ignore duplicates)
    await sql`
      INSERT INTO newsletter_subscribers (email)
      VALUES (${cleanEmail})
      ON CONFLICT (email) DO NOTHING
    `;

    // Link email and device ID if deviceId is provided
    if (deviceId) {
      await sql`
        INSERT INTO user_devices (email, device_id)
        VALUES (${cleanEmail}, ${deviceId})
        ON CONFLICT (email, device_id) DO NOTHING
      `;
    }

    // Log the user subscriber action
    await sql`
      INSERT INTO action_logs (actor_email, action_type, description)
      VALUES (${cleanEmail}, 'USER_SUBSCRIBED', 'New user joined newsletter subscriber list')
    `;

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch (error: any) {
    console.error("Newsletter Subscribe API Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
