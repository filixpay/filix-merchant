"use client";

import { Copy } from "lucide-react";
import { message } from "antd";
import { useTranslations } from "next-intl";
import styles from "./OrderIdCell.module.css";

interface OrderIdCellProps {
    merchantOrderId?: string | null;
    tradeNo?: string | null;
    onOpenDetails?: () => void;
}

async function copyText(value: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(value);
        return true;
    } catch {
        return false;
    }
}

export default function OrderIdCell({
    merchantOrderId,
    tradeNo,
    onOpenDetails,
}: OrderIdCellProps) {
    const t = useTranslations("Orders");

    const handleCopy = async (value: string | null | undefined) => {
        if (!value) return;
        const ok = await copyText(value);
        if (ok) {
            message.success(t("payment_modal.copy_success"));
        }
    };

    const primary = merchantOrderId || "-";
    const secondary = tradeNo || null;

    return (
        <div className={`${styles.cell} order-id-cell`}>
            <div className={styles.primaryRow}>
                {merchantOrderId && onOpenDetails ? (
                    <button
                        type="button"
                        className={styles.orderLink}
                        onClick={onOpenDetails}
                        title={t("actions.view_details")}
                    >
                        {primary}
                    </button>
                ) : (
                    <span className={styles.primary}>{primary}</span>
                )}
                {merchantOrderId ? (
                    <button
                        type="button"
                        className={styles.copyButton}
                        aria-label={t("copy_order")}
                        onClick={() => handleCopy(merchantOrderId)}
                    >
                        <Copy size={12} strokeWidth={2} />
                    </button>
                ) : null}
            </div>
            {secondary ? (
                <div className={styles.primaryRow}>
                    <span className={styles.secondary} title={secondary}>
                        {secondary}
                    </span>
                    <button
                        type="button"
                        className={styles.copyButton}
                        aria-label={t("headers.trade_no")}
                        onClick={() => handleCopy(tradeNo)}
                    >
                        <Copy size={12} strokeWidth={2} />
                    </button>
                </div>
            ) : null}
        </div>
    );
}
