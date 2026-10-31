"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Box, CircularProgress, Drawer } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { clearStoredSelectedMerchantCode } from "@/lib/merchant/selected-merchant-code";
import {
    buildDashboardMenuModel,
    getDefaultOpenKeys,
    getSelectedMenuKey,
    splitDashboardMenuForSider,
    MuiMenuItems,
} from "./dashboard-menu";
import { getRouteDashboardContentMode, resolveDashboardContentMode } from "./dashboard-content-mode";
import {
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
        activeMerchant,
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

    const menuModel = useMemo(
        () =>
            buildDashboardMenuModel(t, activeMerchant, {
                gate: moneyGate,
                capability: moneyCapability,
            }),
        [t, activeMerchant, moneyGate, moneyCapability],
    );
    const { main: mainMenuItems, footer: footerMenuItems } = useMemo(
        () => splitDashboardMenuForSider(menuModel),
        [menuModel],
    );

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
            <Box
                className={styles.authGate}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    minHeight: "100vh",
                }}
            >
                <CircularProgress size={36} />
                <span style={{ fontSize: 13, color: "#64748b" }}>{tCommon("loading")}</span>
            </Box>
        );
    }

    if (status === "unauthenticated") {
        return null;
    }

    return (
        <Box
            className={`${styles.shell} dashboard-typography`}
            sx={{ display: "flex", minHeight: "100vh", bgcolor: "#ffffff" }}
        >
            {/* Mobile temporary Drawer */}
            <Drawer
                variant="temporary"
                open={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        width: 256,
                        boxSizing: "border-box",
                        borderRight: "1px solid #e2e8f0",
                        bgcolor: "#ffffff",
                    },
                }}
            >
                <div className={styles.siderScroll}>
                    {accessToken && (
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
                    <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
                        <MuiMenuItems
                            menuModel={mainMenuItems}
                            locale={locale}
                            selectedKey={selectedKey}
                            openKeys={openKeys}
                            onOpenChange={setOpenKeys}
                            onNavigate={() => setIsMobileMenuOpen(false)}
                            isCollapsed={false}
                        />
                    </Box>
                    {footerMenuItems.length > 0 ? (
                        <Box sx={{ flexShrink: 0, borderTop: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
                            <MuiMenuItems
                                menuModel={footerMenuItems}
                                locale={locale}
                                selectedKey={selectedKey}
                                openKeys={openKeys}
                                onOpenChange={setOpenKeys}
                                onNavigate={() => setIsMobileMenuOpen(false)}
                                isCollapsed={false}
                            />
                        </Box>
                    ) : null}
                </div>
            </Drawer>

            {/* Desktop permanent Drawer */}
            <Drawer
                variant="permanent"
                className="dashboard-shell-sider"
                sx={{
                    display: { xs: "none", md: "block" },
                    width: isCollapsed ? 64 : 256,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: isCollapsed ? 64 : 256,
                        boxSizing: "border-box",
                        border: "none",
                        borderRight: "1px solid #e2e8f0",
                        transition: "width 0.2s ease",
                        overflowX: "hidden",
                        bgcolor: "#ffffff",
                    },
                }}
            >
                <div className={styles.siderScroll}>
                    {!isCollapsed && accessToken && (
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
                    <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
                        <MuiMenuItems
                            menuModel={mainMenuItems}
                            locale={locale}
                            selectedKey={selectedKey}
                            openKeys={openKeys}
                            onOpenChange={setOpenKeys}
                            isCollapsed={isCollapsed}
                        />
                    </Box>
                    {footerMenuItems.length > 0 ? (
                        <Box sx={{ flexShrink: 0, borderTop: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
                            <MuiMenuItems
                                menuModel={footerMenuItems}
                                locale={locale}
                                selectedKey={selectedKey}
                                openKeys={openKeys}
                                onOpenChange={setOpenKeys}
                                isCollapsed={isCollapsed}
                            />
                        </Box>
                    ) : null}
                </div>
            </Drawer>

            <SidebarCollapseToggle collapsed={isCollapsed} onToggle={toggleCollapsed} />

            <Box
                component="div"
                className={`${styles.mainLayout} dashboard-shell-main`}
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    bgcolor: "#ffffff",
                }}
            >
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

                <Box component="main" className={contentClassName} sx={{ flexGrow: 1, overflow: "auto" }}>
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
                </Box>
                <SupportFloatingEntry />
            </Box>
        </Box>
    );
}
