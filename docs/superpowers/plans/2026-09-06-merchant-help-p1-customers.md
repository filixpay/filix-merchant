# Merchant Help P1 — Customers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish one Level-A Payments Help guide `payments/customers` in EN+ZH and wire Dashboard `?` on `/dashboard/customers` — without changing Help architecture.

**Architecture:** Reuse typed content + manifest + loaders + search + sitemap + `HelpDeepLinkButton`. Append the article to existing `en/payments.ts` / `zh/payments.ts`, register one manifest def, add `open_customers` i18n, and mount a single page-level deep link.

**Tech Stack:** Next.js App Router, TypeScript, next-intl, existing Help content model

**Spec:** `docs/superpowers/specs/2026-09-06-merchant-help-p1-customers-design.md`  
**Parent:** `docs/superpowers/specs/2026-09-05-merchant-help-system-design.md`

## Global Constraints

- **Content + wiring only.** Do not redesign typed content, SEO, search, sitemap, or deep-link architecture.
- Help = Merchant Center **UI** how-to. No Customer API, SDK, or CRM product narrative.
- **Typed Help text is plain text only.** Never embed Markdown link syntax (`[label](url)`).
- Faithful to HEAD Customers UI: **list + filter + in-row fields only** — no inventing a detail page, create/edit, or row click-through.
- Filter third field = **Phone** / **电话**; table column = **Mobile** / **手机号** — keep names distinct.
- Page-level `?` on `/dashboard/customers` → `payments/customers` (exactly one button).
- Related: `payments/orders` only (bidirectional recommended). Omit `marketingPath` / `developerPath`.
- **Navigation / labels SSOT = Dashboard HEAD.** Re-audit before writing copy; use live `Customers.*` and `Layout.nav.customers` strings.
- Examples: `customer@example.com`, `13800138000`, fictional codes only (AGENTS.md).
- Per `AGENTS.md`: agents must **not** create or modify `*.test.ts` / `*.test.tsx`. Verify with `npx tsc --noEmit`, `npm run verify:messages`, optional `npx tsx`, manual checks.
- Do not pull Credit, payment-splits, or other P1 batches into this plan.
- `payments/checkouts` stays `published: false`.

## File structure

| File | Responsibility |
|------|----------------|
| `docs/superpowers/specs/2026-09-05-merchant-help-p0-slug-map.md` | P1 Customers amendment note |
| `messages/en.json`, `messages/zh.json` (+ other locales if verify requires) | `Help.dashboardLinks.open_customers` |
| `src/content/help/manifest.ts` | Register `payments/customers`; update `payments/orders` relatedSlugs |
| `src/content/help/en/payments.ts` | EN body for `payments/customers` |
| `src/content/help/zh/payments.ts` | ZH body (parity) |
| `src/app/[locale]/dashboard/customers/page.tsx` | Page-level `HelpDeepLinkButton` |

---

### Task 1: Slug-map amendment + i18n + HEAD label lock

**Files:**
- Modify: `docs/superpowers/specs/2026-09-05-merchant-help-p0-slug-map.md`
- Modify: `messages/en.json`, `messages/zh.json` (+ other locales only if `verify:messages` fails)

**Interfaces:**
- Produces: `Help.dashboardLinks.open_customers`; locked EN/ZH UI strings for Tasks 3–4

- [ ] **Step 1: Re-audit Customers labels from HEAD**

```bash
npx tsx -e "const en=require('./messages/en.json'); const zh=require('./messages/zh.json'); console.log({ enNav: en.Layout.nav.customers, zhNav: zh.Layout.nav.customers, enTitle: en.Customers.title, zhTitle: zh.Customers.title, enPhone: en.Customers.headers.phone, enMobile: en.Customers.headers.mobile, zhPhone: zh.Customers.headers.phone, zhMobile: zh.Customers.headers.mobile });"
```

Confirm `dashboard-menu.tsx` still has top-level `/dashboard/customers` and `customers/page.tsx` has no detail route.

**Locked at plan time (2026-09-06) — re-confirm; if drifted, use live values:**

| Locale | Nav | Page title | Filter 3 | Column mobile |
|--------|-----|------------|----------|---------------|
| EN | Customers | Customer Management | Phone | Mobile |
| ZH | 客户 | 客户 | 电话 | 手机号 |

