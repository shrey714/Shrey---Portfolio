import { describe, expect, it } from "vitest";
import portfolioContent from "../content/portfolio.json";
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
    expect(() => validatePortfolioContent(invalid)).toThrow(/visualImageUrl/);
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
