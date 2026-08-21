import postgres from "postgres";

const globalForDb = globalThis as unknown as {
  conn: ReturnType<typeof postgres> | undefined;
};

// Connect to postgres via DATABASE_URL with Supabase SSL options enabled
export const sql =
  globalForDb.conn ??
  postgres(process.env.DATABASE_URL || "", {
    ssl: { rejectUnauthorized: false },
    transform: postgres.camel, // Automatically maps snake_case DB columns to camelCase JS properties
  });

if (process.env.NODE_ENV !== "production") globalForDb.conn = sql;
