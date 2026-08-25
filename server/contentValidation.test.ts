import { describe, expect, it } from "vitest";
import { portfolioContent } from "../content/portfolioContent";
import { validatePortfolioContent } from "./contentValidation";

describe("portfolio content validation", () => {
  it("accepts the editable portfolio source", () => {
    expect(validatePortfolioContent(portfolioContent).identity.name).toBe(portfolioContent.identity.name);
  });

  it("rejects a missing required project visual field", () => {
    const invalid = structuredClone(portfolioContent) as typeof portfolioContent;
    delete (invalid.work.projects[0] as Partial<(typeof portfolioContent.work.projects)[number]>).visualRows;
    expect(() => validatePortfolioContent(invalid)).toThrow(/visualRows/);
  });

  it("rejects an unsupported project visual layout", () => {
    const invalid = structuredClone(portfolioContent) as typeof portfolioContent;
    invalid.work.projects[0].visualLayout = "unknown";
    expect(() => validatePortfolioContent(invalid)).toThrow(/visualLayout/);
  });

  it("requires a custom image when the custom-image layout is selected", () => {
    const invalid = structuredClone(portfolioContent) as typeof portfolioContent;
    invalid.work.projects[0].visualLayout = "custom-image";
    invalid.work.projects[0].visualImageUrls = [];
    expect(() => validatePortfolioContent(invalid)).toThrow(/visualImageUrls/);
  });

  it("accepts multiple custom project images with per-image theme visibility", () => {
    const valid = structuredClone(portfolioContent) as typeof portfolioContent;
    valid.work.projects[0].visualLayout = "custom-image";
    valid.work.projects[0].visualImageUrls = [
      { image: "/api/media/portfolio/project/one.webp", showInLight: true, showInDark: false },
      { image: "https://example.com/two.webp", showInLight: false, showInDark: true },
    ];
    expect(validatePortfolioContent(valid).work.projects[0].visualImageUrls).toHaveLength(2);
  });

  it("keeps existing editable custom project images as valid structured theme-aware entries", () => {
    const imageEntries = portfolioContent.work.projects.flatMap(project => project.visualImageUrls ?? []);

    expect(imageEntries.length).toBeGreaterThan(0);
    imageEntries.forEach(entry => {
      expect(typeof entry).toBe("object");
      expect(entry).toMatchObject({ image: expect.any(String), showInLight: expect.any(Boolean), showInDark: expect.any(Boolean) });
      expect(entry.showInLight || entry.showInDark).toBe(true);
    });
  });

  it("keeps legacy string image lists valid while projects are migrated to theme-aware image entries", () => {
    const legacy = structuredClone(portfolioContent) as { work: { projects: Array<Record<string, unknown>> } };
    legacy.work.projects[0].visualLayout = "custom-image";
    legacy.work.projects[0].visualImageUrls = ["/api/media/portfolio/project/one.webp"];
    expect(validatePortfolioContent(legacy).work.projects[0].visualImageUrls).toHaveLength(1);
  });

  it("requires each structured image to be enabled for at least one theme", () => {
    const invalid = structuredClone(portfolioContent) as typeof portfolioContent;
    invalid.work.projects[0].visualLayout = "custom-image";
    invalid.work.projects[0].visualImageUrls = [{ image: "/api/media/portfolio/project/one.webp", showInLight: false, showInDark: false }];
    expect(() => validatePortfolioContent(invalid)).toThrow(/Enable the image for light mode/);
  });

  it("rejects the retired singular project-image field", () => {
    const invalid = structuredClone(portfolioContent) as typeof portfolioContent & { work: { projects: Array<Record<string, unknown>> } };
    invalid.work.projects[0].visualImageUrl = "/api/media/portfolio/project/legacy.webp";
    expect(() => validatePortfolioContent(invalid)).toThrow(/visualImageUrl/);
  });

  it("rejects an empty custom project image list", () => {
    const invalid = structuredClone(portfolioContent) as typeof portfolioContent;
    invalid.work.projects[0].visualLayout = "custom-image";
    invalid.work.projects[0].visualImageUrls = [];
    expect(() => validatePortfolioContent(invalid)).toThrow(/visualImageUrls/);
  });

  it("rejects a project without a source destination", () => {
    const invalid = structuredClone(portfolioContent) as typeof portfolioContent;
    delete (invalid.work.projects[0] as Partial<(typeof portfolioContent.work.projects)[number]>).repositoryUrl;
    expect(() => validatePortfolioContent(invalid)).toThrow(/repositoryUrl/);
  });

  it("requires at least one structured experience entry", () => {
    const invalid = structuredClone(portfolioContent) as typeof portfolioContent;
    invalid.experience.entries = [];
    expect(() => validatePortfolioContent(invalid)).toThrow(/entries/);
  });

  it("requires an image when an achievement uses the image visual mode", () => {
    const invalid = structuredClone(portfolioContent) as typeof portfolioContent;
    invalid.achievements.entries[0].visualImageUrl = "";
    expect(() => validatePortfolioContent(invalid)).toThrow(/visualImageUrl/);
  });
});
