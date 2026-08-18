import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const contactApiSource = readFileSync(new URL("./contactApi.ts", import.meta.url), "utf8");
const clientEntrySource = readFileSync(new URL("../client/src/entry-client.tsx", import.meta.url), "utf8");

describe("lightweight public contact delivery", () => {
  it("keeps contact submission on a direct JSON endpoint with existing validation and anti-spam controls", () => {
    expect(contactApiSource).toContain('app.post("/api/contact"');
    expect(contactApiSource).toContain("contactSubmissionSchema.safeParse(req.body)");
    expect(contactApiSource).toContain("if (input.website)");
    expect(contactApiSource).toContain("reserveContactSubmission");
    expect(contactApiSource).toContain("deliverContactToTelegram");
  });

  it("keeps the public hydration entry free of the former tRPC and React Query providers", () => {
    expect(clientEntrySource).not.toContain("@trpc/");
    expect(clientEntrySource).not.toContain("@tanstack/react-query");
    expect(clientEntrySource).toContain("hydrateRoot(");
  });
});
