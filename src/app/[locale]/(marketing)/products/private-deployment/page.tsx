import type { Metadata } from "next";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import PrivateDeploymentContent from "./PrivateDeploymentContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "private_deployment");
}

export default function PrivateDeploymentPage() {
  return <PrivateDeploymentContent />;
}
