export const SCROLL_TO_TOP_VISIBILITY_THRESHOLD = 560;

export function shouldShowScrollToTop(scrollY: number) {
  return Number.isFinite(scrollY) && scrollY > SCROLL_TO_TOP_VISIBILITY_THRESHOLD;
}

export function getScrollToTopBehavior(prefersReducedMotion: boolean): ScrollBehavior {
  return prefersReducedMotion ? "auto" : "smooth";
}
