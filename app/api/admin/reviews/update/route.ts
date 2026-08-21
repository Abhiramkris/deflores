import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function POST(request: Request) {
  try {
    const { id, author, rating, quote, email } = await request.json();

    if (!id || !author || !rating || !quote) {
      return NextResponse.json({ error: "Missing required review fields" }, { status: 400 });
    }

    const actorEmail = email || "admin@deflores.com";

    // Update the review details
    await sql`
      UPDATE product_reviews 
      SET author = ${author}, rating = ${rating}, quote = ${quote}
      WHERE id = ${id}
    `;

    // Insert audit log
    await sql`
      INSERT INTO action_logs (actor_email, action_type, description)
      VALUES (${actorEmail}, 'UPDATE_REVIEW', ${`Updated review ID ${id} by ${author}`})
    `;

    return NextResponse.json({ success: true, message: "Review updated successfully." });
  } catch (error: any) {
    console.error("Update Review API Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
