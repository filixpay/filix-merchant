# Merchant Help P1 — Payment Splits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `payments/payment-splits` Level-A Help (EN+ZH) and wire Dashboard `?` on `/dashboard/payment-splits`.

**Architecture:** Reuse Help stack. Append to `en/payments.ts` / `zh/payments.ts`; one manifest def; one `HelpDeepLinkButton`.

**Spec:** `docs/superpowers/specs/2026-09-06-merchant-help-p1-payment-splits-design.md`

## Global Constraints

- Content + wiring only; no architecture redesign.
- UI how-to only; no split-rule config, API, or settlement-mode handbook (FAQ one-liner for missing menu OK).
- Plain text only — no Markdown links.
- Detail = **modal**, not a detail route.
- Filter = Trade No only.
- Exactly one page-level `?` → `payments/payment-splits`.
- Related: `payments/orders` bidirectional; omit outbound paths.
- Labels SSOT = HEAD audit; fictional examples only.
- No `*.test.ts(x)` from agents; `tsc` + `verify:messages` + tsx smoke.
- Do not pull Credit or other P1 batches; checkouts stay unpublished.

## File structure

| File | Responsibility |
|------|----------------|
| `docs/superpowers/specs/2026-09-05-merchant-help-p0-slug-map.md` | P1 payment-splits amendment |
| `messages/en.json`, `messages/zh.json` | `Help.dashboardLinks.open_payment_splits` |
| `src/content/help/manifest.ts` | Register article; Related ↔ orders |
| `src/content/help/en/payments.ts` | EN body |
| `src/content/help/zh/payments.ts` | ZH body |
| `src/app/[locale]/dashboard/payment-splits/page.tsx` | Deep link |

---

### Task 1: Slug-map + i18n + HEAD lock

- [ ] **Step 1: Audit labels**

```bash
npx tsx -e "const en=require('./messages/en.json'); const zh=require('./messages/zh.json'); console.log({ enNav: en.Layout.nav.split_payment_records, zhNav: zh.Layout.nav.split_payment_records, enTitle: en.PaymentSplits.title, zhTitle: zh.PaymentSplits.title, enTrade: en.PaymentSplits.headers.trade_no, zhTrade: zh.PaymentSplits.headers.trade_no });"
```

Confirm menu gated by `isDirectSettlement`; page has tradeNo filter + details modal.

**Locked at plan time:**

| Locale | Nav | Title | Filter |
|--------|-----|-------|--------|
| EN | Split Payment Records | Payment Splits | Trade No |
| ZH | 分账记录 | 分账记录 | 流水号 |

- [ ] **Step 2: Append slug-map amendment**

```markdown
## P1 amendment (2026-09-06) — Payment Splits batch

| Dashboard path | Page-level `?` | Notes |
|----------------|----------------|-------|
| `/dashboard/payment-splits` | `payments/payment-splits` | Menu may be hidden unless direct settlement |

Spec: `docs/superpowers/specs/2026-09-06-merchant-help-p1-payment-splits-design.md`
```

- [ ] **Step 3: i18n** — EN `Open Payment Splits` / ZH `打开分账记录` under `Help.dashboardLinks.open_payment_splits`

- [ ] **Step 4: `npm run verify:messages`**

- [ ] **Step 5: Commit** — `docs(help): amend slug map and add Payment Splits Help i18n keys`

---

### Task 2: Manifest

- [ ] **Step 1: Add def** (`order: 40`, after customers):

```ts
  {
    slug: "payments/payment-splits",
    domain: "payments",
    published: true,
    order: 40,
    relatedSlugs: ["payments/orders"],
    dashboardLinks: [
      {
        path: "/dashboard/payment-splits",
        labelKey: "open_payment_splits",
        primary: true,
      },
    ],
  },
```

- [ ] **Step 2:** Ensure `payments/orders.relatedSlugs` includes `payments/payment-splits` (keep `payments/customers` if present).

- [ ] **Step 3: Sanity** — `getPrimaryHelpSlugForDashboardPath('/dashboard/payment-splits')` → `payments/payment-splits`

