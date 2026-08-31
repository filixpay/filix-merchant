"use client";

import { Alert, Button, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import type { CreditLineView } from "@/lib/api";
import {
    formatCreditAmount,
    formatPartyDisplayName,
    getCreditStatusColor,
} from "./credit-model";
import { resolveDashboardTableState } from "@/lib/dashboard/table-state";
import DashboardTableError from "../layout/DashboardTableError";
import DashboardTableEmpty from "../layout/DashboardTableEmpty";

type CreditLineTableVariant = "admin" | "member";

interface CreditLineListTableProps {
    creditLines: CreditLineView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    emptyText?: string;
    total?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
    onRetry?: () => void;
    onAdjust?: (line: CreditLineView) => void;
    onViewAdjustments?: (line: CreditLineView) => void;
    onViewTransactions?: (line: CreditLineView) => void;
    variant?: CreditLineTableVariant;
    translationNs?: string;
}

export default function CreditLineListTable({
    creditLines,
    loading,
    isRefreshing = false,
    error = null,
    emptyText,
    total,
    page,
    pageSize,
    onPageChange,
    onRetry,
    onAdjust,
    onViewAdjustments,
    onViewTransactions,
    variant = "admin",
    translationNs = "CreditLimit",
}: CreditLineListTableProps) {
    const t = useTranslations(translationNs);
    const tShared = useTranslations("CreditLimit");
    const tCommon = useTranslations("Common");

    const renderPaymentTerm = (type: string, days: string) => {
        if (type === "NET_DAYS") {
            return tShared("payment_terms.net_days", { days: days || "30" });
        }
        return tShared("payment_terms.immediate");
    };

    const hasRowActions = Boolean(onAdjust || onViewAdjustments || onViewTransactions);

    const columns: ColumnsType<CreditLineView> = [];

    if (variant === "admin") {
        columns.push({
            title: t("headers.source"),
            key: "source",
            render: (_, line) => (
                <Typography.Text>
                    {line.creditLineSource === "MERCHANT"
                        ? tShared("sources.merchant")
                        : tShared("sources.bank")}
                </Typography.Text>
            ),
        });
    }

    columns.push(
        {
            title: t("headers.creditor"),
            key: "creditor",
            render: (_, line) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text>
                        {formatPartyDisplayName(line.creditor) || tCommon("unknown")}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {line.creditor?.code || "-"}
                    </Typography.Text>
                </Space>
            ),
        },
    );

    if (variant === "admin") {
        columns.push({
            title: t("headers.debitor"),
            key: "debitor",
            render: (_, line) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text>
                        {formatPartyDisplayName(line.debitor) || tCommon("unknown")}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {line.debitor?.code || "-"}
                    </Typography.Text>
                </Space>
            ),
        });
    }

    columns.push(
        {
            title: t("headers.credit_limit"),
            key: "creditLimit",
            align: "right",
            render: (_, line) => (
                <Typography.Text>{formatCreditAmount(line.creditLimit)}</Typography.Text>
            ),
        },
        {
            title: t("headers.used_amount"),
            key: "usedAmount",
            align: "right",
            render: (_, line) => (
                <Typography.Text style={{ color: "#ef4444" }}>
                    {formatCreditAmount(line.usedAmount)}
                </Typography.Text>
            ),
        },
        {
            title: t("headers.available_amount"),
            key: "availableAmount",
            align: "right",
            render: (_, line) => (
                <Typography.Text style={{ color: "#10b981" }}>
                    {formatCreditAmount(line.availableAmount)}
                </Typography.Text>
            ),
        },
        {
            title: t("headers.payment_term"),
            key: "paymentTerm",
            render: (_, line) => renderPaymentTerm(line.paymentTermType, line.paymentTermDays),
        },
        {
            title: t("headers.status"),
            key: "status",
            render: (_, line) => (
                <Tag color={getCreditStatusColor(line.activeStatus)}>
                    {line.activeStatus === "ACTIVE"
                        ? tShared("status.active")
                        : tShared("status.inactive")}
                </Tag>
            ),
        },
    );

    if (hasRowActions) {
        columns.push({
            title: tCommon("actions"),
            key: "actions",
            align: "right",
            width: onAdjust ? 240 : 180,
            render: (_, line) => (
                <Space
                    size={0}
                    split={
                        <Typography.Text type="secondary" style={{ marginInline: 4 }}>
                            ·
                        </Typography.Text>
                    }
                >
                    {onAdjust ? (
                        <Button type="link" size="small" style={{ paddingInline: 0 }} onClick={() => onAdjust(line)}>
                            {tShared("adjust")}
                        </Button>
                    ) : null}
                    {onViewAdjustments ? (
                        <Button
                            type="link"
                            size="small"
                            style={{ paddingInline: 0 }}
                            onClick={() => onViewAdjustments(line)}
                        >
                            {t("view_adjustments")}
                        </Button>
                    ) : null}
                    {onViewTransactions ? (
                        <Button
                            type="link"
                            size="small"
                            style={{ paddingInline: 0 }}
                            onClick={() => onViewTransactions(line)}
                        >
                            {t("view_transactions")}
                        </Button>
                    ) : null}
                </Space>
            ),
        });
    }

    const tableState = resolveDashboardTableState({
        loading,
        error: error ?? null,
        rowCount: creditLines.length,
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
                dataSource={creditLines}
                rowKey="id"
                loading={loading || isRefreshing}
                size="middle"
                scroll={{ x: 1100 }}
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
