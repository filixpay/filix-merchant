"use client";

import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import styles from "./layout.module.css";
import type { DashboardContentMode } from "./dashboard-content-mode";
import { useDashboardContentMode } from "./dashboard-content-mode-context";

interface DashboardPageProps {
    title: string;
    subtitle?: React.ReactNode;
    extra?: React.ReactNode;
    filterBar?: React.ReactNode;
    contentMode?: DashboardContentMode;
    plain?: boolean;
    children: React.ReactNode;
}

export default function DashboardPage({
    title,
    subtitle,
    extra,
    filterBar,
    contentMode,
    plain = false,
    children,
}: DashboardPageProps) {
    const { setOverrideMode } = useDashboardContentMode();

    useEffect(() => {
        setOverrideMode(contentMode ?? null);
        return () => {
            setOverrideMode(null);
        };
    }, [contentMode, setOverrideMode]);

    return (
        <div className={styles.pageContainer}>
            <header className={styles.pageHeader}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                    <div>
                        <Typography
                            variant="h2"
                            sx={{
                                m: 0,
                                color: "#1e293b",
                                fontWeight: 600,
                                letterSpacing: "-0.01em",
                                fontSize: 22,
                            }}
                        >
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: 13, mt: 0.25, display: "block" }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </div>
                    {extra && <div className={styles.pageExtra}>{extra}</div>}
                </Box>
            </header>

            {filterBar && (
                <section className={styles.filterSection}>
                    {filterBar}
                </section>
            )}

            <main className={plain ? styles.pageContentPlain : styles.pageContent}>
                {children}
            </main>
        </div>
    );
}
