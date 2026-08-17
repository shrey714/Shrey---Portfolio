import { afterEach, describe, expect, it, vi } from "vitest";
import {
  deliverContactRateLimitCleanupFailureNotification,
  deliverContactRateLimitCleanupNotification,
  formatContactRateLimitCleanupFailureNotification,
  formatContactRateLimitCleanupNotification,
} from "./cleanupNotification";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("scheduled cleanup Telegram notification", () => {
  const cleanupResult = {
    deletedCount: 3,
    cutoff: new Date("2026-08-16T03:00:00.000Z"),
  };

  it("reports only the deleted count and retention cutoff", () => {
    const message = formatContactRateLimitCleanupNotification(cleanupResult);

    expect(message).toContain("3 expired cooldown records");
    expect(message).toContain("2026-08-16T03:00:00.000Z");
    expect(message).not.toContain("ipHash");
    expect(message).not.toContain("email");
  });

  it("uses singular grammar for exactly one deleted record", () => {
    expect(
      formatContactRateLimitCleanupNotification({ ...cleanupResult, deletedCount: 1 })
    ).toContain("1 expired cooldown record");
  });

  it("formats a safe failure alert without including the original error", () => {
    const message = formatContactRateLimitCleanupFailureNotification({
      occurredAt: new Date("2026-08-17T03:00:00.000Z"),
    });

    expect(message).toContain("Rate-limit cleanup failed");
    expect(message).toContain("2026-08-17T03:00:00.000Z");
    expect(message).not.toContain("DATABASE_URL");
    expect(message).not.toContain("Telegram unavailable");
  });

  it("propagates a bounded Telegram failure to the scheduled handler", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("aborted", "AbortError")));

    await expect(deliverContactRateLimitCleanupNotification(cleanupResult)).rejects.toThrow("timed out");
  });

  it("uses the same bounded delivery path for failure alerts", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("aborted", "AbortError")));

    await expect(
      deliverContactRateLimitCleanupFailureNotification({
        occurredAt: new Date("2026-08-17T03:00:00.000Z"),
      })
    ).rejects.toThrow("timed out");
  });
});
