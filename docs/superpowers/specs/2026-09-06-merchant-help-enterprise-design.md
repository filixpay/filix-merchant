# Merchant Help — Enterprise (集团治理) Design

**Date:** 2026-09-06  
**Status:** Approved — ready for implementation  
**Parent:** Extends frozen V1 — `docs/superpowers/specs/2026-09-05-merchant-help-system-design.md`  
**Gap:** Login portal「集团管理中心」→ `/enterprise/**` 当前无 Help 文章、无页面 `?`

## Extension notice (read first)

This spec **extends** the frozen Merchant Help V1 architecture. It does **not** redefine content model, routing, SEO, search, deep-link mechanism, or EN+ZH locale rules.

It **does** add one Help domain (`enterprise`) because Enterprise Portal is a **separate authenticated shell** from Merchant Center Dashboard — not a sidebar section under `/dashboard/**`.

**Plan / agent constraint:** Content + wiring only. Re-audit `/enterprise/**` HEAD UI before locking copy. Do **not** invent wallet/payment/settlement KPIs on the enterprise dashboard (HEAD explicitly says governance metadata only).

---

## 1. Goal

Publish public Help so enterprise ADMIN / VIEWER operators can:

1. Enter **Enterprise Portal** from the management login chooser (集团管理中心).  
2. Select an enterprise, read the governance dashboard, manage the organization directory, enterprise members, and enterprise audit.  
3. Understand the hard boundary vs **Merchant Center → Organization** (`/help/merchant/organization`).

---

## 2. Naming traps (freeze)

| Concept | Portal / route | Help |
|---------|----------------|------|
| **Enterprise Portal** / 集团门户 | `/enterprise/**` | This batch |
| **Organization** (merchant org RBAC) | `/dashboard/organization` | Existing `merchant/organization` |
| **Business Accounts** | Org tab in Merchant Center | `merchant/organization` |
| **Sub-Merchants** | Acquiring settings | `merchant/locations` — **not** enterprise directory |
| Ops platform audit | Outside merchant product | **Out of scope** (HEAD: enterprise audit ≠ ops platform audits) |

**Copy rule:** Enterprise Members kind `ADMIN` / `VIEWER` ≠ Organization Roles / Teams RBAC.

---

## 3. HEAD UI audit (SSOT)

Audited 2026-09-06 against:

- Login portal: `src/app/[locale]/login/page.tsx` (`Portal.enterprise_*`)
- Shell: `EnterpriseDashboardLayout.tsx`, `enterprise-menu.ts`
- Pages: `enterprise/pick`, `dashboard`, `organizations`, `members`, `audit`
- i18n: `Layout.enterprise.*`, `Enterprise.*` in `messages/{en,zh}.json`

| Surface | Route | Title (EN) | Notes |
|---------|-------|------------|-------|
| Portal card | `/login` | Group Management Center / 集团管理中心 | Body: organizations, members, permissions, multi-merchant relations |
| Pick | `/enterprise/pick` | Select Enterprise | Auto-open if only one enterprise; else list name + code + kind |
| Dashboard | `/enterprise/dashboard` | Enterprise Dashboard | Active/Suspended org counts, merchant count, trends, top orgs, Export CSV; **not** wallet/payment/settlement |
| Organizations | `/enterprise/organizations` | Organization Directory | Create (ADMIN), Suspend/Activate, Switch to Merchant Portal; directory ≠ merchant ops rights |
| Members | `/enterprise/members` | Enterprise Members | Add by Identity ID + kind ADMIN/VIEWER; suspend/remove; last ADMIN protected |
| Audit | `/enterprise/audit` | Enterprise Audit | Filter by org code + action; governance events only |

Sidebar nav labels: Dashboard · Organizations · Members · Audit (`Layout.enterprise.nav.*`).  
Shell title: Enterprise Portal / 集团门户.

**Existing Help / `?`:** none on enterprise pages.

---

## 4. Batch scope

### In scope

| Deliverable | Notes |
|-------------|--------|
| New domain `enterprise` | Home card + left nav + `/help/enterprise` |
| One Level-B guide `enterprise/governance` | Map of portal + all four nav surfaces via anchors |
| EN + ZH bodies | Same parity as other Help |
| Manifest `dashboardLinks` | All `/enterprise/...` paths + hashes |
| Page-level `?` | pick, dashboard, organizations, members, audit |
| Related | `merchant/organization` (boundary) |
| Parent V1 status note | Post-V1 enterprise Help extension |

### Explicitly out of scope

| Item | Notes |
|------|--------|
| Splitting into four SEO Level-A articles | Defer unless search demand appears |
| Merchant Organization / Teams / Roles rewrite | Already shipped |
| Sub-merchants / locations | Separate merchant guides |
| Wallet, payments, settlements in enterprise Help | HEAD forbids that framing |
| Ops platform audit encyclopedias | Explicitly excluded by UI copy |
| Enterprise API / SDK docs | Developers later |
| New Help architecture | Frozen |

---

## 5. Frozen product decisions

