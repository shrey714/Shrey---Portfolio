import { deliverTelegramHtmlMessage } from "./contact";

export type CleanupNotification = {
  deletedCount: number;
  cutoff: Date;
};

export type CleanupFailureNotification = {
  occurredAt: Date;
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

/** Formats a safe operational alert without passing database errors, secrets, or visitor data to Telegram. */
export function formatContactRateLimitCleanupFailureNotification({
  occurredAt,
}: CleanupFailureNotification): string {
  return [
    "<b>Rate-limit cleanup failed</b>",
    "",
    "<b>Stage:</b> Expired cooldown record cleanup",
    `<b>Time:</b> ${occurredAt.toISOString()}`,
    "",
    "The scheduled job will retry automatically. Review deployment logs if the alert persists.",
  ].join("\n");
}

export async function deliverContactRateLimitCleanupFailureNotification(
  notification: CleanupFailureNotification
): Promise<void> {
  await deliverTelegramHtmlMessage(
    formatContactRateLimitCleanupFailureNotification(notification),
    "cleanup failure alert"
  );
}
