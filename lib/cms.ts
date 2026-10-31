import fs from "fs";
import path from "path";
import type { JSONValue } from "postgres";
import { sql } from "../app/lib/db";
import defaultSchema from "../app/data/homepage-schema.json";
import defaultContent from "../app/data/homepage-content.json";

export interface CmsFieldDef {
  type: string;
  label: string;
  min_chars?: number;
  max_chars?: number;
  placeholder?: string;
  required?: boolean;
  aspect_ratio?: string;
  cover_mode?: boolean;
  min_width?: number;
  min_height?: number;
  recommended?: string;
  default?: boolean;
}

export interface CmsSectionDef {
  title: string;
  description: string;
  fields: Record<string, CmsFieldDef>;
}

export interface CmsSchema {
  $schema?: string;
  title?: string;
  description?: string;
  sections: Record<string, CmsSectionDef>;
}

export interface CmsHistoryItem {
  id: number;
  sectionKey: string;
  version: number;
  createdAt: string;
  createdBy: string;
}

export interface CmsContentMap {
  [key: string]: Record<string, unknown>;
}

const contentFilePath = path.join(process.cwd(), "app", "data", "homepage-content.json");
const schemaFilePath = path.join(process.cwd(), "app", "data", "homepage-schema.json");

export function getMasterSchema(): CmsSchema {
  try {
    if (fs.existsSync(schemaFilePath)) {
      const data = fs.readFileSync(schemaFilePath, "utf-8");
      return JSON.parse(data) as CmsSchema;
    }
  } catch (err) {
    console.warn("Schema file read error:", err);
  }
  return defaultSchema as unknown as CmsSchema;
}

export function getFallbackContent(): CmsContentMap {
  try {
    if (fs.existsSync(contentFilePath)) {
      const data = fs.readFileSync(contentFilePath, "utf-8");
      return JSON.parse(data) as CmsContentMap;
    }
  } catch (err) {
    console.warn("Content file read error:", err);
  }
  return defaultContent as unknown as CmsContentMap;
}

export function saveFallbackContent(content: CmsContentMap) {
  try {
    fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2), "utf-8");
  } catch (err) {
    console.warn("Content file write error:", err);
  }
}

let tableInitPromise: Promise<void> | null = null;

