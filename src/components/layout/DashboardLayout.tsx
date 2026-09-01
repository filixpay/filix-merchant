"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Layout, Menu, Spin } from "antd";
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

const { Sider, Content } = Layout;

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
        const { main, footer } = splitDashboardMenuForSider(menuModel);
        const closeMobile = () => setIsMobileMenuOpen(false);
        return {
            main: toAntdMenuItems(main, locale, closeMobile) ?? [],
            footer: toAntdMenuItems(footer, locale, closeMobile) ?? [],
        };
    }, [menuModel, locale]);

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
            <div className={styles.authGate}>
                <Spin size="large" tip={tCommon("loading")} />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null;
    }

    return (
        <Layout className={`${styles.shell} dashboard-typography`} hasSider>
            <div
                className={`${styles.mobileOverlay} ${isMobileMenuOpen ? styles.mobileOverlayOpen : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <Sider
                className={`${styles.sider} dashboard-shell-sider ${isMobileMenuOpen ? styles.siderOpen : ""}`}
                width={256}
                collapsedWidth={64}
                collapsed={isCollapsed}
                trigger={null}
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
                    <Menu
                        mode="inline"
                        inlineCollapsed={isCollapsed}
                        selectedKeys={[selectedKey]}
                        openKeys={isCollapsed ? undefined : openKeys}
                        onOpenChange={setOpenKeys}
                        items={menuItems.main}
                        className={styles.menu}
                    />
                    {menuItems.footer.length > 0 ? (
                        <Menu
                            mode="inline"
                            inlineCollapsed={isCollapsed}
                            selectedKeys={[selectedKey]}
                            items={menuItems.footer}
                            className={`${styles.menu} ${styles.menuFooter}`}
                        />
                    ) : null}
                </div>
            </Sider>

            <SidebarCollapseToggle collapsed={isCollapsed} onToggle={toggleCollapsed} />

            <Layout className={`${styles.mainLayout} dashboard-shell-main`}>
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

                <Content className={contentClassName}>
                    {merchantScopeDenied ? (
                        <Alert
                            type="warning"
                            showIcon
                            closable
                            onClose={acknowledgeMerchantScopeDenied}
                            message={tOrganization("scope_denied")}
                            style={{ marginBottom: 16 }}
                        />
                    ) : null}
                    {activeMerchant?.customerStatus === "SUSPENDED" ? (
                        <Alert
                            type="warning"
                            showIcon
                            message="账户已暂停，无法发起交易或资料变更"
                            style={{ marginBottom: 16 }}
                        />
                    ) : null}
                    {activeMerchant?.customerStatus === "RISK_FROZEN" ? (
                        <Alert
                            type="error"
                            showIcon
                            message="账户已风控冻结，无法发起新交易，请联系客服或等待运营处理"
                            style={{ marginBottom: 16 }}
                        />
                    ) : null}
                    {children}
                </Content>
                <SupportFloatingEntry />
            </Layout>
        </Layout>
    );
}
