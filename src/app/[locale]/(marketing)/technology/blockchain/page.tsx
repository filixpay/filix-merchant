import type { Metadata } from "next";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import BlockchainContent from "./BlockchainContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "blockchain", {
    robots: { index: false, follow: true },
  });
}

export default function BlockchainPage() {
  return <BlockchainContent />;
}