- [ ] **Step 2: Append slug-map amendment**

Add to end of `docs/superpowers/specs/2026-09-05-merchant-help-p0-slug-map.md`:

```markdown
## P1 amendment (2026-09-06) — Customers batch

| Dashboard path | Page-level `?` after P1 | Notes |
|----------------|-------------------------|-------|
| `/dashboard/customers` | `payments/customers` | New published guide; single page-level `?` |

Credit domain skipped this cycle. Spec: `docs/superpowers/specs/2026-09-06-merchant-help-p1-customers-design.md`
```

- [ ] **Step 3: Add message keys**

EN `Help.dashboardLinks.open_customers`: `Open Customers`  
ZH: `打开客户`

- [ ] **Step 4: `npm run verify:messages`** — PASS; add EN placeholders to other locales only if required.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/specs/2026-09-05-merchant-help-p0-slug-map.md messages
git commit -m "docs(help): amend slug map and add Customers Help i18n keys"
```

---

### Task 2: Manifest registration

**Files:**
- Modify: `src/content/help/manifest.ts`

- [ ] **Step 1: Add `payments/customers` def** (after offline-collection; before checkouts is fine):

```ts
  {
    slug: "payments/customers",
    domain: "payments",
    published: true,
    order: 30,
    relatedSlugs: ["payments/orders"],
    dashboardLinks: [
      {
        path: "/dashboard/customers",
        labelKey: "open_customers",
        primary: true,
      },
    ],
    // marketingPath / developerPath omitted
  },
```

- [ ] **Step 2: Update `payments/orders`**

Set `relatedSlugs: ["payments/customers"]` (or append if other related already exist).

- [ ] **Step 3: Sanity**

```bash
npx tsx -e "const { getPrimaryHelpSlugForDashboardPath } = require('./src/lib/help/dashboard-deep-links.ts'); console.log(getPrimaryHelpSlugForDashboardPath('/dashboard/customers'));"
```

Expected: `payments/customers` (after content exists may still resolve from manifest primary; if content missing, slug still maps).

- [ ] **Step 4: Commit**

```bash
git add src/content/help/manifest.ts
git commit -m "feat(help): register payments/customers article def"
```

---

### Task 3: EN content

**Files:**
- Modify: `src/content/help/en/payments.ts`

- [ ] **Step 1: Append EN article** (use Task 1 locked labels):

```ts
  "payments/customers": {
    title: "Find customers in Merchant Center",
    description:
      "Open Customer Management in FilixPay Merchant Center to review the customer list and search by customer code, email, or phone.",
    keywords: [
      "FilixPay customers Merchant Center",
      "customer list",
      "find customer by email",
      "customer code",
      "customer phone search",
    ],
    body: {
      whoFor:
        "Operators who need to locate an existing customer record in FilixPay Merchant Center using the Customers list and filters.",
      whenToUse:
        "Use this when you need to find a customer by code, email, or phone, or review customer fields shown on the list.",
      beforeYouStart: [
        "Sign in to FilixPay Merchant Center with access to Customers.",
        "Have at least one identifier ready when searching (customer code, email such as customer@example.com, or phone such as 13800138000).",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Customers (page title: Customer Management) is the Merchant Center list for viewing customer records. This guide covers opening the list, reading row fields, and searching. It does not cover creating or editing customers, Customer APIs, or a separate detail page — those are not part of this screen.",
        },
        {
          type: "heading",
          text: "Open the customer list",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Open Customers from the sidebar.",
            "Confirm the page title Customer Management and the filter bar above the table.",
          ],
        },
        {
          type: "heading",
          text: "Review customer records on the list",
          anchor: "list",
        },
        {
          type: "paragraph",
          text: "Customer records appear as table rows. There is no separate customer detail page on this screen — read the fields shown in each row.",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Customer Code",
              description: "Unique customer code shown in the list.",
            },
            {
              field: "Name",
              description: "Customer display name.",
            },
            {
              field: "Email",
              description: "Email address on the record.",
            },
            {
              field: "Mobile",
              description: "Mobile number column on the table (label Mobile).",
            },
            {
              field: "Status",
              description: "Customer status badge as shown in Merchant Center.",
            },
            {
              field: "Created At",
              description: "When the customer record was created.",
            },
          ],
        },
        {
          type: "heading",
          text: "Search by code, email, or phone",
          anchor: "search",
        },
        {
          type: "steps",
          items: [
            "In the filter bar, enter Customer Code, Email, and/or Phone as needed. The Phone filter placeholder is Phone (distinct from the Mobile table column).",
            "Choose Search to apply filters. Empty fields are ignored.",
            "When multiple fields are filled, Merchant Center applies the provided filters together.",
            "Choose Reset to clear filters and return to the unfiltered list.",
            "Use pagination controls to move through results.",
          ],
        },
        {
          type: "heading",
          text: "Common scenarios",
          anchor: "scenarios",
        },
        {
          type: "steps",
          items: [
            "Known email: enter Email (for example customer@example.com), then Search.",
            "Known phone: enter Phone (for example 13800138000), then Search.",
            "Known customer code: enter Customer Code, then Search.",
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
              problem: "No customer data found.",
              solution:
                "Confirm you are in the correct organization or business account, clear filters with Reset, then Search again. If the list is still empty, no customers are available for this account yet.",
            },
            {
              problem: "Search returns no matching rows.",
              solution:
                "Check spelling and extra spaces. Try one identifier at a time. Remember the filter uses Phone while the table column is labeled Mobile.",
            },
            {
              problem: "I expected a customer detail page.",
              solution:
                "This Merchant Center screen shows records in the table only. Use the row fields for review. A separate detail route is not part of this UI.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Review payments and orders",
        href: "/help/payments/orders",
      },
    },
  },
