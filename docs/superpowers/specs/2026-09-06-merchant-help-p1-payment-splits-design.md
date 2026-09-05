# Merchant Help P1 — Payment Splits Design

**Date:** 2026-09-06  
**Status:** Approved — ready for execution  
**Parent:** Extends frozen V1 — `docs/superpowers/specs/2026-09-05-merchant-help-system-design.md`  
**Plan:** `docs/superpowers/plans/2026-09-06-merchant-help-p1-payment-splits.md`

## Extension notice (read first)

This spec **extends** the frozen Merchant Help V1 architecture. It does **not** redefine typed content, SEO, search, sitemap, deep-link mechanism, locales, or AGENTS.md rules.

**Plan / agent constraint:** Content + wiring only. Re-audit `/dashboard/payment-splits` HEAD UI before locking copy strings.

**Sequencing:** After Customers. Credit remains skipped. Next after this batch: external-accounts → crypto → fraud/risk-rules.

---

## 1. Goal

Publish one Level-A Merchant Center **UI** guide so operators can find payment-split records, filter by trade number, and open the split-details modal — without documenting split-rule configuration, settlement-mode product policy, or APIs.

---

## 2. Batch scope

### In scope

| Deliverable | Notes |
|-------------|--------|
| `payments/payment-splits` | Single Level-A how-to |
| EN + ZH bodies | Parity with prior P1 batches |
| Manifest + Related | Related: `payments/orders` (bidirectional recommended) |
| Dashboard `?` | `/dashboard/payment-splits` → this slug |
| Sitemap / search / Payments category | Published-only pipeline |

### Explicitly out of scope

| Item | Notes |
|------|--------|
| Creating / editing split **rules** or receiver configuration | Not this screen |
| Settlement-mode comparison tables / onboarding to direct settlement | FAQ one-liner only |
| Customer API / Payment Split API / SDK | Out |
| Credit, external-accounts, crypto, fraud | Later batches |
| `marketingPath` / `developerPath` | Omit this batch |
| Separate detail route | HEAD uses Modal only |

---

## 3. HEAD UI audit (SSOT for copy)

Audited 2026-09-06: `payment-splits/page.tsx`, `PaymentSplitTable.tsx`, `PaymentSplitDetailsModal.tsx`, `dashboard-menu.tsx`, `messages/{en,zh}.json`.

| Item | HEAD fact |
|------|-----------|
| Route | `/dashboard/payment-splits` only |
| Menu | Under Transactions; `Layout.nav.split_payment_records`; visible when `isDirectSettlement` |
| Page title | EN `Payment Splits` / ZH `分账记录` |
| Filter | Single field `tradeNo` — placeholder `headers.trade_no` (Trade No / 流水号); Submit + Reset |
| List columns | ID, Trade No, Split Amount (+ total), Type, Status, Receivers progress, Created At, Actions (view) |
| Detail | Modal “Split Details” / “分账详情”: basic info + receivers table — **not** a separate URL |
| Existing `?` | None |

**Copy consequences:**

1. “View details” = open the **modal**, not navigate to `/payment-splits/[id]`.  
2. Capability gate: FAQ only — menu may be hidden when the business account is not direct-settlement; no policy handbook.  
3. Filter is Trade No only (ignore unused `filters.order_id` message keys unless UI gains them).

Re-audit at implementation time; use live labels if drifted.

---

## 4. Frozen product decisions

| # | Decision |
|---|----------|
| S1 | One published guide: `payments/payment-splits` (Level A) |
| S2 | Domain **Payments**; URL `/help/payments/payment-splits` |
| S3 | Faithful to HEAD: list + tradeNo filter + details modal |
| S4 | Page-level `?` → `payments/payment-splits` (exactly one control) |
| S5 | Menu visibility: **FAQ one-liner** only (direct-settlement); no comparison table / approval flow |
| S6 | Related: `payments/orders` only (bidirectional recommended) |
| S7 | Omit `marketingPath` / `developerPath` |
| S8 | Plain text only — no Markdown links |
| S9 | Fictional examples only (`TRD_EXAMPLE_001`, amounts as placeholders) |

---

## 5. Guide matrix

### 5.1 `payments/payment-splits`

**H1 intent:** How to review payment split records in Merchant Center

**Dashboard:** `/dashboard/payment-splits`  
**`?`:** `helpSlug="payments/payment-splits"`

**Body structure:**

1. What payment splits records are / who for  
2. Open the page — Transactions → Split Payment Records / 分账记录; note menu may be hidden  
3. Read the list (columns above)  
4. Filter by Trade No  
5. Open Split Details modal — basic info + receivers  
6. Common issues — no menu; no results; detail fails to load  
7. Related → `payments/orders`  

**Must not:** Document how to configure split rules, API payloads, or how to switch settlement mode beyond the FAQ line.

---

## 6. Deep-link & manifest

| slug | dashboardLinks | Page-level `?` |
|------|----------------|----------------|
| `payments/payment-splits` | `/dashboard/payment-splits` (`open_payment_splits`, primary) | this slug |
| `payments/orders` | unchanged | add Related ↔ payment-splits |

**i18n:** `Help.dashboardLinks.open_payment_splits`  
- EN: `Open Payment Splits`  
- ZH: `打开分账记录`

Append P1 amendment to `2026-09-05-merchant-help-p0-slug-map.md`.

Content lives in existing `en/payments.ts` / `zh/payments.ts` (`order` e.g. `40`).

---

## 7. Success criteria

- `/en|zh/help/payments/payment-splits` 200, self-canonical  
- Payments category lists the guide  
- `/dashboard/payment-splits` `?` → Help article  
- Copy: modal detail, Trade No filter, FAQ gate one-liner; no rule-config / API invent  
- Related ↔ Orders; checkouts still unpublished  
- No new unit tests from agents; `tsc` + `verify:messages` + smoke checks  

---

## 8. Next after this batch

1. external-accounts  
2. crypto  
3. fraud/risk-rules  
4. Credit — still deferred  

---

## 9. Next step

Implementation plan at `docs/superpowers/plans/2026-09-06-merchant-help-p1-payment-splits.md`, then Subagent-Driven execution.
