import { describe, expect, it } from "vitest";
import { buildDecapConfig, isAllowedDecapGithubProxyRequest, isRepositoryOwner } from "./_core/decap";

describe("Decap CMS configuration", () => {
  it("targets the configured repository, live production origin, and local OAuth proxy route", () => {
    const config = buildDecapConfig("https://shrey-patel-profile.vercel.app");
    const portfolio = config.collections[0].files[0];

    expect(config.backend).toEqual({
      name: "github",
      repo: "shrey714/Shrey---Portfolio",
      branch: "main",
      base_url: "https://shrey-patel-profile.vercel.app",
      auth_endpoint: "api/decap/auth",
      api_root: "https://shrey-patel-profile.vercel.app/api/decap/github",
    });
    expect(portfolio.file).toBe("content/portfolio.json");
    expect(portfolio.fields.map(field => field.name)).toContain("seo");
    expect(config.media_folder).toBe("content/media");
    expect(config.public_folder).toBe("/api/media/portfolio");
    expect(config.media_library).toEqual({ name: "vercel-blob" });
    expect(config.editor.preview).toBe(false);

    const expectedSectionNames = ["identity", "navigation", "hero", "work", "practice", "achievements", "about", "experience", "philosophy", "contact", "footer", "ui", "seo"];
    expect(portfolio.fields.map(field => field.name)).toEqual(expectedSectionNames);
    expect(portfolio.fields.every(field => field.collapsed === true)).toBe(true);
    expect(portfolio.fields.find(field => field.name === "identity")).toMatchObject({ label: "1. Profile & site identity", summary: "{{fields.name}} — {{fields.roleDescriptor}}" });
    expect(portfolio.fields.find(field => field.name === "work")).toMatchObject({ label: "4. Selected work & project visuals", summary: "{{fields.heading}}" });

    const hero = portfolio.fields.find(field => field.name === "hero") as { fields: Array<{ name: string; widget: string }> };
    const resume = hero.fields.find(field => field.name === "resume") as { fields: Array<{ name: string; widget: string }> };
    const seo = portfolio.fields.find(field => field.name === "seo") as { fields: Array<{ name: string; widget: string }> };
    expect(resume.fields.find(field => field.name === "url")?.widget).toBe("file");
    expect(hero.fields.find(field => field.name === "imageUrl")?.widget).toBe("image");
    expect(hero.fields.find(field => field.name === "previousVisualLabel")).toBeUndefined();
    expect(hero.fields.find(field => field.name === "nextVisualLabel")).toBeUndefined();
    expect(seo.fields.find(field => field.name === "shareImage")?.widget).toBe("image");

    const work = portfolio.fields.find(field => field.name === "work") as { fields: Array<{ name: string; fields: Array<{ name: string; fields: Array<{ name: string; widget?: string; required?: boolean; options?: unknown[] }> }> }> };
    const projectFields = work.fields.find(field => field.name === "projects")?.fields ?? [];
    const visualLayout = projectFields.find(field => field.name === "visualLayout");
    const customImages = projectFields.find(field => field.name === "visualImageUrls") as { widget?: string; field?: { widget?: string; name?: string } } | undefined;
    expect(visualLayout?.options).toHaveLength(6);
    expect(customImages).toMatchObject({ widget: "list", field: { widget: "image", name: "image" } });
    expect(customImages).toMatchObject({ label: "Project images" });
    expect(projectFields.find(field => field.name === "visualImageUrl")).toBeUndefined();
    expect(work.fields.find(field => field.name === "projects")).toMatchObject({ collapsed: true, summary: "{{fields.name}} — {{fields.type}}", label_singular: "Project" });

    const achievements = portfolio.fields.find(field => field.name === "achievements") as { fields: Array<{ name: string; fields: Array<{ name: string; widget?: string; required?: boolean; options?: unknown[] }> }> };
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
