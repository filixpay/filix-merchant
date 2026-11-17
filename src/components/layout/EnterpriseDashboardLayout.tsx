"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
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

    const menuItems = useMemo(
        () => buildEnterpriseMenuModel(tEnterprise, locale),
        [tEnterprise, locale],
    );

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
                    <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", px: 1, py: 0.5 }}>
                        <List dense disablePadding>
                            {menuItems.map((item) => {
                                const isSelected = item.key === selectedKey;
                                const itemContent = (
                                    <ListItemButton
                                        key={item.key}
                                        component={Link}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        selected={isSelected}
                                        sx={{
                                            minHeight: 32,
                                            py: 0.5,
                                            px: isCollapsed ? 1 : 1.5,
                                            my: 0.25,
                                            borderRadius: 1.5,
                                            justifyContent: isCollapsed ? "center" : "flex-start",
                                            color: isSelected ? "#2563eb" : "#64748b",
                                            bgcolor: isSelected ? "#eff6ff !important" : "transparent",
                                            position: "relative",
                                            "&:hover": {
                                                bgcolor: isSelected ? "#eff6ff" : "#f1f5f9",
                                                color: isSelected ? "#2563eb" : "#0f172a",
                                            },
                                            ...(isSelected && {
                                                "&::before": {
                                                    content: '""',
                                                    position: "absolute",
                                                    left: 0,
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    width: 3,
                                                    height: 16,
                                                    bgcolor: "#2563eb",
                                                    borderRadius: "0 4px 4px 0",
                                                },
                                            }),
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    sx={{
                                                        fontSize: 13,
                                                        fontWeight: isSelected ? 600 : 500,
                                                        lineHeight: "20px",
                                                    }}
                                                >
                                                    {isCollapsed ? item.label.slice(0, 1) : item.label}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                );

                                if (isCollapsed) {
                                    return (
                                        <Tooltip key={item.key} title={item.label} placement="right" arrow>
                                            {itemContent}
                                        </Tooltip>
                                    );
                                }
                                return itemContent;
                            })}
                        </List>
                    </Box>
                </div>
            </aside>

            <SidebarCollapseToggle
                collapsed={isCollapsed}
                onToggle={() => setIsCollapsed((value) => !value)}
            />

            <Box component="main" className={`${styles.mainLayout} dashboard-shell-main`}>
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <IconButton
                            className={styles.mobileToggle}
                            size="small"
                            onClick={() => setIsMobileMenuOpen((open) => !open)}
                            aria-label="Toggle menu"
                            sx={{ color: "text.secondary" }}
                        >
                            <MenuIcon size={20} strokeWidth={1.5} className={styles.headerIcon} />
                        </IconButton>
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
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <LanguageSwitcher />
                            <Avatar
                                sx={{
                                    width: 28,
                                    height: 28,
                                    fontSize: 13,
                                    bgcolor: "primary.main",
                                    fontWeight: 600,
                                }}
                            >
                                {session?.user?.name?.[0] || "E"}
                            </Avatar>
                            <Button
                                size="small"
                                onClick={handleLogout}
                                startIcon={<LogOut size={16} strokeWidth={1.5} />}
                                sx={{
                                    color: "text.secondary",
                                    textTransform: "none",
                                    "&:hover": { color: "error.main" },
                                }}
                            >
                                {t("logout")}
                            </Button>
                        </Box>
                    </div>
                </header>

                <div className={styles.content}>
                    {!selectedEnterpriseCode &&
                        enterprises.length === 0 &&
                        !enterprisesLoading && (
                            <Alert
                                severity="info"
                                sx={{ mb: 2 }}
                            >
                                <strong>{tEnterprise("no_enterprises_title")}</strong>
                                <div>{tEnterprise("no_enterprises_desc")}</div>
                            </Alert>
                        )}
                    {children}
                </div>
            </Box>
        </Box>
    );
}
