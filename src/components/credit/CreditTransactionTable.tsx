"use client";

import { Alert, Button, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import type { CreditTransactionView } from "@/lib/api";
import {
    formatCreditAmount,
    formatCreditDateTime,
    formatPartyDisplayName,
    getTransactionTypeColor,
} from "./credit-model";
import TradeNoText from "../TradeNoText";
import { resolveDashboardTableState } from "@/lib/dashboard/table-state";
import DashboardTableError from "../layout/DashboardTableError";
import DashboardTableEmpty from "../layout/DashboardTableEmpty";

type TransactionTableVariant = "admin" | "member";

interface CreditTransactionTableProps {
    transactions: CreditTransactionView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    emptyText?: string;
    total?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
    onRetry?: () => void;
    variant?: TransactionTableVariant;
    translationNs?: string;
}

export default function CreditTransactionTable({
    transactions,
    loading,
    isRefreshing = false,
    error = null,
    emptyText,
    total,
    page,
    pageSize,
    onPageChange,
    onRetry,
    variant = "admin",
    translationNs = "CreditTransaction",
}: CreditTransactionTableProps) {
    const t = useTranslations(translationNs);
    const tTypes = useTranslations("CreditTransaction");
    const tCommon = useTranslations("Common");

    const columns: ColumnsType<CreditTransactionView> = [
        {
            title: t("headers.business_id"),
            key: "businessId",
            render: (_, item) => <TradeNoText value={item.businessId} ellipsis />,
        },
    ];

    if (variant === "admin") {
        columns.push({
            title: t("headers.customer"),
            key: "customer",
            render: (_, item) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text>
                        {formatPartyDisplayName(item.creditLine?.debitor) ||
                            item.debitorId ||
                            tCommon("unknown")}
                    </Typography.Text>
                    {item.creditLine?.debitor?.code && (
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {item.creditLine.debitor.code}
                        </Typography.Text>
                    )}
                </Space>
            ),
        });
    }

    columns.push(
        {
            title: t("headers.type"),
            key: "type",
            render: (_, item) => (
                <Tag color={getTransactionTypeColor(item.creditTransactionType)}>
                    {tTypes(`types.${item.creditTransactionType}`)}
                </Tag>
            ),
        },
        {
            title: t("headers.amount"),
            key: "amount",
            align: "right",
            render: (_, item) => (
                <Typography.Text>{formatCreditAmount(item.amount)}</Typography.Text>
            ),
        },
        {
            title: t("headers.balance_before"),
            key: "balanceBefore",
            align: "right",
            render: (_, item) => formatCreditAmount(item.usedAmountBefore),
        },
        {
            title: t("headers.balance_after"),
            key: "balanceAfter",
            align: "right",
            render: (_, item) => (
                <Typography.Text>{formatCreditAmount(item.usedAmountAfter)}</Typography.Text>
            ),
        },
        {
            title: t("headers.created_at"),
            key: "createdAt",
            width: 180,
            render: (_, item) => formatCreditDateTime(item.createdAt),
        },
    );

    const tableState = resolveDashboardTableState({
        loading,
        error: error ?? null,
        rowCount: transactions.length,
    });

    return (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {tableState === "refresh-error" ? (
                <Alert
                    type="warning"
                    showIcon
                    message={tCommon("error")}
                    action={onRetry ? <Button size="small" onClick={onRetry}>{tCommon("refresh")}</Button> : null}
                />
            ) : null}

            <Table
                columns={columns}
                dataSource={transactions}
                rowKey="id"
                loading={loading || isRefreshing}
                size="middle"
                scroll={{ x: 1000 }}
                locale={{
                    emptyText:
                        tableState === "error" ? (
                            <DashboardTableError description={emptyText || tCommon("error")} onRetry={onRetry} />
                        ) : (
                            <DashboardTableEmpty description={emptyText || t("empty")} />
                        ),
                }}
                pagination={
                    onPageChange
                        ? {
                              current: (page ?? 0) + 1,
                              pageSize: pageSize ?? 20,
                              total: total ?? 0,
                              showSizeChanger: true,
                              onChange: (nextPage, nextPageSize) =>
                                  onPageChange(nextPage - 1, nextPageSize),
                          }
                        : false
                }
            />
        </Space>
    );
}
