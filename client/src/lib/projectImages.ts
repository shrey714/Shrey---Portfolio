export type ProjectImageTheme = "light" | "dark";

export type ThemeProjectImage = {
  image: string;
  showInLight?: boolean;
  showInDark?: boolean;
};

export type ProjectImageSource = {
  visualImageUrls?: Array<string | ThemeProjectImage>;
};

export function getProjectImageUrls(project: ProjectImageSource, theme: ProjectImageTheme = "light") {
  return (project.visualImageUrls ?? []).flatMap((entry) => {
    if (typeof entry === "string") return [entry];

    const visibleInTheme = theme === "light" ? entry.showInLight !== false : entry.showInDark !== false;
    return entry.image && visibleInTheme ? [entry.image] : [];
  });
}

export function getPreservedProjectImageIndex(previousImageUrls: string[], nextImageUrls: string[], currentIndex: number) {
  if (nextImageUrls.length === 0) return 0;

  const currentImageUrl = previousImageUrls[currentIndex];
  const matchingImageIndex = currentImageUrl ? nextImageUrls.indexOf(currentImageUrl) : -1;
  if (matchingImageIndex >= 0) return matchingImageIndex;

  return Math.min(Math.max(currentIndex, 0), nextImageUrls.length - 1);
}
