"use client";

import Link from "next/link";
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
            <ol className={styles.breadcrumbList}>
                {ancestors.map((item) => (
                    <li key={item.key} className={styles.breadcrumbItem}>
                        {item.href ? (
                            <Link href={item.href} className={styles.breadcrumbLink}>
                                {item.label}
                            </Link>
                        ) : (
                            <span className={styles.breadcrumbMuted}>{item.label}</span>
                        )}
                        <span className={styles.breadcrumbSeparator} aria-hidden>
                            /
                        </span>
                    </li>
                ))}
                <li className={`${styles.breadcrumbItem} ${styles.breadcrumbCurrentItem}`}>
                    <span className={styles.breadcrumbCurrent} aria-current="page">
                        {current.label}
                    </span>
                </li>
            </ol>
            <span className={styles.breadcrumbMobileCurrent} aria-current="page">
                {current.label}
            </span>
        </nav>
    );
}
