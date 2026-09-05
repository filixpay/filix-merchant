# Merchant Help P1 — Remaining Batches Implementation Plan

> **For agentic workers:** Follow this plan. Content + wiring only. Do not reopen Help architecture.

**Goal:** Ship Level-A Help for `funds/external-accounts`, `funds/crypto`, and `risk/controls` on one feature branch, then merge to `main`.

**Tech Stack:** Typed Help content (`src/content/help`), `manifest.ts` dashboardLinks, `HelpDeepLinkButton`, `messages/en.json` + `zh.json` under `Help.dashboardLinks`.

---

### Task 1: Specs already written

- Design: `docs/superpowers/specs/2026-09-06-merchant-help-p1-remaining-design.md`
- V1 status line updated

### Task 2: Manifest + i18n labels

- Add three published defs with dashboardLinks and relatedSlugs
- Bidirectional related: external-accounts ↔ payouts; crypto ↔ money-in; controls → disputes + refunds
- Labels: `open_external_accounts`, `open_crypto`, `open_fraud`, `open_risk_reviews`, `open_risk_rules`

### Task 3: EN/ZH article bodies

- Append to `en/zh/funds.ts` and `en/zh/risk.ts` (plain text; fictional examples only)

### Task 4: Dashboard `?` wiring

- external-accounts + crypto: Help beside primary CTA
- fraud, risk-reviews, risk-rules: `helpSlug="risk/controls"`

### Task 5: Verify

- `npx tsc --noEmit`
- `npm run verify:messages`
- Optional loader smoke via node

### Task 6: Merge

- Merge branch to `main` and push when batch is green
