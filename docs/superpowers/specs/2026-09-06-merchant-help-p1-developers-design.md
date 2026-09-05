# Merchant Help P1 — Developers Domain Design

**Date:** 2026-09-06  
**Status:** Approved — implementation plan at `docs/superpowers/plans/2026-09-06-merchant-help-p1-developers.md`  
**Parent:** Extends frozen V1 — `docs/superpowers/specs/2026-09-05-merchant-help-system-design.md`  
**Plan:** `docs/superpowers/plans/2026-09-06-merchant-help-p1-developers.md`

## Extension notice (read first)

This spec **extends** the frozen Merchant Help V1 architecture. It does **not** redefine:

- Help information architecture (Getting Started + 8 business domains)
- Content model (`HelpArticle`, `dashboardLinks` + `labelKey`, `published`)
- Routing (`/{locale}/help/...`, `(help)` shell)
- SEO infrastructure (`buildPageMetadata` / Help alternates / self-canonical / BreadcrumbList)
- Search (title + description + keywords + flattened body)
- Deep-link mechanism (`HelpDeepLinkButton`, multi-candidate paths + explicit `helpSlug`)
- Locales (EN+ZH published content; other locales 308 → `/en/help/...`)
- Public-repo safety / AGENTS.md test rules

Implementation must **reuse** typed content modules, manifest, loaders, sitemap merge, and existing Help chrome.

**Plan / agent constraint:** P0 built the Help infrastructure; this P1 batch **only adds Developers content + wiring**. Do **not** redesign typed content, SEO, or deep-link architecture in the implementation plan.

---

## 1. Goal

Fill the currently empty `/help/developers` category with three Level-A Merchant Center **UI** guides so technical merchants can find and operate Developer Center features without treating Help as API documentation.

## 2. Batch scope

### In scope (this spec)

| Deliverable | Notes |
|-------------|--------|
| Category `/help/developers` | Stops showing empty “coming soon” once articles publish |
| `developers/developer-center` | Level A — map / overview |
| `developers/webhooks` | Level A — Webhook UI + verification |
| `developers/payment-channels` | Level A — channel config UI |
| EN + ZH bodies | Same parity rule as P0 |
| Manifest + relatedSlugs + `dashboardLinks` | Including multi-candidate `/dashboard/configs` |
| Dashboard `?` on developer + webhook-verification + configs | Explicit `helpSlug` where required |
| Sitemap / search / nav | Via existing published-only pipeline |

### Explicitly out of scope

- Credit domain (next separate design batch)
- customers, payment-splits, external-accounts, crypto, fraud/risk-rules (later P1 batches)
- Account / Merchant empty categories
- API reference, SDK, webhook payload schemas, signature algorithms (Marketing `/developers` + future API docs)
- MDX / CMS
- New Help architecture
- Checkouts (`published: false` unchanged)
- `commerce/products/edit`, first-payment / first-payout slugs

---

## 3. Frozen product decisions (this batch)

| # | Decision |
|---|----------|
| D1 | P1 Developers ships **three** Level-A guides only (not one mega overview, not additional Application/Sandbox slugs) |
| D2 | `developer-center` = **map**: What / Where / When per tab; no full step-by-step for Applications / Sandbox / Explorer / Production Access |
| D3 | Webhook **operations** live in `developers/webhooks` (create / view / enable-disable / delete endpoints, deliveries, verification page); `developer-center` only overview + Related. Merchant-facing copy must **not** use “CRUD” |
| D4 | `payment-channels` is Merchant Center UI only — no channel theory, API params, or SDK onboarding |
| D5 | `/dashboard/configs` **generic `?`** → `developers/payment-channels` (via explicit `helpSlug`) |
| D6 | Getting Started activation still uses `getting-started/payment-channel`; both articles may list `/dashboard/configs` in `dashboardLinks` |
| D7 | Selection among multi-candidate paths **must** use `helpSlug` (or equivalent); never assume path → single slug |
| D8 | Outbound links: **`marketingPath`** = product/commercial intro; **`developerPath`** = real Developer/API docs only when that URL exists. Help stays UI how-to (see §6.1) |
| D9 | Fictional examples only (`example.com`, placeholder secrets/URLs) |
| D10 | Page-level `?` on `/dashboard/developer` → `developers/developer-center` always; **never** auto-switch by active Tab. Explicit `helpSlug="developers/webhooks"` on a tab/CTA is allowed only when a natural help affordance already exists — **do not** add a second `?` solely for deep-link coverage |
| D11 | Production Access in the map: **entry, status, next step only** — no approval criteria, SLAs, or eligibility rules |

---

## 4. Guide matrix

### 4.1 Category: `/help/developers`

- Title/description from existing `HELP_DOMAINS` developers entry (may tweak copy if needed; no IA change).
- Lists the three published articles (no “coming soon” once all three are published).
- Optional short intro: “These guides cover Merchant Center developer UI. For APIs and SDKs, see Developers.”

### 4.2 `developers/developer-center`

