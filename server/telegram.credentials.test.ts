import { describe, expect, it } from "vitest";

describe("Telegram credential configuration", () => {
  it("authenticates the configured bot token with Telegram", async () => {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    expect(token, "TELEGRAM_BOT_TOKEN must be configured for contact delivery").toBeTruthy();

    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const payload = (await response.json()) as { ok?: boolean; result?: { is_bot?: boolean } };

    expect(response.ok).toBe(true);
    expect(payload.ok).toBe(true);
    expect(payload.result?.is_bot).toBe(true);
  }, 15_000);
});
