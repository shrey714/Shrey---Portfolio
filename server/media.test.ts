import { describe, expect, it } from "vitest";
import { isAllowedPortfolioMediaPath } from "./media";

describe("portfolio media paths", () => {
  it("allows only normalized paths within the private portfolio media namespace", () => {
    expect(isAllowedPortfolioMediaPath("portfolio/hero/shrey-hero-editorial.webp")).toBe(true);
    expect(isAllowedPortfolioMediaPath("portfolio/resume/shrey-patel.pdf")).toBe(true);
    expect(isAllowedPortfolioMediaPath("other/hero.webp")).toBe(false);
    expect(isAllowedPortfolioMediaPath("portfolio/../secret.txt")).toBe(false);
    expect(isAllowedPortfolioMediaPath("portfolio/hero/unsafe file.webp")).toBe(false);
  });
});
