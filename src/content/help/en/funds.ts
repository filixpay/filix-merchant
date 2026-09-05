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
  "funds/settlements": {
    title: "Settlement bills",
    description:
      "Review settlement bills in FilixPay Merchant Center: gross, fee, net, release time, and provider reconciliation status.",
    keywords: [
      "settlements",
      "settlement bills",
      "net settlement",
      "released at",
      "provider reconciliation",
    ],
    body: {
      whoFor:
        "Finance operators who need released settlement facts and how they reconcile with providers.",
      whenToUse:
        "Use this when you open Money → Settlement → Settlement bills after acquiring activity should settle to funds.",
      beforeYouStart: [
        "Know the settlement period or Money-In reference you are investigating.",
        "Have access to Money → Settlement bills.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Settlement bills show released settlement amounts (gross, fee, net) with provider and reconciliation status. Use this page to understand how settled funds relate to balance.",
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
                "Confirm the period and asset filters, wait for release timing, and verify related orders reached success before settlement.",
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
};
