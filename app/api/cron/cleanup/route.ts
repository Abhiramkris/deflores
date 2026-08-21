import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // Protect cron endpoint with CRON_SECRET key
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Delete older logs keeping only the latest 1000
    await sql`
      DELETE FROM action_logs 
      WHERE id NOT IN (
        SELECT id FROM action_logs 
        ORDER BY created_at DESC 
        LIMIT 1000
      )
    `;

    // Delete older user activity logs keeping only the latest 1000
    await sql`
      DELETE FROM user_activity_logs 
      WHERE id NOT IN (
        SELECT id FROM user_activity_logs 
        ORDER BY created_at DESC 
        LIMIT 1000
      )
    `;

    return NextResponse.json({ 
      success: true, 
      message: "Log cleanup executed successfully", 
      details: `Older entries removed. Registry maintains latest 1000 logs.` 
    });
  } catch (error: any) {
    console.error("Cron Log Cleanup API Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
