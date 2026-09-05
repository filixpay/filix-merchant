# FilixPay Merchant Help System — Design v1

**Date:** 2026-09-05  
**Status:** Approved — P0 on `main`. P1: Developers + Customers shipped; Credit skipped; **Payment Splits next** (`2026-09-06-merchant-help-p1-payment-splits-design.md`); then external-accounts → crypto → fraud/risk-rules.  
**Scope:** Public, indexable Merchant Center usage guides under `/{locale}/help/**`  
**Out of scope (V1):** CMS authoring, AI search, screenshot-dependent flows, full locale translations beyond EN+ZH, Checkouts published content

## Problem

Merchants lack a public, SEO-friendly “how do I do X in Merchant Center?” knowledge base. Marketing answers “why FilixPay”; Developers answers “how to integrate APIs”; Dashboard answers “what can I do now.” None of them is a durable, crawlable task guide.

## Frozen product decisions

| # | Decision |
|---|----------|
| 1 | Audience priority: new merchant/admin → ops → finance → tech (Merchant Center UI only; API docs stay on Developers) |
| 2 | Locales: `/{locale}/help/...`; EN primary for SEO; ZH ships with MVP; other next-intl locales do not get empty Help shells |
| 3 | Help is fully public and indexable; Dashboard remains authenticated / robots-disallowed |
| 4 | Dashboard `?` is a thin deep link into Help (V1); Help is SSOT for how-to content |
| 5 | IA is task-oriented, not a mirror of the Dashboard sidebar |
| 6 | Commerce Help = Products only; Credit is its own domain; Offline Collection under Payments; Service Plan under Account |
| 7 | Checkouts: reserve in manifest as `published: false` — not a public page (404), no metadata/sitemap/search/nav/`?` until product re-exposes it |
| 8 | Getting Started docks dual tracks: formal onboarding + Commerce Activation / first publish — no parallel activation UI |
| 9 | Content tech: typed content modules + manifest (Approach 2); not MDX/CMS in V1 |
| 10 | SEO reuses/extends existing `buildPageMetadata` stack; no parallel Help-only SEO infrastructure |
| 11 | Funds narrative = funds movement; do not center Help on “wallet” as the product model |
| 12 | Refunds live under Risk (`/help/risk/refunds`), not Payments |
| 13 | Public-repo safety: fictional data only (`example.com`, reserved phone patterns, placeholder credentials) |
| 14 | IA naming: **Getting Started + 8 business domains** (Getting Started is not a business domain) |
| 15 | Manifest uses `dashboardLinks[]` with `labelKey` (i18n); one guide may map to multiple Dashboard paths |
| 16 | Getting Started “first payment/balance” and “first payout” are Related/Next Step only — **not** independent P0 articles |
| 17 | Commerce P0: `products` + `create` + `publish` only; **no** `products/edit` slug in V1 |
| 18 | Each published locale URL canonicalizes to **itself**; never `zh` → canonical `en` |

### Correction from earlier draft

Refund Dashboard deep link is **`/{locale}/help/risk/refunds`**, never `/help/payments/refunds`.

---

## 1. System boundaries

| System | Answers | Route space |
|--------|---------|-------------|
| Marketing | Why choose FilixPay / what it is | `src/app/[locale]/(marketing)/**` e.g. `/products/*` |
| Help | How to complete a task in Merchant Center | `/{locale}/help/**` |
| Developers | How to integrate API / Webhook / SDK | Marketing `/developers` + future API docs; Help only covers Merchant Center developer UI |
| Dashboard | What to do in-product | `/dashboard/**` (`robots.ts` already `disallow: /dashboard/`) |

Cross-links are allowed and expected; content must not be duplicated across systems.

---

## 2. Information architecture

### 2.1 Top-level structure: Getting Started + 8 business domains

Always describe the tree as **Getting Started + 8 business domains**. Do **not** call Getting Started a ninth business domain.

```
/{locale}/help
├── getting-started          # activation funnel (not a business domain)
├── merchant                 # business domain
├── payments
├── funds
├── risk
├── commerce
├── credit
├── developers
└── account
```

Category index URLs:

