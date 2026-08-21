import * as Preact from "preact";
import { describe, expect, it, vi } from "vitest";

vi.mock("react", async () => import("preact/compat"));

describe("project image carousel SSR", () => {
  it("renders the multi-image custom-project fallback without loading the Embla hook runtime", async () => {
    const { default: render } = await import("preact-render-to-string");
    const { StaticProjectImageCarousel } = await import("../client/src/components/StaticProjectImageCarousel");
    const html = render(Preact.h(StaticProjectImageCarousel, { projectName: "DardiBook", imageUrls: ["/project-one.webp", "/project-two.webp"] }));

    expect(html).toContain('data-project-image-count="2"');
    expect(html).toContain('src="/project-one.webp"');
    expect(html).toContain('src="/project-two.webp"');
    expect(html).toContain('aria-label="Show image 1 of 2 for DardiBook"');
  });
});
