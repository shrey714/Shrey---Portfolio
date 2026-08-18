export function getActiveNavigationIndex(ids: readonly string[], activeId: string): number {
  const index = ids.indexOf(activeId);
  return index >= 0 ? index : 0;
}
