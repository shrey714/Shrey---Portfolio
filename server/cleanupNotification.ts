import { deliverTelegramHtmlMessage } from "./contact";

export type CleanupNotification = {
  deletedCount: number;
  cutoff: Date;
};

function recordLabel(count: number): string {
  return count === 1 ? "record" : "records";
}

/** Formats a concise maintenance message without including any visitor-identifying information. */
export function formatContactRateLimitCleanupNotification({
  deletedCount,
  cutoff,
}: CleanupNotification): string {
  return [
    "<b>Rate-limit cleanup complete</b>",
    "",
    `<b>Removed:</b> ${deletedCount} expired cooldown ${recordLabel(deletedCount)}`,
    `<b>Retention cutoff:</b> ${cutoff.toISOString()}`,
  ].join("\n");
}

export async function deliverContactRateLimitCleanupNotification(notification: CleanupNotification): Promise<void> {
  await deliverTelegramHtmlMessage(
    formatContactRateLimitCleanupNotification(notification),
    "cleanup notification"
  );
}
