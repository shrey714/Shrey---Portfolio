import { describe, expect, it } from "vitest";
import { isAllowedPortfolioMediaPath, mediaDeliveryCandidates, mediaLibraryScript } from "./media";

describe("portfolio media paths", () => {
  it("allows only normalized paths within the private portfolio media namespace", () => {
    expect(isAllowedPortfolioMediaPath("portfolio/hero/shrey-hero-editorial.webp")).toBe(true);
    expect(isAllowedPortfolioMediaPath("portfolio/resume/shrey-patel.pdf")).toBe(true);
    expect(isAllowedPortfolioMediaPath("other/hero.webp")).toBe(false);
    expect(isAllowedPortfolioMediaPath("portfolio/../secret.txt")).toBe(false);
    expect(isAllowedPortfolioMediaPath("portfolio/hero/unsafe file.webp")).toBe(false);
  });

  it("maps Decap's canonical flat public path to category-organized private Blob assets", () => {
    expect(mediaDeliveryCandidates("portfolio/1786995073404-7608fdc2-Shrey-Patel.pdf")).toEqual([
      "portfolio/1786995073404-7608fdc2-Shrey-Patel.pdf",
      "portfolio/hero/1786995073404-7608fdc2-Shrey-Patel.pdf",
      "portfolio/social/1786995073404-7608fdc2-Shrey-Patel.pdf",
      "portfolio/resume/1786995073404-7608fdc2-Shrey-Patel.pdf",
      "portfolio/uploads/1786995073404-7608fdc2-Shrey-Patel.pdf",
      "1786995073404-7608fdc2-Shrey-Patel.pdf",
    ]);
    expect(mediaDeliveryCandidates("portfolio/resume/shrey-patel.pdf")).toEqual(["portfolio/resume/shrey-patel.pdf"]);
    expect(mediaDeliveryCandidates("outside/asset.pdf")).toEqual([]);
  });

  it("allows selecting and uploads every chosen file from the Decap Blob media picker", () => {
    const script = mediaLibraryScript();

    expect(script).toContain('type="file" multiple');
    expect(script).toContain("const files = Array.from(fileInput.files || []);");
    expect(script).toContain("for (const [index, file] of files.entries())");
    expect(script).toContain('setStatus("Uploading " + (index + 1) + " of " + files.length + "…")');
    expect(script).toContain('files.length + " file" + (files.length === 1 ? "" : "s") + " uploaded."');
  });
});
