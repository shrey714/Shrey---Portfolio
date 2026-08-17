import { describe, expect, it } from "vitest";

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

describe("GitHub OAuth configuration", () => {
  it.skipIf(!clientId || !clientSecret || process.env.VALIDATE_GITHUB_OAUTH !== "1")("accepts the configured client credentials", async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    try {
      const response = await fetch(`https://api.github.com/applications/${encodeURIComponent(clientId)}/token`, {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({ access_token: "credential-validation-probe" }),
        signal: controller.signal,
      });

      // The deliberately unknown token produces 404 only after GitHub accepts
      // the OAuth App's client ID and secret. Incorrect client credentials are
      // rejected with 401 before token lookup.
      expect(response.status).toBe(404);
    } finally {
      clearTimeout(timeout);
    }
  }, 10_000);
});
