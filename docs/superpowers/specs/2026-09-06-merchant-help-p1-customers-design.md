# Merchant Help P1 — Customers Design

**Date:** 2026-09-06  
**Status:** Approved — ready for `writing-plans` / execution  
**Parent:** Extends frozen V1 — `docs/superpowers/specs/2026-09-05-merchant-help-system-design.md`  
**Plan:** `docs/superpowers/plans/2026-09-06-merchant-help-p1-customers.md`

## Extension notice (read first)

This spec **extends** the frozen Merchant Help V1 architecture. It does **not** redefine:

- Help information architecture (Getting Started + 8 business domains)
- Content model (`HelpArticle`, `dashboardLinks` + `labelKey`, `published`)
- Routing (`/{locale}/help/...`, `(help)` shell)
- SEO infrastructure (`buildPageMetadata` / Help alternates / self-canonical / BreadcrumbList)
- Search (title + description + keywords + flattened body)
- Deep-link mechanism (`HelpDeepLinkButton`, multi-candidate paths + explicit `helpSlug`)
- Locales (EN+ZH published content; other locales 308 → `/en/help/...`)
- Public-repo safety / AGENTS.md test rules

Implementation must **reuse** typed content modules, manifest, loaders, sitemap merge, and existing Help chrome.

**Plan / agent constraint:** Content + wiring only. Do **not** redesign typed content, SEO, or deep-link architecture. Re-audit `/dashboard/customers` HEAD UI before locking copy strings.

**Sequencing note:** Credit domain is **skipped** for now. This batch is the next P1 after Developers. payment-splits and other remaining P1 items stay later.

---

## 1. Goal

Publish one Level-A Merchant Center **UI** guide so operators can find and filter customer records in FilixPay Merchant Center — without inventing CRM, create/edit, or Customer API documentation.

---

## 2. Batch scope

### In scope

| Deliverable | Notes |
|-------------|--------|
| `payments/customers` | Single Level-A how-to |
| EN + ZH bodies | Same parity rule as P0 / Developers P1 |
| Manifest + `dashboardLinks` + Related | Related: `payments/orders` only |
| Dashboard `?` on `/dashboard/customers` | Page-level → this slug |
| Sitemap / search / Payments category listing | Via existing published-only pipeline |

### Explicitly out of scope

| Item | Notes |
|------|--------|
| Credit domain | Skipped this cycle |
| payment-splits | Next P1 batch after this ships |
| external-accounts, crypto, fraud/risk-rules | Later P1 batches |
| Customer create / edit / delete | Not present in HEAD UI |
| Customer detail route / drawer | Not present in HEAD UI |
| Customer API / SDK / CRM narrative | Developers / future API docs |
| `marketingPath` / `developerPath` | Omit this batch — no natural outbound target |
| New Help architecture, MDX, CMS | Frozen V1 |
| Checkouts (`published: false`) | Unchanged |

---

## 3. HEAD UI audit (SSOT for copy)

Audited 2026-09-06 against `src/app/[locale]/dashboard/customers/page.tsx`, `CustomerTable.tsx`, `messages/{en,zh}.json`, `dashboard-menu.tsx`.

| Item | HEAD fact |
|------|-----------|
| Route | `/dashboard/customers` only — **no** `/customers/[id]`, drawer, or row navigation |
| Sidebar | Top-level `Layout.nav.customers` — EN `Customers` / ZH `客户` |
| Page title | `Customers.title` — EN `Customer Management` / ZH `客户` |
| Subtitle | EN `View and manage your customer information.` / ZH `查看和管理您的客户信息。` |
| Filters | Form fields `code`, `email`, `phone` with placeholders `headers.code` / `headers.email` / `headers.phone` |
| Filter actions | Search (`Customers.search`) + Reset (`Common.reset`) |
| Table columns | Code, Name, Email, **Mobile** (`headers.mobile`), Status, Created At |
| Row behavior | Display only — **no** click-through to a detail page |
| Existing `?` | None |

**Copy consequences (frozen):**

1. “View customer records” means **read fields on the list row**, not open a detail page.  
2. Filter label for the third field is **Phone** (EN) / **电话** (ZH); table column is **Mobile** / **手机号** — do not merge the two names incorrectly.  
3. Do not invent create/edit/lifecycle flows.

Re-run the audit at implementation time; if UI drifted, use live labels.

---

## 4. Frozen product decisions (this batch)

