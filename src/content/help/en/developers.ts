import type { HelpArticleContent } from "../article-content";

export const enDevelopers: Record<string, HelpArticleContent> = {
  "developers/developer-center": {
    title: "Use Developer Center in Merchant Center",
    description:
      "Find the right FilixPay Developer Center area—Applications, Sandbox, Explorer, Production Access, Webhooks, and Deliveries—and know when to open each tab.",
    keywords: [
      "FilixPay Developer Center",
      "Merchant Center developers",
      "applications",
      "sandbox",
      "API explorer",
      "production access",
      "webhooks tab",
    ],
    body: {
      whoFor:
        "Technical merchants and integrators who need to locate Developer Center features in FilixPay Merchant Center without reading API reference docs here.",
      whenToUse:
        "Use this when you open Developer Center for the first time, or when you need a map of which tab to use before configuring webhooks or payment channels.",
      beforeYouStart: [
        "Sign in to FilixPay Merchant Center with a role that can open Developer Center.",
        "Confirm you are in the correct organization / business account.",
        "For API calling details, plan to use Marketing Developers or API docs — this guide covers UI navigation only.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Developer Center is the Merchant Center home for integration UI: applications, sandbox testing, API exploration, production access entry, webhooks, and delivery history. This guide is a map (what / where / when). Step-by-step webhook endpoint work lives in the Webhooks guide; ongoing payment channel configuration lives in Payment channels.",
        },
        {
          type: "heading",
          text: "Open Developer Center",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Open Developer from the dashboard navigation (footer / developer entry).",
            "Use the tabs across the top of Developer Center to move between areas.",
          ],
        },
        {
          type: "heading",
          text: "Tab map",
          anchor: "tab-map",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Applications — What",
              description: "Manage applications used for integration credentials.",
            },
            {
              field: "Applications — Where",
              description: "Developer Center → Applications",
            },
            {
              field: "Applications — When",
              description: "Creating or managing apps before sandbox or production work.",
            },
            {
              field: "Sandbox — What",
              description: "Test environment for integration trials.",
            },
            {
              field: "Sandbox — Where",
              description: "Developer Center → Sandbox",
            },
            {
              field: "Sandbox — When",
              description: "Running integration tests with sandbox credentials.",
            },
            {
              field: "Explorer — What",
              description: "Explore and try API calls from the UI.",
            },
            {
              field: "Explorer — Where",
              description: "Developer Center → Explorer",
            },
            {
              field: "Explorer — When",
              description: "Debugging or exploring APIs without leaving Merchant Center.",
            },
            {
              field: "Production Access — What",
              description:
                "Entry point and status for production access in Developer Center (not a policy handbook).",
            },
            {
              field: "Production Access — Where",
              description: "Developer Center → Production Access",
            },
            {
              field: "Production Access — When",
              description:
                "When you are preparing to go live and need to open the production access entry, read on-screen status, and follow the next step the UI shows.",
            },
            {
              field: "Webhooks — What",
              description:
                "Overview of webhook management. Full create / view / enable-disable / delete steps are in the Webhooks guide.",
            },
            {
              field: "Webhooks — Where",
              description: "Developer Center → Webhooks",
            },
            {
              field: "Webhooks — When",
              description: "Configuring event notifications to your endpoint.",
            },
            {
              field: "Deliveries — What",
              description:
                "Overview of webhook delivery history. Troubleshooting steps are in the Webhooks guide.",
            },
            {
              field: "Deliveries — Where",
              description: "Developer Center → Deliveries",
            },
            {
              field: "Deliveries — When",
              description: "Checking whether webhook events were delivered successfully.",
            },
          ],
        },
        {
          type: "heading",
          text: "Production Access boundary",
          anchor: "production-access",
        },
        {
          type: "paragraph",
          text: "On Production Access, use the UI to find the entry, read the status shown, and follow the next step Merchant Center presents. Help does not document approval criteria, review timelines, or eligibility rules — those can change and are shown in-product when relevant.",
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
              problem: "I cannot see Developer Center or some tabs.",
              solution:
                "Confirm you signed into the correct organization and that your role includes developer permissions. Refresh the page after switching accounts.",
            },
            {
              problem: "I need API payloads or SDK samples.",
              solution:
                "Stay on this guide for UI navigation only. Use FilixPay for developers (Marketing) for product context, and API docs when they are available — do not expect Help to replace developer documentation.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Manage webhooks in Merchant Center",
        href: "/help/developers/webhooks",
      },
    },
  },

  "developers/webhooks": {
    title: "Manage and verify webhooks in Merchant Center",
    description:
      "Create, view, enable or disable, and delete FilixPay webhook endpoints; review deliveries; and use the webhook verification page in Merchant Center.",
    keywords: [
      "FilixPay webhook Merchant Center",
      "webhook endpoint",
      "webhook deliveries",
      "webhook verification",
      "enable disable webhook",
    ],
    body: {
      whoFor:
        "Operators and developers who configure webhook endpoints and check deliveries inside FilixPay Merchant Center.",
      whenToUse:
        "Use this when you add or change a webhook endpoint, inspect deliveries, redeliver an event, or open the webhook signature verification help page.",
      beforeYouStart: [
        "Open Developer Center and confirm you can access the Webhooks and Deliveries tabs.",
        "Have an HTTPS endpoint URL ready (examples in Help use https://api.example.com/webhook only).",
        "Store any webhook secret in your own secure vault — never paste real secrets into tickets or public repos.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "This guide covers Merchant Center UI for webhook endpoints, deliveries, and the verification page. It does not document event schemas, signing algorithms, or signature implementation details. Fictional placeholder URLs such as https://api.example.com/webhook may appear as plain text only.",
        },
        {
          type: "heading",
          text: "Create, view, enable/disable, and delete endpoints",
          anchor: "endpoints",
        },
        {
          type: "steps",
          items: [
            "Open Developer Center → Webhooks.",
            "Choose create / add endpoint, then enter your HTTPS URL (for demos use https://api.example.com/webhook).",
            "Save and confirm the endpoint appears in the list with its status.",
            "Open an endpoint to view details.",
            "Enable or disable the endpoint from the UI when you need to pause or resume notifications without deleting it.",
            "Delete an endpoint only when you no longer need that URL; confirm the prompt before removing it.",
          ],
        },
        {
          type: "heading",
          text: "Deliveries and redeliver",
          anchor: "deliveries",
        },
        {
          type: "steps",
          items: [
            "Open Developer Center → Deliveries.",
            "Scan recent delivery attempts and status.",
            "Open a delivery for detail when troubleshooting.",
            "Use Redeliver when the UI offers it after you fix your endpoint.",
          ],
        },
        {
          type: "heading",
          text: "Webhook verification page",
          anchor: "verification",
        },
        {
          type: "steps",
          items: [
            "Open Webhook Verification from Developer Center (or use Open in Merchant Center from this guide).",
            "Read the on-page checklist for verifying signatures in your own service.",
            "Follow that page's guidance in your integration. Help does not document signature implementation details.",
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
              problem: "Endpoint shows inactive or disabled.",
              solution:
                "Open the endpoint in Webhooks and enable it. Confirm the URL is HTTPS and reachable from the public internet.",
            },
            {
              problem: "Verification failed on my server.",
              solution:
                "Compare your implementation with the Webhook Verification page checklist. If verification still fails, review the verification guidance and your integration implementation in the developer documentation. Help does not document signature implementation details.",
            },
            {
              problem: "Delivery failed repeatedly.",
              solution:
                "Check Deliveries for status detail, fix your endpoint response, then use Redeliver. Confirm the endpoint is enabled.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Back to Developer Center map",
        href: "/help/developers/developer-center",
      },
    },
  },

  "developers/payment-channels": {
    title: "Manage payment channel configuration in Merchant Center",
    description:
      "Open Payment Configs in FilixPay Merchant Center to add, edit, and view payment channel configurations for ongoing operations.",
    keywords: [
      "FilixPay payment channel configuration",
      "payment configs",
      "acquiring settings",
      "manage payment channel",
      "Merchant Center configs",
    ],
    body: {
      whoFor:
        "Merchants who already configured (or are maintaining) payment channels and need the ongoing Merchant Center UI guide—not first-time activation alone.",
      whenToUse:
        "Use this when you return to Payment Configs to add, edit, open/close, or review channel configurations during normal operations.",
      beforeYouStart: [
        "Confirm access to Transactions → Acquiring Settings → Payment Configs.",
        "Have provider credentials ready (use placeholders such as sk_test_placeholder in examples — never commit real secrets).",
        "If you have never added a channel, skim Getting Started → Configure your first payment channel first, then return here for ongoing management.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Payment Configs is the Merchant Center UI for channel configuration. This article covers ongoing manage/configure tasks. First-time activation steps stay in Getting Started; do not treat this page as a duplicate onboarding checklist.",
        },
        {
          type: "heading",
          text: "Open Payment Configs",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Go to Transactions → Acquiring Settings → Payment Configs (or use Open in Merchant Center).",
            "Review scenario cards and existing channel rows before making changes.",
          ],
        },
        {
          type: "heading",
          text: "Add, edit, and view channel config",
          anchor: "manage",
        },
        {
          type: "steps",
          items: [
            "Choose Add Configuration (or Add channel on a scenario card) to create a new row.",
            "Select payment brand, channel, scenario, and sub-merchant as required by the form.",
            "Enter credentials from your provider, then save. Obtain credentials from your provider's dashboard; Help will not walk third-party UIs field-by-field.",
            "Open an existing row to view or edit settings.",
            "Use Open / Close controls when you need routing on or off without deleting the configuration.",
          ],
        },
        {
          type: "heading",
          text: "Key fields (UI level)",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Payment brand / channel",
              description: "Which acquiring rail this configuration targets.",
            },
            {
              field: "Scenario / sub-merchant",
              description: "Scope of where the configuration applies in Merchant Center.",
            },
            {
              field: "Credentials",
              description:
                "Provider keys or secrets entered in the form. Use test placeholders in non-production; never publish real secrets.",
            },
            {
              field: "Open / Close",
              description: "Whether the channel is available for routing.",
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
              problem: "Save failed or validation blocked submit.",
              solution:
                "Fix required fields shown on the form. Confirm scenario and sub-merchant selections, then save again.",
            },
            {
              problem: "Missing credentials or channel will not open.",
              solution:
                "Obtain credentials from your payment provider, paste them carefully (no extra spaces), save, then set the channel to Open.",
            },
            {
              problem: "I still need first-time activation guidance.",
              solution:
                "Open the Getting Started payment channel guide linked under Related guides, complete first setup there, then return here for day-to-day changes.",
            },
          ],
        },
      ],
      nextStep: {
        label: "First-time payment channel setup",
        href: "/help/getting-started/payment-channel",
      },
    },
  },
};
