"use client";

import { useTranslations } from "next-intl";
import { ORDER_TRADE_STATUS_OPTIONS, type OrderTradeStatus } from "./order-list-model";
import styles from "./OrderStatusBadge.module.css";

type BadgeVariant = "success" | "pending" | "processing" | "failed" | "neutral" | "warning" | "capture";

function getBadgeVariant(status: string): BadgeVariant {
    switch (status) {
        case "SUCCESS":
        case "PARTIAL_SUCCESS":
            return "success";
        case "PENDING":
            return "pending";
        case "PROCESSING":
            return "processing";
        case "FAILED":
            return "failed";
        case "DISPUTED":
            return "warning";
        case "REQUIRES_CAPTURE":
            return "capture";
        default:
            return "neutral";
    }
}

interface OrderStatusBadgeProps {
    status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const t = useTranslations("Orders");
    const variant = getBadgeVariant(status);
    const labelKey = `trade_status.${status}` as const;
    const label = ORDER_TRADE_STATUS_OPTIONS.includes(status as OrderTradeStatus)
        ? t(labelKey)
        : status;

    return (
        <span className={`${styles.badge} ${styles[variant]}`}>
            <span className={styles.dot} aria-hidden />
            {label}
        </span>
    );
}
