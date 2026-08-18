import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../pages/Home.tsx", import.meta.url), "utf8");
const contactPanelSource = homeSource.match(/<section id="contact"[\s\S]*?<\/section>/)?.[0] ?? "";

describe("footer contact layout", () => {
  it("keeps the contact section within the footer and applies the panel treatment only at desktop widths", () => {
    expect(homeSource).toContain('<footer className="lg:ml-72">');
    expect(contactPanelSource).toContain('footer-contact-panel bg-[#436ee4]');
    expect(contactPanelSource).toContain("lg:mx-8");
    expect(contactPanelSource).toContain("lg:my-8");
    expect(contactPanelSource).toContain("lg:rounded-[2rem]");
    expect(contactPanelSource).toContain("xl:mx-12");
    expect(contactPanelSource).not.toMatch(/(?<![\w:-])rounded-\[2rem\](?![\w:-])/);
  });
});
