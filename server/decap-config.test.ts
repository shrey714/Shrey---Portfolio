import { describe, expect, it } from "vitest";
import { buildDecapConfig, isRepositoryOwner } from "./_core/decap";

describe("Decap CMS configuration", () => {
  it("targets the configured repository and local OAuth proxy route", () => {
    const config = buildDecapConfig("https://shrey-portfolio.vercel.app");
    const portfolio = config.collections[0].files[0];

    expect(config.backend).toEqual({
      name: "github",
      repo: "shrey714/Shrey---Portfolio",
      branch: "main",
      base_url: "https://shrey-portfolio.vercel.app",
      auth_endpoint: "api/decap/auth",
    });
    expect(portfolio.file).toBe("content/portfolio.json");
    expect(portfolio.fields.map(field => field.name)).toContain("seo");
    expect(config.media_folder).toBe("content/media");
    expect(config.public_folder).toBe("/media");
    expect(config.editor.preview).toBe(false);
  });

  it("accepts only the configured repository owner as an editor", () => {
    expect(isRepositoryOwner("shrey714")).toBe(true);
    expect(isRepositoryOwner("ShReY714")).toBe(true);
    expect(isRepositoryOwner("another-editor")).toBe(false);
  });
});
