import about from "./portfolio/about.json" with { type: "json" };
import achievements from "./portfolio/achievements.json" with { type: "json" };
import contact from "./portfolio/contact.json" with { type: "json" };
import experience from "./portfolio/experience.json" with { type: "json" };
import footer from "./portfolio/footer.json" with { type: "json" };
import hero from "./portfolio/hero.json" with { type: "json" };
import identity from "./portfolio/identity.json" with { type: "json" };
import navigation from "./portfolio/navigation.json" with { type: "json" };
import philosophy from "./portfolio/philosophy.json" with { type: "json" };
import practice from "./portfolio/practice.json" with { type: "json" };
import seo from "./portfolio/seo.json" with { type: "json" };
import ui from "./portfolio/ui.json" with { type: "json" };
import work from "./portfolio/work.json" with { type: "json" };

/**
 * The public site consumes one stable object even though the CMS edits every
 * portfolio area in its own focused JSON file.
 */
export const portfolioContent = {
  identity,
  navigation: navigation.items,
  hero,
  work,
  practice,
  achievements,
  about,
  experience,
  philosophy,
  contact,
  footer,
  ui,
  seo,
} as const;
