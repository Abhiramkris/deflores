import { sql } from "../app/lib/db.ts";

async function run() {
  try {
    console.log("Running reviews table migration...");
    await sql`
      CREATE TABLE IF NOT EXISTS product_reviews (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL DEFAULT 5,
        quote TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Migrate any existing reviews from products table into the new product_reviews table
    console.log("Migrating existing product reviews...");
    await sql`
      INSERT INTO product_reviews (product_id, author, rating, quote)
      SELECT id, review_author, COALESCE(review_rating, 5), review_quote 
      FROM products 
      WHERE review_author IS NOT NULL 
        AND review_author != '' 
        AND review_quote IS NOT NULL 
        AND review_quote != ''
        AND id NOT IN (SELECT DISTINCT product_id FROM product_reviews)
    `;

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

run();