- `/{locale}/help`
- `/{locale}/help/getting-started`
- `/{locale}/help/merchant`
- `/{locale}/help/payments`
- `/{locale}/help/funds`
- `/{locale}/help/risk`
- `/{locale}/help/commerce`
- `/{locale}/help/credit`
- `/{locale}/help/developers`
- `/{locale}/help/account`

Article URLs:

- `/{locale}/help/{domain}/{topic}`
- optional task layer: `/{locale}/help/{domain}/{topic}/{task}`

Examples:

- `/en/help/commerce/products`
- `/en/help/commerce/products/create`
- `/en/help/commerce/products/publish`
- `/en/help/payments/offline-collection`
- `/en/help/credit/member-credit`
- `/en/help/account/service-plan`
- `/en/help/risk/refunds`

**Do not** use `/help/products` (collides semantically with Marketing `/products/*`).

### 2.2 Domain contents (aligned to current Dashboard)

Grounded in `src/components/layout/dashboard-menu.tsx` (HEAD at design time). Implementation plan must re-verify paths against HEAD before locking deep-link tables.

#### Getting Started

Dual tracks (no third activation surface):

1. **Merchant setup / formal onboarding** → `dashboardLinks`: `/dashboard/onboarding/status`, `/dashboard/onboarding/apply`  
2. **First product create & publish** → Commerce Activation (`CommerceActivationHost` / activation APIs) + `/dashboard/commerce/products`  

Help documents the funnel; **Help does not own activation state** — that remains Onboarding + Commerce Activation.

**P0 articles (independent slugs):**

- Getting started with FilixPay  
- Complete your merchant setup → `dashboardLinks` to onboarding status + apply  
- Configure your first payment channel → `/dashboard/configs`  
- Create your first product  
- Publish your first product  

**Not independent P0 articles** (Related / Next Step copy only inside Getting Started or adjacent guides — **no extra slugs** in the P0 manifest):

- Understand your first payment / balance → link toward `/help/funds/balance`  
- Make your first payout → link toward `/help/funds/payouts`

#### Merchant & Organization

- Organization → `/dashboard/organization`  
- Business accounts / sub-merchants → `/dashboard/sub-merchants`  
- Locations → `/dashboard/locations`  
- Maintenance (profile / changes / contact) → `/dashboard/maintenance/*`

Task-oriented titles (not field-level pages like “change email”).

#### Payments & Transactions

- Orders → `/dashboard/orders`  
- Customers → `/dashboard/customers`  
- Payment splits → `/dashboard/payment-splits` (capability-gated in UI; Help still documents the task)  
- Offline Collection → `/dashboard/transfers` + `/dashboard/reviews` (multi `dashboardLinks`)  
  - **Naming:** always “Offline Collection” / 线下归集; **never** “product reviews” / 商品评价  
- Checkouts → **reserved** in manifest as `payments/checkouts` with `published: false` (404 if requested; see §5.2)

#### Funds

Topics (funds movement language):

- Balance & Activity → `/dashboard/money/balance`, `/dashboard/money/activity`  
- Money-In → `/dashboard/money/money-in`  
- Crypto (as Money-In adjacent) → `/dashboard/money/crypto`  
- Transfers → `/dashboard/money/transfers`  
- Payouts → `/dashboard/money/payouts`  
- External accounts → `/dashboard/money/external-accounts`  
- Settlements → `/dashboard/money/settlements` (+ statements)  
- Reconciliation → `/dashboard/money/transaction-reconciliation`

Avoid platform-level “Top Up” / “manage your wallet” framing.

#### After-Sales & Risk (`risk`)

- Refunds → `/dashboard/refunds` (+ settings/approvals as anchors or related)  
- Disputes → `/dashboard/disputes`  
- Fraud & risk controls → `/dashboard/fraud`, `/dashboard/risk-reviews`, `/dashboard/risk-rules` (prefer one Level-B guide + anchors unless search demand justifies split)  
- Coverage → `/dashboard/coverage-insurance`, `/dashboard/coverage-config`

#### Commerce

**Products only.**

**P0 independent guides:**

- Manage products → `/help/commerce/products`  
- Create a product → `/help/commerce/products/create`  
- Publish a product → `/help/commerce/products/publish`  

**Not a V1/P0 slug:** `/help/commerce/products/edit` — editing is covered as a section or Related note inside `/help/commerce/products` (and optionally create). Core SEO/onboarding intent is create → publish.

