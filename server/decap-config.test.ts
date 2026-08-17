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
    expect(config.public_folder).toBe("/media");
    expect(config.media_library).toEqual({ name: "vercel-blob" });
    expect(config.editor.preview).toBe(false);
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
