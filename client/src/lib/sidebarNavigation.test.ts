import { describe, expect, it } from "vitest";
import { getActiveNavigationIndex, sidebarSectionObserverOptions } from "./sidebarNavigation";

describe("sidebar navigation", () => {
  const ids = ["top", "work", "practice", "achievements", "about", "contact"];

  it("returns the active section position for the sliding selection indicator", () => {
    expect(getActiveNavigationIndex(ids, "achievements")).toBe(3);
  });

  it("keeps the indicator at the first item until a tracked section is active", () => {
    expect(getActiveNavigationIndex(ids, "unknown")).toBe(0);
  });

  it("observes the current reading band without a minimum intersection ratio that excludes long sections", () => {
    expect(sidebarSectionObserverOptions).toEqual({
      rootMargin: "-32% 0px -55% 0px",
      threshold: 0,
    });
  });
});
