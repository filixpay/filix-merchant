import type { Metadata } from "next";
import { buildPageMetadata } from "./metadata";
import { buildHelpAlternates } from "./metadata";
import { publishedLocalesForSlug } from "@/content/help/loaders";

export async function generateHelpMetadata(input: {
  locale: string;
  path: string; // e.g. "/help/commerce/products/create"
  title: string;
  description: string;
  keywords?: string[];
  slugForAlternates?: string; // article slug; omit for home/category-only
}): Promise<Metadata> {
  const published = input.slugForAlternates
    ? publishedLocalesForSlug(input.slugForAlternates)
    : (["en", "zh"] as const);

  const base = buildPageMetadata({
    locale: input.locale,
    path: input.path,
    title: input.title,
    description: input.description,
    keywords: input.keywords,
  });

  const alternates = buildHelpAlternates(input.locale, input.path, published);

  return {
    ...base,
    alternates,
    openGraph: {
      ...base.openGraph,
      url: alternates.canonical,
    },
  };
}
