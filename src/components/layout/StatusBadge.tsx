"use client";

import styles from "./StatusBadge.module.css";

/**
 * Semantic tones for the unified status badge.
 *
 * - `success`    – paid, active, completed, approved
 * - `warning`    – pending, disputed, under review
 * - `processing` – in-progress, processing
 * - `danger`     – failed, rejected, expired, error
 * - `neutral`    – draft, unknown, cancelled, closed
 * - `info`       – requires capture, requires attention
 */
export type StatusBadgeTone =
    | "success"
    | "warning"
    | "processing"
    | "danger"
    | "neutral"
    | "info";

interface StatusBadgeProps {
    /** The human-readable label to display inside the badge */
    label: string;
    /** Semantic tone controlling color */
    tone: StatusBadgeTone;
    /** Hide the dot indicator (default: show) */
    hideDot?: boolean;
}

/**
 * Unified status badge for all Merchant Center list pages.
 *
 * Usage:
 * ```tsx
 * <StatusBadge label="Active" tone="success" />
 * <StatusBadge label={t("status.pending")} tone="warning" />
 * ```
 */
export default function StatusBadge({ label, tone, hideDot = false }: StatusBadgeProps) {
    return (
        <span className={`${styles.badge} ${styles[tone]}`}>
            {!hideDot && <span className={styles.dot} aria-hidden />}
            {label}
        </span>
    );
}
