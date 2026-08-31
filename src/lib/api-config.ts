/** Same-origin relative base - avoids http/https CSP mixed-content on connect-src. */
export const API_BASE_URL = '/merchant/service';

export const ENDPOINTS = {
    PUBLIC: {
        MERCHANTS: '/public/merchants',
    },
    PORTAL: {
        FINANCIAL_INSTITUTIONS: '/portal/financial-institutions',
        CHANNELS: '/portal/channels',
        SCENARIOS: '/portal/scenarios',
        CONFIGS: '/portal/configs',
        CHECKOUTS: '/portal/checkouts',
        ORDERS: '/portal/orders',
        ORDERS_SERVICE_FEE: '/portal/orders/service-fee',
        ORDERS_TODAY_TOTAL: '/portal/orders/today-total',
        REFUNDS: '/portal/refunds',
        REFUND_SETTINGS: '/portal/refund-settings',
        REFUNDS_PENDING_APPROVAL: '/portal/refunds/pending-approval',
        DEVELOPER_WEBHOOKS: '/developer/webhook-endpoints',
        DEVELOPER_WEBHOOK_DELIVERIES: '/developer/webhook-deliveries',
        DEVELOPER_APPLICATIONS: '/developer/applications',
        DEVELOPER_CONTRACTS: '/developer/contracts',
        DEVELOPER_EXPLORER_EXECUTE: '/developer/explorer/execute',
        MY_ORGANIZATIONS: '/portal/me/organizations',
        ORGANIZATION_CURRENT_MERCHANTS: '/portal/organization/current/merchants',
        organizationMembers: (organizationCode: number | string) =>
            `/portal/organizations/${encodeURIComponent(String(organizationCode))}/members`,
        organizationInvitations: (organizationCode: number | string) =>
            `/portal/organizations/${encodeURIComponent(String(organizationCode))}/invitations`,
        organizationRoles: (organizationCode: number | string) =>
            `/portal/organizations/${encodeURIComponent(String(organizationCode))}/roles`,
        organizationRole: (organizationCode: number | string, roleId: string) =>
            `/portal/organizations/${encodeURIComponent(String(organizationCode))}/roles/${encodeURIComponent(roleId)}`,
        organizationRoleScopes: (organizationCode: number | string, roleId: string) =>
            `/portal/organizations/${encodeURIComponent(String(organizationCode))}/roles/${encodeURIComponent(roleId)}/scopes`,
        organizationMember: (organizationCode: number | string, identityId: string) =>
            `/portal/organizations/${encodeURIComponent(String(organizationCode))}/members/${encodeURIComponent(identityId)}`,
        organizationMemberRole: (organizationCode: number | string, identityId: string) =>
            `/portal/organizations/${encodeURIComponent(String(organizationCode))}/members/${encodeURIComponent(identityId)}/role`,
        organizationInvitationAccept: (token: string) =>
            `/portal/invitations/${encodeURIComponent(token)}/accept`,
        organizationTeams: (organizationCode: number | string) =>
            `/portal/organizations/${encodeURIComponent(String(organizationCode))}/teams`,
        organizationTeam: (organizationCode: number | string, teamId: string) =>
            `/portal/organizations/${encodeURIComponent(String(organizationCode))}/teams/${encodeURIComponent(teamId)}`,
        organizationTeamArchive: (organizationCode: number | string, teamId: string) =>
            `/portal/organizations/${encodeURIComponent(String(organizationCode))}/teams/${encodeURIComponent(teamId)}/archive`,
        organizationTeamMembers: (organizationCode: number | string, teamId: string) =>
            `/portal/organizations/${encodeURIComponent(String(organizationCode))}/teams/${encodeURIComponent(teamId)}/members`,
        organizationTeamMember: (
            organizationCode: number | string,
            teamId: string,
            membershipId: string,
        ) =>
            `/portal/organizations/${encodeURIComponent(String(organizationCode))}/teams/${encodeURIComponent(teamId)}/members/${encodeURIComponent(membershipId)}`,
        organizationTeamMemberRole: (
            organizationCode: number | string,
            teamId: string,
            membershipId: string,
        ) =>
            `/portal/organizations/${encodeURIComponent(String(organizationCode))}/teams/${encodeURIComponent(teamId)}/members/${encodeURIComponent(membershipId)}/role`,
        MERCHANT: '/portal/merchant',
        CLIENTS: '/portal/clients',
        LOCATIONS: '/portal/locations',
        BANK_ACCOUNTS: '/portal/bank-accounts',
        TRANSFERS: '/portal/transfers',
        SUB_MERCHANTS: '/portal/sub-merchants',
        MERCHANTS: '/portal/merchants',
        MERCHANTS_LOOKUP_BY_CODE: '/portal/merchants/lookup-by-code',
        MERCHANT_BALANCE: '/portal/merchant/balance',
        MERCHANT_LEDGER_MOVEMENTS: '/portal/merchant/ledger-movements',
        WALLET_ACCOUNTS: '/portal/wallet/accounts',
        WALLET_OVERVIEW: '/portal/wallet/overview',
        WALLET_MOVEMENTS: '/portal/wallet/movements',
        WALLET_ACCOUNT_MOVEMENTS: (assetCode: string) =>
            `/portal/wallet/accounts/${encodeURIComponent(assetCode)}/movements`,
        WALLET_CAPABILITY: '/portal/wallet/capability',
        WALLET_ACCOUNT_CAPABILITY: (assetCode: string) =>
            `/portal/wallet/accounts/${encodeURIComponent(assetCode)}/capability`,
        WALLET_ACCOUNT_NETWORKS: (assetCode: string) =>
            `/portal/wallet/accounts/${encodeURIComponent(assetCode)}/networks`,
        WALLET_ACCOUNT_ADDRESSES: (assetCode: string, network: string) =>
            `/portal/wallet/accounts/${encodeURIComponent(assetCode)}/networks/${encodeURIComponent(network)}/addresses`,
        WALLET_ACCOUNT_IDENTITY_SUMMARY: (assetCode: string) =>
            `/portal/wallet/accounts/${encodeURIComponent(assetCode)}/identity-summary`,
        WALLET_DEPOSITS: '/portal/wallet/deposits',
        WALLET_TRANSFERS: '/portal/wallet/transfers',
        MONEY_GATE: '/portal/money/gate',
        MONEY_ASSET_CAPABILITY: (assetCode: string) =>
            `/portal/money/assets/${encodeURIComponent(assetCode)}/capability`,
        MONEY_BALANCE: '/portal/money/balance',
        MONEY_BALANCES: '/portal/money/balances',
        MONEY_ACTIVITY: '/portal/money/activity',
        MONEY_MONEY_INS: '/portal/money/money-ins',
        MONEY_MONEY_IN: (id: string) =>
            `/portal/money/money-ins/${encodeURIComponent(id)}`,
        MONEY_PAYOUTS: '/portal/money/payouts',
        MONEY_PAYOUT: (id: string) =>
            `/portal/money/payouts/${encodeURIComponent(id)}`,
        MONEY_EXTERNAL_ACCOUNTS: '/portal/money/external-accounts',
        MONEY_EXTERNAL_ACCOUNT: (id: string) =>
            `/portal/money/external-accounts/${encodeURIComponent(id)}`,
        MONEY_EXTERNAL_ACCOUNT_DISABLE: (id: string) =>
            `/portal/money/external-accounts/${encodeURIComponent(id)}/disable`,
        MONEY_TRANSFERS: '/portal/money/transfers',
        MONEY_TRANSFER: (id: string) =>
            `/portal/money/transfers/${encodeURIComponent(id)}`,
        MONEY_SETTLEMENTS: '/portal/money/settlements',
        MONEY_SETTLEMENT: (id: string) =>
            `/portal/money/settlements/${encodeURIComponent(id)}`,
        MONEY_SETTLEMENT_STATEMENTS: '/portal/money/settlement-statements',
        MONEY_SETTLEMENT_STATEMENT: (statementKey: string) =>
            `/portal/money/settlement-statements/${encodeURIComponent(statementKey)}`,
        MONEY_SETTLEMENT_STATEMENT_DOWNLOAD: (statementKey: string) =>
            `/portal/money/settlement-statements/${encodeURIComponent(statementKey)}/download.xlsx`,
        MONEY_TRANSACTION_RECON: '/portal/money/transaction-reconciliation',
        MONEY_TRANSACTION_RECON_ITEM: (reconciliationItemId: string) =>
            `/portal/money/transaction-reconciliation/${encodeURIComponent(reconciliationItemId)}`,
        MONEY_TRANSACTION_RECON_EXPORT: '/portal/money/transaction-reconciliation/export',
        COLLECTION_DESTINATIONS: '/portal/collection-destinations',
        SECURITY_CAPTCHA_SEND: '/portal/security/captcha/send',
        SECURITY_PAYMENT_PASSWORD: '/portal/security/payment-password',
        PAYOUTS: '/portal/payouts',
        PAYOUT_APPLICATIONS: '/portal/payout-applications',
        CREDIT_LINES: '/portal/creditor/credit-lines',
        CREDIT_LINE_ADJUSTMENTS: '/portal/creditor/credit-line-adjustments',
        CREDIT_TRANSACTIONS: '/portal/creditor/credit-transactions',
        DEBITOR_CREDIT_LINES: '/portal/debitor/credit-lines',
        DEBITOR_CREDIT_LINE_ADJUSTMENTS: '/portal/debitor/credit-line-adjustments',
        DEBITOR_CREDIT_TRANSACTIONS: '/portal/debitor/credit-transactions',
        PLATFORM_PAYOUTS: '/portal/platform/payouts',
        PLATFORM_PAYOUT_REVIEW: '/portal/payout',
        PAYMENT_SPLITS: '/portal/payment-splits',
        NOTIFICATIONS: '/portal/notifications',
        NOTIFICATION_TASKS: '/portal/notifications/tasks',
        NOTIFICATION_COUNTS: '/portal/notifications/counts',
        NOTIFICATION_READ: (id: string) => `/portal/notifications/${id}/read`,
        NOTIFICATION_READ_ALL: '/portal/notifications/read-all',
        SUPPORT_CONVERSATIONS: '/support/v1/conversations',
        SUPPORT_CONVERSATION: (id: string) => `/support/v1/conversations/${encodeURIComponent(id)}`,
        SUPPORT_MESSAGES: (id: string) => `/support/v1/conversations/${encodeURIComponent(id)}/messages`,
        RISK_DASHBOARD: '/portal/risk/dashboard',
        RISK_DISPUTES: '/portal/risk/disputes',
        RISK_REVIEWS: '/portal/risk/reviews',
        RISK_FRAUD_EVENTS: '/portal/risk/fraud-events',
        RISK_FRAUD_EVENT: (id: string) => `/portal/risk/fraud-events/${id}`,
        RISK_REVIEW: (id: string) => `/portal/risk/reviews/${id}`,
        RISK_PAYMENT_CONTEXT: (paymentId: number) => `/portal/risk/context/payment/${paymentId}`,
        RISK_RULES: '/portal/risk/rules',
        RISK_COVERAGE_CONFIG: '/portal/risk/coverage-config',
        RISK_COVERAGE_SUBSCRIPTION: '/portal/risk/coverage-subscription',
        ERRORS: '/portal/errors',
        CRYPTO_SUPPORTED_ASSETS: '/portal/crypto/supported-assets',
        CRYPTO_DEPOSIT_WALLETS: '/portal/crypto/deposit-wallets',
        AUDIT_LOGS: '/portal/audit',
        APPLICATION_SCHEMAS: '/portal/merchant-applications/schema',
        MERCHANT_APPLICATIONS: '/portal/merchant-applications',
        MERCHANT_CHANGE_REQUESTS: '/portal/merchant-change-requests',
        CHANGE_SCHEMAS: '/portal/change-schemas',
        MERCHANT_CONTACT: '/portal/merchant/contact',
        MERCHANT_CLOSE_REQUESTS: '/portal/merchant-close-requests',
        COMMERCE_PRODUCTS: '/portal/merchant/products',
        COMMERCE_CATEGORIES: '/portal/merchant/commerce/categories',
        COMMERCE_PRODUCT_TYPES: '/portal/merchant/commerce/product-types',
        COMMERCE_MEDIA: '/portal/merchant/commerce/media',
        REPORTS_QUERY: '/portal/reports/v1/query',
        REPORTS_EXPORT: '/portal/reports/v1/export',
        REPORTS_WIDGETS: '/portal/reports/v1/widgets',
    },
    ENTERPRISE: {
        MY_ENTERPRISES: '/enterprise/me/enterprises',
        DASHBOARD: '/enterprise/dashboard',
        DASHBOARD_EXPORT: '/enterprise/dashboard/export',
        ORGANIZATIONS: '/enterprise/organizations',
        AUDIT: '/enterprise/audit',
        MEMBERS: '/enterprise/members',
        memberKind: (identityId: string) =>
            `/enterprise/members/${encodeURIComponent(identityId)}/kind`,
        memberSuspend: (identityId: string) =>
            `/enterprise/members/${encodeURIComponent(identityId)}/suspend`,
        memberRemove: (identityId: string) =>
            `/enterprise/members/${encodeURIComponent(identityId)}/remove`,
        organizationSuspend: (organizationCode: number | string) =>
            `/enterprise/organizations/${encodeURIComponent(String(organizationCode))}/suspend`,
        organizationActivate: (organizationCode: number | string) =>
            `/enterprise/organizations/${encodeURIComponent(String(organizationCode))}/activate`,
        switchOrganization: (organizationCode: number | string) =>
            `/enterprise/switch/${encodeURIComponent(String(organizationCode))}`,
    },
};
