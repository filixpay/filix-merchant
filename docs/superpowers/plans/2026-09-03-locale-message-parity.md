# Locale message parity (en.json as source)

> **For agentic workers:** Execute **one language at a time**. **Commit after every finished batch (A–H), and also commit if you have to stop mid-batch** — never leave hours of JSON only in the working tree. If the session dies, start at **Resume**. Do not recreate unit tests (`AGENTS.md`).

**Goal:** Every supported locale file under `messages/` has the same key tree as `messages/en.json`, with real translations (not English leftovers), so switching language no longer falls back to English for missing keys.

**Architecture:** `src/i18n/request.ts` already `deepMerge`s `en.json` under the active locale. Filling files is copy completeness, not a runtime change. Keep existing non-English strings. Translate only missing keys and keys whose value is still identical to English (except brand tokens listed below). Do not add keys that are not in `en.json`.

**Tech Stack:** next-intl, `messages/*.json`, `npm run verify:messages`

## Global Constraints

- Source of truth: `messages/en.json` (4932 leaf keys as of 2026-09-03).
- Locales: `ja`, `ko`, `es`, `fr`, `de`, `pt`, `ar`, then small `zh` gap. `en` is never rewritten except if a structural bug is found.
- Preserve ICU placeholders exactly: `{count}`, `{name}`, `{timezone}`, `{max}`, etc.
- Preserve brand / product tokens: `FilixPay`, `Filix`, `Stripe`, `PayPal`, `Alipay`, `WeChat`, `Keycloak`, `OpenAPI`, `Hosted Checkout`, `TRON`, `USDT`, `T+1`.
- Arrays must keep the same length and object shape as English.
- Do not invent PII; do not put secrets in messages.
- Agent must not create `*.test.ts` / `*.test.tsx`.
- **Commit frequently.** One commit per finished batch. If the session is about to end or the file is already valid JSON with new keys, commit that incomplete language too — do not wait for the whole catalog.

---

## Commit rules (do not skip)

- After **each batch A–H** of the current language: `git add` that locale file and commit. Do not pile batches into one commit.
- If you **cannot finish the current batch** (context limit, crash risk, user stop): still commit whatever is already saved, as long as the JSON parses. Message must say the batch is incomplete.
- If `git status` shows a dirty `messages/<locale>.json` and you are stopping: **commit before ending the turn**.
- Do not `git push` unless the user asked.
- Do not commit `lint-components.log`, `lint-results.json`, or `messages/en.json` (unless you found a real en bug).

Commit message pattern:

```text
feat(i18n): ja batch C (Pages) vs en.json
feat(i18n): ja batch D incomplete (Orders+Refunds only)
feat(i18n): complete Japanese message catalog vs en.json
```

The last line is only for when that locale has `missing = 0` and leftover English is cleaned up.

---

## Resume (read this first after a crash)

1. `git log -5 --oneline` and `git status`. If `messages/<locale>.json` is dirty, commit it first (incomplete is OK).
2. Run the parity command in **Progress table** below.
3. If a language still has `missing > 0`, that language is **in progress** — continue the **next unfinished batch**, do not skip ahead and do not start another language.
4. Read the latest `feat(i18n): <locale> batch …` commit message to see which batch was last completed.
5. If `missing = 0` but `identical-to-en` is still large, finish leftover English **in that same language**, then commit.
6. Never start two locale files in the same session unless the previous language is fully committed (`missing = 0`).

### Progress table (update after each locale)

| Order | Locale | File | Status | Last known gap (2026-09-03) |
| --- | --- | --- | --- | --- |
| 0 | zh | `messages/zh.json` | committed | missing 0 |
| 1 | ja | `messages/ja.json` | committed | missing 0, identical-to-en ~130 (brands/API tokens) |
| 2 | ko | `messages/ko.json` | committed | missing 0, identical-to-en ~143 (brands/API tokens) |
| 3 | es | `messages/es.json` | in progress | missing 4293 — start batch A |
| 4 | fr | `messages/fr.json` | [ ] | missing 4293, identical-to-en 209 |
| 5 | de | `messages/de.json` | [ ] | missing 4293, identical-to-en 221 |
| 6 | pt | `messages/pt.json` | [ ] | missing 4268, identical-to-en 211 |
| 7 | ar | `messages/ar.json` | [ ] | missing 4268, identical-to-en 199 |

Status values: `not started` / `in progress` / `committed`.

### Parity command (run anytime)

