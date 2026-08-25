import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const dotsSource = readFileSync(new URL("../client/src/components/ProjectImageDots.tsx", import.meta.url), "utf8");
const emblaSource = readFileSync(new URL("../client/src/components/EmblaProjectImageCarousel.tsx", import.meta.url), "utf8");
const staticSource = readFileSync(new URL("../client/src/components/StaticProjectImageCarousel.tsx", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("project visual carousel contract", () => {
  it("keeps all existing built-in project visual layout branches intact", () => {
    for (const layout of ["layout-1", "layout-2", "layout-3", "layout-4"]) {
      expect(homeSource).toContain(`project.visualLayout === "${layout}"`);
      expect(homeSource).toContain("project-evidence--${project.visualLayout}");
    }
    expect(homeSource).toContain('return <div className="rounded-[1rem] border border-white/10 bg-[#202124] p-3 sm:p-4">');
    for (const layout of ["layout-1", "layout-2", "layout-3", "layout-4", "layout-5"]) {
      expect(cssSource).toContain(`.project-evidence--${layout}`);
    }
    expect(homeSource).toContain("project-visual-header");
    expect(homeSource).toContain("project-visual-row-line");
    expect(cssSource).toContain(".project-visual-header {");
    expect(cssSource).toContain(".project-visual-row-line {");
    expect(cssSource).toContain(".dark .portfolio .project-visual-header {");
    expect(cssSource).toContain("color: rgba(255, 255, 255, 0.6);");
    expect(homeSource).not.toContain('project.visualLayout.replace("layout-", "Layout ")');
    expect(homeSource).toContain('className="max-w-none text-xs font-medium tracking-[-0.02em] text-white/80 sm:text-sm"');
  });

  it("uses client-only Embla autoplay with an SSR-safe static fallback and dot pagination", () => {
    expect(homeSource).toContain('import("@/components/EmblaProjectImageCarousel")');
    expect(homeSource).not.toContain('import useEmblaCarousel from "embla-carousel-react"');
    expect(homeSource).toContain('if (ClientCarousel) return <ClientCarousel');
    expect(emblaSource).toContain('import useEmblaCarousel from "embla-carousel-react"');
    expect(emblaSource).toContain('import Autoplay from "embla-carousel-autoplay"');
    expect(emblaSource).toContain('Autoplay({ delay: 4200, stopOnInteraction: false, stopOnMouseEnter: true })');
    expect(homeSource).toContain("StaticProjectImageCarousel");
    expect(staticSource).toContain("project-image-track");
    expect(staticSource).toContain("ProjectImageDots");
    expect(dotsSource).toContain("project-image-dot");
    expect(homeSource).not.toContain("Custom project image");
    expect(homeSource).not.toContain("Previous project image");
    expect(homeSource).not.toContain("Next project image");
    expect(cssSource).toContain(".project-image-track");
    expect(cssSource).toContain(".project-image-dot");
    expect(cssSource).toContain("flex: 0 0 100%;");
    expect(cssSource).not.toContain(".project-image-control");
    expect(homeSource).not.toContain('key={`${theme}:${imageUrls.join("|")}`}');
    expect(emblaSource).toContain("getPreservedProjectImageIndex");
    expect(emblaSource).toContain("watchSlides: false");
    expect(emblaSource).toContain("duration: 32");
    expect(emblaSource).toContain("emblaApi.scrollTo(nextIndex)");
    expect(emblaSource).toContain("project-image-slide-image");
    expect(cssSource).toContain("@keyframes project-image-reveal");
    expect(cssSource).toContain("transition: transform 460ms cubic-bezier(0.23, 1, 0.32, 1)");
  });

  it("adds a keyboard-accessible full-screen image lightbox without removing carousel controls", () => {
    expect(emblaSource).toContain('import { createPortal } from "react-dom"');
    expect(emblaSource).toContain('aria-label={`${projectName} image viewer`}');
    expect(emblaSource).toContain('aria-label="Close full-screen image viewer"');
    expect(emblaSource).toContain('event.key === "Escape"');
    expect(emblaSource).toContain('event.key === "ArrowLeft"');
    expect(emblaSource).toContain('event.key === "ArrowRight"');
    expect(emblaSource).toContain('Open image ${index + 1} of ${imageCount} for ${projectName} in full screen');
    expect(emblaSource).toContain('          </div>\n          {imageCount > 1 && <div className="project-image-lightbox-controls"');
    expect(cssSource).toContain(".project-image-lightbox {");
    expect(cssSource).toContain(".project-image-lightbox-controls {");
    expect(cssSource).toContain("position: fixed;");
    expect(cssSource).toContain("bottom: max(1rem, env(safe-area-inset-bottom));");
    expect(cssSource).toContain("@keyframes project-image-lightbox-enter");
  });

  it("uses a light Selected Work panel in light theme and restores its charcoal material in dark theme", () => {
    expect(homeSource).toContain('className="theme-work-panel mx-auto max-w-7xl');
    expect(homeSource).toContain('className="theme-work-header flex flex-col');
    expect(homeSource).toContain('className="theme-work-heading mt-4');
    expect(cssSource).toContain(".theme-work-panel {");
    expect(cssSource).toContain("background-color: #f6f4ef;");
    expect(cssSource).toContain(".dark .portfolio .theme-work-panel {");
    expect(cssSource).toContain("background-color: #1b1c1d;");
    expect(cssSource).toContain(".dark .portfolio .theme-work-heading {");
    expect(cssSource).toContain("color: #f4f1eb;");
  });

  it("uses a porcelain carousel frame in light theme and restores the dark frame only in dark theme", () => {
    expect(homeSource).toContain("project-evidence project-evidence--${project.visualLayout} relative overflow-hidden");
    expect(emblaSource).toContain("theme-project-carousel relative aspect-[16/10]");
    expect(staticSource).toContain("theme-project-carousel relative aspect-[16/10]");
    expect(emblaSource).toContain("theme-project-carousel-scrim");
    expect(staticSource).toContain("theme-project-carousel-scrim");
    expect(cssSource).toContain(".theme-work-surface .project-evidence {");
    expect(cssSource).toContain(".theme-project-carousel {");
    expect(cssSource).toContain("background-color: #e7e4dc;");
    expect(cssSource).toContain(".dark .portfolio .theme-project-carousel {");
    expect(cssSource).toContain("background-color: #202124;");
    expect(cssSource).toContain("--project-image-dot-active: #fff;");
    expect(cssSource).not.toContain("--project-image-dot-active: #1b1c1d;");
    expect(cssSource).toContain("--project-image-dot-active: #fff;");
    expect(cssSource).toContain("background: var(--project-image-dot-active, #fff);");
    expect(cssSource).toContain("--project-carousel-inner-shadow: linear-gradient(to top, rgba(27, 28, 29, 0.46)");
    expect(cssSource).toContain("--project-carousel-inner-shadow: linear-gradient(to top, rgba(0, 0, 0, 0.7)");
    expect(cssSource).toContain("background-image: var(--project-carousel-inner-shadow) !important;");
  });
});
