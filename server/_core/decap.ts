import crypto from "node:crypto";
import type { Express, Request } from "express";
import { parse as parseCookies } from "cookie";
import { ENV } from "./env.js";

const OAUTH_STATE_COOKIE = "__Host-decap_oauth_state";
const OAUTH_STATE_MAX_AGE_MS = 10 * 60 * 1000;
const REPOSITORY = "shrey714/Shrey---Portfolio";
const REPOSITORY_OWNER = REPOSITORY.split("/")[0];

type DecapField = {
  label: string;
  name: string;
  widget?: string;
  required?: boolean;
  fields?: DecapField[];
  field?: DecapField;
  default?: unknown;
};

const stringField = (name: string, label: string, required = true): DecapField => ({ name, label, widget: "string", required });
const textField = (name: string, label: string, required = true): DecapField => ({ name, label, widget: "text", required });
const listOfStrings = (name: string, label: string): DecapField => ({ name, label, widget: "list", field: stringField("value", "Value") });
const objectField = (name: string, label: string, fields: DecapField[]): DecapField => ({ name, label, widget: "object", fields });
const listOfObjects = (name: string, label: string, fields: DecapField[]): DecapField => ({ name, label, widget: "list", fields });

function portfolioFields(): DecapField[] {
  return [
    objectField("identity", "Identity", [
      stringField("name", "Name"), stringField("pageDescriptor", "Page descriptor"), stringField("roleDescriptor", "Role descriptor"),
      stringField("location", "Location"), stringField("availability", "Availability"), stringField("railNote", "Rail note"),
      stringField("appearanceLabel", "Appearance label"),
    ]),
    listOfObjects("navigation", "Navigation", [stringField("id", "Section ID"), stringField("label", "Label"), stringField("number", "Number")]),
    objectField("hero", "Hero", [
      stringField("roleLine", "Role line"), listOfStrings("heading", "Heading lines"), textField("introduction", "Introduction"),
      stringField("workCta", "Work button"), stringField("contactCta", "Contact button"),
      objectField("resume", "Resume", [stringField("label", "Button label"), stringField("url", "PDF URL"), stringField("filename", "Download filename")]),
      stringField("carouselAriaLabel", "Carousel accessibility label"), stringField("carouselSelectorLabel", "Carousel selector accessibility label"),
      stringField("previousVisualLabel", "Previous visual label"), stringField("nextVisualLabel", "Next visual label"),
      stringField("basedInLabel", "Based-in label"), stringField("basedInDescription", "Based-in description"), stringField("roleSnapshot", "Role snapshot"),
      listOfStrings("focusAreas", "Focus areas"), stringField("imageUrl", "Hero image URL"),
      listOfObjects("slides", "Hero slides", [
        stringField("label", "Label"), textField("caption", "Caption"), stringField("alt", "Alternative text"),
        stringField("metaLeft", "Left meta", false), stringField("metaRight", "Right meta", false), stringField("annotation", "Annotation", false),
        listOfStrings("nodes", "System nodes"),
      ]),
    ]),
    objectField("work", "Selected work", [
      stringField("eyebrow", "Eyebrow"), stringField("heading", "Heading"), textField("introduction", "Introduction"),
      listOfObjects("projects", "Projects", [
        { name: "kind", label: "Visual kind", widget: "select", options: ["clinic", "commerce"] } as DecapField,
        stringField("meta", "Meta"), stringField("date", "Date"), stringField("name", "Project name"), stringField("type", "Project type"),
        textField("description", "Description"), listOfStrings("technologies", "Technologies"), stringField("cta", "Button label"),
        stringField("ariaLabel", "Button accessibility label"), stringField("visualMeta", "Visual meta"), stringField("visualTitle", "Visual title"),
        listOfStrings("visualRows", "Visual rows"),
      ]),
    ]),
    objectField("practice", "Practice", [
      stringField("eyebrow", "Eyebrow"), stringField("heading", "Heading"), textField("introduction", "Introduction"),
      stringField("visualFlow", "Visual flow label"), stringField("visualSystemNote", "Visual system note"), stringField("visualTag", "Visual tag"), stringField("visualCallout", "Visual callout"),
      listOfObjects("disciplines", "Disciplines", [stringField("title", "Title"), textField("text", "Description")]),
      listOfObjects("skills", "Skill groups", [stringField("name", "Name"), stringField("tools", "Tools")]),
    ]),
    objectField("about", "About", [
      stringField("eyebrow", "Eyebrow"), stringField("heading", "Heading"), stringField("experienceLabel", "Experience label"),
      textField("statement", "Statement"), textField("description", "Description"),
      listOfObjects("facts", "Facts", [stringField("label", "Label"), stringField("primary", "Primary"), stringField("secondary", "Secondary")]),
    ]),
    objectField("experience", "Experience", [
      stringField("eyebrow", "Eyebrow"), textField("introduction", "Introduction"), stringField("company", "Company"), stringField("role", "Role"),
      stringField("date", "Date"), textField("description", "Description"), stringField("responsibilityLabel", "Responsibilities label"),
      listOfStrings("responsibilities", "Responsibilities"),
    ]),
    objectField("philosophy", "Philosophy", [
      stringField("eyebrow", "Eyebrow"), stringField("headingLineOne", "Heading line one"), stringField("headingLineTwo", "Heading line two"),
      textField("introduction", "Introduction"), listOfObjects("principles", "Principles", [stringField("number", "Number"), stringField("title", "Title"), textField("text", "Description")]),
    ]),
    objectField("contact", "Contact", [
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
    ]),
    objectField("footer", "Footer", [stringField("left", "Left text"), stringField("right", "Right text")]),
    objectField("ui", "Interface labels", [
      stringField("homeAriaLabel", "Home label"), stringField("mobileNavigationLabel", "Mobile navigation label"),
      stringField("sectionNavigationLabel", "Section navigation label"), stringField("navigateLabel", "Navigate label"),
      stringField("themeLightLabel", "Light mode label"), stringField("themeDarkLabel", "Dark mode label"),
    ]),
    objectField("seo", "SEO and social sharing", [
      stringField("title", "Page title"), textField("description", "Meta description"), textField("ogDescription", "Social description"),
      listOfStrings("keywords", "Keywords"), stringField("shareImage", "Social share image URL"),
      objectField("person", "Structured person data", [
        listOfStrings("jobTitles", "Job titles"), stringField("locality", "City"), stringField("countryCode", "Country code"),
        stringField("education", "Education"), stringField("employer", "Employer"), listOfStrings("knowsAbout", "Expertise topics"),
      ]),
    ]),
  ];
}

