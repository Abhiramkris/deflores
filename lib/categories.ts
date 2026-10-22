import fs from "fs";
import path from "path";
import { sql } from "../app/lib/db";
import defaultCategories from "../app/data/categories.json";

export interface SubCategory {
  title: string;
  desc: string;
}

export interface Category {
  id?: number;
  key: string;
  num: string;
  tag: string;
  title: string;
  image: string;
  description: string;
  subcategories: SubCategory[];
}

const categoriesJsonPath = path.join(process.cwd(), "app", "data", "categories.json");

export function getFallbackCategories(): Category[] {
  try {
    if (fs.existsSync(categoriesJsonPath)) {
      const fileData = fs.readFileSync(categoriesJsonPath, "utf-8");
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Category[];
      }
    }
  } catch (err) {
    console.warn("Fallback categories read warning:", err);
  }
  return defaultCategories as Category[];
}

export function saveFallbackCategories(categories: Category[]): void {
  try {
    fs.writeFileSync(categoriesJsonPath, JSON.stringify(categories, null, 2), "utf-8");
  } catch (err) {
    console.warn("Fallback categories write warning:", err);
  }
}

let tableInitPromise: Promise<void> | null = null;

export async function ensureCategoriesTable(): Promise<void> {
  if (tableInitPromise) return tableInitPromise;

  tableInitPromise = (async () => {
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

      const existing = await sql<{ count: string }[]>`
        SELECT COUNT(*)::text as count FROM categories
      `;

      if (!existing[0] || parseInt(existing[0].count, 10) === 0) {
        const fallbacks = getFallbackCategories();
        for (const cat of fallbacks) {
          await sql`
            INSERT INTO categories (category_key, num, tag, title, image, description, subcategories)
            VALUES (${cat.key}, ${cat.num || "01"}, ${cat.tag || ""}, ${cat.title}, ${cat.image || ""}, ${cat.description || ""}, ${JSON.stringify(cat.subcategories || [])})
            ON CONFLICT (category_key) DO NOTHING
          `;
        }
      }
    } catch (err) {
      console.warn("Categories table init warning:", err);
    }
  })();

  return tableInitPromise;
}

export async function getCategories(): Promise<Category[]> {
  try {
    await ensureCategoriesTable();

    const dbRows = await sql<{
      id: number;
      categoryKey?: string;
      key?: string;
      num: string;
      tag: string;
      title: string;
      image: string;
      description: string;
      subcategories: unknown;
    }[]>`
      SELECT id, category_key as key, num, tag, title, image, description, subcategories
      FROM categories
      ORDER BY id ASC
    `;

    if (dbRows && dbRows.length > 0) {
      return dbRows.map((c) => {
        let parsedSubs: SubCategory[] = [];
        if (Array.isArray(c.subcategories)) {
          parsedSubs = c.subcategories as SubCategory[];
        } else if (typeof c.subcategories === "string") {
          try {
            const parsed = JSON.parse(c.subcategories);
            if (Array.isArray(parsed)) parsedSubs = parsed;
          } catch {
            parsedSubs = [];
          }
        }

        const catKey = c.key || c.categoryKey || c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        return {
          id: c.id,
          key: catKey,
          num: c.num || "01",
          tag: c.tag || "",
          title: c.title,
          image: c.image || "",
          description: c.description || "",
          subcategories: parsedSubs,
        };
      });
    }
  } catch (err) {
    console.warn("Reading categories from DB warning:", err);
  }

  return getFallbackCategories();
}

export async function getCategoryByKey(rawKey: string): Promise<Category | null> {
  const normalized = decodeURIComponent(rawKey).trim().toLowerCase();
  const allCategories = await getCategories();

  const matched = allCategories.find((c) => {
    const k = c.key?.toLowerCase();
    const t = c.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const rawTitle = c.title?.toLowerCase();
    return k === normalized || t === normalized || rawTitle === normalized;
  });

  return matched || null;
}
