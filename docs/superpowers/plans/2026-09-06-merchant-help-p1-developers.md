# Merchant Help P1 — Developers Domain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish three Level-A Developers Help guides (`developer-center`, `webhooks`, `payment-channels`) in EN+ZH, wire Dashboard `?` deep links, and clear the empty `/help/developers` category — without changing Help architecture.

**Architecture:** Reuse existing typed content modules + manifest + loaders + search + sitemap + `HelpDeepLinkButton`. Add `src/content/help/{en,zh}/developers.ts`, register three published defs, flip configs reverse-map primary to `developers/payment-channels` via explicit `helpSlug`, and render existing `marketingPath` / `developerPath` fields in `HelpArticleView` (fields already typed; currently unused in UI).

**Tech Stack:** Next.js App Router, TypeScript, next-intl, existing Help content model (`HelpArticleDef`, `HelpBody`, `HelpDeepLinkButton`)

**Spec:** `docs/superpowers/specs/2026-09-06-merchant-help-p1-developers-design.md`  
**Parent:** `docs/superpowers/specs/2026-09-05-merchant-help-system-design.md`

## Global Constraints

- **Content + wiring only.** Do not redesign typed content, SEO, search, sitemap, or deep-link architecture.
- Help = Merchant Center **UI** how-to. No API reference, SDK, webhook payload schemas, or signing algorithms in Help bodies.
- **Typed Help text is plain text only.** Never embed Markdown link syntax (`[label](url)`) in `paragraph` / `steps` / `issues` / `fields` strings — there is no Markdown renderer. Write bare URLs when needed: `https://api.example.com/webhook`.
- **Webhook signature implementation stays out of Help.** Do not mention raw request body hashing, HMAC details, or “how to implement verification.” Point merchants to the Webhook Verification **page** and (when available) developer docs.
- Merchant-facing copy must **never** use the word “CRUD”. Use “create, view, enable/disable, and delete”.
- Page-level `?` on `/dashboard/developer` → **always** `developers/developer-center` (never auto-switch by Tab).
- Explicit `helpSlug="developers/webhooks"` on a Webhooks tab control is an **allowed** capability, but **this batch must not add a second `HelpDeepLinkButton`** on `/dashboard/developer` unless a natural tab-level help affordance already exists (HEAD: none). Prefer Related links from `developer-center` → `webhooks`.
- Production Access copy: **entry, status, next step only** — no approval criteria, SLAs, or eligibility rules.
- `marketingPath` / `developerPath` are **approved product/docs navigation targets**, not arbitrary author URLs. This batch: `marketingPath: "/developers"`; **omit** `developerPath` (no live API docs URL). Do not invent external `developerPath` values.
- **Navigation copy SSOT = Dashboard HEAD**, not design-draft guesses. Audit `dashboard-menu.tsx` + `Layout.nav.*` + `Configs.title` before writing payment-channels steps (Task 1 locks the labels).
- Examples: `@example.com`, `https://api.example.com/webhook`, placeholder secrets only (AGENTS.md).
- Per `AGENTS.md`: agents must **not** create or modify `*.test.ts` / `*.test.tsx`. Verify with `npx tsc --noEmit`, `npm run verify:messages`, optional `npx tsx` sanity scripts, and manual browser checks.
- Login deep links use `callbackUrl` (existing `HelpOpenInDashboard` behavior).
- Do not pull Credit or other P1 batches into this plan.
- `payments/checkouts` stays `published: false`.

## File structure

| File | Responsibility |
|------|----------------|
| `docs/superpowers/specs/2026-09-05-merchant-help-p0-slug-map.md` | Short **P1 amendment** note for configs `?` override |
| `src/content/help/manifest.ts` | Register 3 Developers defs; update `getting-started/payment-channel` relatedSlugs + configs `primary` |
| `src/content/help/en/developers.ts` | EN bodies for the three guides |
| `src/content/help/zh/developers.ts` | ZH bodies (parity) |
| `src/content/help/article-content.ts` | Spread `enDevelopers` / `zhDevelopers` into `HELP_ARTICLE_CONTENT` |
| `src/components/help/HelpArticleView.tsx` | Render `marketingPath` / `developerPath` outbound links when set |
| `src/components/help/help.module.css` | Styles for outbound link group (reuse openCta patterns) |
| `messages/en.json`, `messages/zh.json` (+ other locales if `verify:messages` requires key parity) | `Help.dashboardLinks.open_developer_center`, `open_webhook_verification`; `Help.outbound.section_title` / `marketing` / `developer_docs` |
| `src/app/[locale]/dashboard/developer/page.tsx` | Page-level `?` only → `developers/developer-center` (no second tab `?` in this batch) |
| `src/app/[locale]/dashboard/developer/webhook-verification/page.tsx` | Page-level `?` → webhooks |
| `src/app/[locale]/dashboard/configs/page.tsx` | Add `helpSlug="developers/payment-channels"` |

---

### Task 1: Slug-map P1 amendment + i18n keys

**Files:**
- Modify: `docs/superpowers/specs/2026-09-05-merchant-help-p0-slug-map.md`
- Modify: `messages/en.json`, `messages/zh.json`
- Modify (if `npm run verify:messages` fails without them): `messages/ar.json`, `de.json`, `es.json`, `fr.json`, `ja.json`, `ko.json`, `pt.json` — copy EN chrome strings for new keys only

**Interfaces:**
- Consumes: Design §5.2–5.3, §6.1; HEAD `dashboard-menu.tsx` + `Layout.nav.*` + `Configs.title`
- Produces: Locked docs note + message keys `Help.dashboardLinks.open_developer_center`, `Help.dashboardLinks.open_webhook_verification`, `Help.outbound.section_title`, `Help.outbound.marketing`, `Help.outbound.developer_docs` + locked Payment Configs nav strings for Tasks 4–5

- [ ] **Step 1: Audit Payment Configs navigation labels from HEAD (SSOT)**

Re-read before writing article copy (do not invent breadcrumbs):

```bash
npx tsx -e "const en=require('./messages/en.json'); const zh=require('./messages/zh.json'); console.log({ enPath: [en.Layout.nav.transactions_management, en.Layout.nav.acquiring_settings, en.Layout.nav.payment_configs].join(' → '), zhPath: [zh.Layout.nav.transactions_management, zh.Layout.nav.acquiring_settings, zh.Layout.nav.payment_configs].join(' → '), enTitle: en.Configs.title, zhTitle: zh.Configs.title });"
```

