import crypto from "node:crypto";
import type { Express, Request } from "express";
import { parse as parseCookies } from "cookie";
import { ENV } from "./env.js";

const OAUTH_STATE_COOKIE = "__Host-decap_oauth_state";
const OAUTH_STATE_MAX_AGE_MS = 10 * 60 * 1000;
const REPOSITORY = "shrey714/Shrey---Portfolio";
const REPOSITORY_OWNER = REPOSITORY.split("/")[0];
const DECAP_GITHUB_PROXY_PATH = "/api/decap/github";
const GITHUB_API_ORIGIN = "https://api.github.com";

type DecapField = {
  label: string;
  name: string;
  widget?: string;
  required?: boolean;
  hint?: string;
  collapsed?: boolean;
  summary?: string;
  label_singular?: string;
  minimize_collapsed?: boolean;
  fields?: DecapField[];
  field?: DecapField;
  default?: unknown;
};

const stringField = (name: string, label: string, required = true): DecapField => ({ name, label, widget: "string", required });
const textField = (name: string, label: string, required = true): DecapField => ({ name, label, widget: "text", required });
const mediaField = (name: string, label: string, widget: "file" | "image", required = true, hint?: string): DecapField => ({ name, label, widget, required, hint });
const listOfStrings = (name: string, label: string): DecapField => ({ name, label, widget: "list", collapsed: true, label_singular: "Item", field: stringField("value", "Value") });
const listOfMedia = (name: string, label: string, hint?: string): DecapField => ({ name, label, widget: "list", collapsed: true, label_singular: "Image", summary: "{{fields.image}}", hint, field: mediaField("image", "Image", "image") });
const objectField = (name: string, label: string, fields: DecapField[], summary?: string): DecapField => ({ name, label, widget: "object", collapsed: true, summary, fields });
const listOfObjects = (name: string, label: string, fields: DecapField[], summary?: string, labelSingular = "Entry"): DecapField => ({ name, label, widget: "list", collapsed: true, summary, label_singular: labelSingular, fields });

