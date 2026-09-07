# Merchant Onboarding Agreement & Fee Acceptance V1 — Implementation Plan

> Executed 2026-09-07 after design approval.

**Goal:** Gate formal onboarding submit on versioned acceptance of Merchant Service Agreement + Fee Rules V1.0.0, with fee summary UI and legal pages.

**Architecture:** Frontend confirm-step UI + submit body; backend validates and persists `merchant_agreement_acceptance` in the same TX as submit/linkMerchant.

## Tasks (done)

- [x] Schema `029_merchant_agreement_acceptance.sql` + init-core append
- [x] DAO / Persistent / Service / Required versions / Exception
- [x] Extend submit API with acceptances body; 400 `AGREEMENT_ACCEPTANCE_REQUIRED`
- [x] Legal pages `/{locale}/merchant/terms` and `/{locale}/merchant/fees`
- [x] Confirm-step fee summary + checkbox + disabled submit
- [x] i18n zh/en
- [x] Unit tests (backend service + frontend constants/copy)

## Not in scope

Fee engine, ledger, commerce activation, trial create-merchant, privacy separate consent record.
