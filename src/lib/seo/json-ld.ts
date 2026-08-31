import { getEnv } from "@/lib/env";
import { ORGANIZATION_DESCRIPTION } from "./brand-glossary";
import { ORGANIZATION_EMAIL, ORGANIZATION_SAME_AS } from "./constants";

export function organizationSchema() {
  const { siteUrl } = getEnv();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FilixPay",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    email: ORGANIZATION_EMAIL,
    sameAs: ORGANIZATION_SAME_AS,
    description: ORGANIZATION_DESCRIPTION.en,
  };
}

export function webSiteSchema() {
  const { siteUrl } = getEnv();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FilixPay",
    url: siteUrl,
    inLanguage: ["zh", "en"],
  };
}

export type SoftwareApplicationSchemaInput = {
  name: string;
  url: string;
  description: string;
};

export function softwareApplicationSchema(input: SoftwareApplicationSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    url: input.url,
    description: input.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
  };
}
