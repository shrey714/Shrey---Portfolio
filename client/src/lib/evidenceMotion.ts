export type EvidenceBounds = {
  top: number;
  height: number;
  viewportHeight: number;
};

export type EvidenceMotion = {
  translateY: number;
  scale: number;
};

/** Returns a small, bounded scroll-progress transform or null when motion is disabled. */
export function getEvidenceScrollMotion(
  { top, height, viewportHeight }: EvidenceBounds,
  reduceMotion: boolean
): EvidenceMotion | null {
  if (reduceMotion || height <= 0 || viewportHeight <= 0) return null;

  const progress = Math.min(1, Math.max(0, (viewportHeight - top) / (viewportHeight + height)));
  return {
    translateY: Number(((0.5 - progress) * 10).toFixed(2)),
    scale: Number((0.994 + progress * 0.006).toFixed(4)),
  };
}
