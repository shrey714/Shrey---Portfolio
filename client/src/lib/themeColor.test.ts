import { describe, expect, it } from "vitest";
import { getDarkThemeColorMetaContent, getThemeColor, getThemeColorMetaContent } from "./themeColor";

describe("themeColor", () => {
  it("uses the portfolio surface colors for light and dark browser chrome", () => {
    expect(getThemeColor("light")).toBe("#f6f4ef");
    expect(getThemeColor("dark")).toBe("#101113");
  });

  it("parses the single initial theme-color declaration used by the runtime initializer", () => {
    const markup = '<meta name="theme-color" content="#f6f4ef" />';

    expect(getThemeColorMetaContent(markup)).toBe("#f6f4ef");
    expect(getDarkThemeColorMetaContent(markup)).toBeNull();
  });
});
