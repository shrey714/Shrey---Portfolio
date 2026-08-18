import { describe, expect, it } from "vitest";
import { getAchievementVisualKind } from "./achievementPresentation";

describe("achievement presentation", () => {
  it("renders a selected image even when Decap leaves the visual selector on Placeholder", () => {
    expect(getAchievementVisualKind({ visualMode: "placeholder", visualImageUrl: "/api/media/portfolio/event-mark.png" })).toBe("image");
  });

  it("uses the fallback icon only when no achievement image is saved", () => {
    expect(getAchievementVisualKind({ visualMode: "placeholder", visualImageUrl: null })).toBe("icon");
  });
});
