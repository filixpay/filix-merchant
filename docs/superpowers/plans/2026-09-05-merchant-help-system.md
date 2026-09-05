# Merchant Help System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a public, EN+ZH-indexable FilixPay Merchant Help at `/{locale}/help/**` with typed content, SEO, search, and thin Dashboard `?` deep links for P0 guides.

**Architecture:** Typed Help articles + manifest under `src/content/help` drive App Router pages in `src/app/[locale]/(help)/help`, SEO via extended `buildPageMetadata` (self-canonical + published-locale hreflang only), sitemap from published slugs, and reverse deep links from `dashboardLinks`. `published: false` entries (Checkouts) stay in the manifest only and resolve to 404.

**Tech Stack:** Next.js App Router, TypeScript, next-intl, existing `src/lib/seo/*`, Marketing `SiteNavbar` / `SiteFooter` chrome

**Spec:** `docs/superpowers/specs/2026-09-05-merchant-help-system-design.md`

## Global Constraints

- Help answers “how do I do X in Merchant Center”; do not duplicate Marketing value props or Developers API reference.
- IA = **Getting Started + 8 business domains** (Getting Started is not a business domain).
- URLs: `/{locale}/help/...` — never `/help/products` (Marketing owns `/products/*`).
- Content tech: typed modules + manifest — **no MDX, no CMS** in V1.
- Published Help content locales: **en**, **zh** only. Other locales **308** → `/en/help/{slug}`.
- Each published locale URL **canonicalizes to itself** (never zh → en canonical).
- `dashboardLinks?: { path; labelKey; primary? }[]` — shared structural defs; CTA labels via `Help.dashboardLinks.*` i18n (never hard-coded EN in the manifest). One guide may map to multiple Dashboard paths.
- Reverse deep-link API returns **candidates** (`getHelpSlugsForDashboardPath` → `string[]`); UI picks primary or explicit `helpSlug` override. A Dashboard path is not assumed to map to a single Help slug.
- Help search V1 must index **title + description + keywords + flattened HelpBody plain text** for published articles only.
- Sitemap Help entries must not use `lastModified: new Date()`. Prefer `updatedAt` on the article def when present; otherwise omit `lastModified`.
- `published: false` → 404 + no metadata/sitemap/search/nav/`?`.
- Message `Help.*` chrome keys follow repo key-parity rules only; they do **not** imply Help content/routes for non-EN/ZH locales.
- No P0 slugs for Getting Started “first payment/balance” or “first payout” (Related/Next Step only).
- No `commerce/products/edit` slug in V1.
- Refunds Help slug: `risk/refunds` only.
- Funds copy = funds movement; never “manage your wallet” as the product model.
- Offline Collection ≠ product reviews.
- Examples: `@example.com`, reserved phones, placeholder secrets only.
- Per `AGENTS.md`: agents must **not** create or modify `*.test.ts` / `*.test.tsx`. Verify with `tsc`, manual browser checks, and optional `npx tsx` sanity scripts.
- Login deep links use existing `callbackUrl` (not `returnTo`): `/{locale}/login?callbackUrl=/{locale}/dashboard/...`.
- Do not commit secrets.

## File structure

| File | Responsibility |
|------|----------------|
| `docs/superpowers/specs/2026-09-05-merchant-help-p0-slug-map.md` | Locked P0 slug ↔ `dashboardLinks` ↔ reverse `?` map after HEAD audit |
| `src/content/help/types.ts` | `HelpDomain`, `HelpDashboardLink`, `HelpArticle`, `HelpBody` types |
| `src/content/help/domains.ts` | Domain metadata (id, nav order, titles en/zh) |
| `src/content/help/manifest.ts` | Registers all articles including `published: false` reservations |
| `src/content/help/loaders.ts` | `getHelpArticle`, `listHelpArticles`, `getHelpDomain`, `resolveHelpPath` |
| `src/content/help/search.ts` | Build/query published search index |
| `src/content/help/en/{getting-started,payments,funds,risk,commerce}.ts` | EN P0 bodies by domain |
| `src/content/help/zh/{getting-started,payments,funds,risk,commerce}.ts` | ZH P0 bodies by domain |
| `src/content/help/article-content.ts` | Composes domain modules into `HELP_ARTICLE_CONTENT` |
| `src/lib/help/content-locales.ts` | `HELP_CONTENT_LOCALES`, redirect helper |
| `src/lib/help/dashboard-deep-links.ts` | Reverse map: dashboard path → Help slug **candidates** + primary |
| `src/lib/seo/metadata.ts` | Add `buildHelpAlternates(locale, path, publishedLocales)` |
| `src/lib/seo/generate-help-metadata.ts` | `generateHelpMetadata` using `buildPageMetadata` |
| `src/lib/seo/json-ld.ts` | Add `breadcrumbListSchema` |
| `src/app/sitemap.ts` | Merge published Help URLs (en+zh only; no fake `lastModified`) |
| `src/components/help/*` | Shell, nav, search, article/category/home views, deep-link control, CSS |
| `src/app/[locale]/(help)/layout.tsx` | Public Help chrome; locale redirect; no `enableMarketing` gate |
| `src/app/[locale]/(help)/help/page.tsx` | Help home |
| `src/app/[locale]/(help)/help/[domain]/page.tsx` | Domain category index |
| `src/app/[locale]/(help)/help/[domain]/[...slug]/page.tsx` | Article pages |
| `messages/en.json`, `messages/zh.json` (+ other locales **only if** existing CI key-parity requires it) | `Help.*` chrome + `Help.dashboardLinks.*` |
| Selected `src/app/[locale]/dashboard/**/page.tsx` + list headers | Thin `?` deep-link control |

---

### Task 1: HEAD path audit + lock P0 slug map

**Files:**
- Create: `docs/superpowers/specs/2026-09-05-merchant-help-p0-slug-map.md`
- Read (do not modify yet): `src/components/layout/dashboard-menu.tsx`, P0 dashboard pages under `src/app/[locale]/dashboard/**`

**Interfaces:**
- Consumes: frozen design spec
- Produces: locked markdown table used by Tasks 3–12 (no code yet)

