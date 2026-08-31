import type { Metadata } from "next";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import ResourcesOverviewContent from "./ResourcesOverviewContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "resources");
}

export default function ResourcesOverviewPage() {
  return <ResourcesOverviewContent />;
}
