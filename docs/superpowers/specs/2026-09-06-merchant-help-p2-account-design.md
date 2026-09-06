# Merchant Help P2 — Account & Reporting Design

**Date:** 2026-09-06  
**Status:** Shipped (content + Dashboard deep links)  
**Parent:** `docs/superpowers/specs/2026-09-05-merchant-help-system-design.md`

## Extension notice

Reuses V1 Help architecture only. Content + wiring. Plain text. No Markdown links. No new test files. No API encyclopedias. Fictional examples only.

## Batch decisions

| Slug | Level | Dashboard | Notes |
|------|-------|-----------|-------|
| `account/notifications` | A | `/dashboard/notifications` | Tabs Notifications + Tasks; Mark all as read |
| `account/audit-logs` | A | `/dashboard/audit-logs` | Read-only; filter by date/action/result |
| `account/maintenance` | B | profile + changes + contact | One guide; three `dashboardLinks` + `helpSlug` on each page (and changes detail) |
| `account/close-account` | A | `/dashboard/settings/close-account` | Irreversible workflow; page UI is ZH-hardcoded — EN Help describes actions conceptually |
| `payments/transaction-reports` | A | `/dashboard/reporting/transactions` | Parked under **payments** (no new `reporting` Help domain); Related from `payments/orders` |

## Out of scope this batch

- `account/security`, `account/service-plan` (still later)
- Coverage insurance
- Inventing EN close-account button strings that do not exist in UI
- Per-schema field dumps for profile change forms

## Related graph

- notifications ↔ audit-logs, maintenance  
- audit-logs ↔ developers/developer-center, risk/controls  
- maintenance ↔ funds/external-accounts, close-account, getting-started/merchant-setup  
- close-account ↔ maintenance, funds/balance  
- transaction-reports ↔ payments/orders, funds/reconciliation  

## Sequencing

Ship all five slugs in one feature branch after content + `?` wiring verify.
