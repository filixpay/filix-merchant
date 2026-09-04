# Commerce storefront URL display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show FilixPay-returned `storefrontUrl` as shop hostname + purchase link on commerce product detail and list pages.

**Architecture:** Pass optional `storefrontUrl` through DTO → View; parse hostname with a pure helper (never build URLs). Detail Descriptions and list table render only when the URL is a valid absolute `http(s)` URL — no publish-status gating.

**Tech Stack:** Next.js App Router, TypeScript, Ant Design Descriptions/Table, next-intl

**Spec:** `docs/superpowers/specs/2026-09-04-commerce-storefront-url-display-design.md`

## Global Constraints

- Purchase link SSOT is FilixPay `storefrontUrl`; Merchant Center must not construct product URLs from slug/channel/locale.
- Shop label = `new URL(storefrontUrl).hostname` only.
- Display gate = valid `storefrontUrl` only (not `businessStatus === PUBLISHED`).
- Do not add `slug`, `channel`, or `storeName` fields in V1.
- Per `AGENTS.md`: agents must **not** create or modify `*.test.ts` / `*.test.tsx` files. Verify with `tsc` / manual UI; list suggested tests for humans in the PR description if needed.
- Do not commit secrets or invent real PII in fixtures.

## File structure

| File | Responsibility |
|------|----------------|
| `src/lib/commerce/storefront-url.ts` | `normalizeStorefrontUrl`, `isValidStorefrontUrl`, `hostnameFromStorefrontUrl` |
| `src/lib/api/domains/commerce/types.ts` | Add `storefrontUrl` to DTO + View |
| `src/lib/api/domains/commerce/mappers.ts` | Map / normalize `storefrontUrl` |
| `src/app/[locale]/dashboard/commerce/products/[id]/page.tsx` | Detail: store + purchase link rows |
| `src/components/commerce/ProductListTable.tsx` | List: store column + view-storefront action |
| `messages/{zh,en,ja,ko,es,fr}.json` | i18n keys under `CommerceProducts` |

---

### Task 1: Storefront URL helpers

**Files:**
- Create: `src/lib/commerce/storefront-url.ts`

**Interfaces:**
- Consumes: none
- Produces:
  - `normalizeStorefrontUrl(url: string | null | undefined): string | null`
  - `isValidStorefrontUrl(url: string | null | undefined): boolean`
  - `hostnameFromStorefrontUrl(url: string | null | undefined): string | null`

- [ ] **Step 1: Create helper module**