Dashboard: `/dashboard/commerce/products`, `/dashboard/commerce/products/new`, `/dashboard/commerce/products/[id]`

#### Credit (independent domain)

- Credit limit → `/dashboard/credit/limit`  
- Member / available credit → `/dashboard/member-credit/available-credit`

#### Developers (Help, restrained)

Merchant Center UI only:

- Developer Center → `/dashboard/developer`  
- Webhook verification UI → `/dashboard/developer/webhook-verification`  
- Payment channel configuration → `/dashboard/configs`  

Always deep-link out to Marketing/Developers for API reference. Do not duplicate API docs.

#### Account & Security

- Security (transaction password, etc.) → `/dashboard/security-settings/transaction-password`  
- Notifications → `/dashboard/notifications`  
- Audit logs → `/dashboard/audit-logs`  
- Service plan → `/dashboard/service-plan`  
- Maintenance (if not covered under Merchant)  
- Close account → `/dashboard/settings/close-account`

### 2.3 Reporting

`/dashboard/reporting/transactions` is **not** a V1 Help domain. At most a Related link from Orders in a later pass; no dedicated Help article in P0–P1.

---

## 3. Content granularity

| Level | Rule | Example |
|-------|------|---------|
| **A — Independent SEO guide** | Clear task, multi-step, searchable intent, Dashboard entry | Create product, make payout, reconcile settlement, issue refund |
| **B — Topic with multiple tasks** | Small related actions share one URL | `/help/account/security` |
| **C — In-page anchor** | Definitions / status meanings without standalone search value | `/help/funds/balance#available-balance` |

**Forbidden:** one Dashboard menu row = one thin Help URL by default.

Reserved unpublished entries (e.g. Checkouts) may stay in the manifest with `published: false` for future URL reservation and internal planning only. See §5.2 for the hard rule: they must **not** become public pages.

---

## 4. Page templates

### 4.1 Help home (`/help`)

Task navigation, not a raw dump:

- Search  
- Popular guides / domains  
- “Start here” activation checklist  
- Browse all domains  
- Still need help? → support/contact CTA (reuse existing public contact patterns; no new support stack in V1)

SEO targets brand+help queries (`FilixPay Help`, `FilixPay Merchant Center guide`), **not** generic payment-infrastructure keywords owned by Marketing.

### 4.2 Category page

- Short domain description  
- Popular tasks  
- Full guide list with one-line blurbs  

Category pages are legitimate SEO landings.

### 4.3 Guide article (Level A/B)

Required structure:

1. Breadcrumb  
2. H1 = user task (“How to create a product…”)  
3. Short description (2–3 lines)  
4. **Open in Merchant Center** CTA(s) from `dashboardLinks` (primary link highlighted; login + `returnTo` if unauthenticated)  
5. Overview: who / when / before you start  
6. Numbered steps (must be understandable without screenshots in V1)  
7. Key fields table (when relevant)  
8. Common issues (problem → solution) — high SEO long-tail value  
9. Related guides  
10. Next step CTA  
11. Previous / Next within domain order  

UI chrome strings (Search, Related guides, Open in Merchant Center, …) live in next-intl `messages`.  
Article body lives in typed Help content modules — **not** in `messages/*.json`.

---

## 5. Content & route architecture (Approach 2)

### 5.1 Placement

Recommended:

```
src/content/help/
  manifest.ts                 # or domain index composing articles
  en/...
  zh/...
src/app/[locale]/(help)/help/
  page.tsx                    # home
  [domain]/page.tsx
  [...slug]/page.tsx          # topic / topic/task
```

Exact file layout may use `(help)` route group for shared Help shell (nav, search, footer) without affecting URL. Visual system should follow existing Marketing brand language (not GitBook-like chrome), while remaining distinct from Dashboard Ant Design chrome.

### 5.2 Content model (manifest)

Conceptual `HelpArticle` (names may vary in implementation):