function portfolioFields(): DecapField[] {
  return [
    objectField("identity", "1. Profile & site identity", [
      stringField("name", "Name"), stringField("pageDescriptor", "Page descriptor"), stringField("roleDescriptor", "Role descriptor"),
      stringField("location", "Location"), stringField("availability", "Availability"), stringField("railNote", "Rail note"),
      stringField("appearanceLabel", "Appearance label"),
    ], "{{fields.name}} — {{fields.roleDescriptor}}"),
    listOfObjects("navigation", "2. Navigation", [stringField("id", "Section ID"), stringField("label", "Label"), stringField("number", "Number")], "{{fields.number}} — {{fields.label}}", "Navigation item"),
    objectField("hero", "3. Hero & introduction", [
      stringField("roleLine", "Role line"), listOfStrings("heading", "Heading lines"), textField("introduction", "Introduction"),
      stringField("workCta", "Work button"), stringField("contactCta", "Contact button"),
      objectField("resume", "Resume", [stringField("label", "Button label"), mediaField("url", "PDF URL", "file"), stringField("filename", "Download filename")]),
      stringField("carouselAriaLabel", "Carousel accessibility label"), stringField("carouselSelectorLabel", "Carousel selector accessibility label"),
      stringField("basedInLabel", "Based-in label"), stringField("basedInDescription", "Based-in description"), stringField("roleSnapshot", "Role snapshot"),
      listOfStrings("focusAreas", "Focus areas"), mediaField("imageUrl", "Hero image", "image"),
      listOfObjects("slides", "Hero slides", [
        stringField("label", "Label"), textField("caption", "Caption"), stringField("alt", "Alternative text"),
        stringField("metaLeft", "Left meta", false), stringField("metaRight", "Right meta", false), stringField("annotation", "Annotation", false),
        listOfStrings("nodes", "System nodes"),
      ], "{{fields.label}}", "Slide"),
    ], "{{fields.roleLine}}"),
    objectField("work", "4. Selected work & project visuals", [
      stringField("eyebrow", "Eyebrow"), stringField("heading", "Heading"), textField("introduction", "Introduction"),
      listOfObjects("projects", "Projects", [
        { name: "visualLayout", label: "Project visual", widget: "select", options: [
          { label: "Layout 1 — Workflow dashboard", value: "layout-1" },
          { label: "Layout 2 — Commerce board", value: "layout-2" },
          { label: "Layout 3 — System map", value: "layout-3" },
          { label: "Layout 4 — Editorial showcase", value: "layout-4" },
          { label: "Layout 5 — Analytics panel", value: "layout-5" },
          { label: "Project images — Add images below", value: "custom-image" },
        ] } as DecapField,
        listOfMedia("visualImageUrls", "Project images", "Add one or more images here when Project visual is set to Project images."),
        stringField("meta", "Meta"), stringField("date", "Date"), stringField("name", "Project name"), stringField("type", "Project type"),
        textField("description", "Description"), listOfStrings("technologies", "Technologies"), stringField("cta", "Button label"),
        stringField("ariaLabel", "Button accessibility label"), stringField("repositoryUrl", "GitHub or source URL"), stringField("liveUrl", "Live project URL", false), stringField("visualMeta", "Visual meta"), stringField("visualTitle", "Visual title"),
        listOfStrings("visualRows", "Visual rows"),
      ], "{{fields.name}} — {{fields.type}}", "Project"),
    ], "{{fields.heading}}"),
    objectField("practice", "5. Practice & skills", [
      stringField("eyebrow", "Eyebrow"), stringField("heading", "Heading"), textField("introduction", "Introduction"),
      stringField("visualFlow", "Visual flow label"), stringField("visualSystemNote", "Visual system note"), stringField("visualTag", "Visual tag"), stringField("visualCallout", "Visual callout"),
      listOfObjects("disciplines", "Disciplines", [stringField("title", "Title"), textField("text", "Description")], "{{fields.title}}", "Discipline"),
      listOfObjects("skills", "Skill groups", [stringField("name", "Name"), stringField("tools", "Tools")], "{{fields.name}}", "Skill group"),
    ], "{{fields.heading}}"),
    objectField("achievements", "6. Achievements & participation", [
      stringField("eyebrow", "Eyebrow"), stringField("heading", "Heading"), textField("introduction", "Introduction"),
      listOfObjects("entries", "Achievement entries", [
        stringField("meta", "Meta"), stringField("title", "Title"), stringField("organization", "Organization or host"), stringField("date", "Date"), textField("description", "Description"),
        { name: "visualMode", label: "Achievement visual", widget: "select", options: [
          { label: "Image — Upload or choose an image below", value: "image" },
          { label: "Placeholder — Use the editorial visual below", value: "placeholder" },
        ] } as DecapField,
        mediaField("visualImageUrl", "Achievement image", "image", false, "Required only when Achievement visual is set to Image."),
        stringField("visualLabel", "Placeholder label"), stringField("imageAlt", "Image alternative text"),
      ], "{{fields.title}} — {{fields.organization}}", "Achievement"),
    ], "{{fields.heading}}"),
    objectField("about", "7. About", [
      stringField("eyebrow", "Eyebrow"), stringField("heading", "Heading"), stringField("experienceLabel", "Experience label"),
      textField("statement", "Statement"), textField("description", "Description"),
      listOfObjects("facts", "Facts", [stringField("label", "Label"), stringField("primary", "Primary"), stringField("secondary", "Secondary")], "{{fields.label}}", "Fact"),
    ], "{{fields.heading}}"),
    objectField("experience", "8. Experience", [
      stringField("eyebrow", "Eyebrow"), textField("introduction", "Introduction"),
      listOfObjects("entries", "Experience entries", [
        stringField("company", "Company"), stringField("role", "Role"), stringField("date", "Date"), textField("description", "Description"),
        stringField("responsibilityLabel", "Responsibilities label"), listOfStrings("responsibilities", "Responsibilities"),
      ], "{{fields.company}} — {{fields.role}}", "Role"),
    ], "{{fields.eyebrow}}"),
    objectField("philosophy", "9. Engineering philosophy", [
      stringField("eyebrow", "Eyebrow"), stringField("headingLineOne", "Heading line one"), stringField("headingLineTwo", "Heading line two"),
      textField("introduction", "Introduction"), listOfObjects("principles", "Principles", [stringField("number", "Number"), stringField("title", "Title"), textField("text", "Description")], "{{fields.number}} — {{fields.title}}", "Principle"),
    ], "{{fields.headingLineOne}}"),
    objectField("contact", "10. Contact & enquiry form", [
      stringField("eyebrow", "Eyebrow"), textField("introduction", "Introduction"), stringField("headingLineOne", "Heading line one"),
      stringField("headingLineTwo", "Heading line two"), { name: "email", label: "Email", widget: "string", pattern: ["^.+@.+\\..+$", "Enter a valid email address"] } as DecapField,
      stringField("githubUrl", "GitHub URL"), stringField("linkedinUrl", "LinkedIn URL"), stringField("githubLabel", "GitHub label"),
      stringField("linkedinLabel", "LinkedIn label"), stringField("emailLabel", "Email label"),
      objectField("form", "Contact form", [
        stringField("eyebrow", "Eyebrow"), stringField("heading", "Heading"), stringField("nameLabel", "Name label"), stringField("emailLabel", "Email label"),
        stringField("messageLabel", "Message label"), stringField("namePlaceholder", "Name placeholder"), stringField("emailPlaceholder", "Email placeholder"),
        stringField("messagePlaceholder", "Message placeholder"), stringField("submitLabel", "Submit label"), stringField("submittingLabel", "Submitting label"),
        stringField("sendingMessage", "Sending message"), stringField("successMessage", "Success message"), stringField("fallbackMessage", "Fallback message"),
        stringField("privacyNote", "Privacy note"),
      ]),
    ], "{{fields.email}}"),
    objectField("footer", "11. Footer", [stringField("left", "Left text"), stringField("right", "Right text")], "{{fields.left}}"),
    objectField("ui", "12. Interface labels & accessibility", [
      stringField("homeAriaLabel", "Home label"), stringField("mobileNavigationLabel", "Mobile navigation label"),
      stringField("sectionNavigationLabel", "Section navigation label"), stringField("navigateLabel", "Navigate label"),
      stringField("themeLightLabel", "Light mode label"), stringField("themeDarkLabel", "Dark mode label"), stringField("scrollToTopLabel", "Scroll-to-top label"),
    ], "{{fields.homeAriaLabel}}"),
    objectField("seo", "13. SEO & social sharing", [
      stringField("title", "Page title"), textField("description", "Meta description"), textField("ogDescription", "Social description"),
      listOfStrings("keywords", "Keywords"), mediaField("shareImage", "Social share image", "image"),
      objectField("person", "Structured person data", [
        listOfStrings("jobTitles", "Job titles"), stringField("locality", "City"), stringField("countryCode", "Country code"),
        stringField("education", "Education"), stringField("employer", "Employer"), listOfStrings("knowsAbout", "Expertise topics"),
      ]),
    ], "{{fields.title}}"),
  ];
}