```bash
node -e "const fs=require('fs'); function flatten(v,p=''){const o={}; if(v===null||typeof v!=='object'){if(p)o[p]=v;return o;} if(Array.isArray(v)){o[p]=v;return o;} for(const [k,x] of Object.entries(v)) Object.assign(o,flatten(x,p?p+'.'+k:k)); return o;} const en=flatten(JSON.parse(fs.readFileSync('messages/en.json','utf8'))); for (const loc of ['zh','ja','ko','es','fr','de','pt','ar']) { const f=flatten(JSON.parse(fs.readFileSync('messages/'+loc+'.json','utf8'))); const missing=Object.keys(en).filter(k=>!(k in f)); const extra=Object.keys(f).filter(k=>!(k in en)); const same=Object.keys(en).filter(k=>k in f && JSON.stringify(f[k])===JSON.stringify(en[k]) && typeof en[k]==='string' && en[k].length>1); console.log(loc,'leaves',Object.keys(f).length,'missing',missing.length,'extra',extra.length,'identical-to-en',same.length); if(missing[0]) console.log('  first missing',missing.slice(0,3).join(', ')); }"
```

Done for a locale means: `missing = 0` and `identical-to-en` is only brand/token strings (see Global Constraints), not full English sentences.

Also run:

```bash
npm run verify:messages
```

Expected: `verify:messages passed`. Key-parity warnings for that locale should drop to extra-keys only (or zero). JSON must parse; no mojibake.

---

## Files

| File | Role |
| --- | --- |
| `messages/en.json` | Read-only source tree |
| `messages/zh.json` | Fill 3 missing `Payouts.headers.*` keys |
| `messages/ja.json` | Full key parity, Japanese |
| `messages/ko.json` | Full key parity, Korean |
| `messages/es.json` | Full key parity, Spanish |
| `messages/fr.json` | Full key parity, French |
| `messages/de.json` | Full key parity, German |
| `messages/pt.json` | Full key parity, Portuguese |
| `messages/ar.json` | Full key parity, Arabic |
| `src/i18n/request.ts` | Do not change unless merge behavior is broken |
| `scripts/verify-messages.mjs` | Read-only check |

Do not edit `lint-components.log` / `lint-results.json`.

---

## How to fill one locale (repeat for every language)

Keep existing translated values. Walk `en.json` and write the same object shape into the target file.

**Within one language, fill in this namespace order** so a crash mid-file is easy to describe in the next prompt: “ja done through batch C”.

| Batch | Namespaces (top-level keys in `en.json`) | Approx. en leaves |
| --- | --- | --- |
| A | `Layout`, `Login`, `Dashboard`, `Common`, `Nav`, `SiteFooter`, `Seo`, `ServicePlan` | ~230 |
| B | `Home` | 227 |
| C | `Pages` | 820 |
| D | `Orders`, `Refunds`, `Checkouts`, `Configs`, `CommerceProducts`, `CommerceActivation`, `Customers`, `Locations`, `SubMerchants` | ~640 |
| E | `Disputes`, `Support`, `Notifications`, `AuditLogs`, `audit`, `RiskReviews`, `Reporting`, `Risk`, `RiskRules`, `Fraud`, `CoverageInsurance`, `CoverageConfig` | ~530 |
| F | `Developer`, `BankAccounts`, `CryptoDepositWallets`, `Transfers`, `Reviews`, `SecuritySettings`, `PayoutAudit` | ~480 |
| G | `MoneyCommon`, `MoneyBalance`, `MoneyActivity`, `MoneyIn`, `MoneyExternalAccounts`, `MoneyPayouts`, `MoneyTransfers`, `Balance`, `Deposits`, `Payouts`, `TransferRecords`, `PayoutRecords`, `PaymentSplits`, `SettlementReleases`, `TransactionReconciliation`, `Settlements`, `SettlementStatements` | ~900 |
| H | `Enterprise`, `Organization`, `CreditLimit`, `CreditAdjustment`, `CreditTransaction`, `MemberCreditLimit`, `MemberCreditAdjustment`, `MemberCreditTransaction`, `FirstOnboarding`, `Onboarding`, `Maintenance` | ~1100 |

After each batch:

1. Save the locale JSON (must parse; trailing newline).
2. Run the parity command.
3. **Commit immediately** (`git add messages/<locale>.json` + message `feat(i18n): <locale> batch X (...) vs en.json`).
4. Only then start the next batch.

Do not start the next language until batches A–H for the current language are all committed and `missing = 0`.

---

### Task 0: Chinese gap only

**Files:**
- Modify: `messages/zh.json` (`Payouts.headers`)

**Interfaces:**
- Consumes: `messages/en.json` `Payouts.headers.payee_name`, `payee_account`, `updated_at`
- Produces: `zh.json` has those three keys; all other zh keys unchanged

