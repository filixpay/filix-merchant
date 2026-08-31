import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { organizationSchema, webSiteSchema } from "@/lib/seo/json-ld";
import HomePageContent from "./HomePageContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const HOME_SEO_LOCALES = ["zh", "en"] as const;

async function getHomeSeo(locale: string) {
  const effectiveLocale = HOME_SEO_LOCALES.includes(locale as (typeof HOME_SEO_LOCALES)[number])
    ? locale
    : "en";
  const t = await getTranslations({ locale: effectiveLocale, namespace: "Seo.home" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords") as string[],
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getHomeSeo(locale);

  return buildPageMetadata({
    locale,
    path: "/",
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={webSiteSchema()} />
      <HomePageContent />
    </>
  );
}
