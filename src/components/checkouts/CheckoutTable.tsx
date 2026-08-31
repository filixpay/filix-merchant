"use client";

import { Alert, Button, Popconfirm, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { CheckoutView } from "@/lib/api";
import { getCheckoutStatusColor, resolveCheckoutTitle } from "./checkout-model";
import TradeNoText from "../TradeNoText";
import { resolveDashboardTableState } from "@/lib/dashboard/table-state";
import DashboardTableError from "../layout/DashboardTableError";
import DashboardTableEmpty from "../layout/DashboardTableEmpty";

interface CheckoutTableProps {
    checkouts: CheckoutView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    locale: string;
    emptyText?: string;
    total?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
    onRetry?: () => void;
    onEdit?: (checkout: CheckoutView) => void;
    onDelete?: (id: number) => void;
    onToggleStatus?: (checkout: CheckoutView) => void;
}

export default function CheckoutTable({
    checkouts,
    loading,
    isRefreshing = false,
    error = null,
    locale,
    emptyText,
    total = 0,
    page = 0,
    pageSize = 20,
    onPageChange,
    onRetry,
    onEdit,
    onDelete,
    onToggleStatus,
}: CheckoutTableProps) {
    const t = useTranslations("Checkouts");
    const tCommon = useTranslations("Common");

    const columns: ColumnsType<CheckoutView> = [
        {
            title: t("headers.name"),
            key: "name",
            render: (_, record) => (
                <Space>
                    {record.color && (
                        <span
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                backgroundColor: record.color,
                                display: "inline-block",
                            }}
                        />
                    )}
                    <Typography.Text>
                        {resolveCheckoutTitle(record, locale)}
                    </Typography.Text>
                </Space>
            ),
        },
        {
            title: t("headers.code"),
            dataIndex: "checkoutCode",
            key: "checkoutCode",
            render: (code: string) => <TradeNoText value={code} ellipsis />,
        },
        {
            title: "Configs",
            key: "configs",
            render: (_, record) => (
                <Tag>{record.configs?.length || 0} items</Tag>
            ),
        },
        {
            title: t("headers.status"),
            key: "status",
            render: (_, record) => (
                <Tag
                    color={getCheckoutStatusColor(record.checkoutStatus)}
                    style={{ cursor: "pointer" }}
                    onClick={() => onToggleStatus?.(record)}
                    icon={
                        record.checkoutStatus === "ACTIVE" ? (
                            <CheckCircleOutlined />
                        ) : (
                            <CloseCircleOutlined />
                        )
                    }
                >
                    {record.checkoutStatus}
                </Tag>
            ),
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
                        title={t("delete_confirm")}
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

    const tableState = resolveDashboardTableState({
        loading,
        error: error ?? null,
        rowCount: checkouts.length,
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
                dataSource={checkouts}
                rowKey="id"
                loading={loading || isRefreshing}
                size="middle"
                scroll={{ x: 800 }}
                pagination={
                    onPageChange
                        ? {
                              current: page + 1,
                              pageSize,
                              total,
                              showSizeChanger: true,
                              onChange: (nextPage, nextPageSize) =>
                                  onPageChange(nextPage - 1, nextPageSize),
                          }
                        : false
                }
                locale={{
                    emptyText:
                        tableState === "error" ? (
                            <DashboardTableError
                                description={emptyText || tCommon("error")}
                                onRetry={onRetry}
                            />
                        ) : (
                            <DashboardTableEmpty description={emptyText || t("empty")} />
                        ),
                }}
            />
        </Space>
    );
}