```

- [ ] **Step 2: Sanity** — `getHelpArticle('en','payments/customers')` has body; no CRUD / Markdown / invented detail page.

- [ ] **Step 3: Commit**

```bash
git add src/content/help/en/payments.ts
git commit -m "feat(help): add EN payments/customers guide"
```

---

### Task 4: ZH content

**Files:**
- Modify: `src/content/help/zh/payments.ts`

- [ ] **Step 1: Append ZH parity article**

```ts
  "payments/customers": {
    title: "在商户中心查找客户",
    description:
      "打开 FilixPay 商户中心的客户页，查看客户列表，并按客户号、邮箱或电话筛选。",
    keywords: [
      "FilixPay 客户 商户中心",
      "客户列表",
      "按邮箱查找客户",
      "客户号",
      "电话筛选客户",
    ],
    body: {
      whoFor: "需要在 FilixPay 商户中心用客户列表与筛选条件定位已有客户记录的运营人员。",
      whenToUse: "当你需要按客户号、邮箱或电话查找客户，或查看列表中展示的客户字段时使用。",
      beforeYouStart: [
        "使用具备「客户」权限的账号登录商户中心。",
        "搜索时准备至少一个标识（客户号、邮箱如 customer@example.com、或电话如 13800138000）。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "侧栏「客户」对应页面标题为「客户」。本指南覆盖打开列表、阅读行内字段与筛选。不覆盖创建/编辑客户、Customer API，也不描述单独的详情页——当前界面没有这些能力。",
        },
        {
          type: "heading",
          text: "打开客户列表",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "在侧栏打开「客户」。",
            "确认页面标题为「客户」，表格上方有筛选栏。",
          ],
        },
        {
          type: "heading",
          text: "在列表中查看客户记录",
          anchor: "list",
        },
        {
          type: "paragraph",
          text: "客户记录以表格行展示。本页没有单独的客户详情页——请直接阅读行内字段。",
        },
        {
          type: "fields",
          rows: [
            { field: "客户号", description: "列表中的客户唯一编号。" },
            { field: "姓名", description: "客户显示名称。" },
            { field: "邮箱", description: "记录上的邮箱。" },
            { field: "手机号", description: "表格中的手机号列（标签为「手机号」）。" },
            { field: "客户状态", description: "商户中心展示的状态徽标。" },
            { field: "创建时间", description: "客户记录创建时间。" },
          ],
        },
        {
          type: "heading",
          text: "按客户号、邮箱或电话搜索",
          anchor: "search",
        },
        {
          type: "steps",
          items: [
            "在筛选栏按需填写客户号、邮箱和/或电话。电话筛选项占位为「电话」（与表格列「手机号」不同）。",
            "点击「查询」应用筛选；留空的字段不会参与筛选。",
            "同时填写多个字段时，商户中心会一并应用这些条件。",
            "点击「重置」清空筛选并回到未筛选列表。",
            "使用分页浏览结果。",
          ],
        },
        {
          type: "heading",
          text: "常见场景",
          anchor: "scenarios",
        },
        {
          type: "steps",
          items: [
            "已知邮箱：填写邮箱（例如 customer@example.com），再查询。",
            "已知电话：填写电话（例如 13800138000），再查询。",
            "已知客户号：填写客户号，再查询。",
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
              problem: "提示暂无客户数据。",
              solution:
                "确认当前组织/业务账户正确，先重置筛选再查询。若仍为空，说明该账户下尚无客户记录。",
            },
            {
              problem: "查询后没有匹配行。",
              solution:
                "检查拼写与多余空格，可先只填一个条件。注意筛选项是「电话」，表格列名是「手机号」。",
            },
            {
              problem: "我以为会有客户详情页。",
              solution:
                "当前商户中心此页仅在表格中展示记录。请使用行内字段查看；本 UI 不含单独详情路由。",
            },
          ],
        },
      ],
      nextStep: {
        label: "查看支付与订单",
        href: "/help/payments/orders",
      },
    },
  },
