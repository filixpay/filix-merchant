import type { HelpArticleContent } from "../article-content";

export const enFunds: Record<string, HelpArticleContent> = {
  "funds/balance": {
    title: "Balance and activity",
    description:
      "Read available and pending balance in FilixPay Merchant Center Money, open activity movements, and start money-in, payout, or transfer actions when capability allows.",
    keywords: [
      "balance",
      "available balance",
      "activity",
      "money",
      "fund movements",
    ],
    body: {
      whoFor:
        "Merchants who need to see how funds sit across assets and which movements changed the balance.",
      whenToUse:
        "Use this when you open Money → Balance or Money → Activity to check available funds or investigate a movement.",
      beforeYouStart: [
        "Sign in with access to the Money section.",
        "Know which asset (for example USD) you want to inspect.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Balance shows multi-asset available and pending amounts for your merchant funds. Activity lists movements such as payment, refund, settlement, fee, payout, transfer, money-in, and adjustment. Use these pages to understand how funds move in and out of balance.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Open Money → Balance to see available and pending amounts per asset account.",
            "Check account health (Active / Limited) and whether Money-In, Payout, or Transfer capability is available.",
            "Use Deposit, Withdraw, or Transfer CTAs when shown to start money-in, payout, or transfer flows.",
            "Open Money → Activity to filter by asset and movement direction (In / Out / Transfer).",
            "Open a movement row when you need source, reference, amount, and status detail.",
          ],
        },
        {
          type: "heading",
          text: "Key fields",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Available balance",
              description:
                "Funds you can typically use for payout or transfer, subject to capability limits.",
            },
            {
              field: "Pending balance",
              description: "Funds not yet available while processing or hold rules apply.",
            },
            {
              field: "Asset account",
              description: "Per-asset balance row (for example USD) on the Balance page.",
            },
            {
              field: "Movement / status",
              description: "Activity feed type and status for each funds change, with time and reference.",
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
              problem: "Available balance looks lower than I expect.",
              solution:
                "Check Pending balance and recent Activity for holds, fees, refunds, or payouts. Confirm you selected the correct asset.",
            },
            {
              problem: "Deposit or Withdraw is disabled.",
              solution:
                "Account health may be Limited for that operation. See Money-In and Payouts guides, or check capability status on Balance.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Money-In",
        href: "/help/funds/money-in",
      },
    },
  },
  "funds/money-in": {
    title: "Money-In",
    description:
      "Create and track Money-In (deposit) records in FilixPay Merchant Center so funds credit your balance.",
    keywords: [
      "money-in",
      "deposit",
      "add funds",
      "funding methods",
      "money-in records",
    ],
    body: {
      whoFor:
        "Operators who need to add funds to merchant balance or review Money-In history.",
      whenToUse:
        "Use this when you open Money → Money-In to create a deposit or check Money-In status.",
      beforeYouStart: [
        "Confirm Money-In capability is available on Balance for the target asset.",
        "Know the amount and asset you intend to fund.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Money-In records track deposits that credit merchant funds and increase balance. The page includes Deposits and Funding Methods tabs.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Open Money → Money-In (Money-In records).",
            "Review existing rows by time, amount, asset, status, and Money-In ID.",
            "Choose Create Money-In / Add funds when you need a new deposit.",
            "Follow on-screen funding method instructions until the record reaches a success status.",
            "Return to Balance or Activity to confirm the credit appeared.",
          ],
        },
        {
          type: "heading",
          text: "Key fields",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Money-In ID",
              description: "Unique identifier for the deposit record.",
            },
            {
              field: "Amount / Asset",
              description: "How much is being credited and in which asset.",
            },
            {
              field: "Status",
              description:
                "Processing lifecycle of the Money-In until funds are available or the attempt fails.",
            },
            {
              field: "Funding methods",
              description: "Configured ways to fund the balance (tab on the Money-In page).",
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
              problem: "Create Money-In is not available.",
              solution:
                "Open Balance and check Money-In capability and account health for that asset. Limited accounts may block new deposits.",
            },
            {
              problem: "Money-In succeeded but Balance did not change.",
              solution:
                "Refresh Balance and filter Activity by Money-In. Confirm you are viewing the same asset as the Money-In record.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Payouts",
        href: "/help/funds/payouts",
      },
    },
  },
  "funds/payouts": {
    title: "Payouts",
    description:
      "Withdraw or send merchant funds to linked external accounts from FilixPay Merchant Center Payouts.",
    keywords: [
      "payouts",
      "withdraw",
      "external accounts",
      "money out",
      "payout records",
    ],
    body: {
      whoFor:
        "Merchants who need to move available balance out to a bank or other linked external account.",
      whenToUse:
        "Use this when you open Money → Payouts to create a withdrawal or track payout status.",
      beforeYouStart: [
        "Confirm available balance covers the payout amount for the chosen asset.",
        "Ensure an external account (bank or crypto destination) is linked and eligible.",
        "Verify Payout capability is not limited on Balance.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Payouts lists payout records and the Withdraw action that sends funds from merchant balance to linked external accounts.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Open Money → Payouts (Payout records).",
            "Review existing payouts by time, amount, asset, status, and Payout ID.",
            "Choose Withdraw / apply for payout when you are ready to send funds.",
            "Select asset, amount, and destination external account, then submit.",
            "Watch status until the payout succeeds or fails; confirm Balance and Activity updated.",
          ],
        },
        {
          type: "heading",
          text: "Key fields",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Payout ID",
              description: "Unique identifier for the payout record.",
            },
            {
              field: "Amount / Asset",
              description: "Funds requested to leave the merchant balance.",
            },
            {
              field: "External account",
              description: "Linked BANK or CRYPTO destination configured under Money.",
            },
            {
              field: "Status",
              description: "Lifecycle of the payout until completion or failure.",
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
              problem: "Withdraw warns that amount exceeds available.",
              solution:
                "Lower the amount to available balance, or wait for pending funds to become available. Check Activity for recent holds.",
            },
            {
              problem: "No destination account is listed.",
              solution:
                "Add or verify an external account under Money first, then return to Payouts.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Settlement bills",
        href: "/help/funds/settlements",
      },
    },
  },
  "funds/transfers": {
    title: "Transfer funds between merchants",
    description:
      "Create and track merchant-to-merchant transfers under Money → Transfers in FilixPay Merchant Center.",
    keywords: [
      "money transfers",
      "merchant to merchant transfer",
      "create transfer",
      "payee merchant code",
      "transfer PIN",
    ],
    body: {
      whoFor:
        "Operators who move available balance from one merchant account to another merchant payee inside FilixPay.",
      whenToUse:
        "Use this when you open Money → Transfers to create a transfer or open transfer detail — not for Offline Collection bank-transfer audit.",
      beforeYouStart: [
        "Confirm Transfer capability is available for the debit asset on Balance.",
        "Have the payee merchant code ready (for example MCH_EXAMPLE_001).",
        "Set a transaction password first if the confirm step requires it — see /help/account/security.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Transfers lists merchant-to-merchant fund moves. Create transfer selects debit asset, amount, and payee, then confirms with the transaction password. This is not Offline Collection (Pending audit under Transactions). Cleared transfers cannot be reversed from this UI.",
        },
        {
          type: "heading",
          text: "Open Transfers",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Open Money → Transfers.",
            "Confirm the page title Transfers and the Create transfer action.",
          ],
        },
        {
          type: "heading",
          text: "Create a transfer",
          anchor: "create",
        },
        {
          type: "steps",
          items: [
            "Choose Create transfer.",
            "Select the debit asset and enter the amount.",
            "Enter the payee merchant code and confirm the looked-up name or alias.",
            "Confirm with your transaction password and submit.",
            "Watch the list for Transfer ID, time, amount, counterparty, and status.",
          ],
        },
        {
          type: "heading",
          text: "Open transfer detail",
          anchor: "detail",
        },
        {
          type: "steps",
          items: [
            "Open a row to view amount, status, counterparty, and timestamps.",
            "If status is Cleared, treat the transfer as final — this page does not offer reverse.",
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
              problem: "Create transfer is unavailable.",
              solution:
                "Check Transfer capability and available balance for the asset on Money → Balance — see /help/funds/balance.",
            },
            {
              problem: "Confirm asks for a transaction password I never set.",
              solution:
                "Set the PIN under Security Settings → Transaction Password — see /help/account/security.",
            },
            {
              problem: "Is this Offline Collection?",
              solution:
                "No. Offline Collection is Pending audit / confirmation under Transactions — see /help/payments/offline-collection. Money → Transfers is merchant-to-merchant balance movement.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Payouts",
        href: "/help/funds/payouts",
      },
    },
  },
  "funds/settlements": {
    title: "Settlement bills",
    description:
      "Review settlement bills and settlement records in FilixPay Merchant Center: gross, fee, net, release, payout, and period coverage.",
    keywords: [
      "settlements",
      "settlement bills",
      "settlement records",
      "settlement statements",
      "net settlement",
      "released at",
      "provider reconciliation",
    ],
    body: {
      whoFor:
        "Finance operators who need released settlement facts, period statements, and how they reconcile with providers.",
      whenToUse:
        "Use this when you open Money → Settlement → Settlement bills or Settlement records after acquiring activity should settle to funds.",
      beforeYouStart: [
        "Know the settlement period, asset, or Money-In reference you are investigating.",
        "Have access to Money → Settlement bills and Settlement records.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Settlement bills show released settlement amounts (gross, fee, net) with provider and reconciliation status. Use this page to understand how settled funds relate to balance. Settlement records (statements) summarize day, week, or month periods for the same Money → Settlement area.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Open Money → Settlement → Settlement bills.",
            "Locate a bill by Settlement ID, Money-In ref, asset, or release time.",
            "Compare Gross, Fee, and Net with what you expect from orders and fees.",
            "Check Reconciliation status (Pending, Matched, Exception) and provider.",
            "If needed, continue to Transaction Reconciliation for order-level matching.",
          ],
        },
        {
          type: "heading",
          text: "Settlement records",
          anchor: "statements",
        },
        {
          type: "paragraph",
          text: "Settlement records lists period statements by asset and Day / Week / Month. Filter by asset and date range, then open a row by statement key for detail. Columns include statement period, asset, status (Open / Closed), Settlement Net, Released, Payout, and data coverage (OK / Partial coverage / Inconsistent). Open periods show live amounts as of now; a period that has not started yet is unavailable.",
        },
        {
          type: "heading",
          text: "Key fields",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Settlement ID",
              description: "Identifier for the settlement bill row.",
            },
            {
              field: "Gross / Fee / Net",
              description:
                "Settled total, fees deducted, and net amount related to funds movement.",
            },
            {
              field: "Released at",
              description: "When the settlement fact was released.",
            },
            {
              field: "Reconciliation / Provider",
              description: "Match state against the payment provider and which provider settled.",
            },
            {
              field: "Statement period / Coverage",
              description:
                "On Settlement records: the Day/Week/Month key and whether period data coverage is complete.",
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
              problem: "Reconciliation shows Exception.",
              solution:
                "Open the bill detail if available, compare amounts with provider statements, then use Transaction Reconciliation for order-scoped mismatches.",
            },
            {
              problem: "I expected a settlement but none appears.",
              solution:
                "Confirm the period and asset filters on Settlement bills or Settlement records, wait for release timing, and verify related orders reached success before settlement.",
            },
            {
              problem: "Settlement records says the period has not started.",
              solution:
                "Choose a past or current period range. Future Day/Week/Month keys have no statement yet.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Transaction Reconciliation",
        href: "/help/funds/reconciliation",
      },
    },
  },
  "funds/reconciliation": {
    title: "Transaction Reconciliation",
    description:
      "Match provider transaction bills against local orders in FilixPay Merchant Center Transaction Reconciliation.",
    keywords: [
      "reconciliation",
      "transaction reconciliation",
      "matched",
      "mismatch",
      "provider bills",
    ],
    body: {
      whoFor:
        "Finance and ops teams who compare provider bills with Merchant Center orders.",
      whenToUse:
        "Use this when settlement or finance review requires order-scoped reconciliation status.",
      beforeYouStart: [
        "Know the channel and business date you want to reconcile.",
        "Have Settlement bills or order references ready for mismatch follow-up.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Transaction Reconciliation matches provider transaction bills to local orders (scope: Order). Statuses include Matched, Mismatch, Pending, and Not reconciled. Use it to explain differences between provider bills and local funds movement.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Open Money → Settlement → Transaction Reconciliation.",
            "Filter by channel, business date, and scope (Reconciled only / All transactions).",
            "Review rows that are Matched versus Mismatch or Pending.",
            "Open mismatch rows and compare provider amounts with local order amounts.",
            "Follow up on exceptions with Settlement bills and Orders until status is Matched or explained.",
          ],
        },
        {
          type: "heading",
          text: "Key statuses",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Matched",
              description: "Provider bill and local order amounts align for the row.",
            },
            {
              field: "Mismatch",
              description: "Values differ; investigate amount, fees, or duplicate posting.",
            },
            {
              field: "Pending / Not reconciled",
              description: "Matching not finished or not yet attempted for that transaction.",
            },
            {
              field: "Channel / Biz date",
              description: "Filters that define which provider day you are reconciling.",
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
              problem: "Everything shows Not reconciled.",
              solution:
                "Widen or correct the business date and channel filters. Switch scope to All transactions, then refresh after provider bills are imported.",
            },
            {
              problem: "Mismatch on fees only.",
              solution:
                "Compare Gross/Fee/Net on Settlement bills with the provider statement. Document fee differences before treating the order as failed.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Back to balance",
        href: "/help/funds/balance",
      },
    },
  },
  "funds/external-accounts": {
    title: "External accounts for payouts",
    description:
      "Add and manage BANK and CRYPTO (USDT on TRON) destinations under Money → External accounts for FilixPay Merchant Center payouts.",
    keywords: [
      "external accounts",
      "bank account payout",
      "crypto payout destination",
      "USDT TRON",
      "disable external account",
    ],
    body: {
      whoFor:
        "Operators who need payout destinations before creating withdrawals under Money → Payouts.",
      whenToUse:
        "Use this when you open Money → External accounts to add a bank or crypto destination, or to disable one that should no longer receive payouts.",
      beforeYouStart: [
        "Sign in with access to Money → External accounts.",
        "For bank accounts, have country, currency, account holder name, and account number ready (for example holder Example Merchant LLC).",
        "For crypto destinations, have a USDT address on TRON ready. Full numbers and addresses are masked after save.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "External accounts lists BANK and CRYPTO destinations used when you withdraw from Money → Payouts. This guide covers the list, Add account modal, and Disable. It does not cover creating payouts, and it is separate from Money → Money-In → Digital currency deposit wallets.",
        },
        {
          type: "heading",
          text: "Open External accounts",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Under Money → Payouts, open External accounts.",
            "Confirm the page title External accounts and the Add account action.",
          ],
        },
        {
          type: "heading",
          text: "Read the account list",
          anchor: "list",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Type",
              description: "Bank or Crypto as shown in the table.",
            },
            {
              field: "Account / address",
              description:
                "Masked account number or wallet address after save. Full values are not shown again.",
            },
            {
              field: "Holder / network",
              description:
                "Bank account holder name, or crypto network (for example TRON) with memo note when present.",
            },
            {
              field: "Bank / Currency / Country",
              description:
                "Bank name, currency, and country for BANK rows. Crypto rows show dashes for these columns.",
            },
            {
              field: "Status",
              description: "Active or Disabled. Only Active accounts can be used for payouts.",
            },
          ],
        },
        {
          type: "heading",
          text: "Add a bank account",
          anchor: "add-bank",
        },
        {
          type: "steps",
          items: [
            "Choose Add account.",
            "Set Account type to Bank account.",
            "Select Country / region and Currency.",
            "Enter Account holder name (not an email) and Account number.",
            "Optionally enter Bank name and Bank code, then Save account.",
            "Confirm the new row appears with a masked Account / address.",
          ],
        },
        {
          type: "heading",
          text: "Add a crypto destination",
          anchor: "add-crypto",
        },
        {
          type: "steps",
          items: [
            "Choose Add account.",
            "Set Account type to Crypto address (USDT / TRON).",
            "Select Network (TRON) and enter Wallet address.",
            "Optionally enter Memo / tag if your destination requires it, then Save account.",
            "Confirm the row shows Type Crypto with a masked address.",
          ],
        },
        {
          type: "heading",
          text: "Disable an account",
          anchor: "disable",
        },
        {
          type: "steps",
          items: [
            "On an Active row, open Actions and choose Disable.",
            "Confirm the disable prompt.",
            "Confirm Status becomes Disabled and the account is no longer selectable for new payouts.",
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
              problem: "I cannot see the full account number or address after save.",
              solution:
                "That is expected. External accounts store masked values only after save. Re-enter details only by adding a new account if you need a different destination.",
            },
            {
              problem: "Is this the same as Digital currency under Money-In?",
              solution:
                "No. External accounts are payout destinations. Deposit addresses for receiving crypto live under Money → Money-In → Digital currency — see /help/funds/crypto.",
            },
            {
              problem: "Withdraw cannot find my destination.",
              solution:
                "Confirm the account Status is Active on External accounts, then reopen Money → Payouts. See /help/funds/payouts for the withdraw flow.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Payouts",
        href: "/help/funds/payouts",
      },
    },
  },
  "funds/crypto": {
    title: "Digital currency deposit addresses",
    description:
      "Configure blockchain deposit addresses under Money → Money-In → Digital currency so FilixPay can monitor on-chain deposits for your merchant.",
    keywords: [
      "digital currency",
      "crypto deposit wallet",
      "deposit address",
      "blockchain network",
      "USDT deposit",
    ],
    body: {
      whoFor:
        "Operators who configure on-chain addresses for receiving crypto deposits into FilixPay settlement monitoring.",
      whenToUse:
        "Use this when you open Money → Money-In → Digital currency to add, edit, copy, or activate/inactivate a deposit address.",
      beforeYouStart: [
        "Sign in with permission to manage deposit addresses (Add deposit address appears when you can manage).",
        "Have the correct chain, settlement asset, and deposit address under your control.",
        "Read the on-page security notice: FilixPay does not custody private keys or seed phrases.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Digital currency lists deposit addresses the platform monitors for on-chain deposits. This guide covers the list, add/edit drawer, copy address, and Active/Inactive status. It does not cover crypto payout destinations under External accounts, and it does not document exchange how-tos.",
        },
        {
          type: "heading",
          text: "Open Digital currency",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Under Money → Money-In, open Digital currency.",
            "Confirm the page title Digital currency and the deposit address table.",
          ],
        },
        {
          type: "heading",
          text: "Read the wallet list",
          anchor: "list",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Blockchain network",
              description: "Chain badge and network/protocol label for the deposit address.",
            },
            {
              field: "Settlement asset",
              description: "Asset code monitored for settlement (for example USDT).",
            },
            {
              field: "Deposit address",
              description: "On-chain address with a copy control.",
            },
            {
              field: "Label",
              description: "Optional label you set when adding or editing.",
            },
            {
              field: "Status",
              description:
                "Active or Inactive. When you can manage, click the status pill to toggle.",
            },
            {
              field: "Updated",
              description: "Last update time for the wallet row.",
            },
          ],
        },
        {
          type: "heading",
          text: "Add or edit a deposit address",
          anchor: "add-edit",
        },
        {
          type: "steps",
          items: [
            "Choose Add deposit address, or open Edit on an existing row.",
            "Select blockchain network and settlement asset from the supported options.",
            "Enter the deposit address and confirm it matches the format hint for that chain.",
            "Optionally set a label, confirm the ownership checkbox when shown, then save.",
            "Confirm the row appears or updates in the table.",
          ],
        },
        {
          type: "heading",
          text: "Copy an address",
          anchor: "copy",
        },
        {
          type: "steps",
          items: [
            "On the Deposit address cell, choose the copy control.",
            "Paste into your wallet or exchange only after verifying the address yourself.",
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
              problem: "Add deposit address is missing or the page is read-only.",
              solution:
                "Your role may lack manage permission, or addresses are platform-managed. Use the on-page banner text and contact your admin or support for changes.",
            },
            {
              problem: "I confused this with External accounts crypto.",
              solution:
                "Digital currency is for receiving deposits. CRYPTO rows under External accounts are payout destinations — see /help/funds/external-accounts.",
            },
            {
              problem: "Deposit sent but Money-In / Balance did not update.",
              solution:
                "Confirm the address Status is Active, asset and network match what you sent, then check Money → Money-In — see /help/funds/money-in.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Money-In",
        href: "/help/funds/money-in",
      },
    },
  },
};
