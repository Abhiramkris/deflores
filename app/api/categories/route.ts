import { NextResponse } from "next/server";
import { sql } from "../../lib/db";
import fs from "fs";
import path from "path";
import defaultCategories from "../../data/categories.json";

const categoriesJsonPath = path.join(process.cwd(), "app", "data", "categories.json");

// Helper to load fallback JSON if DB offline
function getFallbackCategories() {
  try {
    if (fs.existsSync(categoriesJsonPath)) {
      const fileData = fs.readFileSync(categoriesJsonPath, "utf-8");
      return JSON.parse(fileData);
    }
  } catch (err) {
    console.warn("⚠️ Failed reading fallback categories.json:", err);
  }
  return defaultCategories;
}

// Helper to save fallback JSON file
function saveFallbackCategories(categories: any[]) {
  try {
    fs.writeFileSync(categoriesJsonPath, JSON.stringify(categories, null, 2), "utf-8");
  } catch (err) {
    console.warn("⚠️ Failed writing fallback categories.json:", err);
  }
}

export async function GET() {
  try {
    // 1. Try fetching from SQL DB
    const dbCategories = await sql`
      SELECT id, category_key as key, num, tag, title, image, description, subcategories
      FROM categories
      ORDER BY id ASC
    `;

    if (dbCategories && dbCategories.length > 0) {
      return NextResponse.json({ success: true, categories: dbCategories });
    }

    // 2. Fallback to local categories.json
    const fallback = getFallbackCategories();
    return NextResponse.json({ success: true, categories: fallback });
  } catch (error: any) {
    console.warn("⚠️ [Categories DB Offline] Using fallback categories.json dataset");
    const fallback = getFallbackCategories();
    return NextResponse.json({ success: true, categories: fallback, warning: "Database connection offline" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, categoryKey, title, tag, image, description, subcategories, categories } = body;

    // Bulk update categories array
    if (action === "update_all" && Array.isArray(categories)) {
      // 1. Write to DB if reachable
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            category_key VARCHAR(100) UNIQUE NOT NULL,
            num VARCHAR(10) NOT NULL,
            tag VARCHAR(100) NOT NULL,
            title VARCHAR(255) NOT NULL,
            image TEXT NOT NULL,
            description TEXT NOT NULL,
            subcategories JSONB DEFAULT '[]'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          )
        `;

        for (const cat of categories) {
          await sql`
            INSERT INTO categories (category_key, num, tag, title, image, description, subcategories)
            VALUES (${cat.key}, ${cat.num || "01"}, ${cat.tag || ""}, ${cat.title}, ${cat.image || ""}, ${cat.description || ""}, ${JSON.stringify(cat.subcategories || [])})
            ON CONFLICT (category_key) DO UPDATE SET
              tag = EXCLUDED.tag,
              title = EXCLUDED.title,
              image = EXCLUDED.image,
              description = EXCLUDED.description,
              subcategories = EXCLUDED.subcategories
          `;
        }
      } catch (dbErr) {
        console.warn("⚠️ Could not sync category update to SQL database:", dbErr);
      }

      // 2. Always sync to local categories.json file for offline resilience
      saveFallbackCategories(categories);

      return NextResponse.json({ success: true, message: "Categories updated successfully" });
    }

    // Single category update
    if (categoryKey) {
      let currentCategories = getFallbackCategories();
      const updated = currentCategories.map((c: any) => {
        if (c.key === categoryKey || c.title?.toLowerCase() === categoryKey.toLowerCase()) {
          return {
            ...c,
            title: title ?? c.title,
            tag: tag ?? c.tag,
            image: image ?? c.image,
            description: description ?? c.description,
            subcategories: subcategories ?? c.subcategories,
          };
        }
        return c;
      });

      saveFallbackCategories(updated);

      try {
        await sql`
          UPDATE categories
          SET title = ${title}, tag = ${tag}, image = ${image}, description = ${description}, subcategories = ${JSON.stringify(subcategories)}
          WHERE category_key = ${categoryKey}
        `;
      } catch (dbErr) {
        console.warn("⚠️ DB update skipped:", dbErr);
      }

      return NextResponse.json({ success: true, categories: updated });
    }

    return NextResponse.json({ error: "Invalid action or parameters" }, { status: 400 });
  } catch (error: any) {
    console.error("Categories API Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
