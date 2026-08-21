import { describe, expect, it } from "vitest";
import { getProjectImageUrls } from "./projectImages";

describe("project image carousel helpers", () => {
  it("prefers the multi-image list when present", () => {
    expect(getProjectImageUrls({ visualImageUrls: ["/one.webp", "/two.webp"] })).toEqual(["/one.webp", "/two.webp"]);
  });

  it("returns no project images when the single repeatable field is empty", () => {
    expect(getProjectImageUrls({ visualImageUrls: [] })).toEqual([]);
    expect(getProjectImageUrls({})).toEqual([]);
  });

});
