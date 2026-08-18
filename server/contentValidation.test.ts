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

  it("rejects an unsupported project visual kind", () => {
    const invalid = structuredClone(portfolioContent) as typeof portfolioContent;
    invalid.work.projects[0].kind = "unknown";
    expect(() => validatePortfolioContent(invalid)).toThrow(/kind/);
  });

  it("requires at least one structured experience entry", () => {
    const invalid = structuredClone(portfolioContent) as typeof portfolioContent;
    invalid.experience.entries = [];
    expect(() => validatePortfolioContent(invalid)).toThrow(/entries/);
  });
});