const editorSections = [
  { name: "profile", label: "1. Profile & site identity", file: "content/portfolio/identity.json", source: "identity" },
  { name: "navigation", label: "2. Navigation", file: "content/portfolio/navigation.json", source: "navigation" },
  { name: "hero", label: "3. Hero & introduction", file: "content/portfolio/hero.json", source: "hero" },
  { name: "work", label: "4. Selected work & project visuals", file: "content/portfolio/work.json", source: "work" },
  { name: "practice", label: "5. Practice & skills", file: "content/portfolio/practice.json", source: "practice" },
  { name: "achievements", label: "6. Achievements & participation", file: "content/portfolio/achievements.json", source: "achievements" },
  { name: "about", label: "7. About", file: "content/portfolio/about.json", source: "about" },
  { name: "experience", label: "8. Experience", file: "content/portfolio/experience.json", source: "experience" },
  { name: "philosophy", label: "9. Engineering philosophy", file: "content/portfolio/philosophy.json", source: "philosophy" },
  { name: "contact", label: "10. Contact & enquiry form", file: "content/portfolio/contact.json", source: "contact" },
  { name: "footer", label: "11. Footer", file: "content/portfolio/footer.json", source: "footer" },
  { name: "interface", label: "12. Interface labels & accessibility", file: "content/portfolio/ui.json", source: "ui" },
  { name: "seo", label: "13. SEO & social sharing", file: "content/portfolio/seo.json", source: "seo" },
] as const;