```

- [ ] **Step 2: Verify both locales**

```bash
npx tsx -e "const { getHelpArticle } = require('./src/content/help/loaders.ts'); const fs=require('fs'); for (const loc of ['en','zh']) console.log(loc, !!getHelpArticle(loc,'payments/customers')?.body); const raw=fs.readFileSync('src/content/help/en/payments.ts','utf8')+fs.readFileSync('src/content/help/zh/payments.ts','utf8'); console.log({ md:/\[[^\]]+\]\([^)]+\)/.test(raw), detailPage:/customers\/\[id\]|Open customer detail/i.test(raw) });"
```

- [ ] **Step 3: Commit**

```bash
git add src/content/help/zh/payments.ts
git commit -m "feat(help): add ZH payments/customers guide"
```

---

### Task 5: Dashboard deep link

**Files:**
- Modify: `src/app/[locale]/dashboard/customers/page.tsx`

- [ ] **Step 1: Import and mount single page-level `?`**

```tsx
import { HelpDeepLinkButton } from "@/components/help/HelpDeepLinkButton";

// In DashboardPage props:
extra={
  <HelpDeepLinkButton
    dashboardPath="/dashboard/customers"
    helpSlug="payments/customers"
  />
}
```

If `filterBar` / other `extra` composition is needed, keep **exactly one** `HelpDeepLinkButton`.

- [ ] **Step 2: `npx tsc --noEmit`**

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/dashboard/customers/page.tsx
git commit -m "feat(help): wire Customers Dashboard help deep link"
```

---

### Task 6: Verification

- [ ] **Step 1: Routes** — `/en|zh/help/payments/customers` load; Payments category lists guide; Related ↔ Orders.

- [ ] **Step 2: SEO** — self-canonical; EN↔ZH hreflang only; BreadcrumbList; no `marketingPath` outbound required.

- [ ] **Step 3: Deep link** — `/dashboard/customers` `?` → `payments/customers`.

- [ ] **Step 4: published-only** — `payments/checkouts` still 404 / absent from search+sitemap.

- [ ] **Step 5: Static hygiene**

```bash
npm run verify:messages
npx tsc --noEmit
```

- [ ] **Step 6: Commit docs if status lines still need alignment** (design/plan already on disk).

---

## Self-review checklist

| Spec requirement | Task |
|------------------|------|
| One Level-A EN+ZH | 3, 4 |
| No detail-page invent | 3, 4, Global |
| Phone vs Mobile naming | 1, 3, 4 |
| `?` → payments/customers | 5 |
| Related orders only | 2 |
| No Credit / payment-splits | Global |
| No Markdown / API | Global, 6 |
| No new tests | Global |

## Frozen rules

| Item | Rule |
|------|------|
| Slug | `payments/customers` |
| Dashboard | `/dashboard/customers` |
| View records | In-table fields only |
| Filter 3 | Phone / 电话 |
| Column | Mobile / 手机号 |
| Related | `payments/orders` |
| Outbound paths | Omit |
| Next P1 | payment-splits |
| Credit | Still skipped |