Also confirm `src/components/layout/dashboard-menu.tsx` still nests configs under `transactions` → `acquiring` → `/dashboard/configs`.

**Locked from HEAD at plan time (2026-09-06) — re-confirm in this step; if drifted, use the live labels instead:**

| Locale | Sidebar path (use in steps) | Page title (`Configs.title`) |
|--------|-----------------------------|------------------------------|
| EN | `Transactions → Acquiring Settings → Payment Configs` | `Payment Configurations` |
| ZH | `交易 → 收单设置 → 支付配置` | `支付配置` |

Record any drift in the P1 amendment note (Step 2). Tasks 4–5 **must** use these audited strings, not design-draft guesses.

- [ ] **Step 2: Append P1 amendment to the P0 slug map**

Add this section at the **end** of `docs/superpowers/specs/2026-09-05-merchant-help-p0-slug-map.md` (do not rewrite the locked P0 table):

```markdown
## P1 amendment (2026-09-06) — Developers batch

Intentional override (not a P0 regression):

| Dashboard path | Page-level `?` after P1 | Notes |
|----------------|-------------------------|-------|
| `/dashboard/configs` | `developers/payment-channels` via explicit `helpSlug` | `getting-started/payment-channel` keeps `dashboardLinks` for Open-in-MC CTAs but must **not** win reverse-map primary |
| `/dashboard/developer` | `developers/developer-center` | Always; ignore active Tab. **No second tab-level `?` required in this batch.** |
| `/dashboard/developer/webhook-verification` | `developers/webhooks` | Page-level |

### Payment Configs nav labels (HEAD audit)

| Locale | Sidebar path | Page title |
|--------|--------------|------------|
| EN | Transactions → Acquiring Settings → Payment Configs | Payment Configurations |
| ZH | 交易 → 收单设置 → 支付配置 | 支付配置 |

Spec: `docs/superpowers/specs/2026-09-06-merchant-help-p1-developers-design.md`
```

- [ ] **Step 3: Add EN message keys**

In `messages/en.json` under `Help.dashboardLinks`, add:

```json
"open_developer_center": "Open Developer Center",
"open_webhook_verification": "Open Webhook Verification"
```

Under `Help` (sibling of `dashboardLinks`), add:

```json
"outbound": {
  "section_title": "Related resources",
  "marketing": "FilixPay for developers",
  "developer_docs": "API & developer docs"
}
```

Keep existing keys intact. Trailing commas must remain valid JSON.

- [ ] **Step 4: Add ZH message keys**

In `messages/zh.json` mirror:

```json
"open_developer_center": "打开开发者中心",
"open_webhook_verification": "打开 Webhook 验签说明",
"outbound": {
  "section_title": "相关资源",
  "marketing": "FilixPay 开发者介绍",
  "developer_docs": "API 与开发者文档"
}
```

- [ ] **Step 5: Satisfy message-key parity if required**

Run:

```bash
npm run verify:messages
```

Expected: PASS. If FAIL on missing keys in other locales, add the **same key paths** with EN placeholder strings to those locale files only — do **not** add Help article content for non-EN/ZH.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/specs/2026-09-05-merchant-help-p0-slug-map.md messages
git commit -m "$(cat <<'EOF'
docs(help): amend P0 slug map and add Developers Help i18n keys