```ts
type HelpDashboardLink = {
  path: string;          // e.g. "/dashboard/transfers"
  labelKey: string;      // i18n key under Help.dashboardLinks.* — never hard-coded display text
  primary?: boolean;     // default Open in Merchant Center target
};

type HelpArticle = {
  slug: string;                 // e.g. "commerce/products/create"
  domain: HelpDomain;           // business domain OR "getting-started"
  locale: "en" | "zh";          // published content locales in MVP
  published: boolean;
  title: string;
  description: string;
  keywords: string[];
  order: number;
  relatedSlugs: string[];
  dashboardLinks?: HelpDashboardLink[];  // zero or more real Dashboard entries
  marketingPath?: string | null;
  developerPath?: string | null;
  body: HelpBody;               // typed blocks or TSX module export
};
```

**`published: false` hard rule (e.g. Checkouts):**

A `published: false` article may exist in the manifest for future URL reservation and internal planning, but it **must**:

- resolve to **404 / not-found** if requested as a public Help URL  
- **not** generate metadata  
- **not** appear in sitemap  
- **not** appear in Help search  
- **not** appear in Help navigation / category listings  
- **not** generate Dashboard `?` deep links  

Reservation is an identifier in the content model only — **not** a crawlable or browsable page.

**`dashboardLinks`:** one guide may map to multiple Dashboard surfaces (e.g. Offline Collection → transfers + reviews; Onboarding → status + apply). The primary link (`primary: true`, or first link if unspecified) drives the default CTA and the default reverse `?` mapping when a screen has a single Help target.

Published articles (`published: true` only) drive: navigation, prev/next, related links, metadata, sitemap inclusion, search index, and Dashboard `?` maps.

Abstract `getHelpArticle(locale, slug)`, `listHelpArticles(locale, { domain?, publishedOnly })` so a future MDX/CMS provider can replace storage without changing URLs.

### 5.4 Why not MDX/CMS in V1

Repo has no MDX toolchain today; Marketing already uses TS + `generateMetadata`. Typed modules give type safety, `published` flags, and PR-reviewed sync with Dashboard field changes. CMS deferred until non-dev authors become a real constraint.

---

## 6. SEO

### 6.1 Metadata pipeline

Extend existing stack:

- `src/lib/seo/metadata.ts` → `buildPageMetadata` / `buildAlternates`  
- `src/lib/seo/generate-marketing-metadata.ts` pattern → add `generateHelpMetadata` (or generalize to `generatePublicPageMetadata`)  
- Help SEO fields live on the article manifest (or `HelpSeoConfig`), **not** a fork of marketing copy tables that diverge forever  

Do **not** create an incompatible parallel `help-seo.ts` that reimplements canonical/OG from scratch.

### 6.2 Canonical, hreflang, and locales

MVP published Help content locales: **en**, **zh** only.

**Canonical (frozen):**

- `/en/help/funds/payouts` → canonical **itself** (`/en/help/funds/payouts`)  
- `/zh/help/funds/payouts` → canonical **itself** (`/zh/help/funds/payouts`)  

Never set a translated page’s canonical to another locale (e.g. **do not** `zh` → canonical `en`). Otherwise Google may treat EN as the only primary version even when ZH is published.

**Hreflang:**

`buildAlternates` today enumerates **all** `LOCALES` (`en es fr de zh ja ko ar pt`). Help must use an alternate builder that only lists locales where that slug is `published: true`. Do not emit hreflang to empty shells.

Behavior for non-published locales hitting `/es/help/...` (and any locale other than `en`/`zh` until translated):

- **Frozen:** **308 redirect** to `/en/help/{same-slug}` (or `/en/help` if slug missing).  
- Do not serve indexable translated shells.  
- `hreflang` lists only locales where that slug is `published: true` (MVP: `en` + `zh` when both exist).  
- Redirect targets and published pages still follow the self-canonical rule above.

### 6.3 Keyword strategy

- Brand + feature: `FilixPay payouts`, `FilixPay reconciliation`  
- Brand + task: `how to create a product in FilixPay`  
- Brand + problem: `FilixPay payout pending`  

Avoid competing with Marketing for generic “payment infrastructure / global payments” head terms.

### 6.4 Structured data

| Type | V1 rule |
|------|---------|
| `BreadcrumbList` | Required on Help pages |
| `FAQPage` | Only when the page has a real FAQ section |
| `HowTo` | Optional semantic enhancement; **not** an SEO traffic dependency |

### 6.5 Sitemap

`src/app/sitemap.ts` currently expands `PUBLIC_ROUTES` × all `LOCALES`.

