import type { Metadata } from "next";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import MicSelectCaseStudyContent from "./MicSelectCaseStudyContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "micselect");
}

export default function MicSelectCaseStudyPage() {
  return <MicSelectCaseStudyContent />;
}
