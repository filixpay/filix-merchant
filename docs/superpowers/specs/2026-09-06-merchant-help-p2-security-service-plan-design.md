# Merchant Help P2 — Security & Service Plan Design

**Date:** 2026-09-06  
**Status:** Shipped (content + Dashboard deep links)  
**Parent:** `docs/superpowers/specs/2026-09-05-merchant-help-system-design.md`  
**Prior batch:** `2026-09-06-merchant-help-p2-account-design.md`

## Decisions

| Slug | Level | Dashboard |
|------|-------|-----------|
| `account/security` | A | `/dashboard/security-settings/transaction-password` only (no MFA/login-password siblings in HEAD) |
| `account/service-plan` | A | `/dashboard/service-plan` |

## Scope notes

- Security: bind security email via Contact Info; set/change 6-digit transaction PIN via 3-step modal (verify captcha → set PIN → done). PIN status on page is session-local after set — do not invent server-hydrated PIN state.
- Service plan: four plan cards (Weekly/Monthly/Half-Year/Yearly USD from Home.pricing copy) → checkout redirect; Payment Records table with Pay on pending `PLATFORM_SERVICE_FEE` rows.
- Out of scope: checkout page UX after redirect; login MFA; inventing plan feature matrices beyond card name/price/desc.

## Related

- security ↔ maintenance, audit-logs, payouts  
- service-plan ↔ orders, close-account  
