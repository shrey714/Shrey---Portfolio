import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const dotsSource = readFileSync(new URL("../client/src/components/ProjectImageDots.tsx", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("project visual carousel contract", () => {
  it("keeps all existing built-in project visual layout branches intact", () => {
    for (const layout of ["layout-1", "layout-2", "layout-3", "layout-4"]) {
      expect(homeSource).toContain(`project.visualLayout === "${layout}"`);
    }
    expect(homeSource).toContain('return <div className="rounded-[1rem] border border-white/10 bg-[#202124] p-3 sm:p-4">');
  });

  it("uses Embla autoplay with dot pagination for multi-image visuals", () => {
    expect(homeSource).toContain('import useEmblaCarousel from "embla-carousel-react"');
    expect(homeSource).toContain('import Autoplay from "embla-carousel-autoplay"');
    expect(homeSource).toContain('Autoplay({ delay: 4200, stopOnInteraction: false, stopOnMouseEnter: true })');
    expect(homeSource).toContain("project-image-track");
    expect(homeSource).toContain("ProjectImageDots");
    expect(dotsSource).toContain("project-image-dot");
    expect(homeSource).not.toContain("Custom project image");
    expect(homeSource).not.toContain("Previous project image");
    expect(homeSource).not.toContain("Next project image");
    expect(cssSource).toContain(".project-image-track");
    expect(cssSource).toContain(".project-image-dot");
    expect(cssSource).toContain("flex: 0 0 100%;");
    expect(cssSource).not.toContain(".project-image-control");
  });
});
