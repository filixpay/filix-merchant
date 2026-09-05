# Merchant Help P0 slug map (locked)

**Date:** 2026-09-05  
**Source of truth after HEAD audit of dashboard-menu + pages**

## Diff from design

No route or ownership drift. HEAD audit (2026-09-05) confirms all P0 `dashboardLinks` paths in `src/components/layout/dashboard-menu.tsx` and corresponding pages under `src/app/[locale]/dashboard/**` match design spec `2026-09-05-merchant-help-system-design.md` §2.2. `/dashboard/checkouts` exists with menu `visible: false` as designed.

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
(merchant/credit/developers/account categories may be empty of P0 articles — still ship index shell with "coming soon" / browse CTA, no fake articles)

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

## P1 amendment (2026-09-06) — Developers batch

Intentional override (not a P0 regression):

| Dashboard path | Page-level `?` after P1 | Notes |
|----------------|-------------------------|-------|
| `/dashboard/configs` | `developers/payment-channels` via explicit `helpSlug` | `getting-started/payment-channel` keeps `dashboardLinks` for Open-in-MC CTAs but must **not** win reverse-map primary |
| `/dashboard/developer` | `developers/developer-center` | Always; ignore active Tab. **No second tab-level `?` required in this batch.** |
| `/dashboard/developer/webhook-verification` | `developers/webhooks` | Page-level |

### Payment Configs nav labels (HEAD audit)

| Locale | Sidebar path | Page title |
|--------|--------------|------------|
| EN | Transactions → Acquiring Settings → Payment Configs | Payment Configurations |
| ZH | 交易 → 收单设置 → 支付配置 | 支付配置 |

Spec: `docs/superpowers/specs/2026-09-06-merchant-help-p1-developers-design.md`

## P1 amendment (2026-09-06) — Customers batch

| Dashboard path | Page-level `?` after P1 | Notes |
|----------------|-------------------------|-------|
| `/dashboard/customers` | `payments/customers` | New published guide; single page-level `?` |

Credit domain skipped this cycle. Spec: `docs/superpowers/specs/2026-09-06-merchant-help-p1-customers-design.md`

## P1 amendment (2026-09-06) — Payment Splits batch

| Dashboard path | Page-level `?` | Notes |
|----------------|----------------|-------|
| `/dashboard/payment-splits` | `payments/payment-splits` | Menu may be hidden unless direct settlement |

Spec: `docs/superpowers/specs/2026-09-06-merchant-help-p1-payment-splits-design.md`
