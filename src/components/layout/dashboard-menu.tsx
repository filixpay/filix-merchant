import type React from "react";
import Link from "next/link";
import type { MenuProps } from "antd";
import {
    Building as BankOutlined,
    Wallet as WalletOutlined,
    GitBranch as PartitionOutlined,
    UserCheck as SolutionOutlined,
    DollarSign as DollarOutlined,
    IdCard as IdcardOutlined,
    BarChart3 as BarChartOutlined,
    Code as CodeOutlined,
    CreditCard as CreditCardOutlined,
    Download as ImportOutlined,
    FileEdit as FormOutlined,
    FileCheck as AuditOutlined,
    FileText as FileTextOutlined,
    SearchCode as FileSearchOutlined,
    ListOrdered as OrderedListOutlined,
    Users as TeamOutlined,
    History as HistoryOutlined,
    Home as HomeOutlined,
    MapPin as EnvironmentOutlined,
    Lock as LockOutlined,
    Bell as BellOutlined,
    User as UserOutlined,
    QrCode as QrcodeOutlined,
    Coins as MoneyCollectOutlined,
    ShieldAlert as SafetyOutlined,
    ShoppingBag as ShoppingOutlined,
    Star as StarOutlined,
    Store as ShopOutlined,
    ArrowLeftRight as SwapOutlined,
    RefreshCcw as RetweetOutlined,
    Sliders as ControlOutlined,
    RotateCcw as RollbackOutlined,
    Settings as SettingOutlined,
    Upload as ExportOutlined,
    AlertTriangle as WarningOutlined,
} from "lucide-react";
import type { MerchantDetailView, MoneyAssetCapability, MoneyGate } from "@/lib/api";
import { shouldShowInNav } from "@/lib/money/capability-presenter";
import { isTrialMerchant } from "@/lib/merchant/merchant-tier";
import styles from "./layout.module.css";

export type DashboardMenuItem = {
    key: string;
    href?: string;
    label: string;
    icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
    children?: DashboardMenuItem[];
    visible?: boolean;
};

type Translate = (key: string) => string;

const DASHBOARD_ROUTE_PREFIXES = [
    "/dashboard/onboarding/apply",
    "/dashboard/onboarding/status",
    "/dashboard/maintenance/profile",
    "/dashboard/maintenance/changes",
    "/dashboard/maintenance/contact",
    "/dashboard/settings/close-account",
    "/dashboard/organization",
    "/dashboard/notifications",
    "/dashboard/money/settlements",
    "/dashboard/money/settlements/statements",
    "/dashboard/money/transaction-reconciliation",
    "/dashboard/payment-splits",
    "/dashboard/member-credit/available-credit",
    "/dashboard/member-credit/adjustment-history",
    "/dashboard/member-credit/payment-history",
    "/dashboard/credit/adjustment-records",
    "/dashboard/credit/transactions",
    "/dashboard/credit/limit",
    "/dashboard/security-settings/transaction-password",
    "/dashboard/audit-logs",
    "/dashboard/sub-merchants",
    "/dashboard/locations",
    "/dashboard/configs",
    "/dashboard/checkouts",
    "/dashboard/bank-accounts",
    "/dashboard/transfers",
    "/dashboard/reviews",
    "/dashboard/transfer-records",
    "/dashboard/payout-records",
    "/dashboard/payouts/audit",
    "/dashboard/payouts/review",
    "/dashboard/payouts",
    "/dashboard/money/balance",
    "/dashboard/money/activity",
    "/dashboard/money/money-in",
    "/dashboard/money/payouts",
    "/dashboard/money/external-accounts",
    "/dashboard/money/transfers",
    "/dashboard/money/crypto",
    "/dashboard/balance",
    "/dashboard/deposits",
    "/dashboard/reporting/transactions",
    "/dashboard/orders",
    "/dashboard/refunds",
    "/dashboard/refunds/settings",
    "/dashboard/refunds/approvals",
    "/dashboard/commerce/products",
    "/dashboard/disputes",
    "/dashboard/coverage-config",
    "/dashboard/coverage-insurance",
    "/dashboard/risk-reviews",
    "/dashboard/risk-rules",
    "/dashboard/fraud",
    "/dashboard/customers",
    "/dashboard/service-plan",
    "/dashboard/developer",
    "/dashboard",
].sort((first, second) => second.length - first.length);

function localizedHref(locale: string, href: string) {
    return `/${locale}${href}`;
}

function item(
    key: string,
    href: string,
    icon: DashboardMenuItem["icon"],
    label: string,
    visible = true,
): DashboardMenuItem {
    return { key, href, icon, label, visible };
}

