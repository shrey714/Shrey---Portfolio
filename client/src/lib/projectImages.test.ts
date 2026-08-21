import { describe, expect, it } from "vitest";
import { getNextProjectImageIndex, getProjectImageUrls } from "./projectImages";

describe("project image carousel helpers", () => {
  it("prefers the multi-image list when present", () => {
    expect(getProjectImageUrls({ visualImageUrl: "/legacy.webp", visualImageUrls: ["/one.webp", "/two.webp"] })).toEqual(["/one.webp", "/two.webp"]);
  });

  it("keeps the existing singular custom image format working", () => {
    expect(getProjectImageUrls({ visualImageUrl: "/legacy.webp" })).toEqual(["/legacy.webp"]);
    expect(getProjectImageUrls({})).toEqual([]);
  });

  it("wraps previous and next navigation around the image list", () => {
    expect(getNextProjectImageIndex(0, -1, 3)).toBe(2);
    expect(getNextProjectImageIndex(2, 1, 3)).toBe(0);
    expect(getNextProjectImageIndex(0, 1, 0)).toBe(0);
  });
});
