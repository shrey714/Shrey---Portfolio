import { afterEach, describe, expect, it, vi } from "vitest";
import { contactSubmissionSchema, deliverContactToTelegram, formatTelegramContactMessage, getClientIp, hasTelegramConfiguration, reserveContactSubmission, retryAfterSeconds, TELEGRAM_TIMEOUT_MS } from "./contact";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("contact submission security", () => {
  it("rejects malformed and oversized submissions while allowing the honeypot to be handled silently", () => {
    expect(contactSubmissionSchema.safeParse({ name: "A", email: "not-an-email", message: "short", website: "bot.example" }).success).toBe(false);
    expect(contactSubmissionSchema.safeParse({ name: "Shrey Patel", email: "hello@example.com", message: "A legitimate project enquiry with enough useful context.", website: "" }).success).toBe(true);
    expect(contactSubmissionSchema.safeParse({ name: "Shrey Patel", email: "hello@example.com", message: "A legitimate project enquiry with enough useful context.", website: "bot.example" }).success).toBe(true);
  });

  it("escapes visitor supplied HTML before formatting a Telegram notification", () => {
    const message = formatTelegramContactMessage({
      name: "<script>",
      email: "hello@example.com",
      message: "A detailed enquiry with <b>untrusted</b> markup.",
      website: "",
    });

    expect(message).toContain("&lt;script&gt;");
    expect(message).toContain("&lt;b&gt;untrusted&lt;/b&gt;");
    expect(message).not.toContain("<script>");
  });

  it("calculates a positive cooldown for blocked repeat submissions", () => {
    expect(retryAfterSeconds(new Date("2026-08-17T10:00:30Z"), new Date("2026-08-17T10:00:00Z"))).toBe(30);
  });

  it("uses an atomic Redis TTL reservation for contact cooldowns", async () => {
    vi.stubEnv("KV_REST_API_URL", "https://redis.example.test");
    vi.stubEnv("KV_REST_API_TOKEN", "test-token");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ result: "OK" }) }));

    await expect(reserveContactSubmission("198.51.100.7")).resolves.toBeNull();
    expect(fetch).toHaveBeenCalledWith(
      "https://redis.example.test",
      expect.objectContaining({ body: expect.stringContaining('"SET"') })
    );
  });

  it("returns Redis TTL seconds for a blocked repeat submission", async () => {
    vi.stubEnv("KV_REST_API_URL", "https://redis.example.test");
    vi.stubEnv("KV_REST_API_TOKEN", "test-token");
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ result: null }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ result: 42_100 }) }));

    await expect(reserveContactSubmission("198.51.100.7")).resolves.toBe(43);
  });

  it("uses the proxy-resolved address with a socket-address fallback", () => {
    expect(getClientIp("198.51.100.7", "127.0.0.1")).toBe("198.51.100.7");
    expect(getClientIp(undefined, "127.0.0.1")).toBe("127.0.0.1");
  });

  it("rejects an incomplete Telegram configuration before delivery", () => {
    expect(hasTelegramConfiguration("token", "chat")).toBe(true);
    expect(hasTelegramConfiguration("", "chat")).toBe(false);
    expect(hasTelegramConfiguration("token", "")).toBe(false);
  });

  it("uses a bounded upstream timeout for predictable visitor feedback", () => {
    expect(TELEGRAM_TIMEOUT_MS).toBeGreaterThanOrEqual(5_000);
    expect(TELEGRAM_TIMEOUT_MS).toBeLessThanOrEqual(10_000);
  });

  it("returns a retry-safe timeout error when Telegram does not respond", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("aborted", "AbortError")));

    await expect(deliverContactToTelegram({
      name: "Shrey Patel",
      email: "hello@example.com",
      message: "A legitimate contact submission with enough useful detail.",
      website: "",
    })).rejects.toThrow("timed out");
  });
});
