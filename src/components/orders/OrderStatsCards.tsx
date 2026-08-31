"use client";

import { useMemo } from "react";
import { Popover } from "antd";
import { useLocale, useTranslations } from "next-intl";
import type { OrderView } from "@/lib/api";
import { formatWalletAmountDisplay } from "@/lib/money/asset-display";
import { computeOrderPageStats } from "./order-list-model";
import styles from "./OrderStatsCards.module.css";

interface OrderStatsCardsProps {
    orders: OrderView[];
    total: number;
}

function formatPageAmount(amount: number, currency: string, locale: string): string {
    const { symbol, amount: formatted } = formatWalletAmountDisplay(
        amount.toFixed(2),
        currency,
        locale,
    );
    return symbol ? `${symbol}${formatted}` : `${formatted} ${currency}`;
}

function PageAmountValue({
    orders,
    pageAmounts,
    locale,
}: {
    orders: OrderView[];
    pageAmounts: { currency: string; amount: number }[];
    locale: string;
}) {
    const t = useTranslations("Orders");

    if (pageAmounts.length === 0) {
        return <span className={styles.statValue}>{t("stats.no_data")}</span>;
    }

    const primaryCurrency =
        orders[0]?.totalAmount?.currency?.trim() ?? pageAmounts[0].currency;
    const primary =
        pageAmounts.find((row) => row.currency === primaryCurrency) ?? pageAmounts[0];

    if (pageAmounts.length === 1) {
        return (
            <span className={styles.statValue}>
                {formatPageAmount(primary.amount, primary.currency, locale)}
                <span className={styles.statUnit}>{primary.currency}</span>
            </span>
        );
    }

    const popoverContent = (
        <ul className={styles.popoverList}>
            {pageAmounts.map((row) => (
                <li key={row.currency} className={styles.popoverRow}>
                    <span className={styles.popoverCode}>{row.currency}</span>
                    <span className={styles.popoverAmount}>
                        {formatPageAmount(row.amount, row.currency, locale)}
                    </span>
                </li>
            ))}
        </ul>
    );

    return (
        <Popover content={popoverContent} placement="bottomLeft" mouseEnterDelay={0.15}>
            <span className={`${styles.statValue} ${styles.pageAmountTrigger}`}>
                <span className={styles.pageAmountPrimary}>
                    {formatPageAmount(primary.amount, primary.currency, locale)}
                    <span className={styles.statUnit}>{primary.currency}</span>
                </span>
                <span className={styles.moreCurrencies}>
                    {t("stats.more_currencies", { count: pageAmounts.length - 1 })}
                </span>
            </span>
        </Popover>
    );
}

export default function OrderStatsCards({ orders, total }: OrderStatsCardsProps) {
    const t = useTranslations("Orders");
    const locale = useLocale();
    const stats = useMemo(() => computeOrderPageStats(orders, total), [orders, total]);

    const cards = [
        {
            key: "total_orders",
            label: t("stats.total_orders"),
            content: (
                <span className={styles.statValue}>
                    {stats.totalOrders.toLocaleString()}
                    <span className={styles.statUnit}>{t("stats.orders_unit")}</span>
                </span>
            ),
        },
        {
            key: "page_amount",
            label: t("stats.page_amount"),
            content: (
                <PageAmountValue
                    orders={orders}
                    pageAmounts={stats.pageAmountsByCurrency}
                    locale={locale}
                />
            ),
        },
        {
            key: "success_rate",
            label: t("stats.success_rate"),
            content: (
                <span className={styles.statValue}>
                    {orders.length > 0 ? `${stats.successRate}%` : t("stats.no_data")}
                </span>
            ),
        },
        {
            key: "pending_orders",
            label: t("stats.pending_orders"),
            content: (
                <span className={styles.statValue}>
                    {stats.pendingCount.toString()}
                    {stats.pendingCount > 0 ? (
                        <span className={styles.statUnit}>{t("stats.orders_unit")}</span>
                    ) : null}
                </span>
            ),
        },
    ];

    return (
        <div className={styles.statsGrid}>
            {cards.map((card) => (
                <div key={card.key} className={styles.statCard}>
                    <span className={styles.statLabel}>{card.label}</span>
                    {card.content}
                </div>
            ))}
        </div>
    );
}
