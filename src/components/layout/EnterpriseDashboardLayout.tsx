"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Avatar, Button, Layout, Menu, Space, Spin } from "antd";
import { LogOut, Menu as MenuIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import EnterpriseSwitcher from "./EnterpriseSwitcher";
import {
    buildEnterpriseMenuModel,
    getEnterpriseSelectedMenuKey,
} from "./enterprise-menu";
import {
    buildKeycloakLogoutUrl,
    buildLoginCallbackUrl,
    canUseKeycloakEndSession,
} from "./keycloak-logout";
import { useEnterpriseCapabilities } from "./use-enterprise-capabilities";
import {
    enterpriseCodeToString,
    getStoredSelectedEnterpriseCode,
} from "./enterprise-shell";
import styles from "./layout.module.css";
import SidebarCollapseToggle from "./SidebarCollapseToggle";
import { sanitizeCallbackUrl } from "@/lib/auth/dashboard-route";

const { Sider, Header, Content } = Layout;

export default function EnterpriseDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();
    const { data: session, status } = useSession();
    const accessToken = session?.accessToken;
    const t = useTranslations("Layout");
    const tCommon = useTranslations("Common");
    const tEnterprise = useTranslations("Layout.enterprise");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const {
        enterprises,
        enterprisesLoading,
        activeEnterprise,
        selectEnterprise,
    } = useEnterpriseCapabilities(accessToken);

    const selectedEnterpriseCode = getStoredSelectedEnterpriseCode();

    useEffect(() => {
        if (status !== "unauthenticated") {
            return;
        }
        const fallback = `/${locale}/enterprise/dashboard`;
        const callbackUrl = sanitizeCallbackUrl(pathname, fallback);
        router.replace(`/${locale}/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }, [status, locale, pathname, router]);

    useEffect(() => {
        if (status !== "authenticated" || enterprisesLoading) {
            return;
        }
        if (enterprises.length === 0) {
            return;
        }
        if (!selectedEnterpriseCode && !pathname.includes("/enterprise/pick")) {
            router.replace(`/${locale}/enterprise/pick`);
        }
    }, [
        enterprises.length,
        enterprisesLoading,
        locale,
        pathname,
        router,
        selectedEnterpriseCode,
        status,
    ]);

    const handleEnterpriseSelect = useCallback(
        (enterprise: Parameters<typeof selectEnterprise>[0]) => {
            selectEnterprise(enterprise);
            router.push(`/${locale}/enterprise/dashboard`);
        },
        [locale, router, selectEnterprise],
    );

    const menuItems = useMemo(() => {
        return buildEnterpriseMenuModel(tEnterprise, locale).map((item) => ({
            key: item.key,
            label: (
                <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    {item.label}
                </Link>
            ),
        }));
    }, [locale, tEnterprise]);

    const selectedKey = getEnterpriseSelectedMenuKey(pathname, locale);

    const handleLogout = async () => {
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
                        <EnterpriseSwitcher
                            variant="sidebar"
                            enterprises={enterprises}
                            selectedEnterpriseCode={
                                activeEnterprise
                                    ? enterpriseCodeToString(activeEnterprise.enterpriseCode)
                                    : selectedEnterpriseCode
                            }
                            loading={enterprisesLoading}
                            onSelect={handleEnterpriseSelect}
                        />
                    )}
                    <Menu
                        mode="inline"
                        inlineCollapsed={isCollapsed}
                        selectedKeys={[selectedKey]}
                        items={menuItems}
                        className={styles.menu}
                    />
                </div>
            </Sider>

            <SidebarCollapseToggle
                collapsed={isCollapsed}
                onToggle={() => setIsCollapsed((value) => !value)}
            />

            <Layout className={`${styles.mainLayout} dashboard-shell-main`}>
                <Header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <Button
                            className={styles.mobileToggle}
                            type="text"
                            icon={<MenuIcon size={20} strokeWidth={1.5} className={styles.headerIcon} />}
                            onClick={() => setIsMobileMenuOpen((open) => !open)}
                            aria-label="Toggle menu"
                        />
                        {activeEnterprise && (
                            <div className={styles.merchantInfo}>
                                <div className={styles.merchantName}>{activeEnterprise.name}</div>
                                <div className={styles.merchantCode}>
                                    {tEnterprise("enterprise_code")}:{" "}
                                    {enterpriseCodeToString(activeEnterprise.enterpriseCode)} ·{" "}
                                    {activeEnterprise.kind}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.headerRight}>
                        <Space className={styles.headerActions} size={12}>
                            <LanguageSwitcher />
                            <Avatar className={styles.avatar}>
                                {session?.user?.name?.[0] || "E"}
                            </Avatar>
                            <Button
                                type="text"
                                icon={<LogOut size={16} strokeWidth={1.5} />}
                                onClick={handleLogout}
                            >
                                {t("logout")}
                            </Button>
                        </Space>
                    </div>
                </Header>

                <Content className={styles.content}>
                    {!selectedEnterpriseCode &&
                        enterprises.length === 0 &&
                        !enterprisesLoading && (
                            <Alert
                                type="info"
                                showIcon
                                message={tEnterprise("no_enterprises_title")}
                                description={tEnterprise("no_enterprises_desc")}
                                style={{ marginBottom: 16 }}
                            />
                        )}
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
