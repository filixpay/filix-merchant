"use client";

import { Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import type { ClientView } from "@/lib/api";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import { formatCustomerCreatedAt, getCustomerStatusColor } from "./customer-model";

interface CustomerTableProps {
    customers: ClientView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    emptyText?: string;
    total?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
}

export default function CustomerTable({
    customers,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    emptyText,
    total,
    page,
    pageSize,
    onPageChange,
}: CustomerTableProps) {
    const t = useTranslations("Customers");

    const columns: ColumnsType<ClientView> = [
        {
            title: t("headers.code"),
            dataIndex: "code",
            key: "code",
            render: (code: string) => (
                <Typography.Text style={{ fontFamily: "var(--font-mono)" }}>
                    {code}
                </Typography.Text>
            ),
        },
        {
            title: t("headers.name"),
            dataIndex: "name",
            key: "name",
            render: (name: string) => <Typography.Text>{name}</Typography.Text>,
        },
        {
            title: t("headers.email"),
            dataIndex: "email",
            key: "email",
        },
        {
            title: t("headers.mobile"),
            dataIndex: "mobile",
            key: "mobile",
        },
        {
            title: t("headers.status"),
            key: "status",
            render: (_, customer) => (
                <Tag color={getCustomerStatusColor(customer.customerStatus)}>
                    {customer.customerStatus}
                </Tag>
            ),
        },
        {
            title: t("headers.created_at"),
            key: "createdAt",
            width: 180,
            render: (_, customer) => formatCustomerCreatedAt(customer),
        },
    ];

    const { tableLoading, locale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: customers.length,
        emptyDescription: emptyText || t("empty"),
        onRetry,
    });

    return (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {refreshBanner}
            <Table
            columns={columns}
            dataSource={customers}
            rowKey="id"
            loading={tableLoading}
            size="middle"
            scroll={{ x: 900 }}
            locale={locale}
            pagination={
                onPageChange
                    ? {
                          current: (page ?? 0) + 1,
                          pageSize: pageSize ?? 20,
                          total: total ?? 0,
                          showSizeChanger: false,
                          onChange: (p, ps) => onPageChange(p - 1, ps),
                      }
                    : false
            }
            />
        </Space>
    );
}
