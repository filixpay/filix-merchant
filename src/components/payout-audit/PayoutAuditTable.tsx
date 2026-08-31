"use client";

import React, { useState } from "react";
import { Table, Tag, Typography, Button, Space } from "antd";
import { useTranslations } from "next-intl";
import type { ColumnsType } from "antd/es/table";
import { getPayoutAuditStatusColor, formatAmount } from "./payout-audit-model";
import PayoutAuditModal from "./PayoutAuditModal";
import { PayoutApplicationView } from "@/lib/api";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";

interface PayoutAuditTableProps {
    applications: PayoutApplicationView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    onAudit?: (id: number) => void;
    currentStatus?: string;
    onSuccess: () => void;
    accessToken: string;
}

export default function PayoutAuditTable({
    applications,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    currentStatus = "PENDING",
    onSuccess,
    accessToken,
}: PayoutAuditTableProps) {
    const t = useTranslations("PayoutAudit");
    const tCommon = useTranslations("Common");

    const [selectedApplication, setSelectedApplication] = useState<PayoutApplicationView | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAuditLocal = (record: PayoutApplicationView) => {
        setSelectedApplication(record);
        setIsModalOpen(true);
    };

    const columns: ColumnsType<PayoutApplicationView> = [
        {
            title: t("headers.order_id"),
            dataIndex: "orderId",
            key: "orderId",
            render: (val: string) => <Typography.Text style={{ fontFamily: "var(--font-mono)" }}>{val}</Typography.Text>,
        },
        {
            title: t("headers.total_amount"),
            dataIndex: "totalAmount",
            key: "totalAmount",
            align: "right" as const,
            render: (val: number) => <Typography.Text>{formatAmount(val)}</Typography.Text>,
        },
        {
            title: t("headers.fee"),
            dataIndex: "fee",
            key: "fee",
            align: "right" as const,
            render: (val: number) => <Typography.Text type="secondary">{formatAmount(val)}</Typography.Text>,
        },
        {
            title: t("headers.buyer_name"),
            key: "buyer",
            render: (_: unknown, r: PayoutApplicationView) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text>{r.buyerName || "-"}</Typography.Text>
                    {r.buyerCode && (
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {r.buyerCode}
                        </Typography.Text>
                    )}
                </Space>
            ),
        },
        {
            title: t("headers.seller_name"),
            key: "seller",
            render: (_: unknown, r: PayoutApplicationView) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text>{r.sellerName || "-"}</Typography.Text>
                    {r.sellerCode && (
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {r.sellerCode}
                        </Typography.Text>
                    )}
                </Space>
            ),
        },
        {
            title: t("headers.approval_status"),
            dataIndex: "approvalStatus",
            key: "approvalStatus",
            render: (status: string) => (
                <Tag color={getPayoutAuditStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: t("headers.payout_status"),
            dataIndex: "payoutStatus",
            key: "payoutStatus",
            render: (status: string) => (
                <Tag color={getPayoutAuditStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: t("headers.created_at"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (val: string) => val ? new Date(val).toLocaleString() : "-",
        },
        {
            title: t("headers.actions"),
            key: "actions",
            fixed: "right" as const,
            width: 100,
            align: "center" as const,
            hidden: currentStatus !== "PENDING",
            render: (_: unknown, r: PayoutApplicationView) => (
                r.approvalStatus === "PENDING" && (
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => handleAuditLocal(r)}
                    >
                        {t("audit_btn")}
                    </Button>
                )
            ),
        },
    ].filter(col => !col.hidden);

    const { tableLoading, locale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: applications.length,
        emptyDescription: tCommon("no_data"),
        onRetry,
    });

    return (
        <>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {refreshBanner}
                <Table
                    columns={columns}
                    dataSource={applications}
                    rowKey="id"
                    loading={tableLoading}
                    scroll={{ x: 1200 }}
                    size="middle"
                    locale={locale}
                    pagination={false}
                />
            </Space>
            <PayoutAuditModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedApplication(null);
                }}
                application={selectedApplication}
                accessToken={accessToken}
                onSuccess={onSuccess}
            />
        </>
    );
}