- [ ] **Step 1: Re-read Dashboard menu + P0 routes from HEAD**

Confirm these paths still exist and note any drift:

```
/dashboard
/dashboard/onboarding/status
/dashboard/onboarding/apply
/dashboard/configs
/dashboard/orders
/dashboard/transfers
/dashboard/reviews
/dashboard/checkouts          # exists; menu visible:false
/dashboard/money/balance
/dashboard/money/activity
/dashboard/money/money-in
/dashboard/money/payouts
/dashboard/money/settlements
/dashboard/money/transaction-reconciliation
/dashboard/refunds
/dashboard/disputes
/dashboard/commerce/products
/dashboard/commerce/products/new
/dashboard/commerce/products/[id]
```

- [ ] **Step 2: Write the locked map doc**

Create `docs/superpowers/specs/2026-09-05-merchant-help-p0-slug-map.md` using the following **structure**. The final table is **authoritative** and may differ from this draft **only** where the HEAD audit proves route/ownership drift. Document any drift in a “Diff from design” note at the top of the file. Do not invent new P0 slugs beyond the design’s published set.

Draft structure to start from:

```markdown
# Merchant Help P0 slug map (locked)

**Date:** 2026-09-05  
**Source of truth after HEAD audit of dashboard-menu + pages**

## Published P0 articles

| slug | domain | primary dashboardLinks | other dashboardLinks | reverse `?` on |
|------|--------|------------------------|----------------------|----------------|
| getting-started/merchant-setup | getting-started | /dashboard/onboarding/status | /dashboard/onboarding/apply | onboarding status + apply |
| getting-started/payment-channel | getting-started | /dashboard/configs | — | configs |
| getting-started/create-product | getting-started | /dashboard/commerce/products/new | — | products/new |
| getting-started/publish-product | getting-started | /dashboard/commerce/products | — | products list + detail (publish context) |
| payments/orders | payments | /dashboard/orders | — | orders |
| payments/offline-collection | payments | /dashboard/transfers | /dashboard/reviews | transfers + reviews |
| funds/balance | funds | /dashboard/money/balance | /dashboard/money/activity | balance (+ activity optional) |
| funds/money-in | funds | /dashboard/money/money-in | — | money-in |
| funds/payouts | funds | /dashboard/money/payouts | — | payouts |
| funds/settlements | funds | /dashboard/money/settlements | — | settlements |
| funds/reconciliation | funds | /dashboard/money/transaction-reconciliation | — | reconciliation |
| risk/refunds | risk | /dashboard/refunds | — | refunds |
| risk/disputes | risk | /dashboard/disputes | — | disputes |
| commerce/products | commerce | /dashboard/commerce/products | — | products list; detail `?` → this or create |
| commerce/products/create | commerce | /dashboard/commerce/products/new | — | products/new |
| commerce/products/publish | commerce | /dashboard/commerce/products | — | detail publish actions |

## Category indexes (published, no article body required beyond blurb)

getting-started, merchant, payments, funds, risk, commerce, credit, developers, account  
(merchant/credit/developers/account categories may be empty of P0 articles — still ship index shell with “coming soon” / browse CTA, no fake articles)

## Home

`/help` — special page, not a domain article.

## Reserved (published: false)

| slug | behavior |
|------|----------|
| payments/checkouts | manifest only → 404; no sitemap/search/nav/`?` |

## Explicitly excluded from P0 slugs

- getting-started first-payment / first-payout (Related only)
- commerce/products/edit
- customers, payment-splits, crypto, fraud splits, reporting, full account/credit/developers sets
```

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-09-05-merchant-help-p0-slug-map.md
git commit -m "docs(help): lock P0 slug and dashboard deep-link map"
```

---

### Task 2: Help types + domain metadata

**Files:**
- Create: `src/content/help/types.ts`
- Create: `src/content/help/domains.ts`
- Create: `src/lib/help/content-locales.ts`

**Interfaces:**
- Consumes: locked map from Task 1
- Produces: types and domain list used by loaders/manifest

- [ ] **Step 1: Create content locale constants**

```ts
// src/lib/help/content-locales.ts
export const HELP_CONTENT_LOCALES = ["en", "zh"] as const;
export type HelpContentLocale = (typeof HELP_CONTENT_LOCALES)[number];

export function isHelpContentLocale(locale: string): locale is HelpContentLocale {
  return (HELP_CONTENT_LOCALES as readonly string[]).includes(locale);
}
```

- [ ] **Step 2: Create types**

```ts
// src/content/help/types.ts
import type { HelpContentLocale } from "@/lib/help/content-locales";

export type HelpDomainId =
  | "getting-started"
  | "merchant"
  | "payments"
  | "funds"
  | "risk"
  | "commerce"
  | "credit"
  | "developers"
  | "account";

export type HelpDashboardLink = {
  path: string;
  /** Key under `Help.dashboardLinks.*` in messages — never a hard-coded display string. */
  labelKey: string;
  primary?: boolean;
};

export type HelpBodyBlock =
  | { type: "paragraph"; text: string }
  | { type: "steps"; items: string[] }
  | { type: "fields"; rows: { field: string; description: string }[] }
  | { type: "issues"; items: { problem: string; solution: string }[] }
  | { type: "heading"; text: string; anchor?: string };

export type HelpBody = {
  whoFor: string;
  whenToUse: string;
  beforeYouStart: string[];
  blocks: HelpBodyBlock[];
  nextStep?: { label: string; href: string };
};

