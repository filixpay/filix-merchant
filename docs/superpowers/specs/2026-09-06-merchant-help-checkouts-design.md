# Merchant Help — Checkouts Design

**Date:** 2026-09-06  
**Status:** Shipped (content + Dashboard deep link)  
**Parent:** Extends frozen V1 — `docs/superpowers/specs/2026-09-05-merchant-help-system-design.md`

## Extension notice (read first)

This spec **extends** the frozen Merchant Help V1 architecture. It does **not** redefine:

- Help information architecture (Getting Started + 8 business domains)
- Content model (`HelpArticle`, `dashboardLinks` + `labelKey`, `published`, optional `hash`)
- Routing (`/{locale}/help/...`, `(help)` shell)
- SEO infrastructure (`buildPageMetadata` / Help alternates / self-canonical / BreadcrumbList)
- Search (title + description + keywords + flattened body)
- Deep-link mechanism (`HelpDeepLinkButton`, multi-candidate paths + explicit `helpSlug`)
- Locales (EN+ZH published content; other locales 308 → `/en/help/...`)
- Public-repo safety / AGENTS.md test rules

Implementation must **reuse** typed content modules, manifest, loaders, sitemap merge, and existing Help chrome.

**Plan / agent constraint:** Content + wiring only. Do **not** redesign typed content, SEO, or deep-link architecture. Re-audit `/dashboard/checkouts` HEAD UI before locking copy strings.

V1 had reserved `payments/checkouts` with `published: false`. Product has re-exposed Checkout Config in Merchant Center; this batch **publishes** that reserved slug.

---

## 1. Goal

Publish one Level-A Merchant Center **UI** guide so operators can create, edit, activate/deactivate, and delete Checkout Config counters in FilixPay Merchant Center — without documenting Checkout API, SDK, or self-hosted filix-checkout deployment.

---

## 2. Batch scope

### In scope

| Deliverable | Notes |
|-------------|--------|
| `payments/checkouts` | Single Level-A how-to (flip reserved slug to published) |
| EN + ZH bodies | Same parity rule as P0–P3 |
| Manifest + `dashboardLinks` + Related | Related: `developers/payment-channels`, `payments/orders` |
| Dashboard `?` on `/dashboard/checkouts` | Page-level → this slug |
| Sitemap / search / Payments category listing | Via existing published-only pipeline |
| Parent V1 status note | Checkouts extension approved / shipped |

### Explicitly out of scope

| Item | Notes |
|------|--------|
| Checkout API / SDK / OpenAPI | Developers / Marketing docs |
| Self-hosted filix-checkout Docker / custom domain | Marketing Developers already covers |
| Split `payments/checkouts/create` slug | Edit is modal on same page |
| Dedicated detail route Help | No `/checkouts/[id]` in HEAD |
| New Help architecture, MDX, CMS | Frozen V1 |
| Full locale Help beyond EN+ZH | Unchanged |
| Changing Checkout product UI | Help + `?` only |

---

## 3. HEAD UI audit (SSOT for copy)

Audited 2026-09-06 against `src/app/[locale]/dashboard/checkouts/page.tsx`, `CheckoutTable.tsx`, `CheckoutFormModal.tsx`, `messages/{en,zh}.json`, `dashboard-menu.tsx`.

| Item | HEAD fact |
|------|-----------|
| Route | `/dashboard/checkouts` only — **no** `/checkouts/[id]` |
| Sidebar | `Layout.nav.checkout_counters` — EN `Checkout Config` / ZH `收银台配置` |
| Page title | `Checkouts.title` — EN `Checkout Config` / ZH `收银台配置` |
| Subtitle | EN `Manage and configure your multi-language aggregated checkout pages.` / ZH `管理和配置您的跨语言聚合收银台。` |
| Primary CTA | `create_counter` — EN `Add Configuration` / ZH `添加配置` |
| Table columns | Counter Name (+ color swatch), Code, Configs count (`N items`), Status, Actions |
| Status | Click Status badge toggles ACTIVE ↔ INACTIVE (`activate` / `deactivate`) |
| Actions | Edit (opens modal), Delete (Popconfirm) |
| Create / Edit | Same `CheckoutFormModal`; title Add Configuration vs Edit Configuration |
| Form (i18n) | Checkout Code (Unique ID) — disabled when editing; Default Display Name EN / ZH / JA titles |
| Form (hard-coded EN in modal today) | Logo URL, Brand Color, Supported Currencies, Buyer Countries, Payment Configurations |
| Configs list | Priority + payment config selection from existing Payment Configs (`/dashboard/configs`) |
| Currencies / countries | Comma-separated; `*` means all |
| Existing `?` | None |

