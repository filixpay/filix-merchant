# Merchant Help P1 — Credit Implementation Plan

> **For agentic workers:** Follow this plan. Content + wiring only.

**Goal:** Ship `credit/limit` and `credit/available-credit` with EN+ZH bodies, manifest, i18n CTAs, and Dashboard deep links; merge to `main`.

### Task 1: Specs

- Design: `docs/superpowers/specs/2026-09-06-merchant-help-p1-credit-design.md`
- Update V1 status / P1 sequencing: Credit restarted → shipping

### Task 2: Manifest + i18n

- Publish both slugs under domain `credit`
- Labels: `open_credit_limit`, `open_available_credit`
- Bidirectional `relatedSlugs`

### Task 3: Content modules

- Add `src/content/help/en/credit.ts` and `zh/credit.ts`
- Register in `article-content.ts`

### Task 4: Dashboard wiring

- `/dashboard/credit/limit` and `/dashboard/member-credit/available-credit` → `HelpDeepLinkButton` with explicit `helpSlug`

### Task 5: Verify + ship

- `npx tsc --noEmit`, `npm run verify:messages`, loader smoke
- Merge to `main` and push
