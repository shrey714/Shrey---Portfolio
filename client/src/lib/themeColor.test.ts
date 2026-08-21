import { describe, expect, it } from "vitest";
import { getThemeColor } from "./themeColor";

describe("themeColor", () => {
  it("keeps the browser surface colors aligned with the portfolio themes", () => {
    expect(getThemeColor("light")).toBe("#f6f4ef");
    expect(getThemeColor("dark")).toBe("#101113");
  });
});
