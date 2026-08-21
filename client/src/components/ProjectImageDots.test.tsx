import render from "preact-render-to-string";
import { describe, expect, it, vi } from "vitest";
import { ProjectImageDots } from "./ProjectImageDots";

describe("ProjectImageDots", () => {
  it("renders accessible dot pagination with the selected image announced", () => {
    const html = render(<ProjectImageDots projectName="DardiBook" imageUrls={["/one.webp", "/two.webp"]} activeIndex={1} onSelect={vi.fn()} />);

    expect(html).toContain('aria-label="Project images for DardiBook"');
    expect(html).toContain('aria-label="Show image 1 of 2 for DardiBook"');
    expect(html).toContain('aria-label="Show image 2 of 2 for DardiBook"');
    expect(html).toContain('aria-current="true"');
    expect((html.match(/project-image-dot/g) ?? [])).toHaveLength(2);
  });

  it("does not render pagination for a single image", () => {
    expect(render(<ProjectImageDots projectName="DardiBook" imageUrls={["/one.webp"]} activeIndex={0} onSelect={vi.fn()} />)).toBe("");
  });
});
