import type { HelpArticleContent } from "../article-content";

export const enPayments: Record<string, HelpArticleContent> = {
  "payments/orders": {
    title: "Manage orders",
    description:
      "Search, view, create, and operate transaction orders in FilixPay Merchant Center Order Management.",
    keywords: [
      "orders",
      "order management",
      "trade no",
      "merchant order id",
      "transactions",
    ],
    body: {
      whoFor:
        "Operators who need to find payment orders, check status, create orders, or start refunds from the Orders list.",
      whenToUse:
        "Use this when you open Transactions → Orders to investigate a payment, export results, or create an order.",
      beforeYouStart: [
        "Sign in with a role that can view Orders.",
        "Have the Merchant Order ID, Trade No, or customer code ready when searching for a specific order.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Order Management lists trade and related order types for your merchant. Filter by status, channel, sub-merchant, location, amount, and date ranges. Demo Merchant Order IDs look like DEMO-ORD-1001 — never use real customer emails or phone numbers in examples (use buyer@example.com or 13800138000 instead).",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Open Transactions → Orders.",
            "Enter Merchant Order ID, Trade No, Customer Code, or other filters, then search.",
            "Open a row to view detail, or use list actions such as Initiate Payment, Initiate Refund, or Patch Order when shown.",
            "To create an order, choose Create Order and complete Merchant Order ID, subject, amount, currency, and related fields.",
            "Export CSV when you need an offline copy of the filtered list.",
          ],
        },
        {
          type: "heading",
          text: "Key fields and statuses",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Merchant Order ID / Trade No",
              description: "Your reference and FilixPay trade identifier used for search and support.",
            },
            {
              field: "Order type",
              description:
                "Examples include trade order, deposit, transfer, payout, refund, and platform service fee.",
            },
            {
              field: "Payment channel / amount",
              description: "Channel used for the payment and the order amount with currency.",
            },
            {
              field: "Trade status",
              description:
                "Lifecycle such as Pending, Processing, Success, Closed, Failed, Requires capture, or Disputed.",
            },
            {
              field: "Created At / Paid At",
              description: "When the order was created and when payment succeeded, if applicable.",
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
              problem: "I cannot find an order I just created.",
              solution:
                "Clear filters, widen the created-date range, and search by Merchant Order ID. Refresh the list after create completes.",
            },
            {
              problem: "How do I refund from Orders?",
              solution:
                "Open the order and use Initiate Refund when available, or go to Refund Management for the refunds list. See /help/risk/refunds for refund statuses.",
            },
            {
              problem: "What is Offline transfer on create order?",
              solution:
                "That option ties the order to Offline Collection (bank-transfer collection), not Money transfers. See Offline Collection for audit and confirmation.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Offline Collection",
        href: "/help/payments/offline-collection",
      },
    },
  },
  "payments/offline-collection": {
    title: "Offline Collection",
    description:
      "Run Offline Collection in FilixPay Merchant Center: audit pending bank transfers, then confirm receipt with a second operator.",
    keywords: [
      "offline collection",
      "bank transfer",
      "pending audit",
      "pending confirmation",
      "four-eyes",
    ],
    body: {
      whoFor:
        "Merchants who collect payment by offline bank transfer and need maker/checker review before confirming funds received.",
      whenToUse:
        "Use this when a buyer pays by bank transfer and you must complete Offline Collection audit and confirmation — not for product ratings or catalog reviews.",
      beforeYouStart: [
        "Confirm two operators with Offline Collection permissions (maker for audit, checker for confirmation).",
        "Have the buyer bank evidence and matching Merchant Order ID or Trade No.",
        "Open the related order if you need amount and payer context before audit.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Offline Collection (线下归集) is the bank-transfer collection workflow under Transactions. Pending audit is the maker step; Pending confirmation is the checker step. The confirmation screen path is /dashboard/reviews, but it is Offline Collection confirmation — never product reviews or 商品评价. Do not confuse it with Risk Reviews or Money → Transfers.",
        },
        {
          type: "heading",
          text: "Steps — audit (maker)",
          anchor: "steps-audit",
        },
        {
          type: "steps",
          items: [
            "Open Transactions → Offline collection → Pending audit (Offline collection audit).",
            "Find the row by Merchant Order ID, Trade No, or Bank Transaction Ref.",
            "Verify payer, payee, amount, and buyer payment evidence against the bank record.",
            "Enter Bank transaction ID, amount actually received, bank transaction time, and notes as required.",
            "Choose Propose received or Propose not received, then submit for confirmation.",
          ],
        },
        {
          type: "heading",
          text: "Steps — confirmation (checker)",
          anchor: "steps-confirmation",
        },
        {
          type: "steps",
          items: [
            "Open Transactions → Offline collection → Pending confirmation (Offline collection confirmation).",
            "Review the maker proposal independently (four-eyes rule).",
            "Choose Confirm received, Confirm not received, or Return to audit.",
            "Confirm the confirmation status updates (Confirmed received / Confirmed not received).",
          ],
        },
        {
          type: "heading",
          text: "Key fields and statuses",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Bank Transaction Ref / ID",
              description: "Reference used to match the buyer transfer on the bank statement.",
            },
            {
              field: "Amount actually received",
              description: "Amount the maker records from the bank credit, which may differ from order amount.",
            },
            {
              field: "Audit status",
              description: "Pending audit, Submitted, or Proposed not received on the audit list.",
            },
            {
              field: "Confirmation status",
              description:
                "Pending confirmation, Confirmed received, or Confirmed not received on the confirmation list.",
            },
            {
              field: "Maker / Checker",
              description: "First operator (audit) and second operator (confirmation). Same person cannot complete both steps when four-eyes is enforced.",
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
              problem: "Is this the product reviews page?",
              solution:
                "No. Offline Collection confirmation uses the reviews path for bank-transfer confirmation only. It is not product reviews or 商品评价.",
            },
            {
              problem: "I cannot confirm my own audit.",
              solution:
                "Four-eyes rules require a different checker. Sign in as another authorized operator for Pending confirmation.",
            },
            {
              problem: "Amount on the bank slip does not match the order.",
              solution:
                "Record the amount actually received and use Propose not received or notes when policy requires exception handling, then let the checker confirm or return to audit.",
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
};