**H1 intent:** How to use Developer Center in Merchant Center (find the right area)

**Dashboard:** `/dashboard/developer`  
**Page-level `?`:** always `helpSlug="developers/developer-center"`  
**Do not** change the page-level `?` based on the active Tab (Applications / Sandbox / Webhooks / etc.).

**Body structure:**

1. What Developer Center is / who it’s for  
2. How to open it (nav footer Developer)  
3. Tab map — every tab uses the same **What / Where / When** triad (see table below)  
4. Before you start (active merchant, permissions)  
5. Common issues (can’t see tab / no token — high level)  
6. Related: webhooks, payment-channels, Marketing `/developers`  
7. Next step CTA toward webhooks or payment-channels as appropriate  

**Tab map (frozen triad):**

| Tab | What | Where | When |
|-----|------|-------|------|
| Applications | Manage applications | Developer Center → Applications | Creating or managing apps |
| Sandbox | Test environment | Developer Center → Sandbox | Integration testing |
| Explorer | API exploration | Developer Center → Explorer | Debugging / exploring APIs |
| Production Access | Production access entry & status | Developer Center → Production Access | Preparing to go live |
| Webhooks | Webhook management (overview) | Developer Center → Webhooks | Configuring event notifications — Related: `developers/webhooks` |
| Deliveries | Delivery history (overview) | Developer Center → Deliveries | Troubleshooting webhook delivery — Related: `developers/webhooks` |

**Production Access boundary (frozen):** Describe **where the entry is**, **what status the merchant may see**, and **what next step the UI suggests**. Do **not** document approval criteria, review SLAs, eligibility rules, or “how to get approved” policy — those change and belong outside Help how-to.

**Must not:** Full create/view/enable/delete tutorials for Applications; Sandbox session setup; Explorer request authoring; or Production Access workflows beyond the entry/status/next-step boundary above. Do not use “CRUD” in merchant-facing copy.

### 4.3 `developers/webhooks`

**H1 intent:** How to manage and verify webhooks in Merchant Center

**Dashboard links:**

| path | role |
|------|------|
| `/dashboard/developer` | Open-in-MC CTA toward Webhooks / Deliveries tabs (secondary; article CTA, not page-level `?`) |
| `/dashboard/developer/webhook-verification` | Verification UI (primary) |

**`?` mapping (frozen):**

| Surface | Behavior |
|---------|----------|
| Page-level `?` on `/dashboard/developer` | **Always** → `developers/developer-center` (thin page-level deep link; **never** auto-switch by active Tab). **One** page-level `?` only in this batch. |
| Page-level `?` on `/dashboard/developer/webhook-verification` | → `developers/webhooks` |
| In-page CTA / tab-specific Help control near Webhooks UI | **Allowed** with explicit `helpSlug="developers/webhooks"` only if a natural help affordance already exists — **do not** add a second `?` solely for coverage |
| Help article “Open in Merchant Center” CTAs | May deep-link to Developer Webhooks/Deliveries context without changing the page-level `?` default |

**Body includes:**

- Create, view, enable/disable, and delete Webhook Endpoints (UI steps — merchant-facing wording; **not** “CRUD”)  
- Deliveries / redeliver (UI)  
- Webhook verification page usage  
- Common issues (endpoint inactive, verification failed — UI troubleshooting)  
- Outbound: UI how-to stays in Help; payload / signature / API → `developerPath` **only if** a real docs URL exists; product/“why FilixPay” → `marketingPath: "/developers"`  
- Related: `developer-center`, Marketing `/developers`  

**Must not:** Document event schemas, signing algorithms, or sample code beyond fictional placeholder URLs (`https://api.example.com/webhook`). Do not use “CRUD” in titles, SEO text, or body copy.

### 4.4 `developers/payment-channels`

**H1 intent:** How to manage payment channel configuration in Merchant Center

**Dashboard:** `/dashboard/configs`  
**`?` on configs page:** `helpSlug="developers/payment-channels"` (**required** — overrides multi-candidate default)

**Relationship to Getting Started:**

| Guide | Question answered |
|-------|-------------------|
| `getting-started/payment-channel` | First-time setup / activation funnel |
| `developers/payment-channels` | Ongoing manage/configure while using Merchant Center |

Both may declare `dashboardLinks` including `/dashboard/configs`.  
Both must `relatedSlugs` each other.  
Do **not** duplicate the full first-time checklist into the Developers article; summarize and link.

**Body includes:**

- Open Payment Configs  
- Add / edit / view channel config (UI fields at Key fields level — no API parameter encyclopedia)  
- Common issues (save failed, missing credentials — UI level)  
- Related: getting-started payment-channel, developer-center, Marketing as needed  

**Must not:** Payment rail theory, SDK integration, or credential hunting on third-party dashboards beyond a short “obtain credentials from your provider” note with fictional examples.

---

## 5. Deep-link & manifest rules

### 5.1 Locked slug ↔ Dashboard map (P1 Developers)

