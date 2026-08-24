import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { portfolioContent } from "../content/portfolioContent";
import { validatePortfolioContent } from "./contentValidation";

const sectionFiles = [
  "identity.json", "navigation.json", "hero.json", "work.json", "practice.json", "achievements.json", "about.json",
  "experience.json", "philosophy.json", "contact.json", "footer.json", "ui.json", "seo.json",
];

describe("portfolio section-file composition", () => {
  it("composes every independently editable section into the unchanged public portfolio contract", () => {
    expect(validatePortfolioContent(portfolioContent)).toMatchObject({
      identity: { name: "Shrey Patel" },
      work: { projects: expect.any(Array) },
      seo: { title: expect.any(String) },
    });
    expect(portfolioContent.navigation).toHaveLength(6);
    expect(portfolioContent.work.projects).toHaveLength(5);
  });

  it("keeps one dedicated JSON source file for every focused admin landing-page entry", () => {
    const contentDirectory = resolve(process.cwd(), "content/portfolio");
    for (const filename of sectionFiles) {
      expect(existsSync(resolve(contentDirectory, filename))).toBe(true);
    }
    expect(existsSync(resolve(process.cwd(), "content/portfolio.json"))).toBe(false);
  });
});
