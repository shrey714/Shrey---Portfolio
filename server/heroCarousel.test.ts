import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");
const contentSchemaSource = readFileSync(new URL("./contentValidation.ts", import.meta.url), "utf8");

describe("hero carousel refinement", () => {
  it("uses autoplay and accessible dot navigation without previous or next controls", () => {
    expect(homeSource).toContain("window.setTimeout(() => setActiveHeroSlide((slide) => (slide + 1) % hero.slides.length), 4200)");
    expect(homeSource).toContain('className="hero-carousel-indicators"');
    expect(homeSource).toContain('role="tablist"');
    expect(homeSource).not.toContain("hero-carousel-control");
    expect(homeSource).not.toContain("hero-carousel-actions");
    expect(homeSource).not.toContain("previousVisualLabel");
    expect(homeSource).not.toContain("nextVisualLabel");
  });

  it("removes obsolete hero arrow-control styles and editable labels", () => {
    expect(cssSource).not.toContain(".hero-carousel-control");
    expect(cssSource).not.toContain(".hero-carousel-actions");
    expect(contentSchemaSource).not.toContain("previousVisualLabel");
    expect(contentSchemaSource).not.toContain("nextVisualLabel");
  });
});
