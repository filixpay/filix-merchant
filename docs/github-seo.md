# FilixPay Open Source Repository SEO (V1)

**Status:** Applied (2026-09-04)

Unified GitHub discovery standard for the FilixPay open-source ecosystem. Keyword ownership is split so the three repos do not compete for the same primary terms.

## Brand structure

```text
FilixPay — Open-Source Payment Infrastructure
        │
        ├── Merchant Portal     (filix-merchant)
        ├── Payment Checkout    (filix-checkout)
        └── Saleor Integration  (filixpay-saleor)
```

| Repo | Primary keyword | Secondary |
|------|-----------------|-----------|
| [filix-merchant](https://github.com/filixpay/filix-merchant) | merchant portal | payment, commerce, dashboard |
| [filix-checkout](https://github.com/filixpay/filix-checkout) | payment checkout | ecommerce, payments, checkout |
| [filixpay-saleor](https://github.com/filixpay/filixpay-saleor) | Saleor payment integration | Saleor Commerce, payment gateway |

Shared brand terms (all three): **FilixPay**, open-source payment infrastructure (prefer website for the latter as hub keyword).

## Applied GitHub metadata

### Descriptions

| Repo | Description |
|------|-------------|
| Merchant | Open-source merchant portal for payment and commerce operations, built with Next.js and FilixPay APIs. |
| Checkout | Open-source payment checkout for modern commerce, built for secure and flexible payment flows with FilixPay. |
| Saleor | Open-source payment integration for Saleor Commerce, connecting Saleor checkout with FilixPay payment infrastructure. |

### README H1

| Repo | H1 |
|------|----|
| Merchant | `# FilixPay Merchant Portal` |
| Checkout | `# FilixPay Checkout` |
| Saleor | `# FilixPay Payment Integration for Saleor` |

### Topics

| Repo | Topics |
|------|--------|
| Merchant | `filixpay`, `merchant-portal`, `merchant-dashboard`, `payment`, `payments`, `commerce`, `ecommerce`, `nextjs`, `typescript`, `open-source` |
| Checkout | `filixpay`, `checkout`, `payment-checkout`, `payment`, `payments`, `ecommerce`, `commerce`, `online-payments`, `payment-gateway`, `typescript`, `nextjs`, `open-source` |
| Saleor | `filixpay`, `saleor`, `saleor-commerce`, `payment-integration`, `payment-gateway`, `ecommerce`, `payments`, `typescript`, `nextjs`, `open-source` |

### Social Preview

| Spec | Value |
|------|--------|
| Size | 1280 × 640 |
| Max | &lt; 1 MB |
| Repo asset | `docs/social-preview.png` (source of truth in git) |
| GitHub | Settings → General → Social preview (custom image uploaded) |

Verified custom OG (`repository-images.githubusercontent.com`) for all three repos on 2026-09-04.

## Re-apply commands (if metadata drifts)

Requires `gh auth login`.

```bash
gh repo edit filixpay/filix-merchant --description "Open-source merchant portal for payment and commerce operations, built with Next.js and FilixPay APIs."
gh repo edit filixpay/filix-checkout --description "Open-source payment checkout for modern commerce, built for secure and flexible payment flows with FilixPay."
gh repo edit filixpay/filixpay-saleor --description "Open-source payment integration for Saleor Commerce, connecting Saleor checkout with FilixPay payment infrastructure."

gh repo edit filixpay/filix-merchant --add-topic filixpay --add-topic merchant-portal --add-topic merchant-dashboard --add-topic payment --add-topic payments --add-topic commerce --add-topic ecommerce --add-topic nextjs --add-topic typescript --add-topic open-source
gh repo edit filixpay/filix-checkout --add-topic filixpay --add-topic checkout --add-topic payment-checkout --add-topic payment --add-topic payments --add-topic ecommerce --add-topic commerce --add-topic online-payments --add-topic payment-gateway --add-topic typescript --add-topic nextjs --add-topic open-source
gh repo edit filixpay/filixpay-saleor --add-topic filixpay --add-topic saleor --add-topic saleor-commerce --add-topic payment-integration --add-topic payment-gateway --add-topic ecommerce --add-topic payments --add-topic typescript --add-topic nextjs --add-topic open-source
```

Social Preview cannot be set via `gh`; re-upload `docs/social-preview.png` in Settings if replaced.

## Out of scope (V1)

- Website Open Source Hub (`/open-source` and product landing pages)
- Keyword stuffing; keep README copy natural and accurate
