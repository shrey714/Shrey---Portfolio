import { z } from "zod";
import portfolioContent from "../content/portfolio.json";

const text = z.string().trim().min(1);
const link = z.string().trim().refine(value => value.startsWith("/") || /^https?:\/\//.test(value), "Expected an absolute URL or site-relative path");
const listOfText = z.array(text).min(1);
const labelledText = z.object({ title: text, text }).strict();

export const portfolioContentSchema = z.object({
  identity: z.object({ name: text, pageDescriptor: text, roleDescriptor: text, location: text, availability: text, railNote: text, appearanceLabel: text }).strict(),
  navigation: z.array(z.object({ id: text, label: text, number: text }).strict()).min(1),
  hero: z.object({
    roleLine: text,
    heading: listOfText,
    introduction: text,
    workCta: text,
    contactCta: text,
    resume: z.object({ label: text, url: link, filename: text }).strict(),
    carouselAriaLabel: text,
    carouselSelectorLabel: text,
    previousVisualLabel: text,
    nextVisualLabel: text,
    basedInLabel: text,
    basedInDescription: text,
    roleSnapshot: text,
    focusAreas: listOfText,
    imageUrl: link,
    slides: z.array(z.object({
      label: text,
      caption: text,
      alt: text,
      metaLeft: text.optional(),
      metaRight: text.optional(),
      annotation: text.optional(),
      nodes: listOfText.optional(),
    }).strict()).length(4),
  }).strict(),
  work: z.object({
    eyebrow: text,
    heading: text,
    introduction: text,
    projects: z.array(z.object({
      kind: z.enum(["clinic", "commerce"]),
      meta: text,
      date: text,
      name: text,
      type: text,
      description: text,
      technologies: listOfText,
      cta: text,
      ariaLabel: text,
      repositoryUrl: link,
      liveUrl: link.optional(),
      visualMeta: text,
      visualTitle: text,
      visualRows: listOfText,
    }).strict()).min(2),
  }).strict(),
  practice: z.object({
    eyebrow: text,
    heading: text,
    introduction: text,
    visualFlow: text,
    visualSystemNote: text,
    visualTag: text,
    visualCallout: text,
    disciplines: z.array(labelledText).min(1),
    skills: z.array(z.object({ name: text, tools: text }).strict()).min(1),
  }).strict(),
  about: z.object({
    eyebrow: text,
    heading: text,
    experienceLabel: text,
    statement: text,
    description: text,
    facts: z.array(z.object({ label: text, primary: text, secondary: text }).strict()).min(1),
  }).strict(),
  experience: z.object({
    eyebrow: text,
    introduction: text,
    entries: z.array(z.object({
      company: text,
      role: text,
      date: text,
      description: text,
      responsibilityLabel: text,
      responsibilities: listOfText,
    }).strict()).min(1),
  }).strict(),
  philosophy: z.object({
    eyebrow: text,
    headingLineOne: text,
    headingLineTwo: text,
    introduction: text,
    principles: z.array(z.object({ number: text, title: text, text }).strict()).min(1),
  }).strict(),
  contact: z.object({
    eyebrow: text,
    introduction: text,
    headingLineOne: text,
    headingLineTwo: text,
    email: z.string().email(),
    githubUrl: link,
    linkedinUrl: link,
    githubLabel: text,
    linkedinLabel: text,
    emailLabel: text,
    form: z.object({
      eyebrow: text,
      heading: text,
      nameLabel: text,
      emailLabel: text,
      messageLabel: text,
      namePlaceholder: text,
      emailPlaceholder: text,
      messagePlaceholder: text,
      submitLabel: text,
      submittingLabel: text,
      sendingMessage: text,
      successMessage: text,
      fallbackMessage: text,
      privacyNote: text,
    }).strict(),
  }).strict(),
  footer: z.object({ left: text, right: text }).strict(),
  ui: z.object({ homeAriaLabel: text, mobileNavigationLabel: text, sectionNavigationLabel: text, navigateLabel: text, themeLightLabel: text, themeDarkLabel: text }).strict(),
  seo: z.object({
    title: text,
    description: text,
    ogDescription: text,
    keywords: listOfText,
    shareImage: link,
    person: z.object({ jobTitles: listOfText, locality: text, countryCode: text, education: text, employer: text, knowsAbout: listOfText }).strict(),
  }).strict(),
}).strict();

export function validatePortfolioContent(content: unknown) {
  return portfolioContentSchema.parse(content);
}

if (process.argv[1]?.endsWith("contentValidation.ts")) {
  validatePortfolioContent(portfolioContent);
  console.log("Portfolio content validation passed.");
}
