import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (relativePath: string) => resolve(process.cwd(), relativePath);

function relativeLuminance(hex: string) {
  const channels = hex.slice(1).match(/.{2}/g)?.map((value) => Number.parseInt(value, 16) / 255);
  if (!channels || channels.length !== 3) throw new Error(`Expected a six-digit hex color, received ${hex}`);

  const [red, green, blue] = channels.map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string) {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort((first, second) => second - first);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Lighthouse regressions", () => {
  it("keeps viewport zoom available for low-vision users", async () => {
    const document = await readFile(projectFile("client/index.html"), "utf8");

    expect(document).toContain('name="viewport" content="width=device-width, initial-scale=1.0"');
    expect(document).not.toContain("maximum-scale");
  });

  it("does not request analytics when its optional deployment values are unavailable", async () => {
    const document = await readFile(projectFile("client/index.html"), "utf8");

    expect(document).toContain('endpoint.startsWith("%")');
    expect(document).not.toContain('<script defer src="%VITE_ANALYTICS_ENDPOINT%/umami"');
  });

  it("loads the unchanged Google font families without blocking the initial render", async () => {
    const document = await readFile(projectFile("client/index.html"), "utf8");

    expect(document).toContain('rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display');
    expect(document).toContain('rel="stylesheet" media="print" onload="this.media=\'all\'"');
    expect(document).toContain("<noscript><link");
  });

  it("prioritizes the hero while deferring below-fold visual media", async () => {
    const home = await readFile(projectFile("client/src/pages/Home.tsx"), "utf8");

    expect(home).toContain('fetchPriority="high"');
    expect(home).toContain('media="(max-width: 767px)"');
    expect(home).toContain('shrey-hero-editorial-768.webp');
    expect(home).toContain('loading="lazy" decoding="async" width={32} height={32}');
    expect(home).toContain('loading="lazy" decoding="async" className="h-full w-full object-cover"');
  });

  it("lets the visible desktop identity provide its own accessible link name", async () => {
    const home = await readFile(projectFile("client/src/pages/Home.tsx"), "utf8");

    expect(home).toContain('<a href="#top"><p className="text-sm font-semibold tracking-[-0.04em]">');
  });

  it("keeps the hero visual selectors at accessible hit-area dimensions", async () => {
    const styles = await readFile(projectFile("client/src/index.css"), "utf8");

    expect(styles).toContain("height: 1.5rem;");
    expect(styles).toContain("width: 1.5rem;");
    expect(styles).toContain(".hero-carousel-dot::before");
  });

  it("uses Axe AA-safe colors for the PageSpeed-flagged desktop text", async () => {
    const [home, styles] = await Promise.all([
      readFile(projectFile("client/src/pages/Home.tsx"), "utf8"),
      readFile(projectFile("client/src/index.css"), "utf8"),
    ]);

    expect(styles).toContain("color: #5f5d59;");
    expect(styles).toContain("--primary: #3455b8;");
    expect(home).toContain('text-[#5f5d59]');
    expect(home).toContain('text-[#3455b8]');
    expect(home).not.toContain('text-[#777571]');
    expect(home).not.toContain('text-[#706e6a]');
    expect(home).not.toContain('text-[#456fe8]">{principle.number}');
    expect(contrastRatio("#5f5d59", "#eeece6")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#3455b8", "#f6f4ef")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#3455b8", "#eeece6")).toBeGreaterThanOrEqual(4.5);
  });
});