export type HelpArticle = {
  slug: string;
  domain: HelpDomainId;
  locale: HelpContentLocale;
  published: boolean;
  title: string;
  description: string;
  keywords: string[];
  order: number;
  relatedSlugs: string[];
  dashboardLinks?: HelpDashboardLink[];
  marketingPath?: string | null;
  developerPath?: string | null;
  /** Optional ISO date for sitemap lastModified; omit rather than inventing "now". */
  updatedAt?: string;
  body?: HelpBody;
};
```

Also freeze CTA i18n convention (implemented in Task 5 messages + Task 7 Open component):

- Default single-link CTA uses `Help.open_in_merchant_center`.
- Multi-link guides resolve each `labelKey` via `t(\`dashboardLinks.${labelKey}\`)` (e.g. `open_transfers`, `open_reviews`).
- Manifest never stores localized display strings.

- [ ] **Step 3: Create domain metadata**

```ts
// src/content/help/domains.ts
import type { HelpDomainId } from "./types";

export type HelpDomainMeta = {
  id: HelpDomainId;
  order: number;
  /** true only for getting-started funnel section */
  isGettingStarted: boolean;
  title: { en: string; zh: string };
  description: { en: string; zh: string };
};

export const HELP_DOMAINS: HelpDomainMeta[] = [
  {
    id: "getting-started",
    order: 0,
    isGettingStarted: true,
    title: { en: "Getting Started", zh: "快速开始" },
    description: {
      en: "Set up your merchant account and publish your first product.",
      zh: "完成商户开通并发布第一个商品。",
    },
  },
  {
    id: "merchant",
    order: 1,
    isGettingStarted: false,
    title: { en: "Merchant & Organization", zh: "商户与组织" },
    description: {
      en: "Organization, locations, sub-merchants, and maintenance.",
      zh: "组织、门店、子商户与资料维护。",
    },
  },
  {
    id: "payments",
    order: 2,
    isGettingStarted: false,
    title: { en: "Payments & Transactions", zh: "支付与交易" },
    description: {
      en: "Orders, customers, payment splits, and offline collection.",
      zh: "订单、客户、分账与线下归集。",
    },
  },
  {
    id: "funds",
    order: 3,
    isGettingStarted: false,
    title: { en: "Funds", zh: "资金" },
    description: {
      en: "Balance, money-in, payouts, settlements, and reconciliation.",
      zh: "余额、入金、出金、结算与对账。",
    },
  },
  {
    id: "risk",
    order: 4,
    isGettingStarted: false,
    title: { en: "After-Sales & Risk", zh: "售后与风控" },
    description: {
      en: "Refunds, disputes, fraud controls, and coverage.",
      zh: "退款、争议、欺诈风控与保障服务。",
    },
  },
  {
    id: "commerce",
    order: 5,
    isGettingStarted: false,
    title: { en: "Commerce", zh: "商务" },
    description: {
      en: "Create and publish products in Merchant Center.",
      zh: "在商户中心创建并发布商品。",
    },
  },
  {
    id: "credit",
    order: 6,
    isGettingStarted: false,
    title: { en: "Credit", zh: "授信" },
    description: {
      en: "Credit limits and member credit.",
      zh: "授信额度与会员可用额度。",
    },
  },
  {
    id: "developers",
    order: 7,
    isGettingStarted: false,
    title: { en: "Developers", zh: "开发者" },
    description: {
      en: "Developer Center and channel settings in Merchant Center.",
      zh: "商户中心内的开发者与渠道配置。",
    },
  },
  {
    id: "account",
    order: 8,
    isGettingStarted: false,
    title: { en: "Account & Security", zh: "账户与安全" },
    description: {
      en: "Security, notifications, audit logs, service plan, and account settings.",
      zh: "安全、通知、审计、服务方案与账户设置。",
    },
  },
];

export function getHelpDomain(id: string): HelpDomainMeta | undefined {
  return HELP_DOMAINS.find((d) => d.id === id);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/content/help/types.ts src/content/help/domains.ts src/lib/help/content-locales.ts
git commit -m "feat(help): add content types and domain metadata"
```

---

### Task 3: Manifest stubs + loaders (including Checkouts reservation)

**Files:**
- Create: `src/content/help/manifest.ts`
- Create: `src/content/help/loaders.ts`
- Create: `src/lib/help/dashboard-deep-links.ts`

**Interfaces:**
- Consumes: types, domains, P0 slug map
- Produces:
  - `listHelpArticles(locale, { domain?, publishedOnly? })`
  - `getHelpArticle(locale, slug)` — returns `null` if missing **or** `published === false`
  - `getHelpArticleRaw(locale, slug)` — includes unpublished (internal only)
  - `getHelpHref(locale, slug)`
  - `getHelpSlugsForDashboardPath(dashboardPath): string[]`
  - `getPrimaryHelpSlugForDashboardPath(dashboardPath): string | null` (first `primary: true` link match among published defs, else first candidate)
  - `getHelpHrefForDashboardPath(locale, dashboardPath, helpSlug?)`

- [ ] **Step 1: Manifest with P0 stubs + Checkouts reservation**

Create `src/content/help/manifest.ts` that exports `HELP_ARTICLE_DEFS: Omit<HelpArticle, "locale" | "title" | "description" | "keywords" | "body">[]` shared across locales, **or** separate en/zh arrays. Prefer:

```ts
// Shared structural defs; locale strings filled in en/zh modules in Task 7+.
export type HelpArticleDef = {
  slug: string;
  domain: HelpDomainId;
  published: boolean;
  order: number;
  relatedSlugs: string[];
  dashboardLinks?: HelpDashboardLink[];
  marketingPath?: string | null;
  developerPath?: string | null;
  /** ISO date for sitemap; omit rather than inventing "now". */
  updatedAt?: string;
};

export const HELP_ARTICLE_DEFS: HelpArticleDef[] = [
  {
    slug: "payments/checkouts",
    domain: "payments",
    published: false,
    order: 99,
    relatedSlugs: [],
  },
  // ... every published P0 slug from the locked map (body filled later)
];
```

Include **all** published P0 slugs from Task 1 with correct `dashboardLinks` using **`labelKey`** values (e.g. `open_transfers`, `open_reviews`, `open_onboarding_status`) — never English display strings. Optional `updatedAt?: string` (ISO date) may be set per def for sitemap; omit if unknown.

Minimum published stub entries (titles come in Task 7): every row in the locked published table.

- [ ] **Step 2: Loaders**

```ts
// src/content/help/loaders.ts
import { HELP_ARTICLE_DEFS } from "./manifest";
import type { HelpArticle } from "./types";
import type { HelpContentLocale } from "@/lib/help/content-locales";
import { isHelpContentLocale } from "@/lib/help/content-locales";

// Populated as articles are authored — map `${locale}:${slug}` → partial content
import { HELP_ARTICLE_CONTENT } from "./article-content";

export function getHelpArticleRaw(
  locale: string,
  slug: string,
): HelpArticle | null {
  if (!isHelpContentLocale(locale)) return null;
  const def = HELP_ARTICLE_DEFS.find((d) => d.slug === slug);
  if (!def) return null;
  const content = HELP_ARTICLE_CONTENT[locale]?.[slug];
  return {
    ...def,
    locale,
    title: content?.title ?? def.slug,
    description: content?.description ?? "",
    keywords: content?.keywords ?? [],
    body: content?.body,
  };
}

/** Public read: unpublished → null (callers must notFound). */
export function getHelpArticle(locale: string, slug: string): HelpArticle | null {
  const article = getHelpArticleRaw(locale, slug);
  if (!article || !article.published) return null;
  return article;
}

export function listHelpArticles(
  locale: string,
  options?: { domain?: string; publishedOnly?: boolean },
): HelpArticle[] {
  const publishedOnly = options?.publishedOnly ?? true;
  return HELP_ARTICLE_DEFS
    .filter((d) => (options?.domain ? d.domain === options.domain : true))
    .filter((d) => (publishedOnly ? d.published : true))
    .map((d) => getHelpArticleRaw(locale, d.slug))
    .filter((a): a is HelpArticle => a != null)
    .filter((a) => (publishedOnly ? a.published : true))
    .sort((a, b) => a.order - b.order);
}

export function getHelpPath(slug: string): string {
  return `/help/${slug}`;
}

export function publishedLocalesForSlug(slug: string): HelpContentLocale[] {
  const def = HELP_ARTICLE_DEFS.find((d) => d.slug === slug);
  if (!def?.published) return [];
  // MVP: both en and zh once content exists; until zh authored, still list both only when content map has entry
  const locales: HelpContentLocale[] = [];
  for (const loc of ["en", "zh"] as const) {
    if (HELP_ARTICLE_CONTENT[loc]?.[slug]) locales.push(loc);
  }
  return locales;
}
```

Create composer `src/content/help/article-content.ts` that imports domain modules (filled in Tasks 7–8):

```ts
import type { HelpBody } from "./types";
import type { HelpContentLocale } from "@/lib/help/content-locales";
import { enGettingStarted } from "./en/getting-started";
import { enPayments } from "./en/payments";
import { enFunds } from "./en/funds";
import { enRisk } from "./en/risk";
import { enCommerce } from "./en/commerce";
import { zhGettingStarted } from "./zh/getting-started";
import { zhPayments } from "./zh/payments";
import { zhFunds } from "./zh/funds";
import { zhRisk } from "./zh/risk";
import { zhCommerce } from "./zh/commerce";

export type HelpArticleContent = {
  title: string;
  description: string;
  keywords: string[];
  body?: HelpBody;
};

export const HELP_ARTICLE_CONTENT: Record<
  HelpContentLocale,
  Record<string, HelpArticleContent>
> = {
  en: { ...enGettingStarted, ...enPayments, ...enFunds, ...enRisk, ...enCommerce },
  zh: { ...zhGettingStarted, ...zhPayments, ...zhFunds, ...zhRisk, ...zhCommerce },
};
```

Create empty domain stubs under `src/content/help/en/*.ts` and `zh/*.ts` exporting `Record<string, HelpArticleContent>` (`{}` until Tasks 7–8).

**Do not** grow a single monolithic article body file beyond this composer.

- [ ] **Step 3: Reverse deep-link helper (candidates, not single-value)**

```ts
// src/lib/help/dashboard-deep-links.ts
import { HELP_ARTICLE_DEFS } from "@/content/help/manifest";

/** Normalize to path starting with /dashboard without locale prefix. */
export function normalizeDashboardPath(path: string): string {
  const trimmed = path.trim();
  const withoutLocale = trimmed.replace(/^\/(en|zh|es|fr|de|ja|ko|ar|pt)(?=\/)/, "");
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
): string | null {
  const slug = helpSlug ?? getPrimaryHelpSlugForDashboardPath(dashboardPath);
  if (!slug) return null;
  return `/${locale}/help/${slug}`;
}
```

- [ ] **Step 4: Sanity-check loaders (no test file)**

```powershell
npx --yes tsx -e "const l = await import('./src/content/help/loaders.ts'); const d = await import('./src/lib/help/dashboard-deep-links.ts'); console.log(l.getHelpArticle('en','payments/checkouts')); console.log(l.getHelpArticleRaw('en','payments/checkouts')?.published); console.log(d.getHelpSlugsForDashboardPath('/dashboard/commerce/products')); console.log(d.getHelpSlugsForDashboardPath('/dashboard/reviews'));"
```

Expected shape:

```
null
false
[ 'commerce/products', 'commerce/products/publish' ]   # order may put primary first
[ 'payments/offline-collection' ]
```

- [ ] **Step 5: Commit**

```bash
git add src/content/help/manifest.ts src/content/help/loaders.ts src/content/help/article-content.ts src/content/help/en src/content/help/zh src/lib/help/dashboard-deep-links.ts
git commit -m "feat(help): add manifest, loaders, and dashboard deep-link candidates"
```

---

### Task 4: SEO helpers (self-canonical + Help alternates)

**Files:**
- Modify: `src/lib/seo/metadata.ts`
- Create: `src/lib/seo/generate-help-metadata.ts`
- Modify: `src/lib/seo/json-ld.ts`

**Interfaces:**
- Consumes: `buildPageMetadata`
- Produces: `buildHelpAlternates`, `generateHelpMetadata`, `breadcrumbListSchema`

- [ ] **Step 1: Add Help-specific alternates**

In `src/lib/seo/metadata.ts`, add (keep existing `buildAlternates` for Marketing unchanged):

```ts
export function buildHelpAlternates(
  locale: string,
  path: string,
  publishedLocales: readonly string[],
) {
  const suffix = normalizePath(path);
  const languages: Record<string, string> = {};
  for (const loc of publishedLocales) {
    languages[loc] = `/${loc}${suffix}`;
  }
  // x-default: DEFAULT_LOCALE when published; otherwise first published locale (never point at unpublished EN).
  const xDefaultLocale = publishedLocales.includes(DEFAULT_LOCALE)
    ? DEFAULT_LOCALE
    : publishedLocales[0];
  if (xDefaultLocale) {
    languages["x-default"] = `/${xDefaultLocale}${suffix}`;
  }
  return {
    canonical: `/${locale}${suffix}`, // self-canonical always
    languages,
  };
}
```

Rule: `x-default` must point to `DEFAULT_LOCALE` **only when** that locale is among `publishedLocales`; otherwise use the first published locale. Never invent an unpublished EN alternate.

- [ ] **Step 2: generateHelpMetadata**

```ts
// src/lib/seo/generate-help-metadata.ts
import type { Metadata } from "next";
import { buildPageMetadata } from "./metadata";
import { buildHelpAlternates } from "./metadata";
import { publishedLocalesForSlug } from "@/content/help/loaders";

export async function generateHelpMetadata(input: {
  locale: string;
  path: string; // e.g. "/help/commerce/products/create"
  title: string;
  description: string;
  keywords?: string[];
  slugForAlternates?: string; // article slug; omit for home/category-only
}): Promise<Metadata> {
  const published = input.slugForAlternates
    ? publishedLocalesForSlug(input.slugForAlternates)
    : (["en", "zh"] as const);

  const base = buildPageMetadata({
    locale: input.locale,
    path: input.path,
    title: input.title,
    description: input.description,
    keywords: input.keywords,
  });

  const alternates = buildHelpAlternates(input.locale, input.path, published);

  return {
    ...base,
    alternates,
    openGraph: {
      ...base.openGraph,
      url: alternates.canonical,
    },
  };
}
```

Note: `buildPageMetadata` currently overwrites alternates with all locales — **overwrite** with `buildHelpAlternates` as shown so ZH keeps self-canonical.

- [ ] **Step 3: BreadcrumbList schema**

Add to `src/lib/seo/json-ld.ts`:

```ts
export function breadcrumbListSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/seo/metadata.ts src/lib/seo/generate-help-metadata.ts src/lib/seo/json-ld.ts
git commit -m "feat(help): add Help SEO metadata and breadcrumb schema"
```

---

### Task 5: Help route shell + locale redirect

**Files:**
- Create: `src/app/[locale]/(help)/layout.tsx`
- Create: `src/components/help/help.module.css`
- Create: `src/components/help/HelpShell.tsx`
- Modify: `messages/en.json`, `messages/zh.json` (and other locales: copy EN `Help` chrome to satisfy key parity if your workflow requires it)

**Interfaces:**
- Consumes: `SiteNavbar`, `SiteFooter`, `HELP_CONTENT_LOCALES`
- Produces: Help layout with 308 redirect for non-content locales

- [ ] **Step 1: Add chrome i18n keys**

Under `messages/en.json` root:

```json
"Help": {
  "search_placeholder": "Search FilixPay Help...",
  "related_guides": "Related guides",
  "previous": "Previous",
  "next": "Next",
  "open_in_merchant_center": "Open in Merchant Center",
  "start_here": "Start here",
  "browse_all": "Browse all guides",
  "still_need_help": "Still need help?",
  "popular_guides": "Popular guides",
  "in_this_guide": "In this guide",
  "coming_soon": "More guides in this section are coming soon.",
  "who_this_is_for": "Who this is for",
  "when_to_use": "When to use this",
  "before_you_start": "Before you start",
  "steps": "Steps",
  "key_fields": "Key fields",
  "common_issues": "Common issues",
  "next_step": "Next step",
  "home_title": "FilixPay Help",
  "home_description": "Learn how to use FilixPay Merchant Center.",
  "dashboardLinks": {
    "open_transfers": "Open Transfers",
    "open_reviews": "Open Reviews",
    "open_onboarding_status": "Open Onboarding Status",
    "open_onboarding_apply": "Open Onboarding Application",
    "open_configs": "Open Payment Configs",
    "open_products": "Open Products",
    "open_products_new": "Create Product",
    "open_orders": "Open Orders",
    "open_balance": "Open Balance",
    "open_activity": "Open Activity",
    "open_money_in": "Open Money-In",
    "open_payouts": "Open Payouts",
    "open_settlements": "Open Settlements",
    "open_reconciliation": "Open Reconciliation",
    "open_refunds": "Open Refunds",
    "open_disputes": "Open Disputes"
  }
}
```

Mirror Chinese strings in `zh.json`.

**Message-key parity vs Help content availability (frozen):**

Add `Help.*` chrome keys **only** according to this repository’s existing message-key parity requirements (e.g. if `verify:messages` or team practice requires all locale files to share the same key tree). These chrome keys do **not** imply Help content availability and must **not** cause agents to add Help bodies or Help routes for non-EN/ZH locales. If CI does not require cross-locale key parity, add `Help` only to `en.json` and `zh.json` — do not expand scope just for Help.

- [ ] **Step 2: Layout with permanent redirect**

```tsx
// src/app/[locale]/(help)/layout.tsx
import { permanentRedirect } from "next/navigation";
import SiteNavbar from "@/components/marketing/SiteNavbar";
import SiteFooter from "@/components/marketing/SiteFooter";
import { isHelpContentLocale } from "@/lib/help/content-locales";
import HelpShell from "@/components/help/HelpShell";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function HelpLayout({ children, params }: Props) {
  const { locale } = await params;

  // Non-content locales: 308 to EN equivalent. Path rewrite happens in child pages
  // via headers/pathname — for layout-level, child pages call ensureHelpLocale.
  // Keep navbar available; do not gate on enableMarketing (Help is product docs).

  return (
    <>
      <SiteNavbar />
      <HelpShell locale={locale}>{children}</HelpShell>
      <SiteFooter />
    </>
  );
}
```

Add helper used by every Help page:

```ts
// src/lib/help/ensure-help-locale.ts
import { permanentRedirect } from "next/navigation";
import { isHelpContentLocale } from "./content-locales";

/** 308 to /en/help/... when locale has no Help content. */
export function ensureHelpLocale(locale: string, helpPathSuffix: string): void {
  if (isHelpContentLocale(locale)) return;
  const suffix = helpPathSuffix.startsWith("/") ? helpPathSuffix : `/${helpPathSuffix}`;
  permanentRedirect(`/en${suffix}`);
}
```

Call `ensureHelpLocale(locale, `/help` | `/help/${domain}` | `/help/${domain}/${slug}`)` at the top of each page.

- [ ] **Step 3: HelpShell**

Minimal shell: left nav of domains (desktop), main column. Style with `help.module.css` using Marketing brand tokens from `marketing.module.css` variables where possible — avoid Ant Design Dashboard look.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/(help)/layout.tsx src/components/help src/lib/help/ensure-help-locale.ts messages/*.json
git commit -m "feat(help): add Help layout shell and chrome i18n"
```

---

### Task 6: Help home + domain category routes

**Files:**
- Create: `src/app/[locale]/(help)/help/page.tsx`
- Create: `src/app/[locale]/(help)/help/[domain]/page.tsx`
- Create: `src/components/help/HelpHomeView.tsx`
- Create: `src/components/help/HelpCategoryView.tsx`

**Interfaces:**
- Consumes: loaders, domains, `generateHelpMetadata`, `ensureHelpLocale`

- [ ] **Step 1: Home page**

`help/page.tsx`:

- `ensureHelpLocale(locale, "/help")`
- `generateMetadata` via `generateHelpMetadata` with brand+help title/description (from `Help.home_*` or hard-coded EN/ZH SEO strings in a small `help-home-seo.ts`)
- Render search + Start here checklist linking to Getting Started P0 slugs + domain browse
- BreadcrumbList: Home → Help

- [ ] **Step 2: Domain category page**

`help/[domain]/page.tsx`:

- If `getHelpDomain(domain)` missing → `notFound()`
- `ensureHelpLocale(locale, `/help/${domain}`)`
- List `listHelpArticles(locale, { domain, publishedOnly: true })`
- Empty P0 domains (merchant/credit/…): show `Help.coming_soon` — still indexable category landing
- Metadata: domain title/description from `HELP_DOMAINS`

- [ ] **Step 3: Manual check**

Run `npm run dev`, open:

- `/en/help` → 200  
- `/zh/help` → 200  
- `/es/help` → 308 to `/en/help`  
- `/en/help/commerce` → category  
- `/en/help/not-a-domain` → 404  

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/(help)/help src/components/help/HelpHomeView.tsx src/components/help/HelpCategoryView.tsx
git commit -m "feat(help): add Help home and domain category pages"
```

---

### Task 7: Article route + template + first P0 content (Commerce)

**Files:**
- Create: `src/app/[locale]/(help)/help/[domain]/[...slug]/page.tsx`
- Create: `src/components/help/HelpArticleView.tsx`
- Create: `src/components/help/HelpOpenInDashboard.tsx`
- Modify: `src/content/help/en/commerce.ts`, `src/content/help/zh/commerce.ts`
- Modify: `src/content/help/article-content.ts` only if composer imports need adjustment
- Modify: `src/content/help/manifest.ts` if needed

**Interfaces:**
- Consumes: `getHelpArticle` (published only), `dashboardLinks` + `labelKey`, article template sections from spec §4.3

- [ ] **Step 1: Article page**

```tsx
// Pseudocode structure for [...slug]/page.tsx
const slug = [domain, ...slugParts].join("/");
ensureHelpLocale(locale, `/help/${slug}`);
const article = getHelpArticle(locale, slug);
if (!article) notFound(); // covers missing AND published:false
```

Verify `/en/help/payments/checkouts` → **404**.

- [ ] **Step 2: HelpArticleView**

Render: breadcrumb, H1, description, `HelpOpenInDashboard` (primary + secondary links), who/when/before, blocks, related, next, prev/next within domain by `order`.

- [ ] **Step 3: HelpOpenInDashboard**

```tsx
// - Single primary link: label = t("open_in_merchant_center")
// - Multiple dashboardLinks: each uses t(`dashboardLinks.${link.labelKey}`)
// Authenticated: `/${locale}${path}`
// Unauthenticated: `/${locale}/login?callbackUrl=${encodeURIComponent(`/${locale}${path}`)}`
// Never render raw labelKey or hard-coded EN from the manifest.
```

- [ ] **Step 4: Author EN+ZH content in domain modules**

Write into `src/content/help/en/commerce.ts` and `zh/commerce.ts`:

- `commerce/products`
- `commerce/products/create`
- `commerce/products/publish`

Use fictional examples only. Include Related/Next Step linking create → publish. Mention edit only as in-page note, **no edit slug**.

- [ ] **Step 5: Manual check**

- `/en/help/commerce/products/create` → 200, self-canonical in view-source  
- `/zh/help/commerce/products/create` → 200, canonical `/zh/...`  
- `/en/help/payments/checkouts` → 404  
- `/en/help/commerce/products/edit` → 404  

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/(help)/help/[domain]/[...slug] src/components/help/HelpArticleView.tsx src/components/help/HelpOpenInDashboard.tsx src/content/help/en/commerce.ts src/content/help/zh/commerce.ts
git commit -m "feat(help): add article template and commerce P0 guides"
```

---

### Task 8: Remaining P0 article content (EN+ZH)

**Files:**
- Modify: `src/content/help/en/getting-started.ts`, `payments.ts`, `funds.ts`, `risk.ts`
- Modify: `src/content/help/zh/getting-started.ts`, `payments.ts`, `funds.ts`, `risk.ts`
- Do **not** dump bodies into a single giant `article-content.ts` (composer only)

**Interfaces:**
- Consumes: locked P0 list
- Produces: all published P0 bodies for en+zh via domain modules

- [ ] **Step 1: Author Getting Started P0** into `en/zh/getting-started.ts`

- `getting-started/merchant-setup` (dashboardLinks: status + apply with `labelKey`s)  
- `getting-started/payment-channel`  
- `getting-started/create-product` (can largely point/related to commerce create)  
- `getting-started/publish-product`  

On Getting Started hub / merchant-setup **Next Step** only: link to `funds/balance` and `funds/payouts` — **do not** create first-payment/first-payout slugs.

- [ ] **Step 2: Author Payments / Funds / Risk P0** into respective domain modules

- `payments/orders`, `payments/offline-collection` (wording: Offline Collection / 线下归集 only)  
- `funds/balance`, `funds/money-in`, `funds/payouts`, `funds/settlements`, `funds/reconciliation`  
- `risk/refunds`, `risk/disputes`  

Funds copy must say “funds” / “balance”, not wallet-centric product narrative.

- [ ] **Step 3: Sanity**

```powershell
npx --yes tsx -e "const l = await import('./src/content/help/loaders.ts'); console.log(l.listHelpArticles('en').map(a=>a.slug).sort().join('\n')); console.log('checkouts', l.getHelpArticle('en','payments/checkouts'));"
```

Expected: all published P0 slugs listed; checkouts `null`.

- [ ] **Step 4: Commit**

```bash
git add src/content/help/en src/content/help/zh
git commit -m "feat(help): add remaining P0 EN/ZH guide content"
```

---

### Task 9: Sitemap merge (published Help only)

**Files:**
- Modify: `src/app/sitemap.ts`
- Optional create: `src/lib/seo/help-sitemap.ts`

**Interfaces:**
- Consumes: `listHelpArticles` / defs with `published: true`, `HELP_DOMAINS`, home path, optional `updatedAt`
- Produces: sitemap entries for `/en/help...` and `/zh/help...` only (not × all LOCALES)

- [ ] **Step 1: Implement merge**

```ts
// Inside sitemap.ts after PUBLIC_ROUTES loop:
import { HELP_ARTICLE_DEFS } from "@/content/help/manifest";
import { HELP_DOMAINS } from "@/content/help/domains";
import { HELP_CONTENT_LOCALES } from "@/lib/help/content-locales";

type HelpSitemapPath = { path: string; lastModified?: string };

const helpPaths: HelpSitemapPath[] = [
  { path: "/help" },
  ...HELP_DOMAINS.map((d) => ({ path: `/help/${d.id}` })),
];
for (const a of HELP_ARTICLE_DEFS) {
  if (!a.published) continue; // checkouts reserved → never
  helpPaths.push({ path: `/help/${a.slug}`, lastModified: a.updatedAt });
}

for (const { path, lastModified } of helpPaths) {
  for (const locale of HELP_CONTENT_LOCALES) {
    entries.push({
      url: `${siteUrl}/${locale}${path}`,
      // Never use `new Date()` — that fakes freshness on every request.
      ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
      changeFrequency: "monthly",
      priority: path === "/help" ? 0.8 : 0.7,
    });
  }
}
```

Do **not** add `payments/checkouts`. Prefer setting `updatedAt` on article defs when content meaningfully changes; otherwise omit `lastModified` entirely.

- [ ] **Step 2: Verify**

Run `npm run build` (or hit `/sitemap.xml` in dev if supported) and confirm:

- contains `/en/help/commerce/products/create`  
- contains `/zh/help/funds/payouts`  
- does **not** contain `checkouts`  
- Help URLs are not multiplied across es/fr/…  

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts src/lib/seo/help-sitemap.ts
git commit -m "feat(help): include published Help URLs in sitemap"
```

---

### Task 10: Help search (V1)

**Files:**
- Create: `src/content/help/search.ts`
- Create: `src/components/help/HelpSearch.tsx`
- Wire into `HelpShell` / home

**Interfaces:**
- Consumes: published articles only
- Produces: search over **title + description + keywords + flattened HelpBody plain text** (Design §7.3)

- [ ] **Step 1: Flatten body + search helper**

```ts
import type { HelpArticle, HelpBody, HelpBodyBlock } from "./types";
import { listHelpArticles } from "./loaders";

function flattenBlock(block: HelpBodyBlock): string {
  switch (block.type) {
    case "heading":
    case "paragraph":
      return block.text;
    case "steps":
      return block.items.join(" ");
    case "fields":
      return block.rows.map((r) => `${r.field} ${r.description}`).join(" ");
    case "issues":
      return block.items.map((i) => `${i.problem} ${i.solution}`).join(" ");
    default:
      return "";
  }
}

/** Plain-text flatten of typed HelpBody for search — not HTML/React. */
export function flattenHelpBody(body: HelpBody | undefined): string {
  if (!body) return "";
  const parts = [
    body.whoFor,
    body.whenToUse,
    ...body.beforeYouStart,
    ...body.blocks.map(flattenBlock),
    body.nextStep?.label ?? "",
  ];
  return parts.filter(Boolean).join(" ");
}

export type HelpSearchHit = { slug: string; title: string; description: string };

export function searchHelpArticles(locale: string, query: string): HelpSearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  // publishedOnly: true — published:false never enters the index
  return listHelpArticles(locale, { publishedOnly: true })
    .filter((a: HelpArticle) => {
      const hay = [
        a.title,
        a.description,
        ...(a.keywords ?? []),
        flattenHelpBody(a.body),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    })
    .map((a) => ({ slug: a.slug, title: a.title, description: a.description }));
}
```

**Frozen:** Flatten the typed `HelpBody` into searchable plain text in V1. Search **must** cover title, description, keywords, **and** body text (heading / paragraph / fields / issues / steps). No HTML/React indexing. No AI / fuzzy search.

- [ ] **Step 2: HelpSearch client component**

Input + results list linking to `/{locale}/help/{slug}`. Never show unpublished.

- [ ] **Step 3: Manual check**

- Search a distinctive phrase that appears **only in body steps** of a guide → hit that guide.  
- Search “payout” → `funds/payouts`.  
- Checkouts never appears.

- [ ] **Step 4: Commit**

```bash
git add src/content/help/search.ts src/components/help/HelpSearch.tsx
git commit -m "feat(help): add Help search over title, keywords, and body text"
```

---

### Task 11: Dashboard `?` deep links (P0 surfaces)

**Files:**
- Create: `src/components/help/HelpDeepLinkButton.tsx`
- Modify P0 dashboard pages/headers listed in locked map (minimal placement: page title row or existing header actions)

**Interfaces:**
- Consumes: `getHelpSlugsForDashboardPath` / `getHelpHrefForDashboardPath(locale, path, helpSlug?)`
- Produces: `?` control → chosen Help article

- [ ] **Step 1: Deep link button (candidates + explicit slug)**

A Dashboard path may map to **multiple** Help slugs. Default = primary candidate; screens that need a specific task pass `helpSlug`.

```tsx
"use client";
import Link from "next/link";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useLocale } from "next-intl";
import { getHelpHrefForDashboardPath } from "@/lib/help/dashboard-deep-links";

