import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HelpHomeView from "@/components/help/HelpHomeView";
import { listHelpArticles } from "@/content/help/loaders";
import { ensureHelpLocale } from "@/lib/help/ensure-help-locale";
import { generateHelpMetadata } from "@/lib/seo/generate-help-metadata";
import { getHelpHomeSeo } from "@/lib/seo/help-home-seo";
import { breadcrumbListSchema } from "@/lib/seo/json-ld";
import { getEnv } from "@/lib/env";

type PageProps = {
  params: Promise<{ locale: string }>;
};

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const seo = getHelpHomeSeo(locale);
  return generateHelpMetadata({
    locale,
    path: "/help",
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function HelpHomePage({ params }: PageProps) {
  const { locale } = await params;
  ensureHelpLocale(locale, "/help");

  const t = await getTranslations({ locale, namespace: "Help" });
  const { siteUrl } = getEnv();
  const startHereArticles = listHelpArticles(locale, {
    domain: "getting-started",
    publishedOnly: true,
  });

  const breadcrumb = breadcrumbListSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: t("home_title"), url: `${siteUrl}/${locale}/help` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <HelpHomeView locale={locale} startHereArticles={startHereArticles} />
    </>
  );
}
