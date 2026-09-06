import type { MetadataRoute } from "next";
import { HELP_ARTICLE_DEFS } from "@/content/help/manifest";
import { HELP_DOMAINS } from "@/content/help/domains";
import { listIndexableLegalPaths } from "@/content/legal/loaders";
import { getEnv } from "@/lib/env";
import { HELP_CONTENT_LOCALES } from "@/lib/help/content-locales";
import { LEGAL_CONTENT_LOCALES } from "@/lib/legal/content-locales";
import { LOCALES } from "@/lib/seo/constants";
import { PUBLIC_ROUTES } from "@/lib/seo/public-routes";

type HelpSitemapPath = { path: string; lastModified?: string };

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

  const helpPaths: HelpSitemapPath[] = [
    { path: "/help" },
    ...HELP_DOMAINS.map((d) => ({ path: `/help/${d.id}` })),
  ];
  for (const a of HELP_ARTICLE_DEFS) {
    if (!a.published) continue;
    helpPaths.push({ path: `/help/${a.slug}`, lastModified: a.updatedAt });
  }

  for (const { path, lastModified } of helpPaths) {
    for (const locale of HELP_CONTENT_LOCALES) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
        changeFrequency: "monthly",
        priority: path === "/help" ? 0.8 : 0.7,
      });
    }
  }

  // Legal: only when status is "final" (draft stays noindex and off sitemap).
  for (const { path } of listIndexableLegalPaths()) {
    for (const locale of LEGAL_CONTENT_LOCALES) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
