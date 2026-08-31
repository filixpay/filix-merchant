"use client";

import React, { useState } from "react";
import { Table, Tag, Typography, Button, Tooltip, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { ColumnsType } from "antd/es/table";
import { api, OrderView } from "@/lib/api";
import { getTransferStatusColor, formatAmount } from "./transfer-record-model";
import TransferDetailsModal from "./TransferDetailsModal";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";

interface TransferTableProps {
    records: OrderView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number, pageSize: number) => void;
    accessToken: string;
}

export default function TransferTable({
    records,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    total,
    page,
    pageSize,
    onPageChange,
    accessToken,
}: TransferTableProps) {
    const t = useTranslations("TransferRecords");
    const tCommon = useTranslations("Common");

    const [detailRecord, setDetailRecord] = useState<OrderView | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = async (record: OrderView) => {
        setIsModalOpen(true);
        setDetailLoading(true);
        try {
            const detail = await api.orders.get(record.merchantOrderId, accessToken);
            setDetailRecord(detail.order);
        } catch (error) {
            console.error("Failed to fetch transfer details:", error);
            setDetailRecord(record);
        } finally {
            setDetailLoading(false);
        }
    };

    const columns: ColumnsType<OrderView> = [
        {
            title: t("headers.transfer_no"),
            dataIndex: "merchantOrderId",
            key: "transferNo",
            render: (val) => <Typography.Text>{val}</Typography.Text>,
        },
        {
            title: t("headers.amount"),
            dataIndex: "totalAmount",
            key: "amount",
            align: "right",
            render: (amt) => <Typography.Text>{formatAmount(amt)}</Typography.Text>,
        },
        {
            title: t("headers.status"),
            dataIndex: "tradeStatus",
            key: "status",
            render: (status) => (
                <Tag color={getTransferStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: t("headers.created_at"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (val) => val ? new Date(val).toLocaleString() : "-",
        },
        {
            title: tCommon("actions"),
            key: "actions",
            fixed: "right",
            width: 100,
            align: "center",
            render: (_, r) => (
                <Tooltip title={tCommon("view")}>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(r)}
                        style={{ color: "#6366f1" }}
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
                    rowKey={(r) => r.id || r.merchantOrderId}
                    loading={tableLoading}
                    scroll={{ x: 800 }}
                    size="middle"
                    locale={locale}
                    pagination={{
                        current: page + 1,
                        pageSize,
                        total,
                        onChange: onPageChange,
                        showSizeChanger: true,
                    }}
                />
            </Space>
            <TransferDetailsModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setDetailRecord(null);
                }}
                record={detailRecord}
                loading={detailLoading}
                accessToken={accessToken}
            />
        </>
    );
}
