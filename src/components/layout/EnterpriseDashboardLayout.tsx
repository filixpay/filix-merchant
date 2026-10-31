"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Drawer,
    IconButton,
    Stack,
    List,
    ListItemButton,
    ListItemText,
    Tooltip,
    Typography,
} from "@mui/material";
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

    const enterpriseMenuItems = useMemo(
        () => buildEnterpriseMenuModel(tEnterprise, locale),
        [locale, tEnterprise],
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
            {/* Mobile Drawer */}
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
                    <List dense disablePadding sx={{ py: 0.5 }}>
                        {enterpriseMenuItems.map((item) => {
                            const isSelected = selectedKey === item.key;
                            return (
                                <ListItemButton
                                    key={item.key}
                                    component={Link}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    selected={isSelected}
                                    sx={{
                                        minHeight: 32,
                                        height: 32,
                                        px: 2,
                                        mx: 1,
                                        my: "1px",
                                        borderRadius: "6px",
                                        position: "relative",
                                        color: isSelected ? "primary.main" : "text.secondary",
                                        bgcolor: isSelected ? "#eff6ff !important" : "transparent",
                                        fontWeight: isSelected ? 600 : 500,
                                        fontSize: 13,
                                        "&:hover": {
                                            bgcolor: isSelected ? "#eff6ff" : "#f1f5f9",
                                            color: isSelected ? "primary.main" : "#0f172a",
                                        },
                                        ...(isSelected && {
                                            "&::before": {
                                                content: '""',
                                                position: "absolute",
                                                left: 0,
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                width: "3px",
                                                height: "16px",
                                                bgcolor: "primary.main",
                                                borderRadius: "0 999px 999px 0",
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
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                        }
                                        sx={{ m: 0 }}
                                    />
                                </ListItemButton>
                            );
                        })}
                    </List>
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
                    <List dense disablePadding sx={{ py: 0.5 }}>
                        {enterpriseMenuItems.map((item) => {
                            const isSelected = selectedKey === item.key;
                            const btn = (
                                <ListItemButton
                                    key={item.key}
                                    component={Link}
                                    href={item.href}
                                    selected={isSelected}
                                    sx={{
                                        minHeight: 32,
                                        height: 32,
                                        px: isCollapsed ? 1.5 : 2,
                                        mx: 1,
                                        my: "1px",
                                        borderRadius: "6px",
                                        position: "relative",
                                        justifyContent: isCollapsed ? "center" : "flex-start",
                                        color: isSelected ? "primary.main" : "text.secondary",
                                        bgcolor: isSelected ? "#eff6ff !important" : "transparent",
                                        fontWeight: isSelected ? 600 : 500,
                                        fontSize: 13,
                                        "&:hover": {
                                            bgcolor: isSelected ? "#eff6ff" : "#f1f5f9",
                                            color: isSelected ? "primary.main" : "#0f172a",
                                        },
                                        ...(isSelected && {
                                            "&::before": {
                                                content: '""',
                                                position: "absolute",
                                                left: 0,
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                width: "3px",
                                                height: "16px",
                                                bgcolor: "primary.main",
                                                borderRadius: "0 999px 999px 0",
                                            },
                                        }),
                                    }}
                                >
                                    {!isCollapsed && (
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    sx={{
                                                        fontSize: 13,
                                                        fontWeight: isSelected ? 600 : 500,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item.label}
                                                </Typography>
                                            }
                                            sx={{ m: 0 }}
                                        />
                                    )}
                                </ListItemButton>
                            );
                            return isCollapsed ? (
                                <Tooltip key={item.key} title={item.label} placement="right">
                                    {btn}
                                </Tooltip>
                            ) : (
                                btn
                            );
                        })}
                    </List>
                </div>
            </Drawer>

            <SidebarCollapseToggle
                collapsed={isCollapsed}
                onToggle={() => setIsCollapsed((value) => !value)}
            />

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
                <Box component="header" className={styles.header}>
                    <div className={styles.headerLeft}>
                        <IconButton
                            className={styles.mobileToggle}
                            onClick={() => setIsMobileMenuOpen((open) => !open)}
                            aria-label="Toggle menu"
                            size="small"
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
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }} className={styles.headerActions}>
                            <LanguageSwitcher />
                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: "primary.main",
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                {session?.user?.name?.[0] || "E"}
                            </Avatar>
                            <Button
                                variant="text"
                                startIcon={<LogOut size={16} strokeWidth={1.5} />}
                                onClick={handleLogout}
                                sx={{
                                    color: "text.secondary",
                                    fontSize: 13,
                                    "&:hover": { color: "text.primary" },
                                }}
                            >
                                {t("logout")}
                            </Button>
                        </Stack>
                    </div>
                </Box>

                <Box component="main" className={styles.content} sx={{ flexGrow: 1, overflow: "auto" }}>
                    {!selectedEnterpriseCode &&
                        enterprises.length === 0 &&
                        !enterprisesLoading && (
                            <Alert
                                severity="info"
                                sx={{ mb: 2 }}
                            >
                                <strong>{tEnterprise("no_enterprises_title")}</strong>:{" "}
                                {tEnterprise("no_enterprises_desc")}
                            </Alert>
                        )}
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