- [ ] **Step 4: Commit** — `feat(help): register payments/payment-splits article def`

---

### Task 3: EN content

Append to `src/content/help/en/payments.ts`:

```ts
  "payments/payment-splits": {
    title: "Review payment split records in Merchant Center",
    description:
      "Open Payment Splits in FilixPay Merchant Center to list split records, filter by trade number, and view receiver details in the split details dialog.",
    keywords: [
      "FilixPay payment splits",
      "split payment records",
      "trade no split",
      "split receivers",
      "Merchant Center payment splits",
    ],
    body: {
      whoFor:
        "Operators on direct-settlement business accounts who need to review order payment-split records and receiver status in Merchant Center.",
      whenToUse:
        "Use this when you need to find a split by trade number, check split status, or open split details to see receivers.",
      beforeYouStart: [
        "Sign in to FilixPay Merchant Center.",
        "Use a business account that can see Split Payment Records under Transactions (direct settlement). If the menu is missing, switch accounts or confirm settlement mode with your admin — Help does not document how to change settlement mode.",
        "Have a trade number ready when searching (for example TRD_EXAMPLE_001).",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Payment Splits lists split records for orders and lets you open a details dialog for receivers. This guide covers the list, Trade No filter, and details dialog only. It does not cover configuring split rules or Payment Split APIs.",
        },
        {
          type: "heading",
          text: "Open Payment Splits",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Under Transactions, open Split Payment Records.",
            "Confirm the page title Payment Splits and the Trade No filter above the table.",
          ],
        },
        {
          type: "heading",
          text: "Read the split list",
          anchor: "list",
        },
        {
          type: "fields",
          rows: [
            { field: "ID", description: "Split record identifier." },
            { field: "Trade No", description: "Trade / payment reference for the split." },
            { field: "Split Amount", description: "Split amount, with order total shown as secondary text." },
            { field: "Split Type", description: "Immediate or Delayed (as labeled in the UI)." },
            { field: "Status", description: "Split status badge (for example Pending, Success, Failed)." },
            { field: "Receivers", description: "Success count versus receiver count; failures may show separately." },
            { field: "Created At", description: "When the split record was created." },
          ],
        },
        {
          type: "heading",
          text: "Filter by Trade No",
          anchor: "search",
        },
        {
          type: "steps",
          items: [
            "Enter Trade No in the filter (placeholder Trade No).",
            "Submit to apply the filter.",
            "Use Reset to clear the filter and reload the full list.",
            "Paginate through results as needed.",
          ],
        },
        {
          type: "heading",
          text: "Open split details",
          anchor: "details",
        },
        {
          type: "steps",
          items: [
            "On a row, choose the view action to open Split Details.",
            "Review basic information (trade no, status, type, amounts, created time).",
            "Review Receiver Details in the dialog table (receiver, name, amount, proportion, status).",
            "Close the dialog when finished. There is no separate detail URL for this screen.",
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
              problem: "I cannot find Split Payment Records in the menu.",
              solution:
                "This item is shown for direct-settlement business accounts. Confirm you selected the correct account. Help does not document how to change settlement mode — ask your admin if the menu stays hidden.",
            },
            {
              problem: "No split payment records found.",
              solution:
                "Clear the Trade No filter with Reset. If the list is still empty, no split records are available for this account yet.",
            },
            {
              problem: "Split Details does not load.",
              solution:
                "Close the dialog, confirm you are still signed in, then open view again. Retry if the network failed.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Manage orders",
        href: "/help/payments/orders",
      },
    },
  },
```

- [ ] Commit — `feat(help): add EN payments/payment-splits guide`

---

### Task 4: ZH content

Append to `src/content/help/zh/payments.ts`:

