"use client";

import { Button, Popconfirm, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { SubMerchantView } from "@/lib/api";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import DateTimeCell from "@/components/layout/DateTimeCell";
import StatusBadge, { type StatusBadgeTone } from "@/components/layout/StatusBadge";

interface SubMerchantTableProps {
    subMerchants: SubMerchantView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    emptyText?: string;
    total?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    onEdit?: (merchant: SubMerchantView) => void;
    onDelete?: (id: number) => void;
}

export default function SubMerchantTable({
    subMerchants,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    emptyText,
    total,
    page,
    pageSize,
    onPageChange,
    onEdit,
    onDelete,
}: SubMerchantTableProps) {
    const t = useTranslations("SubMerchants");
    const tCommon = useTranslations("Common");

    const mapStatusToTone = (status: string): StatusBadgeTone => {
        const s = (status || "").toUpperCase();
        if (s === "ACTIVE") return "success";
        if (s === "INACTIVE" || s === "FROZEN") return "danger";
        if (s === "PENDING") return "warning";
        return "neutral";
    };

    const columns: ColumnsType<SubMerchantView> = [
        {
            title: t("headers.name"),
            dataIndex: "name",
            key: "name",
            render: (name: string) => <Typography.Text>{name}</Typography.Text>,
        },
        {
            title: t("headers.alias"),
            dataIndex: "alias",
            key: "alias",
        },
        {
            title: t("headers.status"),
            key: "status",
            render: (_, record) => (
                <StatusBadge label={record.status} tone={mapStatusToTone(record.status)} />
            ),
        },
        {
            title: t("headers.created_at"),
            key: "createdAt",
            width: 160,
            render: (_, record) => <DateTimeCell value={record.createdAt} />,
        },
        {
            title: tCommon("actions"),
            key: "actions",
            align: "right",
            width: 100,
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => onEdit?.(record)} />
                    <Popconfirm
                        title={t("confirm_delete")}
                        onConfirm={() => onDelete?.(record.id)}
                        okText={tCommon("submit")}
                        cancelText={tCommon("cancel")}
                    >
                        <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const { tableLoading, locale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: subMerchants.length,
        emptyDescription: emptyText || t("empty"),
        onRetry,
    });

    return (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {refreshBanner}
            <Table
                columns={columns}
                dataSource={subMerchants}
                rowKey="id"
                loading={tableLoading}
                size="middle"
                scroll={{ x: 800 }}
                locale={locale}
                pagination={
                    onPageChange
                        ? {
                              current: (page ?? 0) + 1,
                              pageSize: pageSize ?? 20,
                              total: total ?? 0,
                              showSizeChanger: true,
                              showTotal: (count) => tCommon("total", { count }),
                              onChange: (p, ps) => onPageChange?.(p - 1),
                          }
                        : false
                }
            />
        </Space>
    );
}