EOF
)"
```

---

### Task 2: Manifest defs + configs primary flip

**Files:**
- Modify: `src/content/help/manifest.ts`

**Interfaces:**
- Consumes: Design §4–§5; existing `HelpArticleDef`
- Produces: Three published `developers/*` defs; `getting-started/payment-channel.relatedSlugs` includes `developers/payment-channels`; configs path `primary: true` only on `developers/payment-channels`

- [ ] **Step 1: Update `getting-started/payment-channel`**

Change that def so:

- `relatedSlugs: ["developers/payment-channels"]`
- `dashboardLinks[0].primary` is **removed** (or set `primary: false`) — keep `path: "/dashboard/configs"` and `labelKey: "open_configs"`

- [ ] **Step 2: Append three Developers defs**

Add these objects to `HELP_ARTICLE_DEFS` (after commerce entries is fine; keep `payments/checkouts` as-is):

```ts
  {
    slug: "developers/developer-center",
    domain: "developers",
    published: true,
    order: 10,
    relatedSlugs: [
      "developers/webhooks",
      "developers/payment-channels",
    ],
    dashboardLinks: [
      {
        path: "/dashboard/developer",
        labelKey: "open_developer_center",
        primary: true,
      },
    ],
    marketingPath: "/developers",
    // developerPath omitted — no live API docs URL yet
  },
  {
    slug: "developers/webhooks",
    domain: "developers",
    published: true,
    order: 20,
    relatedSlugs: ["developers/developer-center"],
    dashboardLinks: [
      {
        path: "/dashboard/developer/webhook-verification",
        labelKey: "open_webhook_verification",
        primary: true,
      },
      {
        path: "/dashboard/developer",
        labelKey: "open_developer_center",
      },
    ],
    marketingPath: "/developers",
  },
  {
    slug: "developers/payment-channels",
    domain: "developers",
    published: true,
    order: 30,
    relatedSlugs: [
      "getting-started/payment-channel",
      "developers/developer-center",
    ],
    dashboardLinks: [
      {
        path: "/dashboard/configs",
        labelKey: "open_configs",
        primary: true,
      },
    ],
    marketingPath: "/developers",
  },
```

- [ ] **Step 3: Sanity-check reverse map with tsx**

Run:

```bash
npx tsx -e "const { getHelpSlugsForDashboardPath, getPrimaryHelpSlugForDashboardPath } = require('./src/lib/help/dashboard-deep-links.ts'); console.log('configs', getHelpSlugsForDashboardPath('/dashboard/configs'), getPrimaryHelpSlugForDashboardPath('/dashboard/configs')); console.log('developer', getPrimaryHelpSlugForDashboardPath('/dashboard/developer')); console.log('verify', getPrimaryHelpSlugForDashboardPath('/dashboard/developer/webhook-verification'));"
```

Expected:

- `configs` candidates include both `developers/payment-channels` and `getting-started/payment-channel`; **primary** = `developers/payment-channels`
- `developer` primary = `developers/developer-center`
- `verify` primary = `developers/webhooks`

If `tsx`/CJS interop fails, use an equivalent ESM one-liner or temporary script under `/tmp` — do **not** add a `*.test.ts` file.

- [ ] **Step 4: Commit**

```bash
git add src/content/help/manifest.ts
git commit -m "$(cat <<'EOF'
feat(help): register Developers P1 article defs in manifest

EOF
)"
```

---

### Task 3: Render `marketingPath` / `developerPath` in HelpArticleView

**Files:**
- Modify: `src/components/help/HelpArticleView.tsx`
- Modify: `src/components/help/help.module.css`

**Interfaces:**
- Consumes: `article.marketingPath`, `article.developerPath` (already on `HelpArticle`); `Help.outbound.*` keys from Task 1
- Produces: Locale-prefixed outbound links when fields are non-empty strings

- [ ] **Step 1: Add CSS for outbound links**

Append to `help.module.css` (reuse openCta look):

```css
.outboundGroup {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.5rem 0 0;
}

.outboundLink {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  text-decoration: none;
  font-size: 0.95rem;
}

.outboundLink:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}
```

- [ ] **Step 2: Render outbound section in `HelpArticleView`**

After the Related guides section (and before `nextStep`), add:

```tsx
{(article.marketingPath || article.developerPath) ? (
  <section className={styles.section} aria-labelledby="help-outbound">
    <h2 id="help-outbound" className={styles.sectionTitle}>
      {t("outbound.section_title")}
    </h2>
    <div className={styles.outboundGroup}>
      {article.marketingPath ? (
        <Link
          href={`/${locale}${article.marketingPath}`}
          className={styles.outboundLink}
        >
          {t("outbound.marketing")}
        </Link>
      ) : null}
      {article.developerPath ? (
        <Link
          href={
            article.developerPath.startsWith("http")
              ? article.developerPath
              : `/${locale}${article.developerPath}`
          }
          className={styles.outboundLink}
          {...(article.developerPath.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {t("outbound.developer_docs")}
        </Link>
      ) : null}
    </div>
  </section>
) : null}
```

Notes:

- Use `t("outbound.section_title")` / `t("outbound.marketing")` / `t("outbound.developer_docs")` only — **no** hard-coded EN/ZH UI strings in the component.
- `marketingPath` / `developerPath` are approved product/docs targets from the manifest, not free-form content-author URLs. This batch sets `marketingPath: "/developers"` and omits `developerPath`.
- Do **not** invent a `developerPath` value in content — leave unset so only marketing outbound shows for this batch.

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit
```

Expected: PASS (or only pre-existing unrelated errors).

- [ ] **Step 4: Commit**

```bash
git add src/components/help/HelpArticleView.tsx src/components/help/help.module.css
git commit -m "$(cat <<'EOF'
feat(help): render marketingPath and developerPath outbound links

EOF
)"
```

---

### Task 4: EN Developers article bodies + compose

**Files:**
- Create: `src/content/help/en/developers.ts`
- Modify: `src/content/help/article-content.ts`

**Interfaces:**
- Consumes: `HelpArticleContent` type; Design §4.2–4.4 tab map + boundaries
- Produces: `enDevelopers` map with slugs `developers/developer-center`, `developers/webhooks`, `developers/payment-channels`

- [ ] **Step 1: Create `src/content/help/en/developers.ts`**

Write the full file below. Constraints baked into copy: no “CRUD”; no Markdown links; no raw-body/hash/algorithm guidance; Production Access = entry/status/next step only; fictional bare URLs only; payment-channels uses Task 1 audited nav labels (not design-draft guesses); does not duplicate Getting Started checklist.

```ts
import type { HelpArticleContent } from "../article-content";

export const enDevelopers: Record<string, HelpArticleContent> = {
  "developers/developer-center": {
    title: "Use Developer Center in Merchant Center",
    description:
      "Find the right FilixPay Developer Center area—Applications, Sandbox, Explorer, Production Access, Webhooks, and Deliveries—and know when to open each tab.",
    keywords: [
      "FilixPay Developer Center",
      "Merchant Center developers",
      "applications",
      "sandbox",
      "API explorer",
      "production access",
      "webhooks tab",
    ],
    body: {
      whoFor:
        "Technical merchants and integrators who need to locate Developer Center features in FilixPay Merchant Center without reading API reference docs here.",
      whenToUse:
        "Use this when you open Developer Center for the first time, or when you need a map of which tab to use before configuring webhooks or payment channels.",
      beforeYouStart: [
        "Sign in to FilixPay Merchant Center with a role that can open Developer Center.",
        "Confirm you are in the correct organization / business account.",
        "For API calling details, plan to use Marketing Developers or API docs — this guide covers UI navigation only.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Developer Center is the Merchant Center home for integration UI: applications, sandbox testing, API exploration, production access entry, webhooks, and delivery history. This guide is a map (what / where / when). Step-by-step webhook endpoint work lives in the Webhooks guide; ongoing payment channel configuration lives in Payment channels.",
        },
        {
          type: "heading",
          text: "Open Developer Center",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Open Developer from the dashboard navigation (footer / developer entry).",
            "Use the tabs across the top of Developer Center to move between areas.",
          ],
        },
        {
          type: "heading",
          text: "Tab map",
          anchor: "tab-map",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Applications — What",
              description: "Manage applications used for integration credentials.",
            },
            {
              field: "Applications — Where",
              description: "Developer Center → Applications",
            },
            {
              field: "Applications — When",
              description: "Creating or managing apps before sandbox or production work.",
            },
            {
              field: "Sandbox — What",
              description: "Test environment for integration trials.",
            },
            {
              field: "Sandbox — Where",
              description: "Developer Center → Sandbox",
            },
            {
              field: "Sandbox — When",
              description: "Running integration tests with sandbox credentials.",
            },
            {
              field: "Explorer — What",
              description: "Explore and try API calls from the UI.",
            },
            {
              field: "Explorer — Where",
              description: "Developer Center → Explorer",
            },
            {
              field: "Explorer — When",
              description: "Debugging or exploring APIs without leaving Merchant Center.",
            },
            {
              field: "Production Access — What",
              description:
                "Entry point and status for production access in Developer Center (not a policy handbook).",
            },
            {
              field: "Production Access — Where",
              description: "Developer Center → Production Access",
            },
            {
              field: "Production Access — When",
              description:
                "When you are preparing to go live and need to open the production access entry, read on-screen status, and follow the next step the UI shows.",
            },
            {
              field: "Webhooks — What",
              description:
                "Overview of webhook management. Full create / view / enable-disable / delete steps are in the Webhooks guide.",
            },
            {
              field: "Webhooks — Where",
              description: "Developer Center → Webhooks",
            },
            {
              field: "Webhooks — When",
              description: "Configuring event notifications to your endpoint.",
            },
            {
              field: "Deliveries — What",
              description:
                "Overview of webhook delivery history. Troubleshooting steps are in the Webhooks guide.",
            },
            {
              field: "Deliveries — Where",
              description: "Developer Center → Deliveries",
            },
            {
              field: "Deliveries — When",
              description: "Checking whether webhook events were delivered successfully.",
            },
          ],
        },
        {
          type: "heading",
          text: "Production Access boundary",
          anchor: "production-access",
        },
        {
          type: "paragraph",
          text: "On Production Access, use the UI to find the entry, read the status shown, and follow the next step Merchant Center presents. Help does not document approval criteria, review timelines, or eligibility rules — those can change and are shown in-product when relevant.",
        },
        {
          type: "heading",
          text: "Common issues",
          anchor: "common-issues",
        },
        {
          type: "issues",
          items: [
            {
              problem: "I cannot see Developer Center or some tabs.",
              solution:
                "Confirm you signed into the correct organization and that your role includes developer permissions. Refresh the page after switching accounts.",
            },
            {
              problem: "I need API payloads or SDK samples.",
              solution:
                "Stay on this guide for UI navigation only. Use FilixPay for developers (Marketing) for product context, and API docs when they are available — do not expect Help to replace developer documentation.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Manage webhooks in Merchant Center",
        href: "/help/developers/webhooks",
      },
    },
  },

  "developers/webhooks": {
    title: "Manage and verify webhooks in Merchant Center",
    description:
      "Create, view, enable or disable, and delete FilixPay webhook endpoints; review deliveries; and use the webhook verification page in Merchant Center.",
    keywords: [
      "FilixPay webhook Merchant Center",
      "webhook endpoint",
      "webhook deliveries",
      "webhook verification",
      "enable disable webhook",
    ],
    body: {
      whoFor:
        "Operators and developers who configure webhook endpoints and check deliveries inside FilixPay Merchant Center.",
      whenToUse:
        "Use this when you add or change a webhook endpoint, inspect deliveries, redeliver an event, or open the webhook signature verification help page.",
      beforeYouStart: [
        "Open Developer Center and confirm you can access the Webhooks and Deliveries tabs.",
        "Have an HTTPS endpoint URL ready (examples in Help use https://api.example.com/webhook only).",
        "Store any webhook secret in your own secure vault — never paste real secrets into tickets or public repos.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "This guide covers Merchant Center UI for webhook endpoints, deliveries, and the verification page. It does not document event schemas, signing algorithms, or signature implementation details. Fictional placeholder URLs such as https://api.example.com/webhook may appear as plain text only.",
        },
        {
          type: "heading",
          text: "Create, view, enable/disable, and delete endpoints",
          anchor: "endpoints",
        },
        {
          type: "steps",
          items: [
            "Open Developer Center → Webhooks.",
            "Choose create / add endpoint, then enter your HTTPS URL (for demos use https://api.example.com/webhook).",
            "Save and confirm the endpoint appears in the list with its status.",
            "Open an endpoint to view details.",
            "Enable or disable the endpoint from the UI when you need to pause or resume notifications without deleting it.",
            "Delete an endpoint only when you no longer need that URL; confirm the prompt before removing it.",
          ],
        },
        {
          type: "heading",
          text: "Deliveries and redeliver",
          anchor: "deliveries",
        },
        {
          type: "steps",
          items: [
            "Open Developer Center → Deliveries.",
            "Scan recent delivery attempts and status.",
            "Open a delivery for detail when troubleshooting.",
            "Use Redeliver when the UI offers it after you fix your endpoint.",
          ],
        },
        {
          type: "heading",
          text: "Webhook verification page",
          anchor: "verification",
        },
        {
          type: "steps",
          items: [
            "Open Webhook Verification from Developer Center (or use Open in Merchant Center from this guide).",
            "Read the on-page checklist for verifying signatures in your own service.",
            "Follow that page’s guidance in your integration. Help does not document signature implementation details.",
          ],
        },
        {
          type: "heading",
          text: "Common issues",
          anchor: "common-issues",
        },
        {
          type: "issues",
          items: [
            {
              problem: "Endpoint shows inactive or disabled.",
              solution:
                "Open the endpoint in Webhooks and enable it. Confirm the URL is HTTPS and reachable from the public internet.",
            },
            {
              problem: "Verification failed on my server.",
              solution:
                "Compare your implementation with the Webhook Verification page checklist. If verification still fails, review the verification guidance and your integration implementation in the developer documentation. Help does not document signature implementation details.",
            },
            {
              problem: "Delivery failed repeatedly.",
              solution:
                "Check Deliveries for status detail, fix your endpoint response, then use Redeliver. Confirm the endpoint is enabled.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Back to Developer Center map",
        href: "/help/developers/developer-center",
      },
    },
  },

  "developers/payment-channels": {
    title: "Manage payment channel configuration in Merchant Center",
    description:
      "Open Payment Configs in FilixPay Merchant Center to add, edit, and view payment channel configurations for ongoing operations.",
    keywords: [
      "FilixPay payment channel configuration",
      "payment configs",
      "acquiring settings",
      "manage payment channel",
      "Merchant Center configs",
    ],
    body: {
      whoFor:
        "Merchants who already configured (or are maintaining) payment channels and need the ongoing Merchant Center UI guide—not first-time activation alone.",
      whenToUse:
        "Use this when you return to Payment Configs to add, edit, open/close, or review channel configurations during normal operations.",
      beforeYouStart: [
        "Confirm access to Transactions → Acquiring Settings → Payment Configs.",
        "Have provider credentials ready (use placeholders such as sk_test_placeholder in examples — never commit real secrets).",
        "If you have never added a channel, skim Getting Started → Configure your first payment channel first, then return here for ongoing management.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Payment Configs is the Merchant Center UI for channel configuration. This article covers ongoing manage/configure tasks. First-time activation steps stay in Getting Started; do not treat this page as a duplicate onboarding checklist.",
        },
        {
          type: "heading",
          text: "Open Payment Configs",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Go to Transactions → Acquiring Settings → Payment Configs (or use Open in Merchant Center).",
            "Review scenario cards and existing channel rows before making changes.",
          ],
        },
        {
          type: "heading",
          text: "Add, edit, and view channel config",
          anchor: "manage",
        },
        {
          type: "steps",
          items: [
            "Choose Add Configuration (or Add channel on a scenario card) to create a new row.",
            "Select payment brand, channel, scenario, and sub-merchant as required by the form.",
            "Enter credentials from your provider, then save. Obtain credentials from your provider’s dashboard; Help will not walk third-party UIs field-by-field.",
            "Open an existing row to view or edit settings.",
            "Use Open / Close controls when you need routing on or off without deleting the configuration.",
          ],
        },
        {
          type: "heading",
          text: "Key fields (UI level)",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Payment brand / channel",
              description: "Which acquiring rail this configuration targets.",
            },
            {
              field: "Scenario / sub-merchant",
              description: "Scope of where the configuration applies in Merchant Center.",
            },
            {
              field: "Credentials",
              description:
                "Provider keys or secrets entered in the form. Use test placeholders in non-production; never publish real secrets.",
            },
            {
              field: "Open / Close",
              description: "Whether the channel is available for routing.",
            },
          ],
        },
        {
          type: "heading",
          text: "Common issues",
          anchor: "common-issues",
        },
        {
          type: "issues",
          items: [
            {
              problem: "Save failed or validation blocked submit.",
              solution:
                "Fix required fields shown on the form. Confirm scenario and sub-merchant selections, then save again.",
            },
            {
              problem: "Missing credentials or channel will not open.",
              solution:
                "Obtain credentials from your payment provider, paste them carefully (no extra spaces), save, then set the channel to Open.",
            },
            {
              problem: "I still need first-time activation guidance.",
              solution:
                "Open the Getting Started payment channel guide linked under Related guides, complete first setup there, then return here for day-to-day changes.",
            },
          ],
        },
      ],
      nextStep: {
        label: "First-time payment channel setup",
        href: "/help/getting-started/payment-channel",
      },
    },
  },
};
```

- [ ] **Step 2: Compose into `article-content.ts`**

```ts
import { enDevelopers } from "./en/developers";
// ...
  en: {
    ...enGettingStarted,
    ...enPayments,
    ...enFunds,
    ...enRisk,
    ...enCommerce,
    ...enDevelopers,
  },
```

(Do not wire ZH yet — Task 5.)

- [ ] **Step 3: Sanity — EN articles load**

```bash
npx tsx -e "const { getHelpArticle, listHelpArticles } = require('./src/content/help/loaders.ts'); const list = listHelpArticles('en', { domain: 'developers', publishedOnly: true }); console.log(list.map(a => a.slug)); console.log(!!getHelpArticle('en','developers/webhooks')?.body);"
```

Expected: three slugs printed; webhooks body truthy.

- [ ] **Step 4: Commit**

```bash
git add src/content/help/en/developers.ts src/content/help/article-content.ts
git commit -m "$(cat <<'EOF'
feat(help): add EN Developers P1 guide content

EOF
)"
```

---

### Task 5: ZH Developers article bodies + compose

**Files:**
- Create: `src/content/help/zh/developers.ts`
- Modify: `src/content/help/article-content.ts`

**Interfaces:**
- Consumes: Same three slugs and structure as EN Task 4
- Produces: `zhDevelopers` parity content; both locales composed

- [ ] **Step 1: Create `src/content/help/zh/developers.ts`**

Mirror EN structure with Chinese merchant-facing copy. Keep the same anchors, block types, related boundaries (no “CRUD”; no Markdown links; no raw-body/hash guidance; Production Access 仅入口/状态/下一步; fictional bare `https://api.example.com/webhook`; payment-channels nav uses Task 1 audited ZH labels).

```ts
import type { HelpArticleContent } from "../article-content";

export const zhDevelopers: Record<string, HelpArticleContent> = {
  "developers/developer-center": {
    title: "在商户中心使用开发者中心",
    description:
      "了解 FilixPay 开发者中心各页签（应用、沙箱、Explorer、生产权限、Webhook、投递记录）的用途、入口与使用时机。",
    keywords: [
      "FilixPay 开发者中心",
      "商户中心开发者",
      "应用",
      "沙箱",
      "API Explorer",
      "生产权限",
      "Webhook",
    ],
    body: {
      whoFor:
        "需要在 FilixPay 商户中心定位开发者功能的技术商户与集成人员；本指南不替代 API 文档。",
      whenToUse:
        "首次打开开发者中心，或需要确认应进入哪个页签后再配置 Webhook / 支付渠道时使用。",
      beforeYouStart: [
        "使用具备开发者中心权限的账号登录商户中心。",
        "确认当前组织 / 业务账户正确。",
        "API 调用细节请前往开发者介绍或 API 文档；本指南只讲界面导航。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "开发者中心是商户中心内的集成界面入口：应用、沙箱测试、API 探索、生产权限入口、Webhook 与投递记录。本指南是地图（是什么 / 在哪里 / 何时用）。Webhook 端点的逐步操作见《管理 Webhook》；日常支付渠道配置见《管理支付渠道配置》。",
        },
        {
          type: "heading",
          text: "打开开发者中心",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "从导航中的开发者入口打开开发者中心。",
            "使用顶部页签在不同区域之间切换。",
          ],
        },
        {
          type: "heading",
          text: "页签地图",
          anchor: "tab-map",
        },
        {
          type: "fields",
          rows: [
            {
              field: "应用 — 是什么",
              description: "管理用于集成凭证的应用。",
            },
            {
              field: "应用 — 在哪里",
              description: "开发者中心 → 应用",
            },
            {
              field: "应用 — 何时用",
              description: "创建或管理应用，以便进行沙箱或生产相关操作。",
            },
            {
              field: "沙箱 — 是什么",
              description: "用于联调试验的测试环境。",
            },
            {
              field: "沙箱 — 在哪里",
              description: "开发者中心 → 沙箱",
            },
            {
              field: "沙箱 — 何时用",
              description: "使用沙箱凭证做集成测试时。",
            },
            {
              field: "Explorer — 是什么",
              description: "在界面中探索并尝试 API 调用。",
            },
            {
              field: "Explorer — 在哪里",
              description: "开发者中心 → Explorer",
            },
            {
              field: "Explorer — 何时用",
              description: "调试或探索 API、且希望留在商户中心时。",
            },
            {
              field: "生产权限 — 是什么",
              description:
                "开发者中心中生产权限的入口与状态展示（不是政策说明文档）。",
            },
            {
              field: "生产权限 — 在哪里",
              description: "开发者中心 → 生产权限",
            },
            {
              field: "生产权限 — 何时用",
              description:
                "准备上线时，打开入口、查看界面展示的状态，并按界面提示的下一步操作。",
            },
            {
              field: "Webhooks — 是什么",
              description:
                "Webhook 管理概览。创建、查看、启用/停用和删除的完整步骤见 Webhook 指南。",
            },
            {
              field: "Webhooks — 在哪里",
              description: "开发者中心 → Webhooks",
            },
            {
              field: "Webhooks — 何时用",
              description: "需要配置事件通知到你的接收地址时。",
            },
            {
              field: "投递记录 — 是什么",
              description: "Webhook 投递历史概览。排障步骤见 Webhook 指南。",
            },
            {
              field: "投递记录 — 在哪里",
              description: "开发者中心 → 投递记录",
            },
            {
              field: "投递记录 — 何时用",
              description: "需要确认事件是否投递成功时。",
            },
          ],
        },
        {
          type: "heading",
          text: "生产权限边界",
          anchor: "production-access",
        },
        {
          type: "paragraph",
          text: "在「生产权限」中，请使用界面找到入口、阅读展示的状态，并跟随商户中心给出的下一步。Help 不描述审核条件、审核时效或资格规则——这些可能变化，并以产品内展示为准。",
        },
        {
          type: "heading",
          text: "常见问题",
          anchor: "common-issues",
        },
        {
          type: "issues",
          items: [
            {
              problem: "看不到开发者中心或部分页签。",
              solution:
                "确认已登录正确组织，且角色具备开发者权限。切换账户后刷新页面。",
            },
            {
              problem: "我需要 API 字段或 SDK 示例。",
              solution:
                "本指南只覆盖界面导航。产品介绍请看「FilixPay 开发者介绍」；API 文档就绪后再查阅，不要期望 Help 替代开发者文档。",
            },
          ],
        },
      ],
      nextStep: {
        label: "在商户中心管理 Webhook",
        href: "/help/developers/webhooks",
      },
    },
  },

  "developers/webhooks": {
    title: "在商户中心管理并验证 Webhook",
    description:
      "在 FilixPay 商户中心创建、查看、启用/停用和删除 Webhook Endpoint，查看投递记录，并使用验签说明页。",
    keywords: [
      "FilixPay Webhook 商户中心",
      "Webhook Endpoint",
      "Webhook 投递",
      "Webhook 验签",
      "启用停用 Webhook",
    ],
    body: {
      whoFor: "需要在 FilixPay 商户中心配置 Webhook Endpoint 并查看投递记录的运营与开发人员。",
      whenToUse:
        "新增或变更 Endpoint、检查投递、重新投递，或打开 Webhook 验签说明页时使用。",
      beforeYouStart: [
        "打开开发者中心，确认可访问 Webhooks 与投递记录页签。",
        "准备好 HTTPS 接收地址（示例仅使用 https://api.example.com/webhook）。",
        "将 Webhook secret 保存在自有安全位置——不要把真实 secret 写进工单或公开仓库。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "本指南覆盖商户中心内 Endpoint、投递记录与验签说明页的界面操作。不写事件 schema、签名算法或签名实现细节，也不提供除虚构占位 URL（例如 https://api.example.com/webhook）以外的示例代码。",
        },
        {
          type: "heading",
          text: "创建、查看、启用/停用和删除 Endpoint",
          anchor: "endpoints",
        },
        {
          type: "steps",
          items: [
            "打开 开发者中心 → Webhooks。",
            "选择创建 / 添加 Endpoint，填写 HTTPS URL（演示可用 https://api.example.com/webhook）。",
            "保存并确认列表中出现该 Endpoint 及其状态。",
            "打开 Endpoint 查看详情。",
            "需要暂停或恢复通知时，在界面中启用或停用，而不必删除。",
            "不再需要该 URL 时再删除，并确认提示。",
          ],
        },
        {
          type: "heading",
          text: "投递记录与重新投递",
          anchor: "deliveries",
        },
        {
          type: "steps",
          items: [
            "打开 开发者中心 → 投递记录。",
            "查看近期投递尝试与状态。",
            "排障时打开单条投递详情。",
            "修复接收端后，若界面提供重新投递，再执行重新投递。",
          ],
        },
        {
          type: "heading",
          text: "Webhook 验签说明页",
          anchor: "verification",
        },
        {
          type: "steps",
          items: [
            "从开发者中心打开 Webhook 验签说明（或使用本指南的「在商户中心打开」）。",
            "按页面清单在自有服务中实现验签。",
            "按该页指引完成集成。Help 不写签名实现细节。",
          ],
        },
        {
          type: "heading",
          text: "常见问题",
          anchor: "common-issues",
        },
        {
          type: "issues",
          items: [
            {
              problem: "Endpoint 显示未启用或已停用。",
              solution:
                "在 Webhooks 中打开该 Endpoint 并启用。确认 URL 为 HTTPS 且公网可访问。",
            },
            {
              problem: "我这边验签失败。",
              solution:
                "对照 Webhook 验签说明页检查实现。如果仍然验签失败，请根据开发者文档进一步检查你的集成实现。Help 不写签名实现细节。",
            },
            {
              problem: "投递多次失败。",
              solution:
                "在投递记录中查看状态，修复接收端后重新投递，并确认 Endpoint 已启用。",
            },
          ],
        },
      ],
      nextStep: {
        label: "返回开发者中心地图",
        href: "/help/developers/developer-center",
      },
    },
  },

  "developers/payment-channels": {
    title: "在商户中心管理支付渠道配置",
    description:
      "打开 FilixPay 商户中心支付配置，添加、编辑与查看支付渠道，用于日常运维。",
    keywords: [
      "FilixPay 支付渠道配置",
      "支付配置",
      "收单设置",
      "管理支付渠道",
      "商户中心 configs",
    ],
    body: {
      whoFor:
        "已经完成（或正在维护）支付渠道、需要日常管理界面说明的商户——不只是首次开通。",
      whenToUse:
        "回到支付配置以添加、编辑、开启/关闭或查看渠道配置时使用。",
      beforeYouStart: [
        "确认可访问 交易 → 收单设置 → 支付配置。",
        "准备好渠道方凭证（示例可用 sk_test_placeholder —— 切勿提交真实密钥）。",
        "若从未添加过渠道，先阅读快速开始中的「配置第一个支付渠道」，再回到本文做日常管理。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "支付配置是商户中心管理渠道的界面。本文覆盖日常管理；首次开通步骤保留在快速开始，请勿把本文当成重复的入驻清单。",
        },
        {
          type: "heading",
          text: "打开支付配置",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "进入 交易 → 收单设置 → 支付配置（或使用「在商户中心打开」）。",
            "先查看场景卡片与已有渠道行，再做变更。",
          ],
        },
        {
          type: "heading",
          text: "添加、编辑与查看渠道配置",
          anchor: "manage",
        },
        {
          type: "steps",
          items: [
            "选择添加配置（或在场景卡片上添加渠道）。",
            "按表单要求选择支付品牌、渠道、场景与子商户。",
            "填入从渠道方获取的凭证并保存。向渠道方控制台索取凭证即可；Help 不逐步讲解第三方后台。",
            "打开已有行以查看或编辑。",
            "需要控制是否参与路由时，使用开启/关闭，而不必删除配置。",
          ],
        },
        {
          type: "heading",
          text: "关键字段（界面级）",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "支付品牌 / 渠道",
              description: "该配置对应的收单通道。",
            },
            {
              field: "场景 / 子商户",
              description: "配置在商户中心的作用范围。",
            },
            {
              field: "凭证",
              description:
                "表单中的密钥类字段。非生产环境使用测试占位；切勿公开真实密钥。",
            },
            {
              field: "开启 / 关闭",
              description: "渠道是否可用于路由。",
            },
          ],
        },
        {
          type: "heading",
          text: "常见问题",
          anchor: "common-issues",
        },
        {
          type: "issues",
          items: [
            {
              problem: "保存失败或校验无法提交。",
              solution: "按表单提示补全必填项，确认场景与子商户选择后重试。",
            },
            {
              problem: "缺少凭证或无法开启渠道。",
              solution:
                "从支付服务商获取凭证，仔细粘贴后保存，再将渠道设为开启。",
            },
            {
              problem: "仍需要首次开通指引。",
              solution:
                "打开相关指南中的快速开始支付渠道文章完成首次配置，再回到本文做日常变更。",
            },
          ],
        },
      ],
      nextStep: {
        label: "首次配置支付渠道",
        href: "/help/getting-started/payment-channel",
      },
    },
  },
};
```

- [ ] **Step 2: Compose ZH**

In `article-content.ts`:

```ts
import { zhDevelopers } from "./zh/developers";
// ...
  zh: {
    ...zhGettingStarted,
    ...zhPayments,
    ...zhFunds,
    ...zhRisk,
    ...zhCommerce,
    ...zhDevelopers,
  },
```

- [ ] **Step 3: Verify no “CRUD”, no Markdown links, both locales published**

```bash
npx tsx -e "const { listHelpArticles } = require('./src/content/help/loaders.ts'); for (const loc of ['en','zh']) { const a = listHelpArticles(loc,{domain:'developers'}); console.log(loc, a.length, a.every(x=>x.body)); } const fs=require('fs'); const raw=fs.readFileSync('src/content/help/en/developers.ts','utf8')+fs.readFileSync('src/content/help/zh/developers.ts','utf8'); console.log({ hasCRUD: /CRUD/i.test(raw), hasMdLink: /\[[^\]]+\]\([^)]+\)/.test(raw), hasRawHash: /hash the raw|raw request body|对原始 Body 计算/i.test(raw) });"
```

Expected: `en 3 true`, `zh 3 true`; `hasCRUD` / `hasMdLink` / `hasRawHash` all `false`.

- [ ] **Step 4: Commit**

```bash
git add src/content/help/zh/developers.ts src/content/help/article-content.ts
git commit -m "$(cat <<'EOF'
feat(help): add ZH Developers P1 guide content

EOF
)"
```

---

### Task 6: Dashboard deep links

**Files:**
- Modify: `src/app/[locale]/dashboard/developer/page.tsx`
- Modify: `src/app/[locale]/dashboard/developer/webhook-verification/page.tsx`
- Modify: `src/app/[locale]/dashboard/configs/page.tsx`

**Interfaces:**
- Consumes: `HelpDeepLinkButton` (`dashboardPath`, optional `helpSlug`)
- Produces: Frozen page-level `?` map from Design §5.1 — **one** `?` on `/dashboard/developer`; webhook-verification and configs as specified

- [ ] **Step 1: Configs — explicit helpSlug**

In `configs/page.tsx`, change:

```tsx
<HelpDeepLinkButton dashboardPath="/dashboard/configs" />
```

to:

```tsx
<HelpDeepLinkButton
  dashboardPath="/dashboard/configs"
  helpSlug="developers/payment-channels"
/>
```

- [ ] **Step 2: Developer page — page-level `?` only**

In `developer/page.tsx`:

1. Import `HelpDeepLinkButton`.
2. Pass **exactly one** page-level help control on `DashboardPage` `extra` (**no** tab-dependent logic; **do not** add a second `HelpDeepLinkButton` inside Webhooks/Deliveries tab children in this batch):

```tsx
extra={
  <HelpDeepLinkButton
    dashboardPath="/dashboard/developer"
    helpSlug="developers/developer-center"
  />
}
```

`developers/developer-center` already Related-links to `developers/webhooks`. Explicit tab-level `helpSlug="developers/webhooks"` remains an allowed future capability if a natural help affordance appears — **out of scope for this batch**.

**Do not** change `extra` based on `activeTab`.

- [ ] **Step 3: Webhook verification page**

In `webhook-verification/page.tsx`, import `HelpDeepLinkButton` and put both back-link and help in `extra`:

```tsx
extra={
  <Space>
    <HelpDeepLinkButton
      dashboardPath="/dashboard/developer/webhook-verification"
      helpSlug="developers/webhooks"
    />
    <Link href={`/${locale}/dashboard/developer`}>
      <ArrowLeftOutlined /> Back to Developer Center
    </Link>
  </Space>
}
```

(`Space` is already imported from `antd` on that page.)

- [ ] **Step 4: Typecheck**

```bash
npx tsc --noEmit
```

Expected: PASS for touched files.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/dashboard/developer/page.tsx src/app/[locale]/dashboard/developer/webhook-verification/page.tsx src/app/[locale]/dashboard/configs/page.tsx
git commit -m "$(cat <<'EOF'
feat(help): wire Developers P1 Dashboard help deep links

EOF
)"
```

---

### Task 7: Manual verification + search/sitemap smoke

**Files:**
- None required (read-only verification). Optionally touch nothing.

**Interfaces:**
- Consumes: All prior tasks
- Produces: Verification notes for PR / handoff

- [ ] **Step 1: Routes & category**

With `npm run dev`, verify:

| URL | Expect |
|-----|--------|
| `/en/help/developers` | Lists 3 guides; no empty “coming soon” alone |
| `/zh/help/developers` | Same in ZH |
| `/en/help/developers/developer-center` | 200; tab map; marketing outbound; no CRUD; no Markdown artifacts |
| `/en/help/developers/webhooks` | 200; create/view/enable-disable/delete wording; no signature-implementation details |
| `/en/help/developers/payment-channels` | 200; Related includes Getting Started payment-channel; nav path matches Task 1 audit |
| `/en/help/getting-started/payment-channel` | Related includes Developers payment-channels |

- [ ] **Step 2: SEO — self-canonical, hreflang, BreadcrumbList, outbound**

For `/en/help/developers/developer-center` and `/zh/help/developers/developer-center` (and spot-check the other two slugs):

| Check | Expect |
|-------|--------|
| `<link rel="canonical">` | Self-canonical for that locale URL (never zh → en) |
| hreflang | EN ↔ ZH only for published locales; **no** es/ja/fr/de/… Help alternates |
| JSON-LD BreadcrumbList | Present and sane (Home → Help → Developers → article) |
| Outbound | Marketing link to `/{locale}/developers`; **no** `developerPath` link |

- [ ] **Step 3: Deep links + tab-switch freeze**

| Surface | Expect Help target |
|---------|-------------------|
| `/en/dashboard/developer` page-level `?` | `/en/help/developers/developer-center` |
| Switch Applications / Sandbox / Explorer / Production Access / Webhooks / Deliveries | Page-level `?` **still** → `developer-center` (never changes by tab) |
| Count of `HelpDeepLinkButton` on developer page | **Exactly one** (page-level only) |
| `/en/dashboard/developer/webhook-verification` `?` | `/en/help/developers/webhooks` |
| `/en/dashboard/configs` `?` | `/en/help/developers/payment-channels` |

- [ ] **Step 4: Search + sitemap + published-only (`payments/checkouts`)**

```bash
npx tsx -e "const { searchHelpArticles } = require('./src/content/help/search.ts'); const { getHelpArticle } = require('./src/content/help/loaders.ts'); console.log('webhook', searchHelpArticles('en','webhook').map(h=>h.slug)); console.log('checkouts search', searchHelpArticles('en','checkouts').map(h=>h.slug)); console.log('checkouts article', getHelpArticle('en','payments/checkouts'));"
```

Expected:

- search includes `developers/webhooks` / `developers/payment-channels` as appropriate
- `payments/checkouts` **not** in search hits; `getHelpArticle(..., 'payments/checkouts')` → `null`

Also verify in browser / sitemap:

| Check | Expect |
|-------|--------|
| `/en/sitemap.xml` (and zh entries) | Three Developers article URLs present for en+zh |
| `payments/checkouts` in sitemap | **Absent** |
| `/en/help/payments/checkouts` | **404** |
| Help category/nav | Checkouts not listed as a published guide |

- [ ] **Step 5: Final static checks**

```bash
npm run verify:messages
npx tsc --noEmit
```

```bash
npx tsx -e "const fs=require('fs'); const p=['src/content/help/en/developers.ts','src/content/help/zh/developers.ts']; for (const f of p){ const t=fs.readFileSync(f,'utf8'); console.log(f, { CRUD:/CRUD/i.test(t), mdLink:/\[[^\]]+\]\([^)]+\)/.test(t), rawHash:/hash the raw|raw request body|对原始 Body 计算/i.test(t) }); }"
```

Expected: all flags `false`.

- [ ] **Step 6: Commit docs status only if needed**

If design/plan status lines still need alignment, update and commit:

```bash
git add docs/superpowers/specs/2026-09-06-merchant-help-p1-developers-design.md docs/superpowers/plans/2026-09-06-merchant-help-p1-developers.md docs/superpowers/specs/2026-09-05-merchant-help-system-design.md
git commit -m "$(cat <<'EOF'
docs(help): add Developers P1 plan and mark design approved for execution

EOF
)"
```

(Include the already-unstaged V1 P1 sequencing amendment if still uncommitted.)

---

## Self-review (author checklist)

| Spec requirement | Task |
|------------------|------|
| Three Level-A guides EN+ZH | 4, 5 |
| Category no longer empty | 2 + 4/5 (published list) |
| Page-level `?` developer → developer-center; never by Tab | 6, 7 |
| No forced second `?` on Webhooks tab | 6 (explicitly out of batch) |
| webhook-verification → webhooks | 6 |
| configs `?` → payment-channels + Getting Started keeps CTA link | 2, 6 |
| Payment Configs nav from HEAD audit | 1 → 4, 5 |
| Plain text only (no Markdown links) | Global, 4, 5, 7 |
| No signature implementation details (raw body/hash/algorithm) | Global, 4, 5, 7 |
| No CRUD in copy | 4, 5, 7 |
| Production Access boundary | 4, 5 |
| marketingPath set; developerPath omitted; i18n section title | 1, 2, 3 |
| SEO self-canonical + EN↔ZH hreflang only + BreadcrumbList | 7 |
| `payments/checkouts` published-only regressions | 7 |
| No architecture redesign | Global + all tasks |
| No agent unit tests | Global; verify via tsc / tsx / manual |
| Credit / other P1 excluded | Global |

**Placeholder scan:** No TBD / “similar to Task N” without inlined code.  
**Type consistency:** `helpSlug` strings match manifest slugs; `labelKey`s match Task 1 message keys; `marketingPath: "/developers"`; outbound uses `Help.outbound.section_title`.

## Frozen rules (execution)

| Item | Rule |
|------|------|
| Developer Center | Map / What / Where / When |
| Developer `?` | Always `developer-center` |
| Webhooks | Independent Level-A |
| Webhook verification | → `webhooks` |
| Configs `?` | → `payment-channels` |
| Getting Started payment channel | Keeps Open-in-MC; does not win configs generic `?` |
| Second Webhooks `?` | Allowed capability; **not** required this batch |
| Webhook signature impl | No raw body / hash / algorithm details in Help |
| Markdown in typed text | Forbidden |
| Production Access | Entry / Status / Next step |
| Payment channels | UI-only; nav labels from HEAD |
| `developerPath` | Omit this batch |
| Marketing | `/developers` |
| EN/ZH | Full parity |
| Other locales | Message keys only if parity requires |
| Tests | No new test files |
| Credit | Out of batch |