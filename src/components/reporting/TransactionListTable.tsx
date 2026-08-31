"use client";

import { useRouter } from "next/navigation";
import { Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useLocale, useTranslations } from "next-intl";
import MoneyMovementIdCell from "@/components/money/MoneyMovementIdCell";
import listStyles from "@/components/money/MoneyListTable.module.css";
import type { TransactionReportRow } from "@/lib/api/domains/reporting/types";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import {
    reportingTransactionFallbackPath,
    resolveReportingBusinessDetailPath,
} from "@/lib/reporting/reporting-business-detail-path";
import {
    formatTransactionAmount,
    formatTransactionDateTime,
    presentTransactionStatusTone,
    type TransactionListQuery,
    type TransactionStatusTone,
} from "./transaction-list-model";
import styles from "./TransactionListTable.module.css";

interface TransactionListTableProps {
    items: TransactionReportRow[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    total: number;
    query: TransactionListQuery;
    onQueryChange: (next: TransactionListQuery) => void;
}

const STATUS_CLASS: Record<TransactionStatusTone, string> = {
    success: styles.statusSuccess,
    warning: styles.statusWarning,
    danger: styles.statusDanger,
    neutral: styles.statusNeutral,
};

export default function TransactionListTable({
    items,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    total,
    query,
    onQueryChange,
}: TransactionListTableProps) {
    const t = useTranslations("Reporting.transactions");
    const locale = useLocale();
    const router = useRouter();

    const { tableLoading, locale: tableLocale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: items.length,
        emptyDescription: t("empty"),
        onRetry,
    });

    const statusLabel = (status: string) => {
        const key = status?.trim().toUpperCase() ?? "";
        if (!key) return "—";
        const messageKey = `statuses.${key}` as Parameters<typeof t>[0];
        return t.has(messageKey) ? t(messageKey) : status;
    };

    const orderTypeLabel = (orderType: string | null | undefined) => {
        const key = orderType?.trim().toUpperCase() ?? "";
        if (!key) return "—";
        const messageKey = `orderTypes.${key}` as Parameters<typeof t>[0];
        return t.has(messageKey) ? t(messageKey) : orderType;
    };

    const detailHref = (row: TransactionReportRow) =>
        resolveReportingBusinessDetailPath(locale, row.orderType, row.businessId) ??
        reportingTransactionFallbackPath(locale, row.reportId);

    const openDetail = (row: TransactionReportRow) => {
        router.push(detailHref(row));
    };

    const columns: ColumnsType<TransactionReportRow> = [
        {
            title: t("columns.merchant_order_id"),
            dataIndex: "merchantOrderId",
            key: "merchantOrderId",
            width: 240,
            render: (value: string, row) => (
                <MoneyMovementIdCell value={value} href={detailHref(row)} />
            ),
        },
        {
            title: t("columns.trade_no"),
            dataIndex: "tradeNo",
            key: "tradeNo",
            width: 240,
            render: (value: string, row) => (
                <MoneyMovementIdCell value={value} href={detailHref(row)} />
            ),
        },
        {
            title: t("columns.order_type"),
            dataIndex: "orderType",
            key: "orderType",
            width: 120,
            render: (orderType: string | null) => orderTypeLabel(orderType),
        },
        {
            title: t("columns.status"),
            dataIndex: "status",
            key: "status",
            width: 140,
            render: (status: string) => {
                const tone = presentTransactionStatusTone(status);
                return (
                    <span className={`${styles.statusBadge} ${STATUS_CLASS[tone]}`}>
                        <span className={styles.statusDot} />
                        {statusLabel(status)}
                    </span>
                );
            },
        },
        {
            title: t("columns.amount"),
            key: "amount",
            width: 140,
            align: "right",
            render: (_, row) => (
                <span className={`${styles.amount} financial-amount`}>
                    {formatTransactionAmount(row.amount, row.currency)}
                </span>
            ),
        },
        {
            title: t("columns.channel"),
            dataIndex: "channel",
            key: "channel",
            width: 120,
            render: (value: string) =>
                value ? <span className={styles.channel}>{value}</span> : "—",
        },
        {
            title: t("columns.created_at"),
            dataIndex: "createdAt",
            key: "createdAt",
            width: 180,
            align: "right",
            render: (value: string) => (
                <span className={styles.time}>{formatTransactionDateTime(value)}</span>
            ),
        },
    ];

    const handleTableChange = (pagination: TablePaginationConfig) => {
        onQueryChange({
            ...query,
            page: Math.max(0, (pagination.current ?? 1) - 1),
            size: pagination.pageSize ?? query.size,
        });
    };

    return (
        <>
            {refreshBanner}
            <Table<TransactionReportRow>
                className={listStyles.table}
                rowKey="reportId"
                columns={columns}
                dataSource={items}
                loading={tableLoading}
                locale={tableLocale}
                pagination={{
                    current: query.page + 1,
                    pageSize: query.size,
                    total,
                    showSizeChanger: true,
                    showTotal: (count) => t("table_total", { count }),
                }}
                onChange={handleTableChange}
                onRow={(row) => ({
                    onClick: () => openDetail(row),
                    className: "clickable-row",
                })}
                scroll={{ x: 1200 }}
            />
        </>
    );
}
