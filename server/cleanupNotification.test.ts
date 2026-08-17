import { afterEach, describe, expect, it, vi } from "vitest";
import {
  deliverContactRateLimitCleanupNotification,
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

  it("propagates a bounded Telegram failure to the scheduled handler", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("aborted", "AbortError")));

    await expect(deliverContactRateLimitCleanupNotification(cleanupResult)).rejects.toThrow("timed out");
  });
});
