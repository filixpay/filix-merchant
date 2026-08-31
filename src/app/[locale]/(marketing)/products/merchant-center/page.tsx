import type { Metadata } from "next";
import { getEnv } from "@/lib/env";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import { getMarketingPageSeo } from "@/lib/seo/marketing-page-seo";
import { softwareApplicationSchema } from "@/lib/seo/json-ld";
import MerchantCenterContent from "./MerchantCenterContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "merchant_center");
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function MerchantCenterPage({ params }: PageProps) {
  const { locale } = await params;
  const seo = getMarketingPageSeo("merchant_center", locale);
  const { siteUrl } = getEnv();

  const schemaName = locale === "zh" ? "FilixPay 商户中心" : "FilixPay Merchant Center";

  return (
    <>
      <JsonLd
        data={softwareApplicationSchema({
          name: schemaName,
          url: `${siteUrl}/${locale}${seo.path}`,
          description: seo.description,
        })}
      />
      <MerchantCenterContent />
    </>
  );
}
