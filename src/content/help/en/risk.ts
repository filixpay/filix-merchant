import type { HelpArticleContent } from "../article-content";

export const enRisk: Record<string, HelpArticleContent> = {
  "risk/refunds": {
    title: "Manage refunds",
    description:
      "Search, create, and track refund orders in FilixPay Merchant Center Refund Management.",
    keywords: [
      "refunds",
      "refund management",
      "initiate refund",
      "refund status",
      "refund settings",
      "refund approvals",
      "auto-execute threshold",
      "after-sales",
    ],
    body: {
      whoFor:
        "Operators who process customer refunds, configure auto-execute thresholds, or approve pending refunds.",
      whenToUse:
        "Use this when you open Transactions → Refunds, Refund settings, Refund approvals, or after initiating a refund from an order.",
      beforeYouStart: [
        "Have the original Order ID or Refund ID ready.",
        "Confirm your role can create refunds, change Refund settings, or act on Refund approvals.",
        "Know whether amount-based approval is enabled and what the auto-execute threshold is.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Refund Management lists refund orders with Refund ID, Order ID, amount, status, and submitted time. Refunds are merchant-initiated returns of captured payments — separate from Disputes & Chargebacks. Demo emails in notes should stay like refunds-ops@example.com.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Open Transactions → Refunds (Refund Management).",
            "Search by Refund ID or Order ID to find an existing refund.",
            "To create a refund, choose Create Refund (or Initiate Refund from the related order).",
            "Enter amount and required reason fields, then submit.",
            "If the amount exceeds auto-execute settings, wait for Refund approvals before execution completes.",
            "Watch status move from Requested or Processing to Succeeded, Failed, or Cancelled.",
          ],
        },
        {
          type: "heading",
          text: "Refund settings",
          anchor: "settings",
        },
        {
          type: "paragraph",
          text: "Refund settings controls when a refund executes automatically versus waiting for merchant approval. Settlement currency is shown read-only. You can enable Skip amount-based approval, or set an Auto-execute threshold in settlement currency. Cross-currency refunds are converted via FX before comparison; if no quote is available, the refund still creates but awaits approval. Save settings or Refresh to reload.",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Settlement currency",
              description: "Read-only currency used when comparing refund amounts to the threshold.",
            },
            {
              field: "Skip amount-based approval",
              description:
                "When enabled, amount alone never triggers approval. FX conversion failures can still require approval.",
            },
            {
              field: "Auto-execute threshold",
              description:
                "Refunds at or below this amount (in settlement currency) execute automatically. Larger amounts stay pending until approved. A platform-default banner may appear when you have not set a merchant override.",
            },
          ],
        },
        {
          type: "heading",
          text: "Refund approvals",
          anchor: "approvals",
        },
        {
          type: "paragraph",
          text: "Refund approvals lists refunds that exceeded the auto-execute threshold and are waiting for approval. Review Refund ID, Order ID, amount, status, and created time. Approve executes the refund through the payment channel; Reject cancels the request so it does not hit the channel. Open View detail for the full refund record.",
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
              field: "Refund ID / Order ID",
              description: "Refund record identifier and the original order being refunded.",
            },
            {
              field: "Amount",
              description: "Refund amount; may be partial relative to the order.",
            },
            {
              field: "Status",
              description: "Requested, Processing, Succeeded, Failed, or Cancelled.",
            },
            {
              field: "Submitted At",
              description: "When the refund request entered the system.",
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
              problem: "Refund stays in Processing.",
              solution:
                "Refresh the list and open detail. If approvals apply, check Refund approvals. Confirm the original order is in a refundable status.",
            },
            {
              problem: "Create Refund is unavailable.",
              solution:
                "Open the order first and use Initiate Refund when the trade status allows it, or confirm your role permissions and Refund settings.",
            },
            {
              problem: "Is this the same as a chargeback?",
              solution:
                "No. Refunds are merchant-started. Card-network disputes are under Disputes & Chargebacks — see /help/risk/disputes.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Disputes & Chargebacks",
        href: "/help/risk/disputes",
      },
    },
  },
  "risk/disputes": {
    title: "Disputes and chargebacks",
    description:
      "Monitor chargeback cases, response deadlines, and merchant actions in FilixPay Merchant Center Disputes & Chargebacks.",
    keywords: [
      "disputes",
      "chargebacks",
      "evidence",
      "response due",
      "risk management",
    ],
    body: {
      whoFor:
        "Risk and ops teams who respond to payment chargebacks and upload evidence before deadlines.",
      whenToUse:
        "Use this when Cases Require Action, Due Soon, or Overdue appear, or when you open Risk Management → Disputes & Chargebacks.",
      beforeYouStart: [
        "Collect receipt, shipping, or communication evidence for the order.",
        "Note the Case No. and Response Due date from the disputes list.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Disputes & Chargebacks tracks card-network chargeback cases — not Offline Collection confirmations and not Risk Reviews for fraud queues. Priority and Response Due drive what you work first. Upload evidence categories such as Receipt, Shipping, Communication, or Other.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Open Risk Management → Disputes & Chargebacks.",
            "Review KPIs for Cases Require Action, Due Soon (under 3 days), and Overdue.",
            "Open a case by Case No. or Order ID.",
            "In the Merchant Action Center, follow required actions and upload evidence files.",
            "Submit your response before Response Due and monitor status (Draft → Submitted → Under Review → Won / Lost / Accepted).",
          ],
        },
        {
          type: "heading",
          text: "Dispute detail",
          anchor: "detail",
        },
        {
          type: "paragraph",
          text: "Open a case for dispute detail: Case No., Order ID, channel, amount, reason, priority, status, and Response Due. Use the Merchant Action Center to complete required actions and upload evidence (Receipt, Shipping, Communication, or Other). Review the timeline, coverage panels when shown, and related risk links before the deadline.",
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
              field: "Case No. / Order ID",
              description: "Chargeback case identifier and the related payment order.",
            },
            {
              field: "Reason / Priority",
              description: "Dispute reason code context and Critical / High / Medium / Low priority.",
            },
            {
              field: "Status",
              description: "Draft, Submitted, Under Review, Won, Lost, or Accepted.",
            },
            {
              field: "Response Due",
              description: "Deadline to provide merchant evidence or accept the case outcome path.",
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
              problem: "I opened Reviews but cannot find chargebacks.",
              solution:
                "Chargebacks live under Disputes & Chargebacks. Offline Collection confirmation and Risk Reviews are different queues.",
            },
            {
              problem: "Evidence upload fails.",
              solution:
                "Use supported evidence types (Receipt, Shipping, Communication, Other), check file size limits on the form, and retry before Response Due.",
            },
            {
              problem: "Case is Overdue.",
              solution:
                "Open the case immediately, submit whatever evidence remains available, and escalate internally — late responses raise Lost risk.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Manage refunds",
        href: "/help/risk/refunds",
      },
    },
  },
  "risk/controls": {
    title: "Fraud events, risk reviews, and risk rules",
    description:
      "Find Fraud Events, the Risk Review Queue, and read-only Risk Rules under Risk Management in FilixPay Merchant Center.",
    keywords: [
      "fraud events",
      "risk review queue",
      "risk rules",
      "PRE_AUTH",
      "risk management",
    ],
    body: {
      whoFor:
        "Operators who monitor fraud signals, check the manual review queue, or view platform and merchant risk rules.",
      whenToUse:
        "Use this when you open Risk Management → Fraud, Risk Reviews, or Risk Rules to investigate a signal or understand which PRE_AUTH rules are in effect.",
      beforeYouStart: [
        "Sign in with access to Risk Management menus.",
        "Have an order ID, payment ID, or keyword ready when searching Fraud Events or Risk Reviews (for example ORD_EXAMPLE_001).",
        "Know that Risk Rules in Merchant Center are read-only — Help does not document how to create or edit rules.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Risk Management exposes three related surfaces. Fraud Events lists detected fraud signals and investigation status. Risk Review Queue is a read-only list of suspicious orders and payouts flagged for manual review. Risk Rules shows platform and merchant PRE_AUTH rules (read-only). This guide maps What / Where / When and how to open each list; it does not cover scoring algorithms or Credit.",
        },
        {
          type: "heading",
          text: "What / Where / When",
          anchor: "map",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Fraud Events",
              description:
                "Open Risk Management → Fraud when you need event type, severity, related order, and investigation status.",
            },
            {
              field: "Risk Review Queue",
              description:
                "Open Risk Management → Risk Reviews when an order or payout is flagged for manual review (Pending / Approved / Rejected).",
            },
            {
              field: "Risk Rules",
              description:
                "Open Risk Management → Risk Rules when you need to see which PRE_AUTH velocity or amount rules are enabled and how they enforce (Block or Review before payment).",
            },
          ],
        },
        {
          type: "heading",
          text: "Work with Fraud Events",
          anchor: "fraud",
        },
        {
          type: "steps",
          items: [
            "Open Risk Management → Fraud (Fraud Events).",
            "Filter by keyword, Status, and Severity as needed, then Search. Use Reset to clear filters.",
            "Read Event Type, Risk Type, Description, Severity, Related Order, Status, and Detected At.",
            "Open a row to view Fraud Event Detail (payment ID, provider, risk score, and metadata when present).",
            "Use Back to fraud events to return to the list.",
          ],
        },
        {
          type: "heading",
          text: "Work with Risk Reviews",
          anchor: "reviews",
        },
        {
          type: "steps",
          items: [
            "Open Risk Management → Risk Reviews (Risk Review Queue).",
            "Filter by keyword, Status, Priority, and Review type when needed, then Search.",
            "Read Resource (Order or Payout), Reason, Priority, Status, and Flagged At.",
            "Open a row for Review Detail (reason code, queued/decided times, decision note, linked fraud event, resume link when shown).",
            "Treat the queue as read-only in Merchant Center — decisions may be completed outside this list UI.",
          ],
        },
        {
          type: "heading",
          text: "View Risk Rules",
          anchor: "rules",
        },
        {
          type: "steps",
          items: [
            "Open Risk Management → Risk Rules.",
            "Review Name, Type (Velocity or Amount), Severity, Enforcement, Scope (Platform or Merchant), Enabled, and Priority.",
            "Use this list to understand which rules can block or send traffic to review before payment. Do not expect an edit action on this page.",
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
              problem: "I cannot edit a risk rule in Merchant Center.",
              solution:
                "Risk Rules is read-only here. Ask your admin or platform operator if a rule change is required. Help does not document rule authoring APIs.",
            },
            {
              problem: "Is a fraud event the same as a chargeback?",
              solution:
                "No. Fraud Events and Risk Reviews are risk-control surfaces. Card-network disputes live under Disputes & Chargebacks — see /help/risk/disputes. Merchant-started returns are under Refunds — see /help/risk/refunds.",
            },
            {
              problem: "Review queue stays Pending with no action button.",
              solution:
                "The Merchant Center queue is read-only. Open Review Detail for linked fraud or resume information, and follow your internal review process or platform instructions.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Disputes & Chargebacks",
        href: "/help/risk/disputes",
      },
    },
  },
  "risk/coverage": {
    title: "Coverage insurance and chargeback coverage",
    description:
      "Subscribe to platform-hosted coverage insurance or configure chargeback coverage providers under Risk Management → Coverage Services in FilixPay Merchant Center.",
    keywords: [
      "coverage insurance",
      "chargeback coverage",
      "coverage config",
      "dispute coverage provider",
      "activate coverage",
    ],
    body: {
      whoFor:
        "Merchants who enable platform coverage insurance or configure third-party chargeback coverage providers for new cases.",
      whenToUse:
        "Use this when you open Coverage Insurance or Chargeback Coverage under Risk Management → Coverage Services. Which page you see depends on settlement mode and merchant type.",
      beforeYouStart: [
        "Sign in with access to Coverage Services menus.",
        "Know your settlement mode: PLATFORM merchants often use Coverage Insurance; DIRECT (and some PLATFORM merchants) use Chargeback Coverage config.",
        "For provider config, have provider credentials ready — never paste real secrets into Help examples.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Coverage Services exposes two related pages. Coverage Insurance activates or turns off platform-hosted coverage for your account. Chargeback Coverage configures provider connections (add, test, activate/deactivate). Access is capability-gated — if a page redirects away, use the other coverage surface or confirm settlement mode with your admin.",
        },
        {
          type: "heading",
          text: "What / Where / When",
          anchor: "map",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Coverage Insurance",
              description:
                "Open Risk Management → Coverage Services → Coverage Insurance to agree and Activate, or Turn off coverage. Review provider, subscribed time, and agreement version when shown.",
            },
            {
              field: "Chargeback Coverage",
              description:
                "Open Risk Management → Coverage Services → Chargeback Coverage to Add Configuration, Edit, Test Connection, and Activate or Deactivate providers.",
            },
          ],
        },
        {
          type: "heading",
          text: "Coverage Insurance",
          anchor: "insurance",
        },
        {
          type: "steps",
          items: [
            "Open Coverage Insurance.",
            "Read the agreement and choose Activate when you are ready to subscribe.",
            "To stop coverage, choose Turn off and confirm the dialog.",
            "Confirm subscribed / not subscribed / unavailable states from the on-page status.",
          ],
        },
        {
          type: "heading",
          text: "Chargeback Coverage config",
          anchor: "config",
        },
        {
          type: "steps",
          items: [
            "Open Chargeback Coverage.",
            "Choose Add Configuration and select a provider.",
            "Complete the schema fields shown (for example team, shop domain, environment, coverage limit, currency, mode) and secret fields when required.",
            "Use Test Connection, then Activate or Deactivate. Platform operators may also see maintenance controls.",
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
              problem: "The coverage page redirects or is unavailable.",
              solution:
                "Your settlement mode or merchant type may gate insurance vs config. Try the sibling Coverage Services page or ask your admin which surface applies.",
            },
            {
              problem: "Is coverage the same as disputes?",
              solution:
                "Coverage configures protection for new cases. Existing chargeback cases are under Disputes — see /help/risk/disputes.",
            },
            {
              problem: "Test Connection failed.",
              solution:
                "Recheck provider fields and secrets, then retry Test Connection before Activate. Help does not document provider-side dashboards.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Disputes & Chargebacks",
        href: "/help/risk/disputes",
      },
    },
  },
};
