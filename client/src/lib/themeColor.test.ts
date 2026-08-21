import { describe, expect, it } from "vitest";
import { getDarkThemeColorMetaContent, getThemeColor, getThemeColorMetaContent } from "./themeColor";

describe("themeColor", () => {
  it("uses the portfolio surface colors for light and dark browser chrome", () => {
    expect(getThemeColor("light")).toBe("#f6f4ef");
    expect(getThemeColor("dark")).toBe("#101113");
  });

  it("parses both initial Safari theme-color metadata declarations", () => {
    const markup = '<meta name="theme-color" content="#f6f4ef" /> <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#101113" />';

    expect(getThemeColorMetaContent(markup)).toBe("#f6f4ef");
    expect(getDarkThemeColorMetaContent(markup)).toBe("#101113");
  });
});
