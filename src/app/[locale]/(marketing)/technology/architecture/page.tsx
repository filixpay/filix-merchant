import type { Metadata } from "next";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import ArchitectureContent from "./ArchitectureContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "architecture");
}

export default function ArchitecturePage() {
  return <ArchitectureContent />;
}
