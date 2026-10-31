"use client";

import Link from "next/link";
import { Breadcrumbs, Typography } from "@mui/material";
import type { DashboardBreadcrumbItem } from "./dashboard-breadcrumb";
import styles from "./layout.module.css";

type DashboardBreadcrumbProps = {
    items: DashboardBreadcrumbItem[];
};

export default function DashboardBreadcrumb({ items }: DashboardBreadcrumbProps) {
    if (items.length === 0) {
        return null;
    }

    const current = items[items.length - 1];
    const ancestors = items.slice(0, -1);

    return (
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Breadcrumbs
                separator={<span className={styles.breadcrumbSeparator} aria-hidden>/</span>}
                className={styles.breadcrumbList}
                sx={{
                    fontSize: 13,
                    "& .MuiBreadcrumbs-separator": {
                        mx: 0.75,
                        color: "#94a3b8",
                    },
                }}
            >
                {ancestors.map((item) =>
                    item.href ? (
                        <Link key={item.key} href={item.href} className={styles.breadcrumbLink}>
                            {item.label}
                        </Link>
                    ) : (
                        <span key={item.key} className={styles.breadcrumbMuted}>
                            {item.label}
                        </span>
                    ),
                )}
                <Typography
                    component="span"
                    className={styles.breadcrumbCurrent}
                    sx={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "text.primary",
                    }}
                    aria-current="page"
                >
                    {current.label}
                </Typography>
            </Breadcrumbs>
            <span className={styles.breadcrumbMobileCurrent} aria-current="page">
                {current.label}
            </span>
        </nav>
    );
}