**Copy consequences (frozen):**

1. Prefer `Checkouts.*` i18n labels; for hard-coded modal strings, write the HEAD English literals and ZH equivalents from `form.logo` / `form.color` / `form.currencies` / `form.countries` / `form.config_list` where those keys exist.  
2. Naming traps: Checkout Config ≠ Orders; ≠ Money-In “Open checkout”; ≠ Marketing self-hosted checkout deployment.  
3. Do not invent a detail page or separate create route.

Re-run the audit at implementation time; if UI drifted, use live labels.

---

## 4. Frozen product decisions (this batch)

| # | Decision |
|---|----------|
| K1 | One published guide: `payments/checkouts` (Level A) — keep reserved slug |
| K2 | Domain stays **Payments**; URL `/help/payments/checkouts` |
| K3 | Anchors: `#open`, `#create`, `#edit`, `#status`, `#key-fields`, `#common-issues` |
| K4 | Page-level `?` on `/dashboard/checkouts` → `payments/checkouts` |
| K5 | Related: `developers/payment-channels`, `payments/orders` |
| K6 | Omit `marketingPath` / `developerPath` (no forced outbound); optional plain-text mention that self-hosted deployment lives on Marketing Developers |
| K7 | Typed text is plain text only — no Markdown link syntax |
| K8 | Fictional examples only (`checkout-demo`, `https://cdn.example.com/logo.png`) |
| K9 | Manifest `order: 25` (between offline-collection `20` and customers `30`) |

---

## 5. Guide matrix

### 5.1 `payments/checkouts`

**H1 intent:** How to manage Checkout Config counters in Merchant Center

**Dashboard:** `/dashboard/checkouts`  
**Page-level `?`:** `helpSlug="payments/checkouts"`

**Body structure (how-to):**

1. What Checkout Config is — multi-language aggregated checkout pages; not Orders and not self-hosted deploy docs  
2. `#open` — open sidebar Checkout Config / 收银台配置  
3. `#create` — Add Configuration; Checkout Code; titles; branding; currencies/countries; attach Payment Configurations  
4. `#edit` — Edit from row; Checkout Code locked  
5. `#status` — click Status to activate/deactivate; Delete with confirm  
6. `#key-fields` — Counter Name, Code, Configs, Status, modal fields  
7. `#common-issues` — no payment configs to attach; inactive counter; confuse with Orders / Money-In checkout  
8. Related — Payment channels + Orders  
9. Next step → Payment channels (`developers/payment-channels`)

**Must not:**

- Document Checkout API / webhook payload schemas  
- Self-hosted Docker / custom domain steps  
- Invent `/checkouts/[id]` navigation  

---

## 6. Deep-link & manifest rules

| slug | dashboardLinks | Page-level `?` |
|------|----------------|----------------|
| `payments/checkouts` | `/dashboard/checkouts` (`labelKey: open_checkouts`, `primary: true`) | `/dashboard/checkouts` → this slug |

**New i18n key:** `Help.dashboardLinks.open_checkouts`  
- EN: `Open Checkout Config`  
- ZH: `打开收银台配置`

---

## 7. Content & SEO

- Bodies in `src/content/help/en/payments.ts` and `zh/payments.ts`.  
- Manifest: `published: true`, `order: 25`, related + dashboardLinks.  
- SEO keywords: FilixPay checkout config, checkout counters, Merchant Center.  
- Self-canonical EN/ZH; BreadcrumbList; sitemap via published pipeline.

---

## 8. Success criteria

- `/en/help/payments/checkouts` and `/zh/help/payments/checkouts` return 200 (no longer 404).  
- Payments category lists the guide; search indexes it.  
- `/dashboard/checkouts` `?` → `.../help/payments/checkouts`.  
- Copy matches HEAD labels and naming traps.  
- No API/self-host invent; no Markdown links; fictional examples only.  
- No new agent unit tests; `tsc` passes.

---

## 9. Next step

1. Spec status: **Approved** (this document).  
2. Implement content + wiring on the same branch as this design.  
3. Update parent V1 status line to note Checkouts extension.