| slug | dashboardLinks (paths) | Page-level `?` helpSlug |
|------|------------------------|-------------------------|
| `developers/developer-center` | `/dashboard/developer` (primary) | `/dashboard/developer` → **this slug** (always; ignore active Tab) |
| `developers/webhooks` | `/dashboard/developer` (optional secondary CTA), `/dashboard/developer/webhook-verification` (primary) | `/dashboard/developer/webhook-verification` → this slug; Webhooks tab CTA may pass explicit `helpSlug` |
| `developers/payment-channels` | `/dashboard/configs` (primary) | `/dashboard/configs` → **this slug** |
| `getting-started/payment-channel` (existing) | `/dashboard/configs` (keep link; **do not** win generic configs `?`) | Activation / Getting Started CTAs only |

### 5.2 Configs multi-candidate (implementation requirement)

Today `configs/page.tsx` uses:

```tsx
<HelpDeepLinkButton dashboardPath="/dashboard/configs" />
```

Without `helpSlug`, reverse map may prefer whichever def marks `primary` first. After P1:

1. Set configs page to  
   `helpSlug="developers/payment-channels"`.  
2. Keep `getting-started/payment-channel` in manifest with `/dashboard/configs` for Open-in-MC CTAs from that article.  
3. Prefer `primary: true` only on `developers/payment-channels` for the configs path; Getting Started entry should **not** rely on being the reverse-map winner.

Update `docs/superpowers/specs/2026-09-05-merchant-help-p0-slug-map.md` with a short “P1 amendment” note: configs generic `?` now targets Developers payment-channels (not a P0 regression — intentional P1 override).

### 5.3 New `labelKey`s

Add under `Help.dashboardLinks.*` (EN+ZH; other locales only if message-key parity requires):

- `open_developer_center`
- `open_webhook_verification`
- (reuse `open_configs` for payment-channels)

---

## 6. Content & SEO

- Store bodies in `src/content/help/en/developers.ts` and `zh/developers.ts`; compose via existing `article-content.ts`.
- Register defs in `manifest.ts` (`domain: "developers"`, `published: true`, `relatedSlugs`, outbound paths per §6.1).
- SEO: FilixPay + task keywords (e.g. “FilixPay webhook Merchant Center”, “FilixPay payment channel configuration”); avoid competing Marketing head terms; avoid “CRUD” as terminology.
- Self-canonical EN/ZH; BreadcrumbList; FAQPage only if real FAQ section exists.
- Search must index flattened body text (existing V1 rule).
- Sitemap: published articles appear automatically via existing merge.

### 6.1 Outbound link duties (`marketingPath` vs `developerPath`)

| Field | Duty | Example |
|-------|------|---------|
| `marketingPath` | Product / commercial intro — “why FilixPay / what you can do” | `"/developers"` (Marketing developers hub) |
| `developerPath` | Real Developer / API documentation — “how to call APIs / webhook payload / SDK” | Only set when a **real, existing** docs URL is available |

**Inside each Help article:**

| Merchant question | Stay / go |
|-------------------|-----------|
| How do I operate this UI in Merchant Center? | Stay in Help |
| How do I call the API / webhook payload / SDK? | Jump via **`developerPath`** |
| Why FilixPay / what can I build? | Jump via **`marketingPath`** (`/developers`) |

**Frozen constraint:** Do **not** point `developerPath` at a URL that does not exist yet “because docs are incomplete.” Omit `developerPath` (or leave unset) until the target is live; use `marketingPath: "/developers"` for the commercial/intro outbound in the meantime.

---

## 7. Success criteria

- `/en/help/developers` and `/zh/help/developers` list three guides (no empty coming-soon for this domain).  
- Three article URLs 200 with self-canonical.  
- `/dashboard/configs` `?` → `.../help/developers/payment-channels`.  
- `/dashboard/developer` page-level `?` → `.../help/developers/developer-center` (unchanged by active Tab; exactly one `?` on that page for this batch).  
- `/dashboard/developer/webhook-verification` `?` → `.../help/developers/webhooks`.  
- Getting Started payment-channel article still reachable; Related links both ways.  
- No API reference or signature-implementation details in Help bodies; no dangling `developerPath`; no “CRUD”; no Markdown link syntax in typed text.  
- Production Access copy stays entry/status/next-step only.  
- No new unit test files from agents; manual verification + existing tsc/lint on touched files.

---

## 8. Sequencing note for remaining P1

After this batch ships:

1. **Credit domain** — separate design spec (next)  
2. Then customers / payment-splits / external-accounts / crypto / fraud-risk — further batches  

Do not pull Credit into the Developers implementation plan.

---

## 9. Next step after approval

1. Spec status: **Approved** (this revision).  
2. Implementation plan written: `docs/superpowers/plans/2026-09-06-merchant-help-p1-developers.md`.  
3. Execute via Subagent-Driven Development (recommended) or Inline — content + wiring only; **do not** reopen typed content / SEO / deep-link architecture.
