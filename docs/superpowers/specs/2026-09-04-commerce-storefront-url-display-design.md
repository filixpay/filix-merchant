# Commerce product storefront URL display

**Date:** 2026-09-04  
**Status:** Approved for planning  
**Scope:** Merchant Center commerce product list + detail UI

## Problem

Products published to Saleor currently show only status and Saleor product ID. Merchants cannot see which storefront hosts the product or open a purchase link from list/detail.

## Frozen decisions

1. **Purchase link SSOT:** FilixPay returns `storefrontUrl`. Merchant Center never constructs product URLs.
2. **Shop display:** Derive hostname from `storefrontUrl` (e.g. `https://micselect.com/en/us/products/xxx` → `micselect.com`).
3. **No V1 fields for** Saleor channel, store name, or product `slug` (slug may exist on wire later; UI does not depend on it).
4. **API contract:** List, detail, and publish responses all return the same optional `storefrontUrl`.
5. **Display gate:** Show only when `storefrontUrl` itself is a valid absolute URL. Do **not** gate on `businessStatus === PUBLISHED` or any frontend “accessibility” check. Backend returned it → show; missing/invalid → hide, no error toast.

## Data contract (§1)

### Wire / view fields

```ts
// CommerceProductDto & CommerceProductView
storefrontUrl?: string | null;
```

### Mapping

- Pass through in `mapCommerceProductDto`.
- Treat `null`, `undefined`, and whitespace-only strings as absent.

### Helper

```ts
hostnameFromStorefrontUrl(url: string): string | null
```

- Uses `new URL(url)` (or equivalent).
- Returns `hostname` on success.
- Returns `null` on throw / non-http(s) / empty input.
- **Parse only** — never builds or rewrites URLs.

Optional companion:

```ts
isValidStorefrontUrl(url: string | null | undefined): boolean
```

Used by UI to decide whether to render shop + purchase link.

## Detail page UI (§2)

**File:** `src/app/[locale]/dashboard/commerce/products/[id]/page.tsx`

In the existing status `Descriptions` card (status / Saleor ID / last error), when `storefrontUrl` is valid:

| Label (i18n) | Content |
|--------------|---------|
| `detail.store` | Hostname text (e.g. `micselect.com`) |
| `detail.purchase_link` | External link: label `detail.view_purchase_page`, `href={storefrontUrl}`, `target="_blank"`, `rel="noopener noreferrer"` |

Rules:

- Invalid/missing URL → omit both rows entirely.
- Do not change publish / unpublish / edit rules.
- Optional: full URL as `title`/tooltip on the link; primary CTA text remains the view-purchase label.

## List page UI (§3)

**File:** `src/components/commerce/ProductListTable.tsx`

When `storefrontUrl` is valid:

1. **店铺 column** (`columns.store`): hostname text; `—` when absent/invalid.
2. **购买入口:** “查看商品” (`actions.view_storefront`) as an external link in the **actions** column (alongside edit / publish / unpublish), same `target`/`rel` as detail. Only rendered when URL is valid.

Rules:

- No status-based gating.
- Keep existing edit / publish / unpublish / more menu behavior.
- Adjust table `scroll.x` slightly if needed for the new column.

## i18n

Add keys under `CommerceProducts` in all locale files (`zh`, `en`, `ja`, `ko`, `es`, `fr`):

| Key | zh (reference) |
|-----|----------------|
| `detail.store` | 店铺 |
| `detail.purchase_link` | 购买链接 |
| `detail.view_purchase_page` | 查看购买页面 |
| `columns.store` | 店铺 |
| `actions.view_storefront` | 查看商品 |

Other locales: equivalent meaning (not machine-placeholder gibberish).

## Architecture / data flow

```
FilixPay Product API (list | detail | publish)
        │
        │  storefrontUrl?: string | null
        ▼
mapCommerceProductDto → CommerceProductView
        │
        ▼
hostnameFromStorefrontUrl / isValidStorefrontUrl
        │
        ├── Detail Descriptions (店铺 + 购买链接)
        └── List table (店铺列 + 查看商品)
```

FilixPay / Storefront URL Builder remains responsible for composing  
`https://{host}/{locale}/{channel}/products/{slug}`.  
This repo only displays the returned absolute URL.

## Error handling

| Case | Behavior |
|------|----------|
| Missing / null / `""` | Hide store + link UI |
| Invalid URL string | Hide; do not toast |
| Valid URL | Show hostname + open link |
| Network/API errors on load | Unchanged existing error handling |

## Out of scope (V1)

- Frontend URL construction from slug/channel/locale
- Saleor GraphQL calls from Merchant Center
- `slug` / `channel` / `storeName` fields in UI
- Changing activation `storefrontPreviewUrl` celebration flow (can stay as-is; product pages use product `storefrontUrl`)
- Backend FilixPay/Saleor adapter implementation (assumed by API contract B)

## Testing notes (for humans; agents do not add test files)

Suggested coverage when writing tests manually:

- Mapper passes `storefrontUrl` through (including `null`).
- `hostnameFromStorefrontUrl` happy path + invalid inputs.
- Detail/list: valid URL shows rows/link; invalid hides them regardless of `PUBLISHED` status.

## Implementation touchpoints

| Area | Files |
|------|--------|
| Types | `src/lib/api/domains/commerce/types.ts` |
| Mapper | `src/lib/api/domains/commerce/mappers.ts` |
| Helper | new small util under `src/lib/api/domains/commerce/` or `src/lib/commerce/` |
| Detail | `src/app/[locale]/dashboard/commerce/products/[id]/page.tsx` |
| List | `src/components/commerce/ProductListTable.tsx` |
| i18n | `messages/{zh,en,ja,ko,es,fr}.json` |
| Barrel export | `src/lib/api/domains/commerce/index.ts` if helper is public |

## Success criteria

- With a valid `storefrontUrl` on the product payload, detail shows shop hostname + purchase link; list shows shop column + view-product action.
- Without / with invalid `storefrontUrl`, UI stays clean (no empty labels, no errors).
- No frontend code builds storefront paths from slug/channel/locale.
