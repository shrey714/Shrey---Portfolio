import { describe, expect, it } from "vitest";
import { contactSubmissionSchema, formatTelegramContactMessage, getClientIp, hasTelegramConfiguration, retryAfterSeconds } from "./contact";

describe("contact submission security", () => {
  it("rejects malformed, oversized, and honeypot submissions", () => {
    expect(contactSubmissionSchema.safeParse({ name: "A", email: "not-an-email", message: "short", website: "bot.example" }).success).toBe(false);
    expect(contactSubmissionSchema.safeParse({ name: "Shrey Patel", email: "hello@example.com", message: "A legitimate project enquiry with enough useful context.", website: "" }).success).toBe(true);
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

  it("uses the proxy-resolved address with a socket-address fallback", () => {
    expect(getClientIp("198.51.100.7", "127.0.0.1")).toBe("198.51.100.7");
    expect(getClientIp(undefined, "127.0.0.1")).toBe("127.0.0.1");
  });

  it("rejects an incomplete Telegram configuration before delivery", () => {
    expect(hasTelegramConfiguration("token", "chat")).toBe(true);
    expect(hasTelegramConfiguration("", "chat")).toBe(false);
    expect(hasTelegramConfiguration("token", "")).toBe(false);
  });
});
