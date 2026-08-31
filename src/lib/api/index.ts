export { ApiError, authHeaders, request } from "./core";
export type { ApiResponse } from "./core";
export type { Amount, PagedResponse } from "./types";

export {
    ApplicationConflictError,
    APPLICATION_ID_STORAGE_KEY,
    EDITABLE_APPLICATION_STATUSES,
    REAPPLYABLE_APPLICATION_STATUSES,
    TERMINAL_APPLICATION_STATUSES,
    parseApplicationId,
} from "./domains/onboarding";
export type {
    ApplicationDocument,
    ApplicationMerchantType,
    ApplicationProfile,
    ApplicationSchemaDto,
    ApplicationStatus,
    ApplicationType,
    MerchantApplication,
    SchemaFieldDto,
} from "./domains/onboarding";

export {
    PendingChangeExistsError,
    CANCELABLE_CHANGE_STATUSES,
    CHANGE_TYPES,
    CONTACT_TYPES,
    EDITABLE_CHANGE_STATUSES,
} from "./domains/maintenance";
export type {
    ApplyPhase,
    ChangeProfileRequest,
    ChangeRequestStatus,
    ChangeType,
    ContactType,
    MerchantContactView,
    MerchantChangeProfile,
    MerchantChangeRequest,
    MerchantChangeRequestListItem,
    MerchantChangeReview,
} from "./domains/maintenance";

export {
    CANCELABLE_CLOSE_STATUSES,
    CLOSE_REASON_CODES,
    SUBMITTABLE_CLOSE_STATUSES,
} from "./domains/lifecycle";
export type {
    CloseReasonCode,
    CloseRequestStatus,
    CreateMerchantCloseRequestRequest,
    MerchantCloseRequest,
} from "./domains/lifecycle";

export { ordersApi } from "./orders";
export type {
    OrderView,
    OrderPartyView,
    OrderItemView,
    OrderDetailResponse,
    TraceTimelineItem,
    TraceTimelineMetadata,
    TodayOrderTotal,
    OrderItemRequest,
    OrderCreateRequest,
    CollectionDestinationOwnerType,
    CollectionDestinationPurpose,
    CollectionDestinationView,
    CollectionDestinationResolveResponse,
    CollectionDestinationQuery,
    ServicePeriod,
    ServiceFeeOrderRequest,
    TradeStatus,
    MissingOrderView,
} from "./orders";

export { merchantsApi } from "./domains/merchants";
export type {
    MerchantRequest,
    MerchantView,
    MerchantDetailView,
    MerchantBalanceView,
    MerchantBalanceAccountView,
    MerchantLookupByCodeView,
    MerchantPortalBucket,
    MerchantLedgerMovementView,
    TrialMerchantCreateResult,
} from "./domains/merchants";

export { financialInstitutionsApi, channelsApi, scenariosApi } from "./domains/reference";
export type {
    FinancialInstitutionView,
    ChannelView,
    PaymentScenarioChannelMapping,
    ScenarioView,
} from "./domains/reference";

export { configsApi } from "./domains/configs";
export type {
    PaymentConfigView,
    AlipayParameters,
    WechatParameters,
    StripeParameters,
    PayPalParameters,
    NowPaymentsParameters,
    PaymentChannelParameters,
    PaymentConfigParameters,
    PaymentConfigCreateRequest,
    PaymentConfigUpdateRequest,
} from "./domains/configs";

export { checkoutsApi } from "./domains/checkouts";
export type {
    CheckoutConfigItem,
    MerchantCheckoutRequest,
    CheckoutView,
} from "./domains/checkouts";

export { refundsApi, refundSettingsApi } from "./domains/refunds";
export type {
    RefundCreateRequest,
    RefundView,
    RefundStatus,
    RefundTimelineEvent,
    RefundSettings,
    RefundSettingsUpdateRequest,
} from "./domains/refunds";
/** @deprecated Use RefundView */
export type { RefundView as RefundOrderView } from "./domains/refunds";

export { developerApi } from "./domains/developer";
export type {
    ApiCredentialsView,
    WebhookEndpointView,
    WebhookEndpointRequest,
    WebhookDeliveryView,
} from "./domains/developer";

export { clientsApi } from "./domains/clients";
export type { ClientView } from "./domains/clients";

export { locationsApi } from "./domains/locations";
export type { LocationView, LocationUpsertRequest, LocationQrCodeResponse } from "./domains/locations";

export { bankAccountsApi } from "./domains/bank-accounts";
export type { BankAccountView, BankAccountCreateRequest } from "./domains/bank-accounts";

export { cryptoDepositWalletsApi } from "./domains/crypto-deposit-wallets";
export type {
    CryptoDepositWalletView,
    CryptoDepositWalletsListResponse,
    CryptoSupportedAsset,
    CryptoDepositWalletCreateRequest,
    CryptoDepositWalletUpdateRequest,
    CryptoDepositWalletStatusRequest,
} from "./domains/crypto-deposit-wallets";

export { transfersApi } from "./domains/transfers";
export type {
    TransferView,
    TransferId,
    FileMeta,
    TransferDetailResponse,
    TransferAuditRequest,
    TransferReviewRequest,
} from "./domains/transfers";

