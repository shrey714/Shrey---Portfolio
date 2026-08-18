import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (relativePath: string) => resolve(process.cwd(), relativePath);

type Rgb = { red: number; green: number; blue: number };

function hexToRgb(hex: string): Rgb {
  const channels = hex.slice(1).match(/.{2}/g)?.map((value) => Number.parseInt(value, 16));
  if (!channels || channels.length !== 3) throw new Error(`Expected a six-digit hex color, received ${hex}`);
  return { red: channels[0], green: channels[1], blue: channels[2] };
}

function composite(foreground: Rgb, background: Rgb, alpha: number): Rgb {
  return {
    red: foreground.red * alpha + background.red * (1 - alpha),
    green: foreground.green * alpha + background.green * (1 - alpha),
    blue: foreground.blue * alpha + background.blue * (1 - alpha),
  };
}

function relativeLuminanceFromRgb({ red, green, blue }: Rgb) {
  const [linearRed, linearGreen, linearBlue] = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue;
}

function relativeLuminance(hex: string) {
  return relativeLuminanceFromRgb(hexToRgb(hex));
}

function contrastRatio(foreground: string, background: string) {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort((first, second) => second - first);
  return (lighter + 0.05) / (darker + 0.05);
}

function renderedContrast(foreground: Rgb, background: Rgb) {
  const [lighter, darker] = [relativeLuminanceFromRgb(foreground), relativeLuminanceFromRgb(background)].sort((first, second) => second - first);
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
    expect(styles).toContain(".theme-footer p:last-child {\n  color: #565450;");
    expect(styles).toContain("background: rgba(27, 28, 29, 0.72);");
    expect(styles).toContain(".hero-detail .hero-visual-topline { color: #565450; }");
    expect(styles).toContain("--primary: #3455b8;");
    expect(home).toContain('text-[#5f5d59]');
    expect(home).toContain('text-[#3455b8]');
    expect(home).not.toContain('text-[#777571]');
    expect(home).not.toContain('text-[#706e6a]');
    expect(home).not.toContain('text-[#456fe8]">{principle.number}');
    expect(home).not.toContain('text-[#767570]');
    expect(home).not.toContain('text-[#73716e]');
    expect(home).not.toContain('text-[#9b9994]');
    expect(home).not.toContain('<span className="px-1 text-[#aaa8a3]">·</span>');
    expect(home).not.toContain('text-[#8e8c87]');
    expect(contrastRatio("#5f5d59", "#eeece6")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#3455b8", "#f6f4ef")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#3455b8", "#eeece6")).toBeGreaterThanOrEqual(4.5);
  });

  it("preserves AA contrast after footer and hero overlay color compositing", async () => {
    const styles = await readFile(projectFile("client/src/index.css"), "utf8");
    const porcelain = hexToRgb("#f6f4ef");
    const footerForeground = hexToRgb("#565450");
    const heroBase = hexToRgb("#f1efe9");
    const annotationBackground = composite(hexToRgb("#1b1c1d"), heroBase, 0.72);

    expect(styles).toContain(".theme-footer p:last-child {\n  color: #565450;");
    expect(styles).toContain("background: rgba(27, 28, 29, 0.72);");
    expect(styles).toContain(".hero-detail .hero-visual-topline { color: #565450; }");
    expect(renderedContrast(footerForeground, porcelain)).toBeGreaterThanOrEqual(4.5);
    expect(renderedContrast(hexToRgb("#ffffff"), annotationBackground)).toBeGreaterThanOrEqual(4.5);
    expect(renderedContrast(footerForeground, heroBase)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps unused data-client providers out of the public bootstrap bundle", async () => {
    const entry = await readFile(projectFile("client/src/main.tsx"), "utf8");

    expect(entry).not.toContain("@tanstack/react-query");
    expect(entry).not.toContain("@trpc/client");
    expect(entry).not.toContain("superjson");
    expect(entry).not.toContain("trpc.Provider");
    expect(entry).toContain('createRoot(document.getElementById("root")!).render(<App />);');
  });

  it("keeps unused routing and UI utility modules out of the public shell", async () => {
    const [app, ssrEntry, boundary] = await Promise.all([
      readFile(projectFile("client/src/App.tsx"), "utf8"),
      readFile(projectFile("client/src/entry-server.tsx"), "utf8"),
      readFile(projectFile("client/src/components/ErrorBoundary.tsx"), "utf8"),
    ]);

    expect(app).not.toContain("wouter");
    expect(app).not.toContain("NotFound");
    expect(app).toContain("<Home />");
    expect(ssrEntry).not.toContain("wouter");
    expect(boundary).not.toContain("@/lib/utils");
  });

  it("uses the lightweight compatibility runtime for client hydration and SSR", async () => {
    const [clientEntry, serverEntry, clientConfig, ssrConfig] = await Promise.all([
      readFile(projectFile("client/src/entry-client.tsx"), "utf8"),
      readFile(projectFile("client/src/entry-server.tsx"), "utf8"),
      readFile(projectFile("vite.config.ts"), "utf8"),
      readFile(projectFile("vite.config.ssr.ts"), "utf8"),
    ]);

    expect(clientEntry).toContain('import { hydrate } from "preact";');
    expect(serverEntry).toContain('import renderToString from "preact-render-to-string";');
    expect(clientConfig).toContain('"react": "preact/compat"');
    expect(ssrConfig).toContain('"react": "preact/compat"');
  });
});
