import type { QueryClient } from "@tanstack/react-query";
import { portfolioContent } from "@/content/portfolioContent";

export type HeadMeta = {
  title: string;
  description: string;
  ogDescription: string;
  canonicalPath: string;
  noindex?: boolean;
  notFound?: boolean;
};

const homepageMeta: HeadMeta = {
  title: portfolioContent.seo.title,
  description: portfolioContent.seo.description,
  ogDescription: portfolioContent.seo.ogDescription,
  canonicalPath: "/",
};

export async function prefetchForPath(url: string, _queryClient: QueryClient): Promise<HeadMeta> {
  const pathname = url.split("?", 1)[0] || "/";
  if (pathname === "/") return homepageMeta;
  if (pathname === "/admin") {
    return {
      title: `Content editor — ${portfolioContent.identity.name}`,
      description: "Private portfolio content editor.",
      ogDescription: "Private portfolio content editor.",
      canonicalPath: "/admin",
      noindex: true,
    };
  }
  return {
    title: `Page not found — ${portfolioContent.identity.name}`,
    description: "The requested page could not be found.",
    ogDescription: "The requested page could not be found.",
    canonicalPath: pathname,
    noindex: true,
    notFound: true,
  };
}
