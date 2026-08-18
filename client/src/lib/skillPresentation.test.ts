import { describe, expect, it } from "vitest";
import { getSkillVisual, getTechnologyMark, splitSkillTools } from "./skillPresentation";

describe("skill presentation helpers", () => {
  it("splits editable skill text into compact technology tokens", () => {
    expect(splitSkillTools("React Native · Expo · Firebase")).toEqual(["React Native", "Expo", "Firebase"]);
  });

  it("uses recognisable marks and a safe fallback for editable technologies", () => {
    expect(getTechnologyMark("React Native")).toBe("RN");
    expect(getTechnologyMark("Firebase")).toBe("FI");
  });

  it("returns a visual treatment for known and newly added skill groups", () => {
    expect(getSkillVisual("Backend technologies").Icon).toBeDefined();
    expect(getSkillVisual("New category").Icon).toBeDefined();
  });
});
