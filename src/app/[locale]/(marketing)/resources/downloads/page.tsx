import type { Metadata } from "next";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import DownloadsContent from "./DownloadsContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "downloads");
}

export default function DownloadsPage() {
  return <DownloadsContent />;
}
