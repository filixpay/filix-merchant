import type { Metadata } from "next";
import { getEnv } from "@/lib/env";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import { getMarketingPageSeo } from "@/lib/seo/marketing-page-seo";
import { softwareApplicationSchema } from "@/lib/seo/json-ld";
import DevelopersContent from "./DevelopersContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "developers");
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function DevelopersPage({ params }: PageProps) {
  const { locale } = await params;
  const seo = getMarketingPageSeo("developers", locale);
  const { siteUrl } = getEnv();

  const schemaName =
    locale === "zh" ? "FilixPay 开发者平台" : "FilixPay Developer Platform";

  return (
    <>
      <JsonLd
        data={softwareApplicationSchema({
          name: schemaName,
          url: `${siteUrl}/${locale}${seo.path}`,
          description: seo.description,
        })}
      />
      <DevelopersContent />
    </>
  );
}
