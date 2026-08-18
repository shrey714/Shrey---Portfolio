import { describe, expect, it } from "vitest";
import { SCROLL_TO_TOP_VISIBILITY_THRESHOLD, getScrollToTopBehavior, shouldShowScrollToTop } from "./scrollToTop";

describe("scroll-to-top control", () => {
  it("appears only after the reader has meaningfully moved down the page", () => {
    expect(shouldShowScrollToTop(0)).toBe(false);
    expect(shouldShowScrollToTop(SCROLL_TO_TOP_VISIBILITY_THRESHOLD)).toBe(false);
    expect(shouldShowScrollToTop(SCROLL_TO_TOP_VISIBILITY_THRESHOLD + 1)).toBe(true);
  });

  it("uses an instant return for reduced-motion users", () => {
    expect(getScrollToTopBehavior(false)).toBe("smooth");
    expect(getScrollToTopBehavior(true)).toBe("auto");
  });
});
