import type { Metadata } from "next";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import PaymentSplittingContent from "./PaymentSplittingContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "payment_splitting");
}

export default function PaymentSplittingPage() {
  return <PaymentSplittingContent />;
}
