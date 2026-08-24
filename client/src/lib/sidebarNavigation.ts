export const sidebarSectionObserverOptions: IntersectionObserverInit = {
  rootMargin: "-32% 0px -55% 0px",
  // A narrow observer band lets the current reading position win. Threshold 0
  // is essential for a long section such as Selected Work: its intersection
  // ratio can stay below 5% even while it fills the reading band.
  threshold: 0,
};

export function getActiveNavigationIndex(ids: readonly string[], activeId: string) {
  const index = ids.indexOf(activeId);
  return index >= 0 ? index : 0;
}
