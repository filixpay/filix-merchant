import type { Metadata } from "next";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import OpenSourceProjectContent from "../OpenSourceProjectContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "open_source_checkout");
}

export default function OpenSourceCheckoutPage() {
  return <OpenSourceProjectContent projectKey="checkout" messageKey="open_source_checkout" />;
}
