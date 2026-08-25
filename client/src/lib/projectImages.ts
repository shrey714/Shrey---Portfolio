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
