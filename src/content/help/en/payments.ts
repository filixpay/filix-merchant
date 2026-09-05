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
  "payments/customers": {
    title: "Find customers in Merchant Center",
    description:
      "Open Customer Management in FilixPay Merchant Center to review the customer list and search by customer code, email, or phone.",
    keywords: [
      "FilixPay customers Merchant Center",
      "customer list",
      "find customer by email",
      "customer code",
      "customer phone search",
    ],
    body: {
      whoFor:
        "Operators who need to locate an existing customer record in FilixPay Merchant Center using the Customers list and filters.",
      whenToUse:
        "Use this when you need to find a customer by code, email, or phone, or review customer fields shown on the list.",
      beforeYouStart: [
        "Sign in to FilixPay Merchant Center with access to Customers.",
        "Have at least one identifier ready when searching (customer code, email such as customer@example.com, or phone such as 13800138000).",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Customers (page title: Customer Management) is the Merchant Center list for viewing customer records. This guide covers opening the list, reading row fields, and searching. It does not cover creating or editing customers, Customer APIs, or a separate detail page — those are not part of this screen.",
        },
        {
          type: "heading",
          text: "Open the customer list",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Open Customers from the sidebar.",
            "Confirm the page title Customer Management and the filter bar above the table.",
          ],
        },
        {
          type: "heading",
          text: "Review customer records on the list",
          anchor: "list",
        },
        {
          type: "paragraph",
          text: "Customer records appear as table rows. There is no separate customer detail page on this screen — read the fields shown in each row.",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Customer Code",
              description: "Unique customer code shown in the list.",
            },
            {
              field: "Name",
              description: "Customer display name.",
            },
            {
              field: "Email",
              description: "Email address on the record.",
            },
            {
              field: "Mobile",
              description: "Mobile number column on the table (label Mobile).",
            },
            {
              field: "Status",
              description: "Customer status badge as shown in Merchant Center.",
            },
            {
              field: "Created At",
              description: "When the customer record was created.",
            },
          ],
        },
        {
          type: "heading",
          text: "Search by code, email, or phone",
          anchor: "search",
        },
        {
          type: "steps",
          items: [
            "In the filter bar, enter Customer Code, Email, and/or Phone as needed. The Phone filter placeholder is Phone (distinct from the Mobile table column).",
            "Choose Search to apply filters. Empty fields are ignored.",
            "When multiple fields are filled, Merchant Center applies the provided filters together.",
            "Choose Reset to clear filters and return to the unfiltered list.",
            "Use pagination controls to move through results.",
          ],
        },
        {
          type: "heading",
          text: "Common scenarios",
          anchor: "scenarios",
        },
        {
          type: "steps",
          items: [
            "Known email: enter Email (for example customer@example.com), then Search.",
            "Known phone: enter Phone (for example 13800138000), then Search.",
            "Known customer code: enter Customer Code, then Search.",
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
              problem: "No customer data found.",
              solution:
                "Confirm you are in the correct organization or business account, clear filters with Reset, then Search again. If the list is still empty, no customers are available for this account yet.",
            },
            {
              problem: "Search returns no matching rows.",
              solution:
                "Check spelling and extra spaces. Try one identifier at a time. Remember the filter uses Phone while the table column is labeled Mobile.",
            },
            {
              problem: "I expected a customer detail page.",
              solution:
                "This Merchant Center screen shows records in the table only. Use the row fields for review. A separate detail route is not part of this UI.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Review payments and orders",
        href: "/help/payments/orders",
      },
    },
  },
};
