import { describe, expect, it } from "vitest";
import { buildDecapConfig, isAllowedDecapGithubProxyRequest, isRepositoryOwner } from "./_core/decap";

describe("Decap CMS configuration", () => {
  it("targets the configured repository, live production origin, and local OAuth proxy route", () => {
    const config = buildDecapConfig("https://shrey-patel-profile.vercel.app");
    const sectionByName = (name: string) => config.collections.find(collection => collection.name === name);

    expect(config.backend).toEqual({
      name: "github",
      repo: "shrey714/Shrey---Portfolio",
      branch: "main",
      base_url: "https://shrey-patel-profile.vercel.app",
      auth_endpoint: "api/decap/auth",
      api_root: "https://shrey-patel-profile.vercel.app/api/decap/github",
    });
    expect(config.media_folder).toBe("content/media");
    expect(config.public_folder).toBe("/api/media/portfolio");
    expect(config.media_library).toEqual({ name: "vercel-blob" });
    expect(config.editor.preview).toBe(false);

    expect(config.collections.map(collection => collection.name)).toEqual([
      "portfolio-profile", "portfolio-navigation", "portfolio-hero", "portfolio-work", "portfolio-practice", "portfolio-achievements", "portfolio-about",
      "portfolio-experience", "portfolio-philosophy", "portfolio-contact", "portfolio-footer", "portfolio-interface", "portfolio-seo",
    ]);
    expect(config.collections.every(collection => collection.files)).toBe(true);
    expect(sectionByName("portfolio-profile")).toMatchObject({
      label: "1. Profile & site identity",
      files: [{ file: "content/portfolio/identity.json" }],
    });
    expect(sectionByName("portfolio-work")).toMatchObject({
      label: "4. Selected work & project visuals",
      files: [{ file: "content/portfolio/work.json" }],
    });
    expect(sectionByName("portfolio-seo")).toMatchObject({
      label: "13. SEO & social sharing",
      files: [{ file: "content/portfolio/seo.json" }],
    });

    const hero = sectionByName("portfolio-hero")?.files[0] as { fields: Array<{ name: string; widget: string; fields?: Array<{ name: string; widget: string }> }> };
    const resume = hero.fields.find(field => field.name === "resume") as { fields: Array<{ name: string; widget: string }> };
    const seo = sectionByName("portfolio-seo")?.files[0] as { fields: Array<{ name: string; widget: string; fields?: Array<{ name: string; widget: string }> }> };
    expect(resume.fields.find(field => field.name === "url")?.widget).toBe("file");
    expect(hero.fields.find(field => field.name === "imageUrl")?.widget).toBe("image");
    expect(hero.fields.find(field => field.name === "previousVisualLabel")).toBeUndefined();
    expect(hero.fields.find(field => field.name === "nextVisualLabel")).toBeUndefined();
    expect(seo.fields.find(field => field.name === "shareImage")?.widget).toBe("image");

    const work = sectionByName("portfolio-work")?.files[0] as { fields: Array<{ name: string; fields: Array<{ name: string; fields: Array<{ name: string; widget?: string; required?: boolean; options?: unknown[] }> }> }> };
    const projectFields = work.fields.find(field => field.name === "projects")?.fields ?? [];
    const visualLayout = projectFields.find(field => field.name === "visualLayout");
    const customImages = projectFields.find(field => field.name === "visualImageUrls") as { widget?: string; field?: { widget?: string; name?: string } } | undefined;
    expect(visualLayout?.options).toHaveLength(6);
    expect(customImages).toMatchObject({ widget: "list", field: { widget: "image", name: "image" } });
    expect(customImages).toMatchObject({ label: "Project images" });
    expect(projectFields.find(field => field.name === "visualImageUrl")).toBeUndefined();
    expect(work.fields.find(field => field.name === "projects")).toMatchObject({ collapsed: true, summary: "{{fields.name}} — {{fields.type}}", label_singular: "Project" });

    const achievements = sectionByName("portfolio-achievements")?.files[0] as { fields: Array<{ name: string; fields: Array<{ name: string; widget?: string; required?: boolean; options?: unknown[] }> }> };
    const achievementFields = achievements.fields.find(field => field.name === "entries")?.fields ?? [];
    expect(achievementFields.find(field => field.name === "visualMode")?.options).toHaveLength(2);
    expect(achievementFields.find(field => field.name === "visualImageUrl")).toMatchObject({ widget: "image", required: false });
  });

  it("accepts only the configured repository owner as an editor", () => {
    expect(isRepositoryOwner("shrey714")).toBe(true);
    expect(isRepositoryOwner("ShReY714")).toBe(true);
    expect(isRepositoryOwner("another-editor")).toBe(false);
  });

  it("allows only Decap's read-only user identity lookup outside the configured repository", () => {
    expect(isAllowedDecapGithubProxyRequest("/user", "GET")).toBe(true);
    expect(isAllowedDecapGithubProxyRequest("/user", "POST")).toBe(false);
    expect(isAllowedDecapGithubProxyRequest("/user/repos", "GET")).toBe(false);
    expect(isAllowedDecapGithubProxyRequest("/repos/shrey714/Shrey---Portfolio/git/blobs", "POST")).toBe(true);
    expect(isAllowedDecapGithubProxyRequest("/repos/another-owner/another-repository", "GET")).toBe(false);
  });
});