function group(
    key: string,
    icon: DashboardMenuItem["icon"],
    label: string,
    children: DashboardMenuItem[],
    visible = true,
): DashboardMenuItem {
    return { key, icon, label, children, visible };
}

export type MenuVisibility = {
    isPlatformSettlement: boolean;
    isDirectSettlement: boolean;
    isPlatform: boolean;
    showAcquiring: boolean;
    showFunds: boolean;
    showCoverageConfig: boolean;
    showCoverageInsurance: boolean;
};

export type MoneyMenuVisibility = {
    showMoney: boolean;
    showMoneyIn: boolean;
    showPayouts: boolean;
    showTransfers: boolean;
};

export type MoneyMenuInput = {
    gate: MoneyGate | null;
    capability: MoneyAssetCapability | null;
};

/** Stable menu visibility: API detail wins; until loaded, fall back to saved merchant identity. */
export function resolveMenuVisibility(
    merchantDetail: MerchantDetailView | null,
): MenuVisibility {
    let isPlatformSettlement = merchantDetail?.settlementMode === "PLATFORM";
    let isDirectSettlement = merchantDetail?.settlementMode === "DIRECT";
    const isPlatform = merchantDetail?.merchantType === "PLATFORM";

    if (!merchantDetail && typeof window !== "undefined") {
        const identity = localStorage.getItem("merchantIdentity");
        if (identity === "sub_merchant") {
            isPlatformSettlement = true;
            isDirectSettlement = false;
        } else if (identity === "independent") {
            isPlatformSettlement = false;
        }
    }

    const showAcquiring = !isPlatformSettlement || isPlatform;
    const showFunds = isPlatformSettlement;
    const isPlatformManaged = isPlatformSettlement && !isPlatform;
    const showCoverageConfig = isDirectSettlement || isPlatform;
    const showCoverageInsurance = isPlatformManaged;

    return {
        isPlatformSettlement,
        isDirectSettlement,
        isPlatform,
        showAcquiring,
        showFunds,
        showCoverageConfig,
        showCoverageInsurance,
    };
}

/** Money module visibility from gate + productized matrix — never from settlementMode. */
export function resolveMoneyMenuVisibility(
    gate: MoneyGate | null,
    capability: MoneyAssetCapability | null,
): MoneyMenuVisibility {
    const showMoney = Boolean(gate?.canView && gate?.moneyEnabled);
    if (!showMoney) {
        return { showMoney: false, showMoneyIn: false, showPayouts: false, showTransfers: false };
    }

    return {
        showMoney: true,
        showMoneyIn: capability ? shouldShowInNav(capability.moneyIn) : false,
        showPayouts: capability ? shouldShowInNav(capability.payout) : false,
        showTransfers: capability ? shouldShowInNav(capability.transfer) : false,
    };
}

