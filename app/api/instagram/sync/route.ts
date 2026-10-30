import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

const DEFAULT_POSTS = [
  {
    post_id: "atelier-ig-01",
    media_url: "/crop_green.png",
    permalink: "https://instagram.com/deflores.india",
    caption: "Intricate zari geometry in motion. An ode to artisanal precision.",
    media_type: "IMAGE"
  },
  {
    post_id: "atelier-ig-02",
    media_url: "/crop_white.png",
    permalink: "https://instagram.com/deflores.india",
    caption: "Purity of form in ivory silk cotton. Hand-finished draping details.",
    media_type: "IMAGE"
  },
  {
    post_id: "atelier-ig-03",
    media_url: "/crop_red.png",
    permalink: "https://instagram.com/deflores.india",
    caption: "Architectural cowl lines in deep scarlet georgette.",
    media_type: "IMAGE"
  },
  {
    post_id: "atelier-ig-04",
    media_url: "/gallery_purple.jpg",
    permalink: "https://instagram.com/deflores.india",
    caption: "Bespoke bridal heirlooms crafted with enduring tradition.",
    media_type: "IMAGE"
  },
  {
    post_id: "atelier-ig-05",
    media_url: "/crop_green.png",
    permalink: "https://instagram.com/deflores.india",
    caption: "Runway reflections. Structured confidence tailored for the individual.",
    media_type: "IMAGE"
  },
  {
    post_id: "atelier-ig-06",
    media_url: "/crop_white.png",
    permalink: "https://instagram.com/deflores.india",
    caption: "Atelier fitting notes. Every seam calibrated to personal silhouette.",
    media_type: "IMAGE"
  }
];

async function syncFromSource(token?: string) {
  const activeToken = token || process.env.INSTAGRAM_ACCESS_TOKEN || "";

  if (activeToken) {
    try {
      const res = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${activeToken}`
      );
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        for (const item of data.data) {
          const mUrl = item.media_url || item.thumbnail_url;
          if (!mUrl) continue;
          await sql`
            INSERT INTO instagram_posts (post_id, media_url, permalink, caption, media_type, timestamp)
            VALUES (${item.id}, ${mUrl}, ${item.permalink || "https://instagram.com/deflores.india"}, ${item.caption || ""}, ${item.media_type || "IMAGE"}, ${item.timestamp ? new Date(item.timestamp) : new Date()})
            ON CONFLICT (post_id) DO UPDATE SET
              media_url = EXCLUDED.media_url,
              permalink = EXCLUDED.permalink,
              caption = EXCLUDED.caption,
              media_type = EXCLUDED.media_type
          `;
        }
      }
    } catch (err) {
      console.error("Instagram Graph API Sync Error:", err);
    }
  } else {
    for (const item of DEFAULT_POSTS) {
      await sql`
        INSERT INTO instagram_posts (post_id, media_url, permalink, caption, media_type)
        VALUES (${item.post_id}, ${item.media_url}, ${item.permalink}, ${item.caption}, ${item.media_type})
        ON CONFLICT (post_id) DO UPDATE SET
          media_url = EXCLUDED.media_url,
          caption = EXCLUDED.caption
      `;
    }
  }

  await sql`
    UPDATE instagram_sync_meta
    SET last_synced_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    const meta = await sql`
      SELECT handle, access_token as accessToken, last_synced_at as lastSyncedAt
      FROM instagram_sync_meta
      WHERE id = 1
    `;

    const lastSyncedAt = meta[0]?.lastSyncedAt ? new Date(meta[0].lastSyncedAt).getTime() : 0;
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    const isDue = Date.now() - lastSyncedAt > threeDaysMs;

    const existingCount = await sql`SELECT COUNT(*)::int as count FROM instagram_posts`;

    if (force || isDue || existingCount[0]?.count === 0) {
      await syncFromSource(meta[0]?.accessToken);
    }

    const posts = await sql`
      SELECT id, post_id as postId, media_url as mediaUrl, permalink, caption, media_type as mediaType, timestamp
      FROM instagram_posts
      ORDER BY timestamp DESC, id DESC
      LIMIT 12
    `;

    const updatedMeta = await sql`
      SELECT handle, last_synced_at as lastSyncedAt
      FROM instagram_sync_meta
      WHERE id = 1
    `;

    return NextResponse.json({
      success: true,
      posts,
      handle: updatedMeta[0]?.handle || "deflores.india",
      lastSyncedAt: updatedMeta[0]?.lastSyncedAt || new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Instagram GET error:", error);
    return NextResponse.json({
      success: true,
      posts: DEFAULT_POSTS.map((p, idx) => ({ id: idx + 1, postId: p.post_id, mediaUrl: p.media_url, permalink: p.permalink, caption: p.caption, mediaType: p.media_type })),
      handle: "deflores.india",
      lastSyncedAt: new Date().toISOString(),
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { handle, accessToken } = body;

    if (handle || accessToken !== undefined) {
      await sql`
        UPDATE instagram_sync_meta
        SET handle = COALESCE(${handle || null}, handle),
            access_token = COALESCE(${accessToken !== undefined ? accessToken : null}, access_token)
        WHERE id = 1
      `;
    }

    const meta = await sql`
      SELECT access_token as accessToken
      FROM instagram_sync_meta
      WHERE id = 1
    `;

    await syncFromSource(meta[0]?.accessToken);

    const posts = await sql`
      SELECT id, post_id as postId, media_url as mediaUrl, permalink, caption, media_type as mediaType, timestamp
      FROM instagram_posts
      ORDER BY timestamp DESC, id DESC
      LIMIT 12
    `;

    const updatedMeta = await sql`
      SELECT handle, last_synced_at as lastSyncedAt
      FROM instagram_sync_meta
      WHERE id = 1
    `;

    return NextResponse.json({
      success: true,
      message: "Instagram posts synced successfully.",
      posts,
      handle: updatedMeta[0]?.handle || "deflores.india",
      lastSyncedAt: updatedMeta[0]?.lastSyncedAt,
    });
  } catch (error: any) {
    console.error("Instagram POST sync error:", error);
    return NextResponse.json({ error: error.message || "Sync failed" }, { status: 500 });
  }
}
