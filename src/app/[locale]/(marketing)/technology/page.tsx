import type { Metadata } from "next";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import TechnologyOverviewContent from "./TechnologyOverviewContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "technology");
}

export default function TechnologyOverviewPage() {
  return <TechnologyOverviewContent />;
}
