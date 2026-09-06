import type { Metadata } from "next";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import OpenSourceHubContent from "./OpenSourceHubContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "open_source");
}

export default function OpenSourceHubPage() {
  return <OpenSourceHubContent />;
}
