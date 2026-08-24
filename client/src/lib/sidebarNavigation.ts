export const sidebarSectionObserverOptions = {
  rootMargin: "-32% 0px -55% 0px",
  // A narrow observer band lets the current reading position win. Threshold 0
  // is essential for a long section such as Selected Work: its intersection
  // ratio can stay below 5% even while it fills the reading band.
  threshold: 0,
};

type SidebarObservedEntry = {
  target: { id: string };
  isIntersecting: boolean;
  intersectionRatio: number;
};

export function resolveSidebarObserverActiveId(entries: readonly SidebarObservedEntry[], destinationLock: string | null) {
  if (destinationLock) {
    const destinationReached = entries.some((entry) => entry.isIntersecting && entry.target.id === destinationLock);
    return {
      activeId: destinationReached ? destinationLock : null,
      destinationReached,
    };
  }

  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  return {
    activeId: visible?.target.id ?? null,
    destinationReached: false,
  };
}

export function getActiveNavigationIndex(ids: readonly string[], activeId: string) {
  const index = ids.indexOf(activeId);
  return index >= 0 ? index : 0;
}