| # | Decision |
|---|----------|
| E1 | Add Help domain id `enterprise` (extends `HelpDomainId` + `HELP_DOMAINS`) |
| E2 | One published slug: `enterprise/governance` (Level B) |
| E3 | Anchors: `#open`, `#pick`, `#dashboard`, `#organizations`, `#members`, `#audit`, `#common-issues` |
| E4 | Domain titles: EN `Enterprise Governance` / ZH `集团治理` |
| E5 | Domain heading branded: EN `FilixPay Enterprise Governance` / ZH `FilixPay 集团治理` |
| E6 | Related: `merchant/organization` only (bidirectional recommended) |
| E7 | Deep links use paths under `/enterprise/...` (same `HelpDeepLinkButton` / `dashboardLinks` mechanism) |
| E8 | Plain text bodies; fictional emails/IDs only (`governance-admin@example.com`) |
| E9 | Omit `marketingPath` / `developerPath` |

### Domain card description (freeze)

- EN: `Select an enterprise, manage the organization directory and enterprise members, and review governance audit events in FilixPay Enterprise Portal.`  
- ZH: `在 FilixPay 集团门户中选择集团、管理组织目录与集团成员，并查看治理审计事件。`

---

## 6. Guide matrix — `enterprise/governance`

**H1 intent:** How to use FilixPay Enterprise Portal for group governance

**Body structure:**

1. What Enterprise Portal is / who for (ADMIN vs VIEWER) — not Merchant Center ops  
2. `#open` — Management Center login → 进入集团中心 / Enter Group Center  
3. `#pick` — Select Enterprise when multiple; single auto-select  
4. `#dashboard` — governance aggregates, Export CSV, read-model note  
5. `#organizations` — directory, create, suspend/activate, Switch to Merchant Portal (membership required)  
6. `#members` — Identity ID, ADMIN/VIEWER, suspend/remove, last admin rule  
7. `#audit` — filters, action types, not ops platform audits  
8. `#common-issues` — no memberships; cannot switch; confuse with Organization RBAC; last admin  
9. Next step → `merchant/organization`

**Must not:** Document payment/settlement dashboards; invent create-merchant from enterprise UI beyond HEAD org create fields (name, legal name, optional OWNER email).

---

## 7. Deep-link & manifest

| Path | `labelKey` | `hash` | `primary` |
|------|------------|--------|-----------|
| `/enterprise/dashboard` | `open_enterprise_dashboard` | `dashboard` | true |
| `/enterprise/pick` | `open_enterprise_pick` | `pick` | |
| `/enterprise/organizations` | `open_enterprise_organizations` | `organizations` | |
| `/enterprise/members` | `open_enterprise_members` | `members` | |
| `/enterprise/audit` | `open_enterprise_audit` | `audit` | |

**i18n (EN / ZH):**

- `open_enterprise_dashboard` — Open Enterprise Dashboard / 打开集团概览  
- `open_enterprise_pick` — Open Select Enterprise / 打开选择集团  
- `open_enterprise_organizations` — Open Organization Directory / 打开组织目录  
- `open_enterprise_members` — Open Enterprise Members / 打开集团成员  
- `open_enterprise_audit` — Open Enterprise Audit / 打开集团审计  

Wire `HelpDeepLinkButton` with `helpSlug="enterprise/governance"` on each page (and hash via manifest).

Also add `enterprise/governance` to `merchant/organization` `relatedSlugs` for bidirectional discovery.

---

## 8. Implementation checklist

1. Extend `HelpDomainId` + `HELP_DOMAINS` (+ order; place after `merchant` or before `account` — **recommend order `1.5` → use integer `15` between merchant `1` and payments `2` by renumbering OR insert as order `1` bump merchant… **Freeze: domain `order: 1.5` not allowed — use `order: 15` with sort, or set `enterprise` `order: 2` and shift payments+ — simplest: `order: 9` at end of business domains to minimize churn, home card still lists by order.**  
   **Frozen:** `enterprise` domain `order: 9` (after account `8`) for minimal IA churn; home shows 10 cards.  
2. Content modules: `src/content/help/en/enterprise.ts` + `zh/enterprise.ts`; register in `article-content.ts`.  
3. Manifest entry `enterprise/governance`, `published: true`, `order: 10`.  
4. Messages: five `Help.dashboardLinks.open_enterprise_*` keys EN+ZH.  
5. Wire `?` on five enterprise pages.  
6. Update parent V1 status: post-V1 Enterprise Help extension.  
7. Verify: `/en/help/enterprise`, article 200, sitemap, `getHelpHrefForDashboardPath` for `/enterprise/organizations#organizations`.

---

## 9. Success criteria

- Help home shows **集团治理 / Enterprise Governance** card.  
- `/zh/help/enterprise/governance` and `/en/...` return 200.  
- Each Enterprise Portal nav page `?` lands on the matching anchor.  
- Copy states directory switch ≠ merchant ops rights; enterprise members ≠ org RBAC; dashboard ≠ funds.  
- Related links to Merchant Organization guide.  
- No agent-authored unit tests; `tsc` passes.

---

## 10. Next step

1. Spec status: **Approved** (this document).  
2. Implement on a feature branch; ship to `main`.  
3. Optional later: split Level-A articles if search analytics justify.
