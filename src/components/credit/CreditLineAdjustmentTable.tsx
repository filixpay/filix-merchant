"use client";

import { Alert, Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import type { CreditLineAdjustmentView } from "@/lib/api";
import {
    formatCreditAmount,
    formatCreditDateTime,
    formatPartyDisplayName,
    getAdjustmentAmountColor,
} from "./credit-model";
import { resolveDashboardTableState } from "@/lib/dashboard/table-state";
import DashboardTableError from "../layout/DashboardTableError";
import DashboardTableEmpty from "../layout/DashboardTableEmpty";

type AdjustmentTableVariant = "admin" | "member";

interface CreditLineAdjustmentTableProps {
    adjustments: CreditLineAdjustmentView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    emptyText?: string;
    total?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
    onRetry?: () => void;
    variant?: AdjustmentTableVariant;
    translationNs?: string;
}

export default function CreditLineAdjustmentTable({
    adjustments,
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
    translationNs = "CreditAdjustment",
}: CreditLineAdjustmentTableProps) {
    const t = useTranslations(translationNs);
    const tCommon = useTranslations("Common");

    const columns: ColumnsType<CreditLineAdjustmentView> = [
        {
            title: t("headers.operator"),
            key: "operator",
            render: (_, item) => (
                <Typography.Text>{item.operator || tCommon("system")}</Typography.Text>
            ),
        },
    ];

    if (variant === "admin") {
        columns.push({
            title: t("headers.debitor"),
            key: "debitor",
            render: (_, item) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text>
                        {formatPartyDisplayName(item.creditLine?.debitor) ||
                            tCommon("unknown")}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {item.creditLine?.debitor?.code || "-"}
                    </Typography.Text>
                </Space>
            ),
        });
    }

    columns.push(
        {
            title: t("headers.old_limit"),
            key: "oldLimit",
            align: "right",
            render: (_, item) => formatCreditAmount(item.oldLimit),
        },
        {
            title: t("headers.new_limit"),
            key: "newLimit",
            align: "right",
            render: (_, item) => (
                <Typography.Text>{formatCreditAmount(item.newLimit)}</Typography.Text>
            ),
        },
        {
            title: t("headers.amount"),
            key: "amount",
            align: "right",
            render: (_, item) => (
                <Typography.Text style={{ color: getAdjustmentAmountColor(item.amount) }}>
                    {item.amount > 0
                        ? `+${formatCreditAmount(item.amount)}`
                        : formatCreditAmount(item.amount)}
                </Typography.Text>
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
        rowCount: adjustments.length,
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
                dataSource={adjustments}
                rowKey="id"
                loading={loading || isRefreshing}
                size="middle"
                scroll={{ x: 900 }}
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
