import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function POST(request: Request) {
  try {
    const { ids, email } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Missing or invalid product IDs array" }, { status: 400 });
    }

    const actorEmail = email || "admin@deflores.com";

    // Perform soft delete by setting deleted_at timestamp
    for (const id of ids) {
      await sql`
        UPDATE products 
        SET deleted_at = NOW() 
        WHERE id = ${id}
      `;
    }

    // Insert audit log
    await sql`
      INSERT INTO action_logs (actor_email, action_type, description)
      VALUES (${actorEmail}, 'DELETE_PRODUCT', ${`Soft deleted products: ${ids.join(", ")}`})
    `;

    return NextResponse.json({ success: true, message: `Successfully deleted ${ids.length} items.` });
  } catch (error: any) {
    console.error("Products Soft Delete API Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