export function buildDashboardMenuModel(
    t: Translate,
    merchantDetail: MerchantDetailView | null,
    money: MoneyMenuInput | null = null,
): DashboardMenuItem[] {
    const { isDirectSettlement, showAcquiring, showCoverageConfig, showCoverageInsurance } =
        resolveMenuVisibility(merchantDetail);
    const { showMoney, showMoneyIn, showPayouts, showTransfers } = resolveMoneyMenuVisibility(
        money?.gate ?? null,
        money?.capability ?? null,
    );
    const showFormalOnboarding = isTrialMerchant(merchantDetail);
    const showMaintenance = merchantDetail?.customerStatus === "ACTIVE";
    const showCloseAccount =
        merchantDetail?.customerStatus === "ACTIVE" ||
        merchantDetail?.customerStatus === "SUSPENDED" ||
        merchantDetail?.customerStatus === "RISK_FROZEN";

    return [
        item("overview", "/dashboard", HomeOutlined, t("nav.overview")),
        item("notifications", "/dashboard/notifications", BellOutlined, t("nav.notifications")),
        item(
            "formal-onboarding",
            "/dashboard/onboarding/status",
            FormOutlined,
            t("nav.formal_onboarding"),
            showFormalOnboarding,
        ),
        group(
            "transactions",
            CreditCardOutlined,
            t("nav.transactions_management"),
            [
                item("orders", "/dashboard/orders", OrderedListOutlined, t("nav.orders")),
                item("refunds", "/dashboard/refunds", RollbackOutlined, t("nav.refunds")),
                item(
                    "refund-settings",
                    "/dashboard/refunds/settings",
                    SettingOutlined,
                    t("nav.refund_settings"),
                ),
                item(
                    "refund-approvals",
                    "/dashboard/refunds/approvals",
                    AuditOutlined,
                    t("nav.refund_approvals"),
                ),
                item(
                    "payment-splits",
                    "/dashboard/payment-splits",
                    PartitionOutlined,
                    t("nav.split_payment_records"),
                    isDirectSettlement,
                ),
                group(
                    "acquiring",
                    ShoppingOutlined,
                    t("nav.acquiring_settings"),
                    [
                        item("configs", "/dashboard/configs", CreditCardOutlined, t("nav.payment_configs")),
                        item("locations", "/dashboard/locations", EnvironmentOutlined, t("nav.locations")),
                        item("sub-merchants", "/dashboard/sub-merchants", TeamOutlined, t("nav.sub_merchants")),
                        item("checkouts", "/dashboard/checkouts", QrcodeOutlined, t("nav.checkout_counters"), false),
                    ],
                    showAcquiring,
                ),
                group(
                    "payout-management",
                    MoneyCollectOutlined,
                    t("nav.payout_ops"),
                    [
                        item("payout-audit", "/dashboard/payouts/audit", AuditOutlined, t("nav.payout_audit")),
                        item("payout-review", "/dashboard/payouts/review", SolutionOutlined, t("nav.payout_review")),
                    ],
                    false,
                ),
                group(
                    "offline-collection",
                    ShopOutlined,
                    t("nav.offline_collection"),
                    [
                        item(
                            "transfers",
                            "/dashboard/transfers",
                            RetweetOutlined,
                            t("nav.transfers"),
                        ),
                        item(
                            "reviews",
                            "/dashboard/reviews",
                            FileSearchOutlined,
                            t("nav.reviews"),
                        ),
                    ],
                ),
            ],
        ),
        group(
            "money",
            DollarOutlined,
            t("nav.money"),
            [
                item(
                    "money-balance",
                    "/dashboard/money/balance",
                    WalletOutlined,
                    t("nav.money_balance"),
                    showMoney,
                ),
                item(
                    "money-activity",
                    "/dashboard/money/activity",
                    HistoryOutlined,
                    t("nav.money_activity"),
                    showMoney,
                ),
                group(
                    "money-in",
                    ImportOutlined,
                    t("nav.money_in"),
                    [
                        item(
                            "money-in-list",
                            "/dashboard/money/money-in",
                            ImportOutlined,
                            t("nav.money_in_records"),
                            showMoney && showMoneyIn,
                        ),
                        item(
                            "money-crypto",
                            "/dashboard/money/crypto",
                            MoneyCollectOutlined,
                            t("nav.digital_currency"),
                            showMoney,
                        ),
                    ],
                ),
                group(
                    "money-payouts",
                    ExportOutlined,
                    t("nav.money_payouts"),
                    [
                        item(
                            "money-payouts-list",
                            "/dashboard/money/payouts",
                            ExportOutlined,
                            t("nav.money_payouts_records"),
                            showMoney && showPayouts,
                        ),
                        item(
                            "money-external-accounts",
                            "/dashboard/money/external-accounts",
                            BankOutlined,
                            t("nav.money_external_accounts"),
                            showMoney,
                        ),
                    ],
                    showMoney,
                ),
                item(
                    "money-transfers",
                    "/dashboard/money/transfers",
                    SwapOutlined,
                    t("nav.money_transfers"),
                    showMoney && showTransfers,
                ),
                group(
                    "settlement",
                    AuditOutlined,
                    t("nav.settlement"),
                    [
                        item(
                            "transaction-reconciliation",
                            "/dashboard/money/transaction-reconciliation",
                            FileSearchOutlined,
                            t("nav.transaction_reconciliation"),
                            showMoney,
                        ),
                        item(
                            "settlements",
                            "/dashboard/money/settlements",
                            AuditOutlined,
                            t("nav.settlements"),
                            showMoney,
                        ),
                        item(
                            "settlement-statements",
                            "/dashboard/money/settlements/statements",
                            FileTextOutlined,
                            t("nav.settlement_statements"),
                            showMoney,
                        ),
                    ],
                    showMoney,
                ),
            ],
            true,
        ),
        group(
            "reporting",
            BarChartOutlined,
            t("nav.reporting"),
            [
                item(
                    "reporting-transactions",
                    "/dashboard/reporting/transactions",
                    OrderedListOutlined,
                    t("nav.reporting_transactions"),
                ),
            ],
        ),
        item("customers", "/dashboard/customers", UserOutlined, t("nav.customers")),
        group(
            "commerce",
            ShoppingOutlined,
            t("nav.commerce"),
            [item("commerce-products", "/dashboard/commerce/products", ShoppingOutlined, t("nav.commerce_products"))],
        ),
        group(
            "risk",
            WarningOutlined,
            t("nav.risk_management"),
            [
                item("disputes", "/dashboard/disputes", WarningOutlined, t("nav.disputes")),
                item("risk-reviews", "/dashboard/risk-reviews", FileSearchOutlined, t("nav.risk_reviews")),
                item("fraud", "/dashboard/fraud", SafetyOutlined, t("nav.fraud")),
                item("risk-rules", "/dashboard/risk-rules", ControlOutlined, t("nav.risk_rules")),
                group(
                    "coverage-services",
                    SafetyOutlined,
                    t("nav.coverage_services"),
                    [
                        item(
                            "coverage-insurance",
                            "/dashboard/coverage-insurance",
                            SafetyOutlined,
                            t("nav.coverage_insurance"),
                            showCoverageInsurance,
                        ),
                        item(
                            "coverage-config",
                            "/dashboard/coverage-config",
                            SafetyOutlined,
                            t("nav.coverage_config"),
                            showCoverageConfig,
                        ),
                    ],
                    showCoverageInsurance || showCoverageConfig,
                ),
            ],
        ),
        group(
            "credit-center",
            CreditCardOutlined,
            t("nav.credit_center"),
            [
                group(
                    "credit-granting",
                    CreditCardOutlined,
                    t("nav.credit_granting"),
                    [
                        item(
                            "credit-limit",
                            "/dashboard/credit/limit",
                            CreditCardOutlined,
                            t("nav.credit_limit_management"),
                        ),
                    ],
                ),
                group(
                    "credit-usage",
                    WalletOutlined,
                    t("nav.credit_usage"),
                    [
                        item(
                            "available-credit",
                            "/dashboard/member-credit/available-credit",
                            CreditCardOutlined,
                            t("nav.available_credit"),
                        ),
                    ],
                ),
            ],
        ),
        group(
            "account",
            SolutionOutlined,
            t("nav.account_management"),
            [
                item(
                    "maintenance-profile",
                    "/dashboard/maintenance/profile",
                    IdcardOutlined,
                    t("nav.maintenance_profile"),
                    showMaintenance,
                ),
                item(
                    "maintenance-changes",
                    "/dashboard/maintenance/changes",
                    FormOutlined,
                    t("nav.maintenance_changes"),
                    showMaintenance,
                ),
                item(
                    "maintenance-contact",
                    "/dashboard/maintenance/contact",
                    BellOutlined,
                    t("nav.maintenance_contact"),
                    showMaintenance,
                ),
                item(
                    "organization",
                    "/dashboard/organization",
                    TeamOutlined,
                    t("nav.organization_affiliation"),
                ),
                group(
                    "security-settings",
                    LockOutlined,
                    t("nav.security_settings"),
                    [
                        item(
                            "transaction-password",
                            "/dashboard/security-settings/transaction-password",
                            LockOutlined,
                            t("nav.transaction_password"),
                        ),
                        item("audit-logs", "/dashboard/audit-logs", HistoryOutlined, t("nav.audit_logs")),
                    ],
                ),
                item("service-plan", "/dashboard/service-plan", StarOutlined, t("nav.service_plan")),
                item(
                    "close-account",
                    "/dashboard/settings/close-account",
                    ExportOutlined,
                    t("nav.close_account"),
                    showCloseAccount,
                ),
            ],
        ),
        item("developer", "/dashboard/developer", CodeOutlined, t("nav.developer")),
    ];
}

