import type { MetadataRoute } from "next";
import { getEnv } from "@/lib/env";
import { LOCALES } from "@/lib/seo/constants";
import { PUBLIC_ROUTES } from "@/lib/seo/public-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteUrl } = getEnv();
  const entries: MetadataRoute.Sitemap = [];

  for (const route of PUBLIC_ROUTES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${siteUrl}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
  }

  return entries;
}
