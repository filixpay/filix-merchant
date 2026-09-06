# Merchant Help P1 — Credit Design

**Date:** 2026-09-06  
**Status:** Shipped (content + Dashboard deep links)  
**Parent:** `docs/superpowers/specs/2026-09-05-merchant-help-system-design.md`

## Extension notice

Reuses V1 Help architecture only. Content + wiring. Plain text. No Markdown links in bodies. No new test files. No API/SDK encyclopedias. Fictional examples only (`10001`, `ops@example.com`, `CRD-TEST-20260906-0001`).

## Decision: two Level-A guides

| Slug | Dashboard | Role |
|------|-----------|------|
| `credit/limit` | `/dashboard/credit/limit` | Grantor: create line, adjust limit, open history drawers |
| `credit/available-credit` | `/dashboard/member-credit/available-credit` | Member: read-only My Available Credit + history drawers |

**Why not one guide:** Distinct nav trees (Credit Granting vs Credit Usage), distinct capabilities (editable vs read-only), distinct search intents. V1 already lists both paths. History drawers stay Level-C anchors inside each article — no standalone Help URLs for Adjustment Logs or Credit Transactions.

## `credit/limit` scope

- Open Credit Center → Credit Granting → Credit Limit
- List: Source, Creditor, Debitor, Limit / Used / Available, Terms, Status; pagination
- Create Credit Line modal (debitor customer code, limit, payment term, net days when applicable)
- Adjust Limit modal (signed delta)
- Row drawers: Adjustment Logs, Credit Transactions
- Related → `credit/available-credit`

**Out of scope:** Filters/export; edit terms/source/status after create; standalone history pages; underwriting; multi-currency picker (UI formats USD); inventing End-of-Month list labels beyond what the table shows (non–Net Days rows display as Immediate Payment).

## `credit/available-credit` scope

- Open Credit Center → Credit Usage → My Limit (page title: My Available Credit)
- Read-only list: Creditor, Total / Used / Available, Payment Term, Status
- Row drawers only (member-scoped copy)
- Related → `credit/limit`

**Out of scope:** Member create/adjust/request UI; payment initiation from this page; admin Source/Debitor columns on this surface.

## Dashboard `?`

- Credit Limit page → `credit/limit`
- Available Credit page → `credit/available-credit`
