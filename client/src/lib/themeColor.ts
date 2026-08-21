export type ThemeColorMode = "light" | "dark";

export const THEME_COLORS: Record<ThemeColorMode, string> = {
  light: "#f6f4ef",
  dark: "#101113",
};

export function getThemeColor(mode: ThemeColorMode) {
  return THEME_COLORS[mode];
}

export function applyThemeColor(mode: ThemeColorMode) {
  if (typeof document === "undefined") return;

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  meta?.setAttribute("content", getThemeColor(mode));
  document.documentElement.style.colorScheme = mode;
}

export function getThemeColorMetaContent(documentMarkup: string) {
  return documentMarkup.match(/<meta name="theme-color" content="([^"]+)"\s*\/>/)?.[1] ?? null;
}

export function getDarkThemeColorMetaContent(documentMarkup: string) {
  return documentMarkup.match(/<meta name="theme-color" media="\(prefers-color-scheme: dark\)" content="([^"]+)"\s*\/>/)?.[1] ?? null;
}