function sectionFields(source: (typeof editorSections)[number]["source"]): DecapField[] {
  const field = portfolioFields().find(candidate => candidate.name === source);
  if (!field) throw new Error(`Missing CMS field definition for ${source}.`);

  if (source === "navigation") {
    return [listOfObjects("items", "Navigation items", field.fields ?? [], field.summary, "Navigation item")];
  }

  return field.fields ?? [];
}

export function buildDecapConfig(origin: string) {
  return {
    backend: {
      name: "github",
      repo: REPOSITORY,
      branch: "main",
      base_url: origin,
      auth_endpoint: "api/decap/auth",
      api_root: `${origin}${DECAP_GITHUB_PROXY_PATH}`,
    },
    media_folder: "content/media",
    public_folder: "/api/media/portfolio",
    media_library: { name: "vercel-blob" },
    publish_mode: "simple",
    editor: { preview: false },
    collections: editorSections.map(section => ({
      name: `portfolio-${section.name}`,
      label: section.label,
      format: "json",
      files: [{ name: section.name, label: section.label, file: section.file, fields: sectionFields(section.source) }],
    })),
  };
}

function requestOrigin(request: Request) {
  if (ENV.isProduction) return ENV.canonicalOrigin;
  return `${request.protocol}://${request.get("host")}`;
}

function constantTimeEqual(first: string, second: string) {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);
  return firstBuffer.length === secondBuffer.length && crypto.timingSafeEqual(firstBuffer, secondBuffer);
}

function callbackDocument(status: "success" | "error", content: Record<string, string>, trustedOrigin: string) {
  const message = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`).replace(/</g, "\\u003c");
  const safeOrigin = JSON.stringify(trustedOrigin).replace(/</g, "\\u003c");
  return `<!doctype html><html><head><meta charset="utf-8"><title>Completing authentication</title></head><body><script>const message=${message};const trustedOrigin=${safeOrigin};const receiveMessage=(event)=>{if(event.origin!==trustedOrigin)return;if(window.opener){window.opener.postMessage(message,trustedOrigin)}window.removeEventListener("message",receiveMessage,false);window.close()};window.addEventListener("message",receiveMessage,false);if(window.opener){window.opener.postMessage("authorizing:github",trustedOrigin)}</script></body></html>`;
}

export function isRepositoryOwner(login: string) {
  return login.trim().toLowerCase() === REPOSITORY_OWNER.toLowerCase();
}

export async function isAuthorizedEditorToken(accessToken: string) {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    const profile = (await response.json()) as { login?: unknown };
    return response.ok && typeof profile.login === "string" && isRepositoryOwner(profile.login);
  } catch {
    return false;
  }
}

function unavailable(res: Parameters<Express["get"]>[1] extends (...args: infer Args) => unknown ? Args[1] : never) {
  return res.status(503).type("text/plain").send("The content editor has not been configured yet.");
}

function editorShell() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex,nofollow" /><title>Portfolio content editor</title></head><body><noscript>This private editor requires JavaScript.</noscript><script src="https://unpkg.com/decap-cms@3.7.1/dist/decap-cms.js"></script><script src="/admin/vercel-blob-media-library.js"></script></body></html>`;
}

export function isAllowedDecapGithubProxyRequest(pathname: string, method: string) {
  if (pathname === "/user") return method === "GET";
  return pathname === `/repos/${REPOSITORY}` || pathname.startsWith(`/repos/${REPOSITORY}/`);
}

