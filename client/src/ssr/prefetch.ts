import { portfolioContent } from "@/content/portfolioContent";

type PersonMeta = {
  name: string;
  jobTitles: readonly string[];
  locality: string;
  countryCode: string;
  education: string;
  employer: string;
  knowsAbout: readonly string[];
};

export type HeadMeta = {
  title: string;
  description: string;
  ogDescription: string;
  canonicalPath: string;
  author: string;
  keywords: readonly string[];
  shareImage: string;
  person: PersonMeta;
  noindex?: boolean;
  notFound?: boolean;
};

const sharedSeoMeta = {
  author: portfolioContent.identity.name,
  keywords: portfolioContent.seo.keywords,
  shareImage: portfolioContent.seo.shareImage,
  person: {
    name: portfolioContent.identity.name,
    jobTitles: portfolioContent.seo.person.jobTitles,
    locality: portfolioContent.seo.person.locality,
    countryCode: portfolioContent.seo.person.countryCode,
    education: portfolioContent.seo.person.education,
    employer: portfolioContent.seo.person.employer,
    knowsAbout: portfolioContent.seo.person.knowsAbout,
  },
} as const;

const homepageMeta: HeadMeta = {
  title: portfolioContent.seo.title,
  description: portfolioContent.seo.description,
  ogDescription: portfolioContent.seo.ogDescription,
  canonicalPath: "/",
  ...sharedSeoMeta,
};

export async function prefetchForPath(url: string): Promise<HeadMeta> {
  const pathname = url.split("?", 1)[0] || "/";
  if (pathname === "/") return homepageMeta;
  if (pathname === "/admin") {
    return {
      title: `Content editor — ${portfolioContent.identity.name}`,
      description: "Private portfolio content editor.",
      ogDescription: "Private portfolio content editor.",
      canonicalPath: "/admin",
      ...sharedSeoMeta,
      noindex: true,
    };
  }
  return {
    title: `Page not found — ${portfolioContent.identity.name}`,
      description: "The requested page could not be found.",
      ogDescription: "The requested page could not be found.",
      canonicalPath: pathname,
      ...sharedSeoMeta,
      noindex: true,
    notFound: true,
  };
}
