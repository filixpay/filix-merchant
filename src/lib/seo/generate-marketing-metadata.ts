import type { Metadata } from "next";
import { buildPageMetadata } from "./metadata";
import { getMarketingPageSeo } from "./marketing-page-seo";

export async function generateMarketingMetadata(
  locale: string,
  pageKey: string,
  options?: { robots?: Metadata["robots"] }
): Promise<Metadata> {
  const seo = getMarketingPageSeo(pageKey, locale);

  return buildPageMetadata({
    locale,
    path: seo.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: options?.robots,
  });
}
