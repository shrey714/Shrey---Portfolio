import { describe, expect, it } from "vitest";
import {
  CONTACT_RATE_LIMIT_RETENTION_MS,
  getContactRateLimitCleanupCutoff,
} from "./contactRateLimitCleanup";
import { hasValidCronAuthorization, runContactRateLimitCleanup } from "./scheduledCleanup";

type CapturedResponse = {
  statusCode?: number;
  body?: unknown;
  allow?: string;
};

function createResponse(captured: CapturedResponse) {
  const response = {
    status(code: number) {
      captured.statusCode = code;
      return response;
    },
    json(body: unknown) {
      captured.body = body;
      return response;
    },
    setHeader(name: string, value: string) {
      if (name === "Allow") captured.allow = value;
      return response;
    },
  };
  return response;
}

describe("contact rate-limit cleanup", () => {
  it("retains only the most recent 24 hours of expired cooldown records", () => {
    const now = new Date("2026-08-17T03:00:00.000Z");

    expect(getContactRateLimitCleanupCutoff(now).getTime()).toBe(
      now.getTime() - CONTACT_RATE_LIMIT_RETENTION_MS
    );
  });

  it("accepts only the exact scheduler bearer secret", () => {
    expect(hasValidCronAuthorization("Bearer a-strong-secret", "a-strong-secret")).toBe(true);
    expect(hasValidCronAuthorization("Bearer incorrect", "a-strong-secret")).toBe(false);
    expect(hasValidCronAuthorization(undefined, "a-strong-secret")).toBe(false);
    expect(hasValidCronAuthorization("Bearer a-strong-secret", "")).toBe(false);
  });

  it("rejects unauthenticated scheduled requests before any cleanup query runs", async () => {
    const captured: CapturedResponse = {};

    await runContactRateLimitCleanup(
      { method: "GET", headers: {} } as never,
      createResponse(captured) as never
    );

    expect(captured.statusCode).toBe(401);
    expect(captured.body).toEqual({ error: "unauthorized" });
  });

  it("rejects non-GET requests without running the cleanup", async () => {
    const captured: CapturedResponse = {};

    await runContactRateLimitCleanup(
      { method: "POST", headers: {} } as never,
      createResponse(captured) as never
    );

    expect(captured.statusCode).toBe(405);
    expect(captured.allow).toBe("GET");
    expect(captured.body).toEqual({ error: "method-not-allowed" });
  });
});
