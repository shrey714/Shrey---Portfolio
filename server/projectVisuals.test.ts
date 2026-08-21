import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("project visual carousel contract", () => {
  it("keeps all existing built-in project visual layout branches intact", () => {
    for (const layout of ["layout-1", "layout-2", "layout-3", "layout-4"]) {
      expect(homeSource).toContain(`project.visualLayout === "${layout}"`);
    }
    expect(homeSource).toContain('return <div className="rounded-[1rem] border border-white/10 bg-[#202124] p-3 sm:p-4">');
  });

  it("uses a horizontal composited transform transition for multi-image visuals", () => {
    expect(homeSource).toContain("project-image-track");
    expect(homeSource).toContain("translate3d(-${activeIndex * (100 / imageCount)}%, 0, 0)");
    expect(cssSource).toContain(".project-image-track");
    expect(cssSource).toContain("transition: transform 260ms cubic-bezier(0.23, 1, 0.32, 1);");
  });
});
