import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummykey123");

// GET all dashboard data (Logs, Subscribers, Products, Stats)
export async function GET() {
  try {
    const logs = await sql`
      SELECT id, actor_email as actorEmail, action_type as actionType, description, metadata, created_at as createdAt
      FROM action_logs
      ORDER BY created_at DESC
      LIMIT 100
    `;

    const userActivities = await sql`
      SELECT id, session_id as sessionId, device_id as deviceId, action_type as actionType, page_url as pageUrl, scroll_percentage as scrollPercentage, target_element as targetElement, browser_meta as browserMeta, product_id as productId, email, created_at as createdAt
      FROM user_activity_logs
      ORDER BY created_at DESC
      LIMIT 100
    `;

    const userDevices = await sql`
      SELECT id, email, device_id as deviceId, created_at as createdAt
      FROM user_devices
      ORDER BY created_at DESC
      LIMIT 100
    `;

    const subscribers = await sql`
      SELECT id, email, created_at as createdAt
      FROM newsletter_subscribers
      ORDER BY created_at DESC
    `;

    const productsRaw = await sql`
      SELECT id, title, price, description, colors, sizes, rating, review_count as reviewCount
      FROM products
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    const productImages = await sql`
      SELECT product_id as productId, image_url as imageUrl
      FROM product_images
    `;

    const products = productsRaw.map((p) => {
      const imgs = productImages
        .filter((img: any) => img.productId === p.id)
        .map((img: any) => img.imageUrl);
      return {
        ...p,
        images: imgs
      };
    });

    const logCount = await sql`SELECT COUNT(*)::int as count FROM action_logs`;
    const subscriberCount = await sql`SELECT COUNT(*)::int as count FROM newsletter_subscribers`;
    const productCount = await sql`SELECT COUNT(*)::int as count FROM products WHERE deleted_at IS NULL`;
    const galleryCount = await sql`SELECT COUNT(*)::int as count FROM gallery_images`;

    const reviews = await sql`
      SELECT id, product_id as productId, author, rating, quote, created_at as createdAt
      FROM product_reviews
      ORDER BY created_at DESC
    `;

    // Calculate unique tracking stats
    const uniqueDevices = await sql`SELECT COUNT(DISTINCT device_id)::int as count FROM user_activity_logs`;
    const uniqueSessions = await sql`SELECT COUNT(DISTINCT session_id)::int as count FROM user_activity_logs`;
    const totalActivities = await sql`SELECT COUNT(*)::int as count FROM user_activity_logs`;

    return NextResponse.json({
      success: true,
      logs,
      userActivities,
      userDevices,
      subscribers,
      products,
      reviews,
      stats: {
        totalLogs: logCount[0]?.count || 0,
        totalSubscribers: subscriberCount[0]?.count || 0,
        totalProducts: productCount[0]?.count || 0,
        totalGalleryImages: galleryCount[0]?.count || 0,
        uniqueDevices: uniqueDevices[0]?.count || 0,
        uniqueSessions: uniqueSessions[0]?.count || 0,
        totalActivities: totalActivities[0]?.count || 0,
      }
    });
  } catch (error: any) {
    console.error("Dashboard Data Fetch Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}

// POST to create dynamic actions (Add Subscriber, Send Email Campaigns)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, subject, html, actorEmail } = body;
    const cleanActor = actorEmail || "admin@deflores.com";

    // 1. Add subscriber manually
    if (action === "add_subscriber") {
      if (!email) {
        return NextResponse.json({ error: "Subscriber email is required" }, { status: 400 });
      }
      const cleanEmail = email.trim().toLowerCase();

      await sql`
        INSERT INTO newsletter_subscribers (email)
        VALUES (${cleanEmail})
        ON CONFLICT (email) DO NOTHING
      `;

      await sql`
        INSERT INTO action_logs (actor_email, action_type, description)
        VALUES (${cleanActor}, 'MANUAL_SUBSCRIBER_ADDED', ${`Manually subscribed email address: ${cleanEmail}`})
      `;

      return NextResponse.json({ success: true, message: "Subscriber added successfully" });
    }

    // 2. Send email campaign
    if (action === "send_campaign") {
      if (!subject || !html) {
        return NextResponse.json({ error: "Subject and HTML body are required" }, { status: 400 });
      }

      // Fetch all subscribers
      const subscribers = await sql`
        SELECT email FROM newsletter_subscribers
      `;

      if (subscribers.length === 0) {
        return NextResponse.json({ error: "No subscribers found to send emails to" }, { status: 400 });
      }

      const emailsList = subscribers.map((s) => s.email);

      if (process.env.RESEND_API_KEY) {
        // Send batch or loop
        for (const recipient of emailsList) {
          await resend.emails.send({
            from: "de flores Haute Couture <onboarding@resend.dev>",
            to: recipient,
            subject: subject,
            html: html,
          });
        }
      } else {
        console.log(`[LOCAL DEV] Simulated Resend email campaign to ${emailsList.length} subscribers: "${subject}"`);
      }

      await sql`
        INSERT INTO action_logs (actor_email, action_type, description, metadata)
        VALUES (${cleanActor}, 'EMAIL_CAMPAIGN_SENT', ${`Sent campaign: "${subject}" to ${emailsList.length} subscribers`}, ${JSON.stringify({ recipientsCount: emailsList.length, subject })})
      `;

      return NextResponse.json({ success: true, message: `Campaign sent successfully to ${emailsList.length} subscribers.` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Dashboard Post Actions Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