export { payoutsApi } from "./domains/payouts";
export type { PayoutApplicationView, PayoutView } from "./domains/payouts";

export { subMerchantsApi } from "./domains/sub-merchants";
export type { SubMerchantView } from "./domains/sub-merchants";

export { walletApi } from "./domains/wallet";
export type {
    DepositView,
    WalletDepositRequest,
    WalletTransferCreateRequest,
} from "./domains/wallet";

export {
    walletReadsApi,
    toWalletMovementRow,
    normalizeIdentitySummary,
    reduceIdentityNetworkCount,
    reduceIdentityAddressCount,
    loadIdentitySummariesBestEffort,
} from "./domains/wallet-reads";
export type {
    WalletOverviewView,
    WalletOperationCapability,
    WalletCapabilityView,
    WalletAssetCapabilityView,
    WalletAssetCapabilityOperationView,
    WalletMovementView,
    WalletMovementRow,
    WalletMovementDirection,
    WalletPortalBucket,
    WalletMovementsQuery,
    WalletNetworkView,
    WalletNetworksResponse,
    WalletAddressView,
    WalletAddressesResponse,
    WalletIdentitySummaryView,
    WalletAssetStatusName,
} from "./domains/wallet-reads";

export { moneyProductApi } from "./domains/money";
export type {
    MoneyGate,
    MoneyOpCapability,
    MoneyAssetCapability,
    MoneyBalanceProjection,
    MoneyBalanceBucket,
    MoneyAssetBalance,
    MoneyActivityItem,
    MoneyActivityQuery,
    MoneyInView,
    MoneyInCreateRequest,
    MoneyInCreateResponse,
    MoneyInNextAction,
    MoneyInQuery,
    MoneyPayoutView,
    MoneyTransferView,
    MoneyTransferNextAction,
    MoneyTransferCounterparty,
    ExternalAccountView,
    ExternalAccountCreateRequest,
    ExternalAccountQuery,
    PayoutCreateRequest,
    PayoutQuery,
    TransferCreateRequest,
    TransferQuery,
} from "./domains/money";

export { securityApi } from "./domains/security";

export { creditApi } from "./domains/credit";
export type {
    CreditorView,
    DebitorView,
    CreditLineView,
    CreateCreditLineRequest,
    CreditLineAdjustmentView,
    CreditTransactionView,
} from "./domains/credit";

export { memberCreditApi } from "./domains/member-credit";

export { paymentSplitsApi } from "./domains/payment-splits";

export { notificationsApi } from "./domains/notifications";
export type {
    MerchantNotification,
    ActionTask,
    ActionTaskView,
    NotificationCounts,
    NotificationSeverity,
    TaskStatus,
    TaskPriority,
    NotificationListQuery,
    TaskListQuery,
} from "./domains/notifications";

export { supportApi } from "./domains/support";
export type {
    SupportConversation,
    SupportConversationStatus,
    SupportListQuery,
    SupportMessage,
    SupportMessageSenderType,
    CreateSupportConversationRequest,
} from "./domains/support";

export { auditApi } from "./domains/audit";
export type {
    AuditActorType,
    AuditActionCategory,
    AuditResult,
    AuditMetadata,
    AuditLogItem,
    AuditLogPage,
    AuditLogListQuery,
} from "./domains/audit";

export { reportingApi } from "./domains/reporting";
export type {
    WidgetDataAvailability,
    WidgetStatus,
    WidgetResultDto,
    WidgetBundleDto,
    ReportingApiVersion,
    ReportDomain,
    ReportView,
    ReportQueryRequest,
    ReportExportRequest,
    WidgetBatchRequest,
    ReportPageDto,
    TransactionReportRow,
    TransactionReportDetail,
    TransactionTimelineItem,
    TransactionTimeline,
    WidgetNumericResolution,
} from "./domains/reporting";
export {
    MERCHANT_WIDGETS,
    MERCHANT_WIDGET_IDS,
    reportingTitleKey,
    resolveWidgetNumericValue,
    resolveWidgetCardView,
    formatWidgetMoney,
} from "./domains/reporting";
export type { MerchantWidgetDefinition, MerchantWidgetId, WidgetFormat, WidgetCardView } from "./domains/reporting";

