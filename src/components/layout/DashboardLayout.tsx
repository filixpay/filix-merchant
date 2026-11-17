"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useTranslations, useLocale } from "next-intl";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
/** @deprecated Legacy merchant/group switcher — kept for transition; use MerchantBusinessSwitcher */
import IdentitySwitcher from "./IdentitySwitcher";
import { clearStoredSelectedMerchantCode } from "@/lib/merchant/selected-merchant-code";
import {
    buildDashboardMenuModel,
    getDefaultOpenKeys,
    getSelectedMenuKey,
    splitDashboardMenuForSider,
    toAntdMenuItems,
} from "./dashboard-menu";
import { getRouteDashboardContentMode, resolveDashboardContentMode } from "./dashboard-content-mode";
import {
    getStoredSelectedMerchantId,
    readSidebarCollapsed,
    syncSidebarCollapsedDom,
} from "./merchant-shell";
import {
    buildKeycloakLogoutUrl,
    buildLoginCallbackUrl,
    canUseKeycloakEndSession,
} from "./keycloak-logout";
import { useMerchantCapabilities } from "./use-merchant-capabilities";
import { useMoneyMenuCapabilities } from "./use-money-menu-capabilities";
import { useOrganizationCapabilities } from "./use-organization-capabilities";
import { useOrganizationMerchants } from "./use-organization-merchants";
import { useEnterpriseCapabilities } from "./use-enterprise-capabilities";
import { merchantCodeToString } from "./organization-merchant-shell";
import styles from "./layout.module.css";
import { sanitizeCallbackUrl } from "@/lib/auth/dashboard-route";
import {
    membershipStateFromOrganizations,
    shouldRedirectDashboardToCreateMerchant,
} from "@/lib/auth/merchant-context-resolver";
import TaskUrgencyBanner from "@/components/notifications/TaskUrgencyBanner";
import { useDashboardContentMode } from "./dashboard-content-mode-context";
import SidebarCollapseToggle from "./SidebarCollapseToggle";
import DashboardHeader from "./DashboardHeader";
import SupportFloatingEntry from "@/components/support/SupportFloatingEntry";
import { MuiSidebarNav } from "./MuiSidebarNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();
    const { data: session, status } = useSession();
    const accessToken = session?.accessToken;
    const t = useTranslations("Layout");
    const tCommon = useTranslations("Common");
    const tOrganization = useTranslations("Organization");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(readSidebarCollapsed);
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const { overrideMode } = useDashboardContentMode();

    const {
        organizations,
        organizationsLoading,
        activeOrganization,
        selectOrganization,
    } = useOrganizationCapabilities(accessToken);

    const handleOrganizationSelect = useCallback(
        (organization: Parameters<typeof selectOrganization>[0]) => {
            clearStoredSelectedMerchantCode();
            selectOrganization(organization);
            router.refresh();
        },
        [router, selectOrganization],
    );

    const {
        merchants: businessAccounts,
        merchantsLoading: businessAccountsLoading,
        activeMerchant: activeBusinessAccount,
        merchantScopeDenied,
        selectMerchant: selectBusinessAccount,
        acknowledgeMerchantScopeDenied,
    } = useOrganizationMerchants(accessToken, activeOrganization);

    const { enterprises } = useEnterpriseCapabilities(accessToken);
    const canAccessEnterprisePortal = enterprises.length > 0;

    const businessAccountCode = activeBusinessAccount
        ? merchantCodeToString(activeBusinessAccount.merchantCode)
        : null;

    const {
        merchants,
        merchantsLoading,
        activeMerchant,
        reloadMerchants,
        selectMerchant,
    } = useMerchantCapabilities(accessToken, businessAccountCode);

    const { gate: moneyGate, capability: moneyCapability } = useMoneyMenuCapabilities(accessToken);

    useEffect(() => {
        setOpenKeys(getDefaultOpenKeys(pathname));
    }, [pathname]);

    useEffect(() => {
        syncSidebarCollapsedDom(isCollapsed);
    }, [isCollapsed]);

    useEffect(() => {
        if (status !== "unauthenticated") {
            return;
        }

        const fallback = `/${locale}/dashboard`;
        const callbackUrl = sanitizeCallbackUrl(pathname, fallback);
        router.replace(`/${locale}/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }, [status, locale, pathname, router]);

    const membership = membershipStateFromOrganizations(organizations);

    useEffect(() => {
        if (shouldRedirectDashboardToCreateMerchant(membership, organizationsLoading)) {
            router.replace(`/${locale}/onboarding/create-merchant`);
        }
    }, [membership, organizationsLoading, locale, router]);

    const handleBusinessAccountSelect = useCallback(
        (merchant: Parameters<typeof selectBusinessAccount>[0]) => {
            selectBusinessAccount(merchant);
            router.push(`/${locale}/dashboard`);
        },
        [locale, router, selectBusinessAccount],
    );

    const handleMerchantSelect = useCallback(
        (merchant: Parameters<typeof selectMerchant>[0]) => {
            selectMerchant(merchant);
            router.push(`/${locale}/dashboard`);
        },
        [locale, router, selectMerchant],
    );

    const menuModel = useMemo(
        () =>
            buildDashboardMenuModel(t, activeMerchant, {
                gate: moneyGate,
                capability: moneyCapability,
            }),
        [t, activeMerchant, moneyGate, moneyCapability],
    );
    const menuItems = useMemo(() => {
        return splitDashboardMenuForSider(menuModel);
    }, [menuModel]);

    const selectedKey = getSelectedMenuKey(pathname, locale);
    const routeContentMode = getRouteDashboardContentMode(pathname);
    const contentMode = resolveDashboardContentMode(routeContentMode, overrideMode);
    const contentClassName = `${styles.content} ${
        contentMode === "table"
            ? styles.contentTable
            : contentMode === "overview"
              ? styles.contentOverview
              : styles.contentForm
    }`;

    const toggleCollapsed = () => {
        const next = !isCollapsed;
        setIsCollapsed(next);
        localStorage.setItem("sidebarCollapsed", String(next));
        syncSidebarCollapsedDom(next);
    };

    const logout = async () => {
        const postLogoutRedirectUri = buildLoginCallbackUrl(window.location.origin, locale);

        if (canUseKeycloakEndSession(session ?? {})) {
            const logoutUrl = buildKeycloakLogoutUrl(
                session!.issuer!,
                session!.idToken!,
                postLogoutRedirectUri,
            );
            await signOut({ redirect: false });
            window.location.href = logoutUrl;
            return;
        }

        await signOut({ callbackUrl: postLogoutRedirectUri });
    };

    if (status === "loading" && !session) {
        return (
            <Box className={styles.authGate}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <CircularProgress size={36} />
                    <Typography variant="body2" color="text.secondary">
                        {tCommon("loading")}
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (status === "unauthenticated") {
        return null;
    }

    return (
        <Box className={`${styles.shell} dashboard-typography`} sx={{ display: "flex" }}>
            <div
                className={`${styles.mobileOverlay} ${isMobileMenuOpen ? styles.mobileOverlayOpen : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <aside
                className={`${styles.sider} dashboard-shell-sider ${isMobileMenuOpen ? styles.siderOpen : ""}`}
            >
                <div className={styles.siderScroll}>
                    {(!isCollapsed || isMobileMenuOpen) && accessToken && (
                        <WorkspaceSwitcher
                            organization={activeOrganization}
                            organizations={organizations}
                            merchants={businessAccounts}
                            activeMerchant={activeBusinessAccount}
                            selectedMerchantCode={businessAccountCode}
                            loading={organizationsLoading || businessAccountsLoading}
                            onSelectMerchant={handleBusinessAccountSelect}
                            onSelectOrganization={handleOrganizationSelect}
                            canAccessEnterprisePortal={canAccessEnterprisePortal}
                        />
                    )}
                    {false && (!isCollapsed || isMobileMenuOpen) && accessToken && (
                        <IdentitySwitcher
                            variant="sidebar"
                            merchants={merchants}
                            selectedMerchantId={activeMerchant?.id ?? getStoredSelectedMerchantId()}
                            loading={merchantsLoading}
                            onSelect={handleMerchantSelect}
                            onMerchantsReload={reloadMerchants}
                            accessToken={accessToken!}
                        />
                    )}
                    <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
                        <MuiSidebarNav
                            items={menuItems.main}
                            locale={locale}
                            selectedKey={selectedKey}
                            openKeys={openKeys}
                            onOpenChange={setOpenKeys}
                            onNavigate={() => setIsMobileMenuOpen(false)}
                            isCollapsed={isCollapsed && !isMobileMenuOpen}
                        />
                    </Box>
                    {menuItems.footer.length > 0 ? (
                        <Box sx={{ borderTop: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
                            <MuiSidebarNav
                                items={menuItems.footer}
                                locale={locale}
                                selectedKey={selectedKey}
                                openKeys={openKeys}
                                onOpenChange={setOpenKeys}
                                onNavigate={() => setIsMobileMenuOpen(false)}
                                isCollapsed={isCollapsed && !isMobileMenuOpen}
                            />
                        </Box>
                    ) : null}
                </div>
            </aside>

            <SidebarCollapseToggle collapsed={isCollapsed} onToggle={toggleCollapsed} />

            <Box component="main" className={`${styles.mainLayout} dashboard-shell-main`}>
                <DashboardHeader
                    menuModel={menuModel}
                    locale={locale}
                    session={session}
                    onMobileMenuToggle={() => setIsMobileMenuOpen((open) => !open)}
                    onLogout={logout}
                />

                <div className={styles.taskUrgencyStrip}>
                    <TaskUrgencyBanner layout="strip" />
                </div>

                <div className={contentClassName}>
                    {merchantScopeDenied ? (
                        <Alert
                            severity="warning"
                            onClose={acknowledgeMerchantScopeDenied}
                            sx={{ mb: 2 }}
                        >
                            {tOrganization("scope_denied")}
                        </Alert>
                    ) : null}
                    {activeMerchant?.customerStatus === "SUSPENDED" ? (
                        <Alert
                            severity="warning"
                            sx={{ mb: 2 }}
                        >
                            账户已暂停，无法发起交易或资料变更
                        </Alert>
                    ) : null}
                    {activeMerchant?.customerStatus === "RISK_FROZEN" ? (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            账户已风控冻结，无法发起新交易，请联系客服或等待运营处理
                        </Alert>
                    ) : null}
                    {children}
                </div>
                <SupportFloatingEntry />
            </Box>
        </Box>
    );
}
