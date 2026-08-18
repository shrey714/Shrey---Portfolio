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
});