export { organizationApi } from "./domains/organization";
export { enterpriseApi } from "./domains/enterprise";
export type {
    EnterpriseMembershipKind,
    EnterpriseMembershipStatus,
    DiscoverableEnterpriseView,
    EnterpriseDashboardView,
    EnterpriseMemberView,
    EnterpriseOrganizationDirectoryEntry,
    EnterpriseSwitchHandoff,
    EnterpriseAuditListQuery,
    EnterpriseAuditLogItem,
    EnterpriseAuditLogPage,
    EnterpriseDailyCount,
    EnterpriseTopOrganizationRow,
} from "./domains/enterprise";
export type {
    OrganizationRoleType,
    OrganizationRoleKind,
    OrganizationPermission,
    OrganizationPermissionDomain,
    OrganizationRoleSummary,
    OrganizationRoleResponse,
    OrganizationMemberRole,
    MembershipStatus,
    OrganizationSummaryView,
    OrganizationMerchantView,
    OrganizationMerchantSettlementMode,
    OrganizationMerchantStatus,
    OrganizationMemberView,
    OrganizationRoleScopeResponse,
    OrganizationInvitationView,
    CreateOrganizationInvitationRequest,
    CreateOrganizationRoleRequest,
    UpdateOrganizationRoleRequest,
    ReplaceOrganizationRoleScopeRequest,
    CreateOrganizationMerchantRequest,
    TeamRole,
    TeamStatus,
    OrganizationTeamView,
    OrganizationTeamMemberView,
    CreateOrganizationTeamRequest,
    TeamHasLastOwnerData,
} from "./domains/organization";
export {
    ORGANIZATION_PERMISSIONS,
    ORGANIZATION_PERMISSION_DOMAINS,
    ORGANIZATION_PERMISSION_DOMAIN_ORDER,
} from "./domains/organization";

export { riskApi } from "./domains/risk";
export type {
    DisputeView,
    DisputeListItem,
    DisputeOperationalSummary,
    DisputeEvidence,
    RiskEvent,
    RiskReviewListItem,
    RiskReviewDetail,
    FraudEventListItem,
    FraudEventDetail,
    RelatedRiskSummary,
    PaymentRiskContext,
    PaymentTimelineItem,
    RiskDashboardMetrics,
    RiskRuleView,
    CoverageClaimView,
    CoverageClaimEvent,
    CoverageAssessmentLogView,
    CoverageAssessmentSummaryView,
} from "./domains/risk";
export {
    DisputeStatus,
    RiskPriority,
    EvidenceCategory,
    RiskReviewStatus,
    FraudEventStatus,
    CoverageClaimStatus,
    CoverageClaimEventType,
    canEditEvidence,
    getAvailableActions,
} from "./domains/risk";
export type {
    PaymentSplitReceiver,
    PaymentSplitDetailView,
    PaymentSplitView,
} from "./domains/payment-splits";

import { ordersApi } from "./orders";
import { merchantsApi } from "./domains/merchants";
import { financialInstitutionsApi, channelsApi, scenariosApi } from "./domains/reference";
import { configsApi } from "./domains/configs";
import { checkoutsApi } from "./domains/checkouts";
import { refundsApi, refundSettingsApi } from "./domains/refunds";
import { developerApi } from "./domains/developer";
import { clientsApi } from "./domains/clients";
import { locationsApi } from "./domains/locations";
import { bankAccountsApi } from "./domains/bank-accounts";
import { cryptoDepositWalletsApi } from "./domains/crypto-deposit-wallets";
import { transfersApi } from "./domains/transfers";
import { payoutsApi } from "./domains/payouts";
import { subMerchantsApi } from "./domains/sub-merchants";
import { walletApi } from "./domains/wallet";
import { walletReadsApi } from "./domains/wallet-reads";
import { moneyProductApi } from "./domains/money";
import { securityApi } from "./domains/security";
import { creditApi } from "./domains/credit";
import { memberCreditApi } from "./domains/member-credit";
import { paymentSplitsApi } from "./domains/payment-splits";
import { riskApi } from "./domains/risk";
import { notificationsApi } from "./domains/notifications";
import { supportApi } from "./domains/support";
import { auditApi } from "./domains/audit";
import { reportingApi } from "./domains/reporting";
import { organizationApi } from "./domains/organization";
import { enterpriseApi } from "./domains/enterprise";
import { onboardingApi } from "./domains/onboarding";
import { maintenanceApi } from "./domains/maintenance";
import { lifecycleApi } from "./domains/lifecycle";
import { commerceApi } from "./domains/commerce";
export type {
    CommerceCategoryView,
    CommerceProductTypeView,
    CommerceProductView,
} from "./domains/commerce";

export const api = {
    merchants: merchantsApi,
    financialInstitutions: financialInstitutionsApi,
    channels: channelsApi,
    scenarios: scenariosApi,
    configs: configsApi,
    checkouts: checkoutsApi,
    orders: ordersApi,
    refunds: refundsApi,
    refundSettings: refundSettingsApi,
    developer: developerApi,
    clients: clientsApi,
    locations: locationsApi,
    bankAccounts: bankAccountsApi,
    cryptoDepositWallets: cryptoDepositWalletsApi,
    transfers: transfersApi,
    payouts: payoutsApi,
    subMerchants: subMerchantsApi,
    wallet: walletApi,
    walletReads: walletReadsApi,
    money: moneyProductApi,
    security: securityApi,
    credit: creditApi,
    memberCredit: memberCreditApi,
    paymentSplits: paymentSplitsApi,
    risk: riskApi,
    notifications: notificationsApi,
    support: supportApi,
    audit: auditApi,
    reporting: reportingApi,
    organizations: organizationApi,
    enterprise: enterpriseApi,
    onboarding: onboardingApi,
    maintenance: maintenanceApi,
    lifecycle: lifecycleApi,
    commerce: commerceApi,
};