/** L1 keys pinned to the sider footer (account/settings above developer). */
export const DASHBOARD_MENU_FOOTER_KEYS = new Set(["developer"]);

export function splitDashboardMenuForSider(menuModel: DashboardMenuItem[]): {
    main: DashboardMenuItem[];
    footer: DashboardMenuItem[];
} {
    const main: DashboardMenuItem[] = [];
    const footer: DashboardMenuItem[] = [];
    for (const item of menuModel) {
        if (DASHBOARD_MENU_FOOTER_KEYS.has(item.key)) {
            footer.push(item);
        } else {
            main.push(item);
        }
    }
    return { main, footer };
}

export function toAntdMenuItems(
    menuModel: DashboardMenuItem[],
    locale: string,
    onNavigate: () => void,
): NonNullable<MenuProps["items"]> {
    return menuModel
        .filter((menuItem) => menuItem.visible !== false)
        .map((menuItem) => {
            const Icon = menuItem.icon;
            const icon = <Icon className={styles.menuIcon} size={16} strokeWidth={1.75} />;

            if (menuItem.children?.length) {
                const children = toAntdMenuItems(menuItem.children, locale, onNavigate);
                if (!children.length) {
                    return null;
                }
                return {
                    key: menuItem.key,
                    icon,
                    label: menuItem.label,
                    children,
                };
            }

            return {
                key: localizedHref(locale, menuItem.href ?? "/dashboard"),
                icon,
                label: (
                    <Link href={localizedHref(locale, menuItem.href ?? "/dashboard")} onClick={onNavigate}>
                        {menuItem.label}
                    </Link>
                ),
            };
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry != null);
}

export function getSelectedMenuKey(pathname: string, locale: string) {
    const matchedPrefix = DASHBOARD_ROUTE_PREFIXES.find((routePrefix) => {
        const localizedPrefix = localizedHref(locale, routePrefix);
        return pathname === localizedPrefix || pathname.startsWith(`${localizedPrefix}/`);
    });

    return localizedHref(locale, matchedPrefix ?? "/dashboard");
}

export function getDefaultOpenKeys(pathname: string): string[] {
    if (pathname.includes("/dashboard/maintenance/")) {
        return ["account"];
    }

    if (
        pathname.includes("/dashboard/sub-merchants") ||
        pathname.includes("/dashboard/locations") ||
        pathname.includes("/dashboard/configs") ||
        pathname.includes("/dashboard/checkouts")
    ) {
        return ["transactions", "acquiring"];
    }

    if (pathname.includes("/dashboard/payouts/audit") || pathname.includes("/dashboard/payouts/review")) {
        return ["transactions", "payout-management"];
    }

    if (
        pathname.includes("/dashboard/orders") ||
        pathname.includes("/dashboard/refunds") ||
        pathname.includes("/dashboard/payment-splits")
    ) {
        return ["transactions"];
    }

    if (pathname.includes("/dashboard/commerce/")) {
        return ["commerce"];
    }

    if (pathname.includes("/dashboard/reporting/")) {
        return ["reporting"];
    }

    if (
        pathname.includes("/dashboard/money/money-in") ||
        pathname.includes("/dashboard/money/crypto")
    ) {
        return ["money", "money-in"];
    }

    if (
        pathname.includes("/dashboard/money/payouts") ||
        pathname.includes("/dashboard/money/external-accounts")
    ) {
        return ["money", "money-payouts"];
    }

    if (
        pathname.includes("/dashboard/money/settlements") ||
        pathname.includes("/dashboard/money/settlements/statements") ||
        pathname.includes("/dashboard/money/transaction-reconciliation")
    ) {
        return ["money", "settlement"];
    }

    if (pathname.includes("/dashboard/money/") || pathname.includes("/dashboard/balance")) {
        return ["money"];
    }

    if (
        pathname.includes("/dashboard/deposits") ||
        (pathname.includes("/dashboard/payouts") &&
            !pathname.includes("/dashboard/payouts/audit") &&
            !pathname.includes("/dashboard/payouts/review")) ||
        pathname.includes("/dashboard/transfer-records") ||
        pathname.includes("/dashboard/payout-records")
    ) {
        return ["money"];
    }

    if (
        pathname.includes("/dashboard/coverage-config") ||
        pathname.includes("/dashboard/coverage-insurance")
    ) {
        return ["risk", "coverage-services"];
    }

    if (
        pathname.includes("/dashboard/disputes") ||
        pathname.includes("/dashboard/risk-reviews") ||
        pathname.includes("/dashboard/risk-rules") ||
        pathname.includes("/dashboard/fraud")
    ) {
        return ["risk"];
    }

    if (
        pathname.includes("/dashboard/bank-accounts") ||
        pathname.includes("/dashboard/transfers") ||
        pathname.includes("/dashboard/reviews")
    ) {
        return ["transactions", "offline-collection"];
    }

    if (pathname.includes("/dashboard/credit/")) {
        return ["credit-center", "credit-granting"];
    }

    if (pathname.includes("/dashboard/member-credit/")) {
        return ["credit-center", "credit-usage"];
    }

    if (
        pathname.includes("/dashboard/security-settings") ||
        pathname.includes("/dashboard/audit-logs")
    ) {
        return ["account", "security-settings"];
    }

    if (
        pathname.includes("/dashboard/organization") ||
        pathname.includes("/dashboard/service-plan") ||
        pathname.includes("/dashboard/settings/close-account")
    ) {
        return ["account"];
    }

    return [];
}
