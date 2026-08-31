import type { Metadata } from "next";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import SolutionsOverviewContent from "./SolutionsOverviewContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "solutions");
}

export default function SolutionsOverviewPage() {
  return <SolutionsOverviewContent />;
}
