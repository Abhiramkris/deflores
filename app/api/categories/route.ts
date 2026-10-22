import { NextResponse } from "next/server";
import { sql } from "../../lib/db";
import {
  getCategories,
  saveFallbackCategories,
  getFallbackCategories,
  ensureCategoriesTable,
  Category,
} from "../../../lib/categories";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error: unknown) {
    const fallback = getFallbackCategories();
    const msg = error instanceof Error ? error.message : "Database connection offline";
    return NextResponse.json({ success: true, categories: fallback, warning: msg });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, categoryKey, title, tag, image, description, subcategories, categories } = body;

    if (action === "update_all" && Array.isArray(categories)) {
      const sanitized: Category[] = categories.map((cat: Record<string, unknown>, idx: number) => ({
        id: typeof cat.id === "number" ? cat.id : idx + 1,
        key: typeof cat.key === "string" && cat.key ? cat.key : typeof cat.title === "string" ? cat.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `category-${idx + 1}`,
        num: typeof cat.num === "string" ? cat.num : (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`),
        tag: typeof cat.tag === "string" ? cat.tag : "",
        title: typeof cat.title === "string" ? cat.title : "Untitled Category",
        image: typeof cat.image === "string" ? cat.image : "",
        description: typeof cat.description === "string" ? cat.description : "",
        subcategories: Array.isArray(cat.subcategories) ? (cat.subcategories as Category["subcategories"]) : [],
      }));

      try {
        await ensureCategoriesTable();

        const activeKeys = sanitized.map((c) => c.key);

        for (const cat of sanitized) {
          await sql`
            INSERT INTO categories (category_key, num, tag, title, image, description, subcategories)
            VALUES (${cat.key}, ${cat.num}, ${cat.tag}, ${cat.title}, ${cat.image}, ${cat.description}, ${JSON.stringify(cat.subcategories)})
            ON CONFLICT (category_key) DO UPDATE SET
              num = EXCLUDED.num,
              tag = EXCLUDED.tag,
              title = EXCLUDED.title,
              image = EXCLUDED.image,
              description = EXCLUDED.description,
              subcategories = EXCLUDED.subcategories
          `;
        }

        if (activeKeys.length > 0) {
          await sql`
            DELETE FROM categories
            WHERE category_key NOT IN ${sql(activeKeys)}
          `;
        }
      } catch (dbErr) {
        console.warn("Could not sync categories to database:", dbErr);
      }

      saveFallbackCategories(sanitized);

      return NextResponse.json({ success: true, message: "Categories updated successfully", categories: sanitized });
    }

    if (categoryKey) {
      const current = await getCategories();
      const updated = current.map((c) => {
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
        console.warn("DB update skipped:", dbErr);
      }

      return NextResponse.json({ success: true, categories: updated });
    }

    return NextResponse.json({ error: "Invalid action or parameters" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
