import { describe, expect, it } from "vitest";
import { getAppearanceToggleState } from "./appearanceToggle";

describe("getAppearanceToggleState", () => {
  const labels = { light: "Switch to light mode", dark: "Switch to dark mode" };

  it("exposes the next appearance as the action when light mode is active", () => {
    expect(getAppearanceToggleState(false, labels)).toEqual({
      theme: "light",
      ariaLabel: "Switch to dark mode",
      status: "Light mode active",
    });
  });

  it("exposes the next appearance as the action when dark mode is active", () => {
    expect(getAppearanceToggleState(true, labels)).toEqual({
      theme: "dark",
      ariaLabel: "Switch to light mode",
      status: "Dark mode active",
    });
  });
});
