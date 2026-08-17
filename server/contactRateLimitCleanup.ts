/** Retained for the scheduled-maintenance report contract. Redis deletes TTL keys itself. */
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
 * Upstash Redis expires cooldown keys atomically at their TTL. The retained
 * cron endpoint therefore remains safe and operationally visible, but never
 * runs a database deletion query.
 */
export async function cleanupExpiredContactRateLimits(now = new Date()) {
  const cutoff = getContactRateLimitCleanupCutoff(now);
  return {
    cutoff,
    deletedCount: 0,
  };
}