Help must contribute URLs from the **published** Help manifest (en+zh), not a hand-maintained duplicate list. Options (implementation detail):

- Merge helper: `getPublicSitemapEntries()` = marketing `PUBLIC_ROUTES` + published Help slugs  
- Or append Help entries inside `sitemap.ts` via manifest loader  

Unpublished reserved slugs (Checkouts) **must not** appear in sitemap.

### 6.6 Robots

Keep Dashboard disallowed. Ensure `/help` remains allowed under existing `allow: /`. No change that accidentally blocks Help.

### 6.7 Open Graph

Reuse Marketing brand OG defaults (`DEFAULT_OG_IMAGE` / shared template). Title pattern: product task + FilixPay Help framing.

---

## 7. UX

### 7.1 Desktop

Left domain nav + article column; sticky search in Help chrome; breadcrumb; related; prev/next.

### 7.2 Mobile

Stacked: breadcrumb → H1 → search → “In this guide” → body → related → prev/next.

### 7.3 Search (V1)

Client or static index over **published** articles only. Must search:

- `title`
- `description`
- `keywords`
- **plain text flattened from typed `HelpBody`** (heading, paragraph, steps, fields, issues — not HTML/React)

`published: false` articles never enter the index. No AI answer dependency and no fuzzy/semantic search requirement in V1.

### 7.4 Auth CTA

Content always public. **Open in Merchant Center** uses `dashboardLinks`:

- Authenticated → primary (or chosen) `path`  
- Unauthenticated → login with `returnTo` to that dashboard path  

No complex Help context state in V1.

### 7.5 Dashboard `?` deep links (V1)

Thin control on key Dashboard surfaces mapping to Help slugs. Priority P0 screens:

| Dashboard surface | Help slug |
|-------------------|-----------|
| Commerce products list / create / detail | `commerce/products`, `commerce/products/create`, `commerce/products/publish` |
| Orders | `payments/orders` |
| Refunds | `risk/refunds` |
| Money balance | `funds/balance` |
| Money-In | `funds/money-in` |
| Payouts | `funds/payouts` |
| Settlements | `funds/settlements` |
| Transaction reconciliation | `funds/reconciliation` |
| Disputes | `risk/disputes` |
| Payment configs | Getting Started “Configure your first payment channel” (primary); Developers Help may related-link the same paths |
| Offline collection transfers/reviews | `payments/offline-collection` |
| Onboarding status / apply | Getting Started merchant-setup guide |

Checkouts: **no** `?`. Product edit screens: map `?` to `commerce/products` or `commerce/products/create` as appropriate — **not** a dedicated edit Help slug.

Deep-link map should be data-driven from manifest (`dashboardLinks` ↔ slug), not scattered string literals. A single Help article may be the target of multiple Dashboard screens when listed in `dashboardLinks`.

---

## 8. Internationalization

- URLs: existing next-intl locale prefix.  
- Chrome UI: `messages/{locale}.json` keys under e.g. `help.*`.  
- Bodies: `src/content/help/en|zh`.  
- EN is SEO primary; ZH required for MVP parity of P0 set.  
- Other locales: no empty Help trees; redirect strategy per §6.2.

---

## 9. Security & compliance (public repo)

Per `AGENTS.md`:

- Examples use `@example.com`, reserved phone numbers, obviously fake IDs.  
- No real merchant data, API keys, webhook secrets, wallet addresses, or tx hashes.  
- Crypto examples must be labeled placeholders.  
- Do not add agent-authored unit test files; plan may suggest manual QA and running existing tests only.

---

## 10. MVP (P0) scope

### P0 — shell & platform

1. Help route shell + domain nav + article template  
2. Content manifest + loader  
3. Typed EN+ZH content modules for P0 articles  
4. SEO metadata + BreadcrumbList  
5. Sitemap merge for published Help  
6. Locale alternate/redirect rules for Help  
7. Basic Help search  
8. Dashboard `?` on P0 surfaces  

### P0 — Getting Started content

Independent published guides only:

- `/help`
- `/help/getting-started`
- `/help/getting-started/merchant-setup` (or equivalent slug)
- `/help/getting-started/payment-channel`
- `/help/getting-started/create-product`
- `/help/getting-started/publish-product`