export function buildDecapConfig(origin: string) {
  return {
    backend: { name: "github", repo: REPOSITORY, branch: "main", base_url: origin, auth_endpoint: "api/decap/auth" },
    media_folder: "content/media",
    public_folder: "/media",
    publish_mode: "simple",
    editor: { preview: false },
    collections: [{ name: "portfolio", label: "Portfolio content", format: "json", files: [{ name: "portfolio", label: "Portfolio", file: "content/portfolio.json", fields: portfolioFields() }] }],
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

async function verifyEditorOwner(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const profile = (await response.json()) as { login?: unknown };
  return response.ok && typeof profile.login === "string" && isRepositoryOwner(profile.login);
}

function unavailable(res: Parameters<Express["get"]>[1] extends (...args: infer Args) => unknown ? Args[1] : never) {
  return res.status(503).type("text/plain").send("The content editor has not been configured yet.");
}

function editorShell() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex,nofollow" /><title>Portfolio content editor</title><script>window.CMS_MANUAL_INIT=true;</script></head><body><noscript>This private editor requires JavaScript.</noscript><script src="https://unpkg.com/decap-cms@3.7.1/dist/decap-cms.js"></script><script>fetch("/api/decap/config",{credentials:"same-origin"}).then(function(response){if(!response.ok)throw new Error("Unable to load editor configuration.");return response.json()}).then(function(config){CMS.init({config:config})}).catch(function(){document.body.innerHTML="<p>The editor configuration could not be loaded. Please try again later.</p>"});</script></body></html>`;
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
      const authorized = await verifyEditorOwner(tokenBody.access_token);
      if (!authorized) {
        return res.status(403).type("html").send(callbackDocument("error", { error: "Only the portfolio repository owner can use this editor." }, trustedOrigin));
      }
      return res.type("html").send(callbackDocument("success", { token: tokenBody.access_token, provider: "github" }, trustedOrigin));
    } catch {
      return res.status(502).type("html").send(callbackDocument("error", { error: "Authentication could not be completed." }, trustedOrigin));
    }
  });
}
