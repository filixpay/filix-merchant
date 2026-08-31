import type { Metadata } from "next";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import ReconciliationSettlementContent from "./ReconciliationSettlementContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "reconciliation_settlement");
}

export default function ReconciliationSettlementPage() {
  return <ReconciliationSettlementContent />;
}
