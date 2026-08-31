"use client";

import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import type { WalletMovementRow } from "@/lib/api";

interface WalletMovementTableProps {
    movements: WalletMovementRow[];
    loading: boolean;
    emptyText?: string;
    page?: number;
    pageSize?: number;
    total?: number;
    onPageChange?: (page: number) => void;
}

export default function WalletMovementTable({
    movements,
    loading,
    emptyText,
    page = 0,
    pageSize = 20,
    total = 0,
    onPageChange,
}: WalletMovementTableProps) {
    const t = useTranslations("Balance.movements");
    const tCommon = useTranslations("Common");

    const columns: ColumnsType<WalletMovementRow> = [
        {
            title: t("headers.time"),
            key: "time",
            width: 180,
            render: (_, record) => new Date(record.occurredAt).toLocaleString(),
        },
        {
            title: t("headers.type"),
            dataIndex: "movementType",
            key: "movementType",
        },
        {
            title: t("headers.direction"),
            dataIndex: "direction",
            key: "direction",
            width: 90,
        },
        {
            title: t("headers.reference"),
            dataIndex: "referenceId",
            key: "referenceId",
            render: (_: unknown, record) => (
                <Typography.Text style={{ wordBreak: "break-all" }}>
                    {record.referenceId || "-"}
                    {record.referenceType ? ` (${record.referenceType})` : ""}
                </Typography.Text>
            ),
        },
        {
            title: t("headers.status"),
            dataIndex: "status",
            key: "status",
            width: 110,
            render: (value: string | null | undefined) => value || "-",
        },
        {
            title: t("headers.amount"),
            key: "amount",
            align: "right",
            render: (_, record) => (
                <Typography.Text
                    strong
                    style={{ color: record.direction === "IN" ? "#10b981" : "#ef4444" }}
                >
                    {record.signedAmountPrefix}
                    {Math.abs(record.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Typography.Text>
            ),
        },
        {
            title: t("headers.asset"),
            dataIndex: "assetCode",
            key: "assetCode",
            width: 90,
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={movements}
            rowKey={(record) =>
                record.movementId ||
                `${record.occurredAt}-${record.referenceId}-${record.direction}-${record.amount}`
            }
            loading={loading}
            size="middle"
            scroll={{ x: 900 }}
            locale={{ emptyText: emptyText || tCommon("no_data") }}
            pagination={
                onPageChange
                    ? {
                          current: page + 1,
                          pageSize,
                          total,
                          showSizeChanger: false,
                          onChange: (p) => onPageChange(p - 1),
                      }
                    : false
            }
        />
    );
}
