import { describe, expect, it } from "vitest";
import { buildDecapConfig, isAllowedDecapGithubProxyRequest, isRepositoryOwner } from "./_core/decap";

describe("Decap CMS configuration", () => {
  it("targets the configured repository, live production origin, and local OAuth proxy route", () => {
    const config = buildDecapConfig("https://shrey-patel-profile.vercel.app");
    const portfolio = config.collections[0];
    const sectionByName = (name: string) => portfolio.files.find(section => section.name === name);

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

    expect(config.collections).toHaveLength(1);
    expect(portfolio).toMatchObject({ name: "portfolio", label: "Portfolio" });
    expect(portfolio.files.map(section => section.name)).toEqual([
      "profile", "navigation", "hero", "work", "practice", "achievements", "about", "experience", "philosophy", "contact", "footer", "interface", "seo",
    ]);
    expect(sectionByName("profile")).toMatchObject({
      label: "1. Profile & site identity",
      file: "content/portfolio/identity.json",
    });
    expect(sectionByName("work")).toMatchObject({
      label: "4. Selected work & project visuals",
      file: "content/portfolio/work.json",
    });
    expect(sectionByName("seo")).toMatchObject({
      label: "13. SEO & social sharing",
      file: "content/portfolio/seo.json",
    });

    const hero = sectionByName("hero") as { fields: Array<{ name: string; widget: string; fields?: Array<{ name: string; widget: string }> }> };
    const resume = hero.fields.find(field => field.name === "resume") as { fields: Array<{ name: string; widget: string }> };
    const seo = sectionByName("seo") as { fields: Array<{ name: string; widget: string; fields?: Array<{ name: string; widget: string }> }> };
    expect(resume.fields.find(field => field.name === "url")?.widget).toBe("file");
    expect(hero.fields.find(field => field.name === "imageUrl")?.widget).toBe("image");
    expect(hero.fields.find(field => field.name === "previousVisualLabel")).toBeUndefined();
    expect(hero.fields.find(field => field.name === "nextVisualLabel")).toBeUndefined();
    expect(seo.fields.find(field => field.name === "shareImage")?.widget).toBe("image");

    const work = sectionByName("work") as { fields: Array<{ name: string; fields: Array<{ name: string; fields: Array<{ name: string; widget?: string; required?: boolean; options?: unknown[] }> }> }> };
    const projectFields = work.fields.find(field => field.name === "projects")?.fields ?? [];
    const visualLayout = projectFields.find(field => field.name === "visualLayout");
    const customImages = projectFields.find(field => field.name === "visualImageUrls") as { widget?: string; fields?: Array<{ widget?: string; name?: string; default?: boolean }> } | undefined;
    expect(visualLayout?.options).toHaveLength(6);
    expect(customImages).toMatchObject({ widget: "list", fields: [
      { widget: "image", name: "image" },
      { widget: "boolean", name: "showInLight", default: true },
      { widget: "boolean", name: "showInDark", default: true },
    ] });
    expect(customImages).toMatchObject({ label: "Project images" });
    expect(projectFields.find(field => field.name === "visualImageUrl")).toBeUndefined();
    expect(work.fields.find(field => field.name === "projects")).toMatchObject({ collapsed: true, summary: "{{fields.name}} — {{fields.type}}", label_singular: "Project" });

    const achievements = sectionByName("achievements") as { fields: Array<{ name: string; fields: Array<{ name: string; widget?: string; required?: boolean; options?: unknown[] }> }> };
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