export function HelpDeepLinkButton({
  dashboardPath,
  helpSlug,
}: {
  dashboardPath: string;
  /** When a path has multiple Help candidates, pick explicitly. */
  helpSlug?: string;
}) {
  const locale = useLocale();
  const href = getHelpHrefForDashboardPath(locale, dashboardPath, helpSlug);
  if (!href) return null;
  return (
    <Link href={href} aria-label="Help" title="Help">
      <QuestionCircleOutlined />
    </Link>
  );
}
```

- [ ] **Step 2: Wire into P0 surfaces**

Add deep links on:

- commerce products list → default or `helpSlug="commerce/products"`  
- commerce products/new → `helpSlug="commerce/products/create"` (or path map)  
- commerce products detail → e.g. `helpSlug="commerce/products/publish"` when near publish actions; otherwise `commerce/products`  
- orders, refunds, disputes  
- money balance, money-in, payouts, settlements, transaction-reconciliation  
- transfers, reviews  
- configs  
- onboarding status (+ apply if practical)  

Do **not** add on checkouts. Do not rely on manifest array order alone to disambiguate multi-candidate paths — use `helpSlug` when the page intent is specific.

- [ ] **Step 3: Manual check**

- `/en/dashboard/money/payouts` `?` → `/en/help/funds/payouts`  
- `/en/dashboard/commerce/products` with `helpSlug="commerce/products/publish"` → publish guide  
- `getHelpSlugsForDashboardPath("/dashboard/commerce/products")` returns multiple candidates (sanity via tsx)

- [ ] **Step 4: Commit**

```bash
git add src/components/help/HelpDeepLinkButton.tsx src/app/[locale]/dashboard
git commit -m "feat(help): add Dashboard help deep links for P0 surfaces"
```

---

### Task 12: Marketing nav entry + robots sanity + final manual verification

**Files:**
- Modify: `src/components/marketing/SiteNavbar.tsx` (add Help link under Resources or top-level)
- Read: `src/app/robots.ts` (confirm `/help` not disallowed — should need **no** change)
- Update spec status line if still “pending confirmation” → Approved

**Interfaces:**
- Consumes: public Help home

- [ ] **Step 1: Add navbar link** to `/help` (locale-prefixed via existing Link patterns).

- [ ] **Step 2: Full manual verification checklist**

Run through:

| Check | Expected |
|-------|----------|
| `/en/help` | 200, search, start-here |
| `/zh/help/commerce/products/create` | 200, canonical self |
| `/es/help/funds/payouts` | 308 → `/en/help/funds/payouts` |
| `/en/help/payments/checkouts` | 404 |
| `/en/help/commerce/products/edit` | 404 |
| sitemap | published Help en+zh only; no checkouts; no per-request `new Date()` lastModified |
| search body | distinctive body-only phrase finds the guide |
| robots | dashboard disallowed; help allowed |
| Offline Collection copy | no “product review” wording |
| Dashboard `?` on payouts | → funds/payouts |
| Open in Merchant Center logged out | login + callbackUrl |
| `npm run lint` / `npx tsc --noEmit` | clean for touched files |
| `npm run test` | existing tests still pass (no new test files) |

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing/SiteNavbar.tsx docs/superpowers/specs/2026-09-05-merchant-help-system-design.md
git commit -m "feat(help): link Help from marketing nav and finalize verification"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| HEAD path calibration first | Task 1 |
| Getting Started + 8 business domains | Tasks 2, 6 |
| Typed content + manifest | Tasks 2–3, 7–8 |
| `dashboardLinks[]` multi-entry | Tasks 1, 3, 7 |
| `published:false` → 404 / no SEO/search/sitemap/`?` | Tasks 3, 7, 9, 10, 11 |
| Self-canonical + Help hreflang | Task 4 |
| 308 non-content locale | Task 5–6 |
| Article template §4.3 | Task 7 |
| P0 content set | Tasks 7–8 |
| No first-payment/payout / no edit slugs | Tasks 1, 7–8 |
| Sitemap merge (no fake `new Date()` lastModified) | Task 9 |
| Search V1 (title + description + keywords + body plain text) | Task 10 |
| Dashboard `?` (candidates + `helpSlug`) | Task 11 |
| Message chrome ≠ content availability | Task 5 |
| Domain-split EN/ZH content modules | Tasks 3, 7–8 |
| AGENTS.md no new unit tests | Global + all tasks use manual/tsx |
| Robots unchanged allow Help | Task 12 |

## Placeholder scan

No TBD/TODO steps remain; open sequencing items from the spec are decided in File structure + Tasks 1–5.

## Type consistency

- `HelpDashboardLink.labelKey` (not display `label`) — resolved via `Help.dashboardLinks.*`.  
- `HelpArticle.dashboardLinks?: HelpDashboardLink[]` used in manifest, loaders, Open CTA, reverse map.  
- `getHelpSlugsForDashboardPath` → `string[]`; `getPrimaryHelpSlugForDashboardPath` / `getHelpHrefForDashboardPath(..., helpSlug?)` for selection.  
- `getHelpArticle` = public published-only; raw for internal.  
- Search uses `flattenHelpBody` over all typed body blocks.  
- Login query param = `callbackUrl` throughout.

## Plan revision note (2026-09-05)

Incorporated pre-execution review: body-inclusive search; `labelKey` i18n; multi-candidate reverse map; sitemap without fake `lastModified`; message keys decoupled from Help content locales; Task 1 authoritative-map wording; domain-split content modules.