export async function ensureCmsTables(): Promise<void> {
  if (tableInitPromise) return tableInitPromise;

  tableInitPromise = (async () => {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS homepage_cms (
          section_key VARCHAR(64) PRIMARY KEY,
          content JSONB NOT NULL,
          status VARCHAR(20) DEFAULT 'published',
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_by VARCHAR(255) DEFAULT 'admin@deflores.com'
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS homepage_cms_history (
          id SERIAL PRIMARY KEY,
          section_key VARCHAR(64) NOT NULL,
          content JSONB NOT NULL,
          version INT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          created_by VARCHAR(255) DEFAULT 'admin@deflores.com'
        )
      `;

      try {
        await sql`
          UPDATE storage.buckets
          SET public = true, file_size_limit = 52428800
          WHERE id = 'deflores-bucket'
        `;
      } catch (bucketErr) {
        console.warn("Storage bucket config check warning:", bucketErr);
      }
    } catch (err) {
      console.warn("CMS table initialization warning:", err);
    }
  })();

  return tableInitPromise;
}

export function validateSection(sectionKey: string, content: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const schema = getMasterSchema();
  const sectionSchema = schema.sections?.[sectionKey];

  if (!sectionSchema) {
    return { valid: false, errors: [`Unknown section: ${sectionKey}`] };
  }

  if (sectionKey === "ramp_videos") {
    return { valid: true, errors: [] };
  }

  const errors: string[] = [];
  const fields = sectionSchema.fields || {};

  for (const [fieldKey, fieldDef] of Object.entries(fields)) {
    const val = content[fieldKey];

    if (fieldDef.required && (val === undefined || val === null || val === "")) {
      errors.push(`Field '${fieldDef.label || fieldKey}' is required.`);
      continue;
    }

    if (val === undefined || val === null || val === "") continue;

    if (fieldDef.type === "text" || fieldDef.type === "textarea") {
      const strVal = String(val).trim();
      if (fieldDef.min_chars !== undefined && strVal.length < fieldDef.min_chars) {
        errors.push(`'${fieldDef.label}' must have at least ${fieldDef.min_chars} characters (currently ${strVal.length}).`);
      }
      if (fieldDef.max_chars !== undefined && strVal.length > fieldDef.max_chars) {
        errors.push(`'${fieldDef.label}' cannot exceed ${fieldDef.max_chars} characters (currently ${strVal.length}).`);
      }
    }

    if (fieldDef.type === "boolean" && typeof val !== "boolean") {
      errors.push(`'${fieldDef.label}' must be a boolean.`);
    }

    if (fieldDef.type === "image" && typeof val === "string" && val.length > 0) {
      if (!val.startsWith("http://") && !val.startsWith("https://") && !val.startsWith("/")) {
        errors.push(`'${fieldDef.label}' must be a valid image path or URL.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function getHomepageData(): Promise<CmsContentMap> {
  const fallback = getFallbackContent();

  try {
    await ensureCmsTables();
    const rows = await sql<{ sectionKey: string; content: Record<string, unknown>; status: string; updatedAt: string }[]>`
      SELECT section_key as "sectionKey", content, status, updated_at as "updatedAt"
      FROM homepage_cms
      WHERE status = 'published'
    `;

    if (rows && rows.length > 0) {
      const merged: CmsContentMap = { ...fallback };
      for (const row of rows) {
        let parsed: Record<string, unknown> = {};
        if (typeof row.content === "string") {
          try {
            parsed = JSON.parse(row.content);
          } catch {
            parsed = {};
          }
        } else if (row.content && typeof row.content === "object") {
          parsed = row.content as Record<string, unknown>;
        }

        merged[row.sectionKey] = {
          ...fallback[row.sectionKey],
          ...parsed,
        };
      }
      return merged;
    }
  } catch (err) {
    console.warn("Reading CMS data from SQL failed; falling back to local dataset:", err);
  }

  return fallback;
}

export async function getAllCmsDataWithDrafts(): Promise<{
  schema: CmsSchema;
  sections: Record<string, { content: Record<string, unknown>; status: string; updatedAt: string | null; updatedBy: string }>;
  history: CmsHistoryItem[];
  offline?: boolean;
}> {
  const fallback = getFallbackContent();
  const schema = getMasterSchema();

  try {
    await ensureCmsTables();
    const rows = await sql<{ sectionKey: string; content: Record<string, unknown>; status: string; updatedAt: string; updatedBy: string }[]>`
      SELECT section_key as "sectionKey", content, status, updated_at as "updatedAt", updated_by as "updatedBy"
      FROM homepage_cms
    `;

    const historyRows = await sql<CmsHistoryItem[]>`
      SELECT id, section_key as "sectionKey", version, created_at as "createdAt", created_by as "createdBy"
      FROM homepage_cms_history
      ORDER BY created_at DESC
      LIMIT 50
    `;

    const sectionsData: Record<string, { content: Record<string, unknown>; status: string; updatedAt: string | null; updatedBy: string }> = {};
    for (const key of Object.keys(schema.sections || {})) {
      const found = rows.find((r) => r.sectionKey === key);
      let parsedFound: Record<string, unknown> | null = null;
      if (found?.content) {
        if (typeof found.content === "string") {
          try {
            parsedFound = JSON.parse(found.content);
          } catch {
            parsedFound = null;
          }
        } else if (typeof found.content === "object") {
          parsedFound = found.content as Record<string, unknown>;
        }
      }

      sectionsData[key] = {
        content: parsedFound ? { ...fallback[key], ...parsedFound } : fallback[key],
        status: found?.status || "published",
        updatedAt: found?.updatedAt || null,
        updatedBy: found?.updatedBy || "System Default",
      };
    }

    return {
      schema,
      sections: sectionsData,
      history: historyRows || [],
    };
  } catch (err) {
    console.warn("Failed fetching CMS admin data from DB:", err);
    const sectionsData: Record<string, { content: Record<string, unknown>; status: string; updatedAt: string | null; updatedBy: string }> = {};
    for (const key of Object.keys(schema.sections || {})) {
      sectionsData[key] = {
        content: fallback[key],
        status: "published",
        updatedAt: null,
        updatedBy: "Offline System",
      };
    }
    return {
      schema,
      sections: sectionsData,
      history: [],
      offline: true,
    };
  }
}

export async function saveSectionData(
  sectionKey: string,
  content: Record<string, unknown>,
  status: "draft" | "published" = "published",
  actorEmail: string = "admin@deflores.com"
) {
  const validation = validateSection(sectionKey, content);
  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  const currentFallback = getFallbackContent();
  currentFallback[sectionKey] = {
    ...currentFallback[sectionKey],
    ...content,
  };
  saveFallbackContent(currentFallback);

  try {
    await ensureCmsTables();

    const maxVerRow = await sql<{ maxVer: number }[]>`
      SELECT COALESCE(MAX(version), 0)::int as "maxVer"
      FROM homepage_cms_history
      WHERE section_key = ${sectionKey}
    `;
    const nextVersion = (maxVerRow[0]?.maxVer || 0) + 1;

    await sql`
      INSERT INTO homepage_cms (section_key, content, status, updated_at, updated_by)
      VALUES (${sectionKey}, ${sql.json(content as unknown as JSONValue)}, ${status}, CURRENT_TIMESTAMP, ${actorEmail})
      ON CONFLICT (section_key) DO UPDATE SET
        content = EXCLUDED.content,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP,
        updated_by = EXCLUDED.updated_by
    `;

    await sql`
      INSERT INTO homepage_cms_history (section_key, content, version, created_at, created_by)
      VALUES (${sectionKey}, ${sql.json(content as unknown as JSONValue)}, ${nextVersion}, CURRENT_TIMESTAMP, ${actorEmail})
    `;

    await sql`
      INSERT INTO action_logs (actor_email, action_type, description, metadata)
      VALUES (
        ${actorEmail},
        ${`CMS_SECTION_${status.toUpperCase()}`},
        ${`Updated CMS section '${sectionKey}' (${status}, v${nextVersion})`},
        ${JSON.stringify({ sectionKey, version: nextVersion, status })}
      )
    `;

    return { success: true, version: nextVersion, status };
  } catch (err: unknown) {
    console.warn("DB write warning in saveSectionData:", err);
    return { success: true, warning: "Saved locally only. Database was unreachable." };
  }
}

export async function rollbackSectionData(historyId: number, actorEmail: string = "admin@deflores.com") {
  try {
    await ensureCmsTables();
    const rows = await sql<{ id: number; sectionKey: string; content: Record<string, unknown>; version: number }[]>`
      SELECT id, section_key as "sectionKey", content, version
      FROM homepage_cms_history
      WHERE id = ${historyId}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      throw new Error("Revision snapshot not found.");
    }

    const { sectionKey, content, version } = rows[0];

    const currentFallback = getFallbackContent();
    currentFallback[sectionKey] = {
      ...currentFallback[sectionKey],
      ...content,
    };
    saveFallbackContent(currentFallback);

    await sql`
      UPDATE homepage_cms
      SET content = ${sql.json(content as unknown as JSONValue)},
          status = 'published',
          updated_at = CURRENT_TIMESTAMP,
          updated_by = ${actorEmail}
      WHERE section_key = ${sectionKey}
    `;

    await sql`
      INSERT INTO action_logs (actor_email, action_type, description, metadata)
      VALUES (
        ${actorEmail},
        'CMS_SECTION_ROLLBACK',
        ${`Restored CMS section '${sectionKey}' to revision v${version}`},
        ${JSON.stringify({ sectionKey, restoredVersion: version, historyId })}
      )
    `;

    return { success: true, sectionKey, content, restoredVersion: version };
  } catch (err: unknown) {
    console.error("Rollback error:", err);
    throw err;
  }
}
