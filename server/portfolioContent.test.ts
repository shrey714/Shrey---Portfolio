import { describe, expect, it } from "vitest";
import { portfolioContent } from "../client/src/content/portfolioContent";

describe("portfolio micro case-study content", () => {
  it("provides three editable, labelled walkthrough steps for every selected project", () => {
    for (const project of portfolioContent.work.projects) {
      expect(project.caseStudy.steps).toHaveLength(3);
      expect(project.caseStudy.controlsLabel).toContain(project.name);

      for (const step of project.caseStudy.steps) {
        expect(step.label.trim()).not.toHaveLength(0);
        expect(step.title.trim()).not.toHaveLength(0);
        expect(step.text.trim()).not.toHaveLength(0);
        expect(step.signal.trim()).not.toHaveLength(0);
      }
    }
  });
});
