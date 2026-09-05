# Merchant Help P1 — Remaining Batches Design

**Date:** 2026-09-06  
**Status:** Shipped (content + Dashboard deep links)  
**Parent:** `docs/superpowers/specs/2026-09-05-merchant-help-system-design.md`  
**Credit:** Still skipped

## Extension notice

Reuses V1 Help architecture only. Content + wiring. Plain text. No Markdown links. No new test files. No API/SDK encyclopedias.

## Batch A — `funds/external-accounts`

| Item | Decision |
|------|----------|
| Dashboard | `/dashboard/money/external-accounts` |
| Level | Single Level-A |
| Scope | Open Money → External accounts; list BANK/CRYPTO (masked); Add account modal (BANK + CRYPTO/TRON); Disable |
| Related | `funds/payouts` (bidirectional) |
| `?` | page-level → this slug |
| Out of scope | Full PAN/address after save; payout API; `/money/crypto` deposit wallets (separate guide) |

## Batch B — `funds/crypto`

| Item | Decision |
|------|----------|
| Dashboard | `/dashboard/money/crypto` |
| Level | Single Level-A |
| Scope | Open Money → Money-In → Digital currency; list deposit addresses; add/edit drawer; Active/Inactive; copy address |
| Related | `funds/money-in` (bidirectional) |
| `?` | page-level → this slug |
| Out of scope | External-accounts CRYPTO payout destinations; chain theory; exchange how-tos |

## Batch C — `risk/controls`

| Item | Decision |
|------|----------|
| Dashboards | `/dashboard/fraud`, `/dashboard/risk-reviews`, `/dashboard/risk-rules` |
| Level | One Level-A map + how-to (V1 preferred single guide) |
| Scope | What/Where/When for three surfaces; open lists; filters where present; open detail pages for fraud/reviews; rules are read-only |
| Related | `risk/disputes`, `risk/refunds` |
| `?` | Each of the three pages → `risk/controls` via explicit `helpSlug` |
| Out of scope | Writing/editing risk rules; fraud scoring algorithms; Credit |

## Sequencing after ship

P1 remaining list complete (except Credit). P2: notifications, audit-logs, maintenance, close-account, reporting.
