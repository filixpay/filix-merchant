"use client";

import React, { useState } from "react";
import { Table, Tag, Typography, Button, Space, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { ColumnsType } from "antd/es/table";
import { PaymentSplitView, PaymentSplitDetailView, api, ApiError } from "@/lib/api";
import { signIn } from "next-auth/react";
import { getStatusTagColor, formatAmount } from "./payment-split-model";
import PaymentSplitDetailsModal from "./PaymentSplitDetailsModal";
import TradeNoText from "../TradeNoText";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";

interface PaymentSplitTableProps {
    records: PaymentSplitView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    accessToken: string;
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number, pageSize: number) => void;
}

export default function PaymentSplitTable({
    records,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    accessToken,
    total,
    page,
    pageSize,
    onPageChange,
}: PaymentSplitTableProps) {
    const t = useTranslations("PaymentSplits");
    const tCommon = useTranslations("Common");

    const [detailRecord, setDetailRecord] = useState<PaymentSplitDetailView | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = async (id: number) => {
        setIsModalOpen(true);
        setDetailLoading(true);
        try {
            const data = await api.paymentSplits.get(id, accessToken);
            setDetailRecord(data);
        } catch (error) {
            console.error("Failed to fetch details:", error);
            if (error instanceof ApiError && error.status === 401 && error.code !== "MISSING_ACCESS_TOKEN") {
                signIn();
            }
        } finally {
            setDetailLoading(false);
        }
    };

    const columns: ColumnsType<PaymentSplitView> = [
        {
            title: "ID",
            dataIndex: "id",
            width: 80,
        },
        {
            title: t("headers.trade_no"),
            dataIndex: "tradeNo",
            ellipsis: true,
            render: (val) => <TradeNoText value={val} ellipsis />,
        },
        {
            title: t("headers.split_amount"),
            key: "amount",
            width: 150,
            render: (_, r) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text type="success">{formatAmount(r.splitAmount)}</Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        Total: {formatAmount(r.orderAmount)}
                    </Typography.Text>
                </Space>
            ),
        },
        {
            title: t("headers.type"),
            dataIndex: "paymentSplitType",
            width: 120,
            render: (val) => t(`types.${val}`) || val,
        },
        {
            title: t("headers.status"),
            dataIndex: "paymentSplitStatus",
            width: 120,
            render: (status) => (
                <Tag color={getStatusTagColor(status)}>
                    {t(`statuses.${status}`) || status}
                </Tag>
            ),
        },
        {
            title: t("headers.receivers"),
            key: "receivers",
            width: 120,
            render: (_, r) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text>{r.successCount} / {r.receiverCount}</Typography.Text>
                    {r.failureCount > 0 && <Typography.Text type="danger" style={{ fontSize: 12 }}>Fail: {r.failureCount}</Typography.Text>}
                </Space>
            ),
        },
        {
            title: t("headers.created_at"),
            dataIndex: "createdAt",
            width: 180,
            render: (val) => val ? new Date(val).toLocaleString() : "-",
        },
        {
            title: tCommon("actions"),
            key: "actions",
            fixed: "right",
            width: 80,
            align: "center",
            render: (_, r) => (
                <Tooltip title={tCommon("view")}>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(r.id)}
                    />
                </Tooltip>
            ),
        },
    ];

    const { tableLoading, locale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: records.length,
        emptyDescription: tCommon("no_data"),
        onRetry,
    });

    return (
        <>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {refreshBanner}
                <Table
                    columns={columns}
                    dataSource={records}
                    rowKey="id"
                    loading={tableLoading}
                    scroll={{ x: 1000 }}
                    size="middle"
                    locale={locale}
                    pagination={{
                        current: page + 1,
                        pageSize,
                        total,
                        onChange: onPageChange,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} items`,
                    }}
                />
            </Space>
            <PaymentSplitDetailsModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setDetailRecord(null);
                }}
                record={detailRecord}
                loading={detailLoading}
            />
        </>
    );
}
