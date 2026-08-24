import { describe, expect, it } from "vitest";
import { getActiveNavigationIndex, resolveSidebarObserverActiveId, sidebarSectionObserverOptions } from "./sidebarNavigation";

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

  it("holds a clicked distant destination while intermediate sections cross the observer band", () => {
    expect(resolveSidebarObserverActiveId([
      { target: { id: "work" }, isIntersecting: true, intersectionRatio: 0.3 },
      { target: { id: "practice" }, isIntersecting: true, intersectionRatio: 0.4 },
    ], "contact")).toEqual({ activeId: null, destinationReached: false });
  });

  it("releases the click lock only when the clicked destination reaches the observer band", () => {
    expect(resolveSidebarObserverActiveId([
      { target: { id: "contact" }, isIntersecting: true, intersectionRatio: 0.06 },
    ], "contact")).toEqual({ activeId: "contact", destinationReached: true });
  });
});
