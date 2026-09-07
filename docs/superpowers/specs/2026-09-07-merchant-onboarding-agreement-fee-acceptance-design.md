# Merchant Onboarding Agreement & Fee Acceptance V1 — Design

**Date:** 2026-09-07  
**Repos:** `filix-merchant` (portal) + `filix-pay` (backend)  
**Status:** Approved

## Goal

Before formal merchant application submit, require versioned acceptance of:

- `MERCHANT_SERVICE_AGREEMENT` `V1.0.0`
- `MERCHANT_FEE_RULES` `V1.0.0`

Show a clear fee summary (SaaS free / Commerce 5% / ¥500 payment threshold) and links to full legal documents.

## Legal content SSOT

Protocol pages MUST be produced from these source documents (not from ad-hoc summaries):

| Document | Source (ZH) | Source (EN) | Portal route |
|----------|-------------|-------------|--------------|
| Merchant Service Agreement V1 | `filix-pay/docs/FilixPay 商户服务协议 V1.md` | `filix-pay/docs/FilixPay Merchant Service Agreement V1.en.md` | `/{locale}/merchant/terms` |
| Merchant Service & Fee Rules V1 | `filix-pay/docs/FilixPay 商户服务与收费规则 V1.md` | `filix-pay/docs/FilixPay Merchant Service and Fee Rules V1.en.md` | `/{locale}/merchant/fees` |

Regenerate portal content with:

```bash
node scripts/generate-merchant-legal-from-md.mjs
```

Outputs: `src/content/legal/merchant-terms.ts`, `src/content/legal/merchant-fees.ts`.

Do not merge into platform `/terms`. Reuse `/{locale}/privacy` for privacy.

## Gate

`POST /portal/merchant-applications/{id}/submit` — same transactional boundary as status→SUBMITTED and merchant link. Not activation/COMPLETED.

## Data model

Table `merchant_agreement_acceptance` (independent of Merchant core columns):

- merchant_id, application_id, agreement_type, agreement_version
- accepted_at, accepted_by (= platform_identity.id), source, metadata, created_at
- UNIQUE (merchant_id, agreement_type, agreement_version)

## API

Submit body:

```json
{
  "acceptances": [
    { "agreementType": "MERCHANT_SERVICE_AGREEMENT", "agreementVersion": "V1.0.0" },
    { "agreementType": "MERCHANT_FEE_RULES", "agreementVersion": "V1.0.0" }
  ]
}
```

Missing/wrong version → HTTP 400, code `AGREEMENT_ACCEPTANCE_REQUIRED`.

## Frontend

- Confirm step: fee summary + links + checkbox (disabled submit until checked)
- Legal pages: `/{locale}/merchant/terms`, `/{locale}/merchant/fees`; reuse `/{locale}/privacy`

## Out of scope

Fee engine, ledger writes, commerce activation states, merchant.feeRate, trial create-merchant checkbox, privacy separate consent record.

## Fee copy (frozen)

- FilixPay SaaS payment collection: Free (0%)
- E-commerce platform sales orders: 5%
- ¥500 is payment trigger threshold, not a free allowance
