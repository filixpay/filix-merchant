"use client";

import React, { useState } from "react";
import { Table, Tag, Typography, Button, Space } from "antd";
import { useTranslations } from "next-intl";
import type { ColumnsType } from "antd/es/table";
import { getPayoutReviewStatusColor, formatAmount } from "./payout-review-model";
import PayoutReviewModal from "./PayoutReviewModal";
import { PayoutView } from "@/lib/api";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";

interface PayoutReviewTableProps {
    payouts: PayoutView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    onReview?: (id: number) => void;
    currentStatus?: string;
    onSuccess: () => void;
    accessToken: string;
}

export default function PayoutReviewTable({
    payouts,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    currentStatus = "PENDING",
    onSuccess,
    accessToken,
}: PayoutReviewTableProps) {
    const t = useTranslations("PayoutReview");
    const tCommon = useTranslations("Common");

    const [selectedPayout, setSelectedPayout] = useState<PayoutView | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleReviewLocal = (record: PayoutView) => {
        setSelectedPayout(record);
        setIsModalOpen(true);
    };

    const columns: ColumnsType<PayoutView> = [
        {
            title: t("headers.id"),
            dataIndex: "id",
            key: "id",
            render: (val: number) => <Typography.Text style={{ fontFamily: "var(--font-mono)" }}>{val}</Typography.Text>,
        },
        {
            title: t("headers.amount"),
            dataIndex: "totalAmount",
            key: "totalAmount",
            align: "right" as const,
            render: (val: number) => <Typography.Text>{formatAmount(val)}</Typography.Text>,
        },
        {
            title: t("headers.payee"),
            key: "payee",
            render: (_: unknown, r: PayoutView) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text>{r.payeeAccountHolder}</Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}>
                        {r.payeeAccountNumber}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                        {r.payeeBankName}
                    </Typography.Text>
                </Space>
            ),
        },
        {
            title: t("headers.payer"),
            key: "payer",
            render: (_: unknown, r: PayoutView) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text>{r.payerAccountHolder}</Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}>
                        {r.payerAccountNumber}
                    </Typography.Text>
                </Space>
            ),
        },
        {
            title: t("headers.review_status"),
            dataIndex: "reviewStatus",
            key: "reviewStatus",
            render: (status: string) => (
                <Tag color={getPayoutReviewStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: t("headers.memo"),
            dataIndex: "memo",
            key: "memo",
            render: (val: string) => val || "-",
        },
        {
            title: t("headers.created_at"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (val: string) => (val ? new Date(val).toLocaleString() : "-"),
        },
        {
            title: t("headers.actions"),
            key: "actions",
            fixed: "right" as const,
            width: 100,
            align: "center" as const,
            hidden: currentStatus !== "PENDING",
            render: (_: unknown, r: PayoutView) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => handleReviewLocal(r)}
                >
                    {t("review_btn")}
                </Button>
            ),
        },
    ].filter(col => !col.hidden);

    const { tableLoading, locale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: payouts.length,
        emptyDescription: tCommon("no_data"),
        onRetry,
    });

    return (
        <>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {refreshBanner}
                <Table
                    columns={columns}
                    dataSource={payouts}
                    rowKey="id"
                    loading={tableLoading}
                    scroll={{ x: 1200 }}
                    size="middle"
                    locale={locale}
                    pagination={false}
                />
            </Space>
            <PayoutReviewModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedPayout(null);
                }}
                payout={selectedPayout}
                accessToken={accessToken}
                onSuccess={onSuccess}
            />
        </>
    );
}
