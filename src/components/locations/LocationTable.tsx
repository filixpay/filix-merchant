"use client";

import { Button, Popconfirm, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined, QrcodeOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { LocationView, SubMerchantView } from "@/lib/api";
import {
    getLocationDefaultLabel,
    getLocationStatusColor,
    getLocationStatusLabel,
    maskLocationEmail,
    maskLocationPhone,
    resolveSubMerchantName,
} from "./location-model";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";

interface LocationTableProps {
    locations: LocationView[];
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
    onEdit?: (location: LocationView) => void;
    onDelete?: (id: number) => void;
    onShowQr?: (location: LocationView) => void;
}

export default function LocationTable({
    locations,
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
    onShowQr,
}: LocationTableProps) {
    const t = useTranslations("Locations");
    const tCommon = useTranslations("Common");

    const columns: ColumnsType<LocationView> = [
        {
            title: t("headers.name"),
            dataIndex: "name",
            key: "name",
            render: (name: string) => <Typography.Text>{name}</Typography.Text>,
        },
        {
            title: t("headers.sub_merchant"),
            key: "subMerchant",
            render: (_, record) => resolveSubMerchantName(record, subMerchants),
        },
        {
            title: t("headers.address"),
            dataIndex: "address",
            key: "address",
            render: (val: string) => val || "-",
        },
        {
            title: t("headers.contact"),
            key: "contact",
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    {record.mobilePhone && (
                        <Typography.Text style={{ fontSize: 12 }}>
                            Tel: {maskLocationPhone(record.mobilePhone)}
                        </Typography.Text>
                    )}
                    {record.cantactEmail && (
                        <Typography.Text style={{ fontSize: 12 }}>
                            Email: {maskLocationEmail(record.cantactEmail)}
                        </Typography.Text>
                    )}
                </Space>
            ),
        },
        {
            title: t("headers.status"),
            key: "status",
            render: (_, record) => (
                <Tag color={getLocationStatusColor(record.status)}>
                    {getLocationStatusLabel(record.status, (key) => t(key))}
                </Tag>
            ),
        },
        {
            title: t("headers.default"),
            key: "default",
            render: (_, record) => (
                <Tag color={record.default ? "blue" : undefined}>
                    {getLocationDefaultLabel(record.default, (key) => tCommon(key))}
                </Tag>
            ),
        },
        {
            title: t("headers.created_at"),
            key: "createdAt",
            width: 180,
            render: (_, record) => new Date(record.createdAt).toLocaleString(),
        },
        {
            title: tCommon("actions"),
            key: "actions",
            align: "right",
            width: 130,
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        icon={<QrcodeOutlined />}
                        title={t("qrcode")}
                        onClick={() => onShowQr?.(record)}
                    />
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
        rowCount: locations.length,
        emptyDescription: emptyText || t("empty"),
        onRetry,
    });

    return (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {refreshBanner}
            <Table
                columns={columns}
                dataSource={locations}
                rowKey="id"
                loading={tableLoading}
                size="middle"
                scroll={{ x: 1100 }}
                locale={locale}
                pagination={
                    onPageChange
                        ? {
                              current: (page ?? 0) + 1,
                              pageSize: pageSize ?? 20,
                              total: total ?? 0,
                              showSizeChanger: false,
                              onChange: (p) => onPageChange(p - 1),
                          }
                        : false
                }
            />
        </Space>
    );
}
