import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (relativePath: string) => resolve(process.cwd(), relativePath);

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
});