| # | Decision |
|---|----------|
| C1 | One published guide only: `payments/customers` (Level A) |
| C2 | Domain stays **Payments** (V1 IA); URL is `/help/payments/customers`, not a top-level Customers domain |
| C3 | Faithful to HEAD: list + filter + in-row field viewing; no fake detail page |
| C4 | Page-level `?` on `/dashboard/customers` → `payments/customers` (single control) |
| C5 | Related: `payments/orders` only — do not force offline-collection or other links |
| C6 | Omit `marketingPath` and `developerPath` for this article |
| C7 | Typed text is plain text only — no Markdown link syntax |
| C8 | Fictional examples only (`customer@example.com`, `13800138000`, placeholder codes) |
| C9 | Credit remains skipped; payment-splits is the following P1 batch |

---

## 5. Guide matrix

### 5.1 `payments/customers`

**H1 intent:** How to find and review customer records in Merchant Center

**Dashboard:** `/dashboard/customers`  
**Page-level `?`:** `helpSlug="payments/customers"`

**Body structure (how-to):**

1. What Customers is / who it’s for — locate customer records; not a CRM or API guide  
2. How to open it — sidebar **Customers** / **客户**  
3. Review the customer list — columns as in HEAD (Code, Name, Email, Mobile, Status, Created At); records are viewed **in the table**  
4. Search / filter — Customer Code, Email, Phone; Search and Reset; multi-field behavior = all provided filters applied together (as UI does today)  
5. Common scenarios — known email / phone / customer code  
6. Common issues — no results, empty list, confusing Phone filter vs Mobile column  
7. Related — `payments/orders`  
8. Optional next step → Orders guide  

**Must not:**

- Document create/edit/delete customer  
- Invent a detail page or “Open record” step that does not exist  
- Customer API, webhooks, or SDK  
- Payment-splits, Credit, crypto, fraud content  

### 5.2 Related & category

- Payments category lists this article once published (alongside orders + offline-collection).  
- Update `payments/orders` `relatedSlugs` to include `payments/customers` (optional but recommended for bidirectional discovery).  
- Do **not** add Related to offline-collection unless product later requests it.

---

## 6. Deep-link & manifest rules

| slug | dashboardLinks | Page-level `?` |
|------|----------------|----------------|
| `payments/customers` | `/dashboard/customers` (`labelKey: open_customers`, `primary: true`) | `/dashboard/customers` → this slug |
| `payments/orders` (existing) | unchanged | unchanged; add `payments/customers` to `relatedSlugs` |

**New i18n key:** `Help.dashboardLinks.open_customers`  
- EN: `Open Customers`  
- ZH: `打开客户`

**Slug-map:** Append a short P1 Customers amendment to `docs/superpowers/specs/2026-09-05-merchant-help-p0-slug-map.md`.

---

## 7. Content & SEO

- Store bodies in existing `src/content/help/en/payments.ts` and `zh/payments.ts` (Payments domain modules — **do not** invent a new domain file).  
- Register def in `manifest.ts` (`domain: "payments"`, `published: true`, `order` after offline-collection, e.g. `30`).  
- SEO: FilixPay + task keywords (e.g. “FilixPay customers Merchant Center”, “find customer by email”); avoid Marketing head terms.  
- Self-canonical EN/ZH; BreadcrumbList; no FAQPage unless a real FAQ section exists.  
- Search indexes flattened body (existing V1 rule).  
- Sitemap: published automatically.

---

## 8. Success criteria

- `/en/help/payments/customers` and `/zh/help/payments/customers` return 200 with self-canonical.  
- Payments category lists the new guide.  
- `/dashboard/customers` `?` → `.../help/payments/customers`.  
- Copy matches HEAD: no detail-page steps; Phone vs Mobile naming correct.  
- Related includes Orders; no forced extra Related.  
- No API/CRM invent; no Markdown links; fictional PII only.  
- No new unit test files from agents; `tsc` + `verify:messages` + manual checks.

---

## 9. Sequencing after this batch

1. **payment-splits** — next P1 design  
2. Then external-accounts / crypto / fraud-risk  
3. **Credit** remains deferred until explicitly restarted  

---

## 10. Next step

1. Spec status: **Approved** (this document).  
2. Implementation plan: `docs/superpowers/plans/2026-09-06-merchant-help-p1-customers.md`.  
3. Execute via Subagent-Driven Development (recommended) — content + wiring only.