- [ ] **Step 1:** Add under `Payouts.headers` (keep existing `payee` if present; do not delete extra zh-only keys):

```json
"payee_name": "收款户名",
"payee_account": "收款账号",
"updated_at": "更新时间"
```

English source:

- `payee_name`: Payee Name
- `payee_account`: Payee Account
- `updated_at`: Updated At

- [ ] **Step 2:** Run parity command. Expected: `zh missing 0`.

- [ ] **Step 3:** `npm run verify:messages`

- [ ] **Step 4:** Commit

```bash
git add messages/zh.json
git commit -m "fix(i18n): add missing Payouts header keys in zh"
```

---

### Task 1: Japanese (`ja`)

**Files:**
- Modify: `messages/ja.json` only

**Interfaces:**
- Consumes: `messages/en.json` full tree; existing `ja.json` translations
- Produces: `ja.json` key-complete vs `en.json`

- [ ] Batch A — then commit `feat(i18n): ja batch A (shell) vs en.json`
- [ ] Batch B — then commit `feat(i18n): ja batch B (Home) vs en.json`
- [ ] Batch C — then commit `feat(i18n): ja batch C (Pages) vs en.json`
- [ ] Batch D — then commit `feat(i18n): ja batch D (commerce) vs en.json`
- [ ] Batch E — then commit `feat(i18n): ja batch E (risk) vs en.json`
- [ ] Batch F — then commit `feat(i18n): ja batch F (developer) vs en.json`
- [ ] Batch G — then commit `feat(i18n): ja batch G (money) vs en.json`
- [ ] Batch H — then commit `feat(i18n): ja batch H (org) vs en.json`
- [ ] If stopping before a batch is finished: commit anyway with `incomplete` in the message.
- [ ] Parity: `ja missing 0`. Sweep remaining English sentences; commit `feat(i18n): complete Japanese message catalog vs en.json` if that sweep is a separate change.
- [ ] `npm run verify:messages`
- [ ] Mark Progress table: ja = committed

---

### Task 2: Korean (`ko`)

**Files:**
- Modify: `messages/ko.json` only

- [ ] Batches A–H in order; **commit after each batch** (`feat(i18n): ko batch X ...`). Incomplete batch → still commit with `incomplete`.
- [ ] Write Korean, not a character-map of Japanese.
- [ ] Parity: `ko missing 0`; final commit `feat(i18n): complete Korean message catalog vs en.json` if needed after leftover-English sweep.
- [ ] `npm run verify:messages`
- [ ] Mark Progress table: ko = committed

---

### Task 3: Spanish (`es`)

**Files:**
- Modify: `messages/es.json` only

- [ ] Batches A–H; **commit after each batch**. Neutral Spanish; keep existing wording.
- [ ] Incomplete batch → commit with `incomplete` in the message.
- [ ] Parity: `es missing 0`; final complete commit if leftover English remains after H.

---

### Task 4: French (`fr`)

**Files:**
- Modify: `messages/fr.json` only

- [ ] Batches A–H; **commit after each batch**. Incomplete → still commit.
- [ ] Parity: `fr missing 0`; final complete commit if needed.

---

### Task 5: German (`de`)

**Files:**
- Modify: `messages/de.json` only

- [ ] Batches A–H; **commit after each batch**. Incomplete → still commit.
- [ ] Parity: `de missing 0`; final complete commit if needed.

---

### Task 6: Portuguese (`pt`)

**Files:**
- Modify: `messages/pt.json` only

- [ ] Batches A–H; **commit after each batch**. Brazilian-leaning. Incomplete → still commit.
- [ ] Parity: `pt missing 0`; final complete commit if needed.

---

### Task 7: Arabic (`ar`)

**Files:**
- Modify: `messages/ar.json` only

- [ ] Batches A–H; **commit after each batch**. Values only (no RTL CSS). Incomplete → still commit.
- [ ] Parity: `ar missing 0`; final complete commit if needed.

---

## Crash recovery prompt (paste into a new chat)

```text
Continue docs/superpowers/plans/2026-09-03-locale-message-parity.md
git log -5 --oneline; git status; run the parity command.
If messages/*.json is dirty, commit it first (incomplete is OK).
Resume the next unfinished batch of the first incomplete locale.
Commit after every batch. Commit again if you have to stop mid-batch.
Do not start a new language until the current one has missing = 0.
Do not create unit tests.
```

---

## Out of scope

- Deleting unused English keys
- Enabling checkouts in the sidebar
- Changing `deepMerge` fallback behavior
- Translating marketing whitepaper (hardcoded Chinese in `WhitepaperContent.tsx`)
