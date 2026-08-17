import superjson from "superjson";
import portfolioContent from "../../content/portfolio.json" with { type: "json" };
import type { RenderResult } from "../../client/src/entry-server.js";
import { ENV } from "./env.js";

function escapeHtml(value: string) {
  return value.replace(/[&<>\"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[character]!);
}

function absoluteUrl(pathname: string) {
  return new URL(pathname, ENV.canonicalOrigin).toString();
}

function jsonForScript(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

function buildHeadTags(result: RenderResult) {
  const { head } = result;
  const canonicalUrl = absoluteUrl(head.canonicalPath);
  const shareImageUrl = absoluteUrl(portfolioContent.seo.shareImage);
  const robots = head.noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large";
  const person = portfolioContent.seo.person;
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: portfolioContent.identity.name,
    url: canonicalUrl,
    jobTitle: person.jobTitles,
    description: portfolioContent.seo.description,
    address: { "@type": "PostalAddress", addressLocality: person.locality, addressCountry: person.countryCode },
    alumniOf: { "@type": "CollegeOrUniversity", name: person.education },
    worksFor: { "@type": "Organization", name: person.employer },
    knowsAbout: person.knowsAbout,
  };

  return [
    `<title>${escapeHtml(head.title)}</title>`,
    `<meta name="description" content="${escapeHtml(head.description)}" />`,
    `<meta name="author" content="${escapeHtml(portfolioContent.identity.name)}" />`,
    `<meta name="keywords" content="${escapeHtml(portfolioContent.seo.keywords.join(", "))}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="theme-color" content="#456FE8" />`,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(ENV.siteName)}" />`,
    `<meta property="og:title" content="${escapeHtml(head.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(head.ogDescription)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:image" content="${escapeHtml(shareImageUrl)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(head.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(head.ogDescription)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(shareImageUrl)}" />`,
    `<script type="application/ld+json">${jsonForScript(personJsonLd)}</script>`,
  ].join("\n    ");
}

export function composeHtml(template: string, result: RenderResult) {
  const dehydratedState = jsonForScript(superjson.serialize(result.dehydratedState));
  const dataScript = `<script>window.__RQ_STATE__=${dehydratedState};</script>`;
  return template.replace("<!--app-head-->", buildHeadTags(result)).replace("<!--app-html-->", `${result.html}${dataScript}`);
}
