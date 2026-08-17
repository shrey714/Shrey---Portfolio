import { timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import { deliverContactRateLimitCleanupNotification } from "./cleanupNotification";
import { cleanupExpiredContactRateLimits } from "./contactRateLimitCleanup";
import { ENV } from "./_core/env";

export type ScheduledCleanupDependencies = {
  authorize?: typeof hasValidCronAuthorization;
  cleanup?: typeof cleanupExpiredContactRateLimits;
  notify?: typeof deliverContactRateLimitCleanupNotification;
};

function getAuthorizationToken(value: string | string[] | undefined): string {
  const header = Array.isArray(value) ? value[0] : value;
  if (!header?.startsWith("Bearer ")) return "";
  return header.slice("Bearer ".length);
}

/** Verifies the scheduler's bearer token without exposing the configured secret. */
export function hasValidCronAuthorization(
  authorization: string | string[] | undefined,
  configuredSecret = ENV.cronSecret
): boolean {
  const presentedSecret = getAuthorizationToken(authorization);
  if (!configuredSecret || !presentedSecret) return false;

  const expected = Buffer.from(configuredSecret);
  const received = Buffer.from(presentedSecret);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

/**
 * Vercel invokes this route with GET and an Authorization: Bearer CRON_SECRET
 * header. The work is isolated from the page and contact-submission request paths.
 */
export async function runContactRateLimitCleanup(
  req: Request,
  res: Response,
  {
    authorize = hasValidCronAuthorization,
    cleanup = cleanupExpiredContactRateLimits,
    notify = deliverContactRateLimitCleanupNotification,
  }: ScheduledCleanupDependencies = {}
): Promise<void> {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "method-not-allowed" });
    return;
  }

  if (!authorize(req.headers.authorization)) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  try {
    const { cutoff, deletedCount } = await cleanup();
    let notificationSent = true;

    try {
      await notify({ deletedCount, cutoff });
    } catch (error) {
      notificationSent = false;
      // Cleanup already completed. Do not return 5xx and invite a duplicate retry.
      console.error("[Scheduled Cleanup] Telegram notification failed:", error);
    }

    res.status(200).json({ ok: true, deletedCount, cutoff: cutoff.toISOString(), notificationSent });
  } catch (error) {
    console.error("[Scheduled Cleanup] Contact rate-limit cleanup failed:", error);
    res.status(500).json({ error: "cleanup-failed", timestamp: new Date().toISOString() });
  }
}
