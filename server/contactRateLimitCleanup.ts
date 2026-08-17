import { lt } from "drizzle-orm";
import { contactRateLimits } from "../drizzle/schema";
import { getDb } from "./db";

/** Retain an expired cooldown hash briefly for observability, then remove it. */
export const CONTACT_RATE_LIMIT_RETENTION_MS = 24 * 60 * 60 * 1_000;

export function getContactRateLimitCleanupCutoff(now = new Date()): Date {
  return new Date(now.getTime() - CONTACT_RATE_LIMIT_RETENTION_MS);
}

function getAffectedRowCount(result: unknown): number {
  const header = Array.isArray(result) ? result[0] : result;
  if (!header || typeof header !== "object") return 0;
  const affectedRows = (header as { affectedRows?: unknown }).affectedRows;
  return typeof affectedRows === "number" ? affectedRows : 0;
}

/**
 * Deletes only cooldown records that expired more than 24 hours ago.
 * It is safe to repeat: a later run simply finds no already-deleted rows.
 */
export async function cleanupExpiredContactRateLimits(now = new Date()) {
  const db = await getDb();
  if (!db) throw new Error("Contact rate-limit storage is unavailable.");

  const cutoff = getContactRateLimitCleanupCutoff(now);
  const result = await db.delete(contactRateLimits).where(lt(contactRateLimits.nextAllowedAt, cutoff));

  return {
    cutoff,
    deletedCount: getAffectedRowCount(result),
  };
}
