import { describe, expect, it } from "vitest";
import { getProjectImageUrls } from "./projectImages";

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

});
