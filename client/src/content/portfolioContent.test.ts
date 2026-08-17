import { describe, expect, it } from "vitest";
import { portfolioContent } from "./portfolioContent";

describe("portfolio interaction content", () => {
  it("provides three clearly labeled x-ray lenses for every selected project", () => {
    for (const project of portfolioContent.work.projects) {
      expect(project.xray.lenses).toHaveLength(3);
      expect(project.xray.lenses.map(lens => lens.label)).toEqual(["Interface", "Workflow", "System"]);
      expect(project.xray.openLabel).toBeTruthy();
      expect(project.xray.closeLabel).toBeTruthy();
    }
  });

  it("keeps Field Notes and Debug Mode as editable, non-live content", () => {
    expect(portfolioContent.fieldNotes.entries).toHaveLength(3);
    expect(portfolioContent.fieldNotes.entries.every(note => note.category && note.title && note.text && note.tag)).toBe(true);
    expect(portfolioContent.debug.openLabel).toBeTruthy();
    expect(portfolioContent.debug.gridValue).toContain("column");
  });
});
