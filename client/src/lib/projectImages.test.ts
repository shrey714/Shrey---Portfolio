import { describe, expect, it } from "vitest";
import { getPreservedProjectImageIndex, getProjectImageUrls } from "./projectImages";

describe("project image carousel helpers", () => {
  it("keeps legacy image URL lists visible in both themes", () => {
    expect(getProjectImageUrls({ visualImageUrls: ["/one.webp", "/two.webp"] })).toEqual(["/one.webp", "/two.webp"]);
    expect(getProjectImageUrls({ visualImageUrls: ["/one.webp", "/two.webp"] }, "dark")).toEqual(["/one.webp", "/two.webp"]);
  });

  it("filters structured image entries by the active theme", () => {
    const project = {
      visualImageUrls: [
        { image: "/light.webp", showInLight: true, showInDark: false },
        { image: "/dark.webp", showInLight: false, showInDark: true },
        { image: "/both.webp", showInLight: true, showInDark: true },
      ],
    };

    expect(getProjectImageUrls(project, "light")).toEqual(["/light.webp", "/both.webp"]);
    expect(getProjectImageUrls(project, "dark")).toEqual(["/dark.webp", "/both.webp"]);
  });

  it("defaults newly structured images to both themes when no checkbox value exists", () => {
    expect(getProjectImageUrls({ visualImageUrls: [{ image: "/both.webp" }] }, "dark")).toEqual(["/both.webp"]);
  });

  it("returns no project images when the single repeatable field is empty", () => {
    expect(getProjectImageUrls({ visualImageUrls: [] })).toEqual([]);
    expect(getProjectImageUrls({})).toEqual([]);
  });

  it("keeps the same image selected when it remains available in the next theme", () => {
    expect(getPreservedProjectImageIndex(["/one.webp", "/two.webp", "/three.webp"], ["/two.webp", "/three.webp"], 2)).toBe(1);
  });

  it("keeps the current position when its image is unavailable but that position still exists", () => {
    expect(getPreservedProjectImageIndex(["/one.webp", "/two.webp", "/three.webp"], ["/four.webp", "/five.webp", "/six.webp"], 2)).toBe(2);
  });

  it("falls back to the nearest valid position when the next theme has fewer images", () => {
    expect(getPreservedProjectImageIndex(["/one.webp", "/two.webp", "/three.webp", "/four.webp", "/five.webp"], ["/one.webp", "/two.webp", "/three.webp"], 4)).toBe(2);
  });

});
