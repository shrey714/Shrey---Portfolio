export type AchievementVisualInput = {
  visualMode: string;
  visualImageUrl?: string | null;
};

/**
 * Media selected in Decap is intentional content. Render it whenever a valid
 * URL is present, even if the editor's mode selector was left on Placeholder.
 */
export function getAchievementVisualKind({ visualImageUrl }: AchievementVisualInput): "image" | "icon" {
  return visualImageUrl?.trim() ? "image" : "icon";
}
