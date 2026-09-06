import type { Metadata } from "next";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import OpenSourceProjectContent from "../OpenSourceProjectContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "open_source_saleor");
}

export default function OpenSourceSaleorPage() {
  return <OpenSourceProjectContent projectKey="saleor" messageKey="open_source_saleor" />;
}
