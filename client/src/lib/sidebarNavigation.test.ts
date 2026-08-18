import { describe, expect, it } from "vitest";
import { getActiveNavigationIndex } from "./sidebarNavigation";

describe("sidebar navigation", () => {
  const ids = ["top", "work", "practice", "achievements", "about", "contact"];

  it("returns the active section position for the sliding selection indicator", () => {
    expect(getActiveNavigationIndex(ids, "achievements")).toBe(3);
  });

  it("keeps the indicator at the first item until a tracked section is active", () => {
    expect(getActiveNavigationIndex(ids, "unknown")).toBe(0);
  });
});
