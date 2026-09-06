import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import HelpCategoryView from "@/components/help/HelpCategoryView";
import { getHelpDomain } from "@/content/help/domains";
import { listHelpArticles } from "@/content/help/loaders";
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
  params: Promise<{ locale: string; domain: string }>;
};

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function domainLocale(locale: string): HelpContentLocale {
  return isHelpContentLocale(locale) ? locale : "en";
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, domain } = await params;
  const meta = getHelpDomain(domain);
  if (!meta) {
    return {};
  }
  const loc = domainLocale(locale);
  return generateHelpMetadata({
    locale,
    path: `/help/${domain}`,
    title: formatHelpDocumentTitle(meta.heading[loc], locale),
    description: meta.description[loc],
  });
}

export default async function HelpDomainPage({ params }: PageProps) {
  const { locale, domain } = await params;
  ensureHelpLocale(locale, `/help/${domain}`);

  const meta = getHelpDomain(domain);
  if (!meta) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Help" });
  const { siteUrl } = getEnv();
  const articles = listHelpArticles(locale, {
    domain,
    publishedOnly: true,
  });
  const loc = domainLocale(locale);

  const breadcrumb = breadcrumbListSchema([
    { name: helpBreadcrumbHomeName(locale), url: `${siteUrl}/${locale}` },
    { name: t("home_nav"), url: `${siteUrl}/${locale}/help` },
    {
      name: meta.heading[loc],
      url: `${siteUrl}/${locale}/help/${domain}`,
    },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <HelpCategoryView locale={locale} domain={meta} articles={articles} />
    </>
  );
}
