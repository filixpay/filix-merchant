# Merchant Help P3 — Merchant, Transfers, Coverage Design

**Date:** 2026-09-06  
**Status:** Shipped (content + Dashboard deep links)  
**Parent:** `docs/superpowers/specs/2026-09-05-merchant-help-system-design.md`

## Decisions

| Slug | Level | Dashboard |
|------|-------|-----------|
| `merchant/organization` | B | `/dashboard/organization` (Business Accounts / Members / Teams / Roles) |
| `merchant/locations` | B | `/dashboard/locations` + `/dashboard/sub-merchants` (acquiring pair; not merged with org) |
| `funds/transfers` | A | `/dashboard/money/transfers` (not Offline Collection `/dashboard/transfers`) |
| `risk/coverage` | B | `/dashboard/coverage-insurance` + `/dashboard/coverage-config` |

## Naming traps

- Org **Business Accounts** ≠ Acquiring **Sub-Merchants**
- Money **Transfers** ≠ Offline Collection Pending audit

## Out of scope

- Checkouts (`published: false`)
- Coverage provider API encyclopedias
- Inventing combined org+acquiring screens
