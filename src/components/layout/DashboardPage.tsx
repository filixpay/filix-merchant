"use client";

import React, { useEffect } from "react";
import { Typography, Flex } from "antd";
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
                <Flex justify="space-between" align="flex-start">
                    <div>
                        <Typography.Title
                            level={2}
                            style={{
                                margin: 0,
                                color: "#1e293b",
                                fontWeight: 600,
                                letterSpacing: "-0.01em",
                                fontSize: 22,
                            }}
                        >
                            {title}
                        </Typography.Title>
                        {subtitle && (
                            <Typography.Text
                                type="secondary"
                                style={{ fontSize: 13, marginTop: 2, display: "block" }}
                            >
                                {subtitle}
                            </Typography.Text>
                        )}
                    </div>
                    {extra && <div className={styles.pageExtra}>{extra}</div>}
                </Flex>
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

