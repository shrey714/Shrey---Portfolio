export type ThemeColorMode = "light" | "dark";

export const THEME_COLORS: Record<ThemeColorMode, string> = {
  light: "#f6f4ef",
  dark: "#101113",
};

export function getThemeColor(mode: ThemeColorMode) {
  return THEME_COLORS[mode];
}

export function applyThemeEnvironment(mode: ThemeColorMode) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode;
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute("content", getThemeColor(mode));
}