```ts
/** Trim and treat empty as absent. Does not build URLs. */
export function normalizeStorefrontUrl(url: string | null | undefined): string | null {
  if (url == null) return null;
  const trimmed = url.trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * True only for absolute http(s) URLs that `URL` can parse.
 * Display gate for shop hostname + purchase link — not publish status.
 */
export function isValidStorefrontUrl(url: string | null | undefined): boolean {
  const normalized = normalizeStorefrontUrl(url);
  if (!normalized) return false;
  try {
    const parsed = new URL(normalized);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Hostname for shop label, or null if URL is not displayable. */
export function hostnameFromStorefrontUrl(url: string | null | undefined): string | null {
  const normalized = normalizeStorefrontUrl(url);
  if (!normalized || !isValidStorefrontUrl(normalized)) return null;
  try {
    return new URL(normalized).hostname;
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: Sanity-check in Node/tsx (no test file)**

Run from repo root (PowerShell):

```powershell
npx --yes tsx -e "const m = await import('./src/lib/commerce/storefront-url.ts'); console.log(m.hostnameFromStorefrontUrl('https://micselect.com/en/us/products/tea')); console.log(m.isValidStorefrontUrl('not-a-url')); console.log(m.hostnameFromStorefrontUrl('  '));"
```

Expected stdout (order):

```
micselect.com
false
null
```

- [ ] **Step 3: Commit**

```powershell
git add src/lib/commerce/storefront-url.ts
git commit -m "feat(commerce): add storefront URL parse helpers"
```

---

### Task 2: DTO / View / mapper

**Files:**
- Modify: `src/lib/api/domains/commerce/types.ts`
- Modify: `src/lib/api/domains/commerce/mappers.ts`
- Consumes: `normalizeStorefrontUrl` from Task 1
- Produces: `CommerceProductView.storefrontUrl?: string | null` (normalized or absent)

- [ ] **Step 1: Add field to DTO and View**

In `CommerceProductDto` (after `externalProductId` is fine):

```ts
externalProductId?: string;
storefrontUrl?: string | null;
```

In `CommerceProductView`:

```ts
externalProductId?: string;
storefrontUrl?: string | null;
```

Do **not** add `slug` / `channel` / `storeName`.

- [ ] **Step 2: Map the field**

At top of `mappers.ts`:

```ts
import { normalizeStorefrontUrl } from "@/lib/commerce/storefront-url";
```

In `mapCommerceProductDto` return object, add:

```ts
externalProductId: dto.externalProductId,
storefrontUrl: normalizeStorefrontUrl(dto.storefrontUrl),
lastError: dto.lastError,
```

- [ ] **Step 3: Typecheck**

```powershell
npx tsc --noEmit
```

Expected: exit 0 (or only pre-existing unrelated errors — do not introduce new ones in these files).

- [ ] **Step 4: Commit**

```powershell
git add src/lib/api/domains/commerce/types.ts src/lib/api/domains/commerce/mappers.ts
git commit -m "feat(commerce): map storefrontUrl on product DTO/view"
```

---

### Task 3: i18n keys (all locales)

**Files:**
- Modify: `messages/zh.json`, `messages/en.json`, `messages/ja.json`, `messages/ko.json`, `messages/es.json`, `messages/fr.json` — under `CommerceProducts` only

**Interfaces:**
- Produces keys used by Tasks 4–5:
  - `CommerceProducts.detail.store`
  - `CommerceProducts.detail.purchase_link`
  - `CommerceProducts.detail.view_purchase_page`
  - `CommerceProducts.columns.store`
  - `CommerceProducts.actions.view_storefront`

- [ ] **Step 1: Add keys**

**zh.json**

```json
"detail": {
  "store": "店铺",
  "purchase_link": "购买链接",
  "view_purchase_page": "查看购买页面"
},
"columns": {
  "store": "店铺"
},
"actions": {
  "view_storefront": "查看商品"
}
```

(Merge into existing `detail` / `columns` / `actions` objects — do not replace whole objects.)

**en.json**

```json
"detail.store": "Store",
"detail.purchase_link": "Purchase link",
"detail.view_purchase_page": "View purchase page",
"columns.store": "Store",
"actions.view_storefront": "View product"
```

**ja.json**

```json
"detail.store": "ストア",
"detail.purchase_link": "購入リンク",
"detail.view_purchase_page": "購入ページを見る",
"columns.store": "ストア",
"actions.view_storefront": "商品を見る"
```

**ko.json**

```json
"detail.store": "스토어",
"detail.purchase_link": "구매 링크",
"detail.view_purchase_page": "구매 페이지 보기",
"columns.store": "스토어",
"actions.view_storefront": "상품 보기"
```

**es.json**

```json
"detail.store": "Tienda",
"detail.purchase_link": "Enlace de compra",
"detail.view_purchase_page": "Ver página de compra",
"columns.store": "Tienda",
"actions.view_storefront": "Ver producto"
```

**fr.json**

```json
"detail.store": "Boutique",
"detail.purchase_link": "Lien d'achat",
"detail.view_purchase_page": "Voir la page d'achat",
"columns.store": "Boutique",
"actions.view_storefront": "Voir le produit"
```

- [ ] **Step 2: Validate JSON parses**

```powershell
node -e "for (const f of ['zh','en','ja','ko','es','fr']) JSON.parse(require('fs').readFileSync('messages/'+f+'.json','utf8')); console.log('ok')"
```

Expected: `ok`

- [ ] **Step 3: Commit**

```powershell
git add messages/zh.json messages/en.json messages/ja.json messages/ko.json messages/es.json messages/fr.json
git commit -m "feat(i18n): storefront URL labels for commerce products"
```

---

### Task 4: Detail page UI

**Files:**
- Modify: `src/app/[locale]/dashboard/commerce/products/[id]/page.tsx`

**Interfaces:**
- Consumes: `product.storefrontUrl`, `isValidStorefrontUrl`, `hostnameFromStorefrontUrl`, i18n keys from Task 3

- [ ] **Step 1: Import helpers**

Near other imports:

```tsx
import {
  hostnameFromStorefrontUrl,
  isValidStorefrontUrl,
} from "@/lib/commerce/storefront-url";
```

- [ ] **Step 2: Extend Descriptions**

Inside the status `Card` → `Descriptions`, after the `externalProductId` item (and before `lastError`), add:

```tsx
{isValidStorefrontUrl(product.storefrontUrl) ? (
  <>
    <Descriptions.Item label={t("detail.store")}>
      {hostnameFromStorefrontUrl(product.storefrontUrl)}
    </Descriptions.Item>
    <Descriptions.Item label={t("detail.purchase_link")}>
      <Typography.Link
        href={product.storefrontUrl!}
        target="_blank"
        rel="noopener noreferrer"
        title={product.storefrontUrl!}
      >
        {t("detail.view_purchase_page")}
      </Typography.Link>
    </Descriptions.Item>
  </>
) : null}
```

Do not gate on `businessStatus`. Do not change publish/unpublish handlers.

- [ ] **Step 3: Manual check**

With API returning `storefrontUrl: "https://micselect.com/en/us/products/tea-set"`: detail shows 店铺 `micselect.com` and a working 查看购买页面 link.  
With missing/invalid URL: those two rows absent; no toast.

- [ ] **Step 4: Commit**

```powershell
git add "src/app/[locale]/dashboard/commerce/products/[id]/page.tsx"
git commit -m "feat(commerce): show store and purchase link on product detail"
```

---

### Task 5: List table UI

**Files:**
- Modify: `src/components/commerce/ProductListTable.tsx`

**Interfaces:**
- Consumes: `record.storefrontUrl`, helpers from Task 1, i18n from Task 3

- [ ] **Step 1: Import helpers**

```tsx
import {
  hostnameFromStorefrontUrl,
  isValidStorefrontUrl,
} from "@/lib/commerce/storefront-url";
```

- [ ] **Step 2: Add store column**

Insert after the `status` column (before `updated`):

```tsx
{
  title: t("columns.store"),
  key: "store",
  width: 140,
  render: (_: unknown, record) =>
    hostnameFromStorefrontUrl(record.storefrontUrl) ?? "—",
},
```

- [ ] **Step 3: Add view-storefront action**

Inside the actions `Space`, after the edit `Link` (before publish button), add:

```tsx
{isValidStorefrontUrl(record.storefrontUrl) ? (
  <Button
    size="small"
    type="link"
    href={record.storefrontUrl!}
    target="_blank"
    rel="noopener noreferrer"
  >
    {t("actions.view_storefront")}
  </Button>
) : null}
```

- [ ] **Step 4: Widen horizontal scroll**

Change `scroll={{ x: 1100 }}` to `scroll={{ x: 1240 }}` (store column + action).

- [ ] **Step 5: Manual check**

List with valid URL: 店铺 column shows hostname; 查看商品 opens storefront.  
Without URL: column shows `—`; no 查看商品 link. Publish/edit/unpublish unchanged.

- [ ] **Step 6: Commit**

```powershell
git add src/components/commerce/ProductListTable.tsx
git commit -m "feat(commerce): show store and purchase link on product list"
```

---

### Task 6: Final verification

**Files:** none new

- [ ] **Step 1: Typecheck**

```powershell
npx tsc --noEmit
```

Expected: no new errors from this change set.

- [ ] **Step 2: Grep guard — no frontend URL construction**

```powershell
rg "products/\$\{|/products/' \+|storefrontPreviewUrl.*slug|micselect\.com" src/app/[locale]/dashboard/commerce src/components/commerce src/lib/commerce/storefront-url.ts src/lib/api/domains/commerce
```

Expected: no hits that build purchase URLs (helper file only parses). Celebration modal may still use activation `storefrontPreviewUrl` — leave it alone.

- [ ] **Step 3: Confirm success criteria**

- [ ] Valid `storefrontUrl` → detail shop + link; list shop + 查看商品  
- [ ] Invalid/missing → hidden / `—`, no errors  
- [ ] No slug/channel/storeName fields added  

**Suggested tests for humans (do not add in this plan):** mapper pass-through; helper happy/invalid paths; UI renders independent of `PUBLISHED`.

---

## Spec coverage checklist

| Spec item | Task |
|-----------|------|
| `storefrontUrl` on DTO/View | 2 |
| normalize / parse helpers | 1 |
| Display only on valid URL | 1, 4, 5 |
| No publish-status gate | 4, 5 |
| Detail store + purchase link | 4 |
| List store column + view action | 5 |
| i18n 6 locales | 3 |
| No slug/channel/storeName | 2 (explicit) |
| No frontend URL build | 6 grep |
| Agents don't add tests | Global + Task 6 notes |
