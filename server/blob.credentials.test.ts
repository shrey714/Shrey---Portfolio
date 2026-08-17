import { list } from "@vercel/blob";
import { describe, expect, it } from "vitest";
import { ENV } from "./_core/env";

describe("Vercel Blob credentials", () => {
  it("can list the configured store without modifying any media", async () => {
    expect(ENV.blobReadWriteToken).not.toBe("");
    const result = await list({ token: ENV.blobReadWriteToken, limit: 1 });
    expect(Array.isArray(result.blobs)).toBe(true);
  }, 15_000);
});
