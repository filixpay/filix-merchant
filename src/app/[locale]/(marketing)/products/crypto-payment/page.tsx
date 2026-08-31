import type { Metadata } from "next";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import CryptoPaymentContent from "./CryptoPaymentContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "crypto_payment");
}

export default function CryptoPaymentPage() {
  return <CryptoPaymentContent />;
}
