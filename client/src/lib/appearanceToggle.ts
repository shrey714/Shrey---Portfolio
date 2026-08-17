export function getAppearanceToggleState(
  isDark: boolean,
  labels: { light: string; dark: string }
) {
  return {
    theme: isDark ? "dark" : "light",
    ariaLabel: isDark ? labels.light : labels.dark,
    status: isDark ? "Dark mode active" : "Light mode active",
  } as const;
}
