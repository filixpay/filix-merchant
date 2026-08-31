import type { Metadata } from "next";
import { getEnv } from "@/lib/env";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import { getMarketingPageSeo } from "@/lib/seo/marketing-page-seo";
import ForEnterpriseContent from "./ForEnterpriseContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "for_enterprise");
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function ForEnterprisePage({ params }: PageProps) {
  const { locale } = await params;
  const seo = getMarketingPageSeo("for_enterprise", locale);
  const { siteUrl } = getEnv();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: seo.title,
          description: seo.description,
          url: `${siteUrl}/${locale}/for-enterprise`,
          isPartOf: { "@type": "WebSite", name: "FilixPay", url: siteUrl },
        }}
      />
      <ForEnterpriseContent />
    </>
  );
}
