import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import HelpArticleView from "@/components/help/HelpArticleView";
import { getHelpDomain } from "@/content/help/domains";
import {
  getHelpArticle,
  listHelpArticles,
} from "@/content/help/loaders";
import {
  isHelpContentLocale,
  type HelpContentLocale,
} from "@/lib/help/content-locales";
import { ensureHelpLocale } from "@/lib/help/ensure-help-locale";
import { generateHelpMetadata } from "@/lib/seo/generate-help-metadata";
import {
  formatHelpDocumentTitle,
  helpBreadcrumbHomeName,
} from "@/lib/seo/help-page-seo";
import { breadcrumbListSchema } from "@/lib/seo/json-ld";
import { getEnv } from "@/lib/env";

type PageProps = {
  params: Promise<{ locale: string; domain: string; slug: string[] }>;
};

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function articleLocale(locale: string): HelpContentLocale {
  return isHelpContentLocale(locale) ? locale : "en";
}

function buildSlug(domain: string, slugParts: string[]): string {
  return [domain, ...slugParts].join("/");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, domain, slug: slugParts } = await params;
  const slug = buildSlug(domain, slugParts ?? []);
  const article = getHelpArticle(locale, slug);
  if (!article) {
    return {};
  }
  return generateHelpMetadata({
    locale,
    path: `/help/${slug}`,
    title: formatHelpDocumentTitle(article.title, locale),
    description: article.description,
    keywords: article.keywords,
    slugForAlternates: slug,
  });
}

export default async function HelpArticlePage({ params }: PageProps) {
  const { locale, domain, slug: slugParts } = await params;
  const slug = buildSlug(domain, slugParts ?? []);
  ensureHelpLocale(locale, `/help/${slug}`);

  const article = getHelpArticle(locale, slug);
  if (!article) {
    notFound();
  }

  const meta = getHelpDomain(domain);
  if (!meta || article.domain !== domain) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Help" });
  const { siteUrl } = getEnv();
  const loc = articleLocale(locale);

  const siblings = listHelpArticles(locale, {
    domain: article.domain,
    publishedOnly: true,
  });
  const index = siblings.findIndex((item) => item.slug === article.slug);
  const prev = index > 0 ? siblings[index - 1] : null;
  const next =
    index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;

  const related = article.relatedSlugs
    .map((relatedSlug) => getHelpArticle(locale, relatedSlug))
    .filter((item): item is NonNullable<typeof item> => item != null);

  const breadcrumb = breadcrumbListSchema([
    { name: helpBreadcrumbHomeName(locale), url: `${siteUrl}/${locale}` },
    { name: t("home_nav"), url: `${siteUrl}/${locale}/help` },
    {
      name: meta.heading[loc],
      url: `${siteUrl}/${locale}/help/${domain}`,
    },
    {
      name: article.title,
      url: `${siteUrl}/${locale}/help/${slug}`,
    },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <HelpArticleView
        locale={locale}
        domain={meta}
        article={article}
        related={related}
        prev={prev}
        next={next}
      />
    </>
  );
}
