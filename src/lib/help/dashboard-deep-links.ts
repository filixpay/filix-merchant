import { HELP_ARTICLE_DEFS } from "@/content/help/manifest";

/** Normalize to path starting with /dashboard without locale prefix. */
export function normalizeDashboardPath(path: string): string {
  const trimmed = path.trim();
  const withoutLocale = trimmed.replace(
    /^\/(en|zh|es|fr|de|ja|ko|ar|pt)(?=\/)/,
    "",
  );
  return withoutLocale.startsWith("/") ? withoutLocale : `/${withoutLocale}`;
}

/**
 * All published Help slugs that list this dashboard path in dashboardLinks.
 * Order: defs with a primary link matching the path first, then remaining by manifest order.
 * Never assumes a dashboard path maps to exactly one Help slug.
 */
export function getHelpSlugsForDashboardPath(dashboardPath: string): string[] {
  const target = normalizeDashboardPath(dashboardPath);
  const primary: string[] = [];
  const rest: string[] = [];
  for (const def of HELP_ARTICLE_DEFS) {
    if (!def.published || !def.dashboardLinks?.length) continue;
    const match = def.dashboardLinks.find(
      (link) => normalizeDashboardPath(link.path) === target,
    );
    if (!match) continue;
    if (match.primary) primary.push(def.slug);
    else rest.push(def.slug);
  }
  return [...primary, ...rest];
}

export function getPrimaryHelpSlugForDashboardPath(
  dashboardPath: string,
): string | null {
  return getHelpSlugsForDashboardPath(dashboardPath)[0] ?? null;
}

export function getHelpHrefForDashboardPath(
  locale: string,
  dashboardPath: string,
  helpSlug?: string,
  hash?: string,
): string | null {
  const target = normalizeDashboardPath(dashboardPath);
  let slug = helpSlug ?? null;
  let resolvedHash = hash;

  if (!slug || resolvedHash === undefined) {
    for (const def of HELP_ARTICLE_DEFS) {
      if (!def.published || !def.dashboardLinks?.length) continue;
      const match = def.dashboardLinks.find(
        (link) => normalizeDashboardPath(link.path) === target,
      );
      if (!match) continue;
      if (!slug) slug = def.slug;
      if (resolvedHash === undefined && match.hash) {
        resolvedHash = match.hash;
      }
      if (match.primary || helpSlug === def.slug) break;
    }
  }

  if (!slug) {
    slug = getPrimaryHelpSlugForDashboardPath(dashboardPath);
  }
  if (!slug) return null;
  const fragment =
    resolvedHash && resolvedHash.length > 0
      ? `#${resolvedHash.replace(/^#/, "")}`
      : "";
  return `/${locale}/help/${slug}${fragment}`;
}
