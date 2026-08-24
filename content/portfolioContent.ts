import about from "./portfolio/about.json";
import achievements from "./portfolio/achievements.json";
import contact from "./portfolio/contact.json";
import experience from "./portfolio/experience.json";
import footer from "./portfolio/footer.json";
import hero from "./portfolio/hero.json";
import identity from "./portfolio/identity.json";
import navigation from "./portfolio/navigation.json";
import philosophy from "./portfolio/philosophy.json";
import practice from "./portfolio/practice.json";
import seo from "./portfolio/seo.json";
import ui from "./portfolio/ui.json";
import work from "./portfolio/work.json";

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