```ts
  "payments/payment-splits": {
    title: "在商户中心查看分账记录",
    description:
      "打开 FilixPay 商户中心分账记录，按流水号筛选，并在分账详情中查看接收方明细。",
    keywords: [
      "FilixPay 分账记录",
      "分账",
      "流水号筛选",
      "分账接收方",
      "商户中心分账",
    ],
    body: {
      whoFor:
        "使用直清业务账户、需要在商户中心查看订单分账记录与接收方状态的运营人员。",
      whenToUse: "需要按流水号查找分账、查看分账状态，或打开详情查看接收方时使用。",
      beforeYouStart: [
        "登录 FilixPay 商户中心。",
        "使用能在「交易」下看到「分账记录」的业务账户（直清）。若没有该菜单，请切换账户或向管理员确认结算模式——Help 不说明如何变更结算模式。",
        "搜索时准备好流水号（例如 TRD_EXAMPLE_001）。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "「分账记录」列出订单分账，并可打开详情对话框查看接收方。本指南仅覆盖列表、流水号筛选与详情对话框，不覆盖分账规则配置或分账 API。",
        },
        {
          type: "heading",
          text: "打开分账记录",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "在「交易」下打开「分账记录」。",
            "确认页面标题为「分账记录」，表格上方有流水号筛选。",
          ],
        },
        {
          type: "heading",
          text: "阅读分账列表",
          anchor: "list",
        },
        {
          type: "fields",
          rows: [
            { field: "ID", description: "分账记录标识。" },
            { field: "流水号", description: "该分账对应的交易流水号。" },
            { field: "分账金额", description: "分账金额；次要文字可显示订单总额。" },
            { field: "分账类型", description: "即时分账或延时分账（以界面标签为准）。" },
            { field: "分账状态", description: "状态徽标（如待分账、成功、失败）。" },
            { field: "接收方数量", description: "成功数 / 接收方总数；失败数可能单独显示。" },
            { field: "创建时间", description: "分账记录创建时间。" },
          ],
        },
        {
          type: "heading",
          text: "按流水号筛选",
          anchor: "search",
        },
        {
          type: "steps",
          items: [
            "在筛选栏填写流水号。",
            "提交以应用筛选。",
            "使用重置清空筛选并回到完整列表。",
            "需要时使用分页浏览。",
          ],
        },
        {
          type: "heading",
          text: "打开分账详情",
          anchor: "details",
        },
        {
          type: "steps",
          items: [
            "在行操作中选择查看，打开「分账详情」。",
            "查看基本信息（流水号、状态、类型、金额、创建时间）。",
            "在接收方明细表中查看接收方、名称、金额、比例与状态。",
            "查看完毕后关闭对话框。本页没有单独的详情 URL。",
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
              problem: "侧栏找不到「分账记录」。",
              solution:
                "该入口面向直清业务账户。请确认已选择正确账户。Help 不说明如何变更结算模式——若仍无菜单，请联系管理员。",
            },
            {
              problem: "提示暂无分账记录。",
              solution: "先重置流水号筛选。若仍为空，说明当前账户下尚无分账记录。",
            },
            {
              problem: "分账详情打不开或一直加载。",
              solution: "关闭对话框，确认仍处于登录状态后再次查看；若因网络失败可重试。",
            },
          ],
        },
      ],
      nextStep: {
        label: "管理订单",
        href: "/help/payments/orders",
      },
    },
  },
```

- [ ] Verify no Markdown links; both locales load.
- [ ] Commit — `feat(help): add ZH payments/payment-splits guide`

---

### Task 5: Dashboard deep link

In `payment-splits/page.tsx`:

```tsx
import { HelpDeepLinkButton } from "@/components/help/HelpDeepLinkButton";

extra={
  <HelpDeepLinkButton
    dashboardPath="/dashboard/payment-splits"
    helpSlug="payments/payment-splits"
  />
}
```

- [ ] `npx tsc --noEmit`
- [ ] Commit — `feat(help): wire Payment Splits Dashboard help deep link`

---

### Task 6: Verification

- Routes EN/ZH; Payments category lists guide; Related ↔ Orders  
- SEO self-canonical + EN↔ZH hreflang  
- `?` → Help; checkouts still unpublished  
- `npm run verify:messages` + `tsc`

---

## Frozen rules

| Item | Rule |
|------|------|
| Slug | `payments/payment-splits` |
| Menu gate | FAQ one-liner only |
| Detail | Modal |
| Filter | Trade No / 流水号 |
| Related | Orders |
| Next P1 | external-accounts |
| Credit | Still skipped |
