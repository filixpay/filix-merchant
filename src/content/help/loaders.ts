import { HELP_ARTICLE_DEFS } from "./manifest";
import type { HelpArticle } from "./types";
import type { HelpContentLocale } from "@/lib/help/content-locales";
import { isHelpContentLocale } from "@/lib/help/content-locales";
import { HELP_ARTICLE_CONTENT } from "./article-content";

export function getHelpArticleRaw(
  locale: string,
  slug: string,
): HelpArticle | null {
  if (!isHelpContentLocale(locale)) return null;
  const def = HELP_ARTICLE_DEFS.find((d) => d.slug === slug);
  if (!def) return null;
  const content = HELP_ARTICLE_CONTENT[locale]?.[slug];
  return {
    ...def,
    locale,
    title: content?.title ?? def.slug,
    description: content?.description ?? "",
    keywords: content?.keywords ?? [],
    body: content?.body,
  };
}

/** Public read: unpublished → null (callers must notFound). */
export function getHelpArticle(locale: string, slug: string): HelpArticle | null {
  const article = getHelpArticleRaw(locale, slug);
  if (!article || !article.published) return null;
  return article;
}

export function listHelpArticles(
  locale: string,
  options?: { domain?: string; publishedOnly?: boolean },
): HelpArticle[] {
  const publishedOnly = options?.publishedOnly ?? true;
  return HELP_ARTICLE_DEFS.filter((d) =>
    options?.domain ? d.domain === options.domain : true,
  )
    .filter((d) => (publishedOnly ? d.published : true))
    .map((d) => getHelpArticleRaw(locale, d.slug))
    .filter((a): a is HelpArticle => a != null)
    .filter((a) => (publishedOnly ? a.published : true))
    .sort((a, b) => a.order - b.order);
}

export function getHelpPath(slug: string): string {
  return `/help/${slug}`;
}

export function getHelpHref(locale: string, slug: string): string {
  return `/${locale}/help/${slug}`;
}

export function publishedLocalesForSlug(slug: string): HelpContentLocale[] {
  const def = HELP_ARTICLE_DEFS.find((d) => d.slug === slug);
  if (!def?.published) return [];
  // MVP: both en and zh once content exists; until zh authored, still list both only when content map has entry
  const locales: HelpContentLocale[] = [];
  for (const loc of ["en", "zh"] as const) {
    if (HELP_ARTICLE_CONTENT[loc]?.[slug]) locales.push(loc);
  }
  return locales;
}