**Not P0 slugs:** “Understand your first payment / balance” and “Make your first payout” — Related / Next Step links into Funds guides only.

### P0 — high-frequency business content

- `payments/orders`  
- `payments/offline-collection` (correct semantics; multi `dashboardLinks`)  
- `funds/balance`, `funds/money-in`, `funds/payouts`, `funds/settlements`, `funds/reconciliation`  
- `risk/refunds`, `risk/disputes`  
- `commerce/products`, `commerce/products/create`, `commerce/products/publish`  

### Explicitly not P0

- Checkouts body/sitemap/nav/search/`?` (manifest reservation only → 404 if hit)  
- `commerce/products/edit`  
- Getting Started “first payment” / “first payout” as standalone articles  
- Full Credit/Developers/Account article sets (P1/P2)  
- Customers, payment-splits, crypto, fraud deep splits, reporting  
- CMS, MDX, AI search, screenshot-required flows  

### P1 / P2 (ordered later)

- **P1 (batched):**  
  1. **Developers UI guides** — shipped  
  2. **Credit domain** — **skipped** (restart only when requested)  
  3. **Customers** — shipped (`2026-09-06-merchant-help-p1-customers-design.md`)  
  4. **Payment Splits** — current (`2026-09-06-merchant-help-p1-payment-splits-design.md` + plan)  
  5. Then: external-accounts, crypto, fraud/risk-rules  
- **P2:** notifications, audit-logs, maintenance detail, close-account, reporting  

---

## 11. Operational sync

Any PR that changes Merchant Center user-visible flow should check:

- Affected Help guide?  
- Screenshots (when added later)?  
- Help URLs / slugs?  
- SEO title/description?  
- Dashboard `?` mapping?  

Help content and Dashboard behavior should change in the same PR when practical.

---

## 12. Testing & verification (plan-time only)

Respect AGENTS.md:

- Agents must not create or edit `*.test.ts(x)` unless humans request it.  
- Implementation plan should list **manual** verification: routes, metadata, sitemap entries, robots, deep links, EN/ZH, unpublished Checkouts absent from sitemap.  
- Optionally run existing `npm run test` / lint scripts without adding new suites.

---

## 13. Architecture sketch

```
Marketing (why) ──links──► Help (how to use) ──links──► Developers (how to integrate)
                              │
                              ├── typed content + manifest (EN/ZH)
                              ├── (help) App Router pages
                              ├── SEO via buildPageMetadata (+ Help alternates)
                              ├── sitemap from published manifest
                              └── Dashboard ? deep links (thin)
```

---

## 14. Open items deferred to implementation plan (not blocking design approval)

1. Exact App Router file tree under `(help)` vs flat `help/`.  
2. Exact Help body representation (TSX sections vs markdown strings parsed lightly).  
3. Shared Help chrome CSS module location.  
4. Final P0 slug ↔ `dashboardLinks` table after HEAD path audit of `dashboard-menu.tsx` and related pages.  

**Plan task #1 (frozen expectation):** HEAD path calibration + lock the P0 slug / `dashboardLinks` / reverse `?` map — **before** scaffolding Help pages.

These are sequencing details, not product-direction forks.

---

## 15. Success criteria

- New merchant can complete setup + first publish using Getting Started alone.  
- P0 guides are indexable at `/en/help/...` and `/zh/help/...` with **self-canonical** URLs and hreflang only between published locales.  
- `published: false` Checkouts resolves to 404 and is absent from sitemap, search, nav, and `?` maps.  
- Dashboard `?` on P0 surfaces lands on the correct Help task; multi-entry guides use `dashboardLinks`.  
- Marketing `/products/*` and Help `/help/commerce/products*` remain distinct; no `products/edit` Help slug in V1.  
- Offline Collection copy never reads as product reviews.  
- No secrets or real PII in Help content.  
- Taxonomy language stays **Getting Started + 8 business domains**.

---

## Next step after approval

1. User approves this spec (edits if needed).  
2. Invoke `writing-plans` → `docs/superpowers/plans/2026-09-05-merchant-help-system.md` with small agentic tasks (shell, manifest, template, SEO, sitemap, i18n, search, deep links, P0 content, manual verification).  
3. No application code until the plan exists and execution is requested.