async function proxyDecapGithubRequest(req: Request, res: Parameters<Express["get"]>[1] extends (...args: infer Args) => unknown ? Args[1] : never) {
  const pathWithQuery = req.originalUrl.slice(DECAP_GITHUB_PROXY_PATH.length) || "/";
  const targetUrl = new URL(pathWithQuery, GITHUB_API_ORIGIN);
  const authorization = req.get("authorization");

  if (!authorization) return res.status(401).json({ message: "Editor authentication is required." });
  if (targetUrl.origin !== GITHUB_API_ORIGIN || !isAllowedDecapGithubProxyRequest(targetUrl.pathname, req.method)) {
    return res.status(403).json({ message: "This editor may only identify its authenticated user or access its configured repository." });
  }

  const headers = new Headers({
    Accept: req.get("accept") ?? "application/vnd.github+json",
    Authorization: authorization,
    "User-Agent": "Shrey-Portfolio-Decap-Proxy",
    "X-GitHub-Api-Version": req.get("x-github-api-version") ?? "2022-11-28",
  });
  const contentType = req.get("content-type");
  const ifMatch = req.get("if-match");
  if (contentType) headers.set("Content-Type", contentType);
  if (ifMatch) headers.set("If-Match", ifMatch);

  const hasRequestBody = !["GET", "HEAD"].includes(req.method);
  const body = hasRequestBody && req.body !== undefined ? JSON.stringify(req.body) : undefined;

  try {
    const response = await fetch(targetUrl, { method: req.method, headers, body });
    res.set({ "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" });
    const contentTypeHeader = response.headers.get("content-type");
    const etag = response.headers.get("etag");
    const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
    if (contentTypeHeader) res.type(contentTypeHeader);
    if (etag) res.set("ETag", etag);
    if (rateLimitRemaining) res.set("X-RateLimit-Remaining", rateLimitRemaining);
    return res.status(response.status).send(await response.text());
  } catch {
    return res.status(502).json({ message: "The editor could not reach GitHub. Please try again." });
  }
}

export function registerDecapRoutes(app: Express) {
  app.get("/admin", (_req, res) => {
    res.set("X-Robots-Tag", "noindex, nofollow");
    res.type("html").send(editorShell());
  });

  app.get("/api/decap/config", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(buildDecapConfig(requestOrigin(req)));
  });

  // Decap can request this conventional path after completing a popup OAuth
  // flow even when the initial page manually loads runtime JSON config. JSON is
  // valid YAML, so this keeps both initialization paths on one configuration.
  app.get("/config.yml", (req, res) => {
    res.set({ "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" });
    res.type("text/yaml").send(JSON.stringify(buildDecapConfig(requestOrigin(req))));
  });

  app.all(`${DECAP_GITHUB_PROXY_PATH}/*`, proxyDecapGithubRequest);

  app.get("/api/decap/auth", (req, res) => {
    res.set({ "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" });
    if (!ENV.githubClientId || !ENV.githubClientSecret) return unavailable(res);
    const origin = requestOrigin(req);
    const state = crypto.randomBytes(32).toString("base64url");
    res.cookie(OAUTH_STATE_COOKIE, state, { httpOnly: true, secure: ENV.isProduction, sameSite: "lax", maxAge: OAUTH_STATE_MAX_AGE_MS, path: "/" });
    const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
    authorizeUrl.searchParams.set("client_id", ENV.githubClientId);
    authorizeUrl.searchParams.set("redirect_uri", `${origin}/api/decap/callback`);
    authorizeUrl.searchParams.set("scope", "repo");
    authorizeUrl.searchParams.set("state", state);
    res.redirect(authorizeUrl.toString());
  });

  app.get("/api/decap/callback", async (req, res) => {
    res.set({ "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" });
    const state = typeof req.query.state === "string" ? req.query.state : "";
    const code = typeof req.query.code === "string" ? req.query.code : "";
    const cookieState = parseCookies(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE] ?? "";
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/" });
    const trustedOrigin = requestOrigin(req);

    if (!ENV.githubClientId || !ENV.githubClientSecret || !code || !state || !constantTimeEqual(state, cookieState)) {
      return res.status(400).type("html").send(callbackDocument("error", { error: "Authentication could not be completed." }, trustedOrigin));
    }

    try {
      const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: ENV.githubClientId, client_secret: ENV.githubClientSecret, code }),
      });
      const tokenBody = (await tokenResponse.json()) as { access_token?: string };
      if (!tokenResponse.ok || !tokenBody.access_token) {
        return res.status(401).type("html").send(callbackDocument("error", { error: "Authentication could not be completed." }, trustedOrigin));
      }
      const authorized = await isAuthorizedEditorToken(tokenBody.access_token);
      if (!authorized) {
        return res.status(403).type("html").send(callbackDocument("error", { error: "Only the portfolio repository owner can use this editor." }, trustedOrigin));
      }
      return res.type("html").send(callbackDocument("success", { token: tokenBody.access_token, provider: "github" }, trustedOrigin));
    } catch {
      return res.status(502).type("html").send(callbackDocument("error", { error: "Authentication could not be completed." }, trustedOrigin));
    }
  });
}
