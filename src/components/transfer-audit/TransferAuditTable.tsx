"use client";

import React, { useState } from "react";
import { Table, Typography, Button, Space } from "antd";
import { useTranslations } from "next-intl";
import type { ColumnsType } from "antd/es/table";
import { TransferId, TransferView } from "@/lib/api";
import TransferAuditModal from "./TransferAuditModal";
import TransferReviewModal from "./TransferReviewModal";
import TradeNoText from "../TradeNoText";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import {
    formatTransferAmount,
    formatTransferMetaValue,
    formatTransferPartyAccountHint,
} from "./transfer-audit-model";
import styles from "./TransferAuditTable.module.css";

interface TransferAuditTableProps {
    transfers: TransferView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    onSuccess: () => void;
    currentStatus?: string;
    accessToken: string;
    mode: "AUDIT" | "REVIEW";
}

export default function TransferAuditTable({
    transfers,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    onSuccess,
    currentStatus = "PENDING",
    accessToken,
    mode,
}: TransferAuditTableProps) {
    const t = useTranslations(mode === "AUDIT" ? "Transfers" : "Reviews");
    const tCommon = useTranslations("Common");

    const [selectedId, setSelectedId] = useState<TransferId | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewOnly, setViewOnly] = useState(false);

    const handleOpenModal = (id: TransferId, isView: boolean) => {
        setSelectedId(id);
        setViewOnly(isView);
        setIsModalOpen(true);
    };

    const columns: ColumnsType<TransferView> = [
        {
            title: t("headers.merchant_order_id"),
            key: "order",
            width: 320,
            render: (_: unknown, r: TransferView) => (
                <Space direction="vertical" size={2}>
                    <TradeNoText value={r.order?.merchantOrderId} />
                    <Typography.Text className={styles.secondaryMeta}>
                        {t("headers.transaction_id")}: {formatTransferMetaValue(r.order?.tradeNo)}
                    </Typography.Text>
                </Space>
            ),
        },
        {
            title: t("headers.transaction_id"),
            dataIndex: "transactionId",
            key: "transactionId",
            render: (val: string) => (
                <Typography.Text className={styles.secondaryMeta}>
                    {formatTransferMetaValue(val)}
                </Typography.Text>
            ),
        },
        {
            title: t("headers.payer"),
            key: "payer",
            render: (_: unknown, r: TransferView) => (
                <Space direction="vertical" size={1}>
                    <Typography.Text>{formatTransferMetaValue(r.payerAccountHolder)}</Typography.Text>
                    <Typography.Text className={styles.secondaryMeta}>
                        {formatTransferPartyAccountHint(r.payerBankName, r.payerAccountNumber)}
                    </Typography.Text>
                </Space>
            ),
        },
        {
            title: t("headers.payee"),
            key: "payee",
            render: (_: unknown, r: TransferView) => (
                <Space direction="vertical" size={1}>
                    <Typography.Text>{formatTransferMetaValue(r.payeeAccountHolder)}</Typography.Text>
                    <Typography.Text className={styles.secondaryMeta}>
                        {formatTransferPartyAccountHint(r.payeeBankName, r.payeeAccountNumber)}
                    </Typography.Text>
                </Space>
            ),
        },
        {
            title: t("headers.amount"),
            key: "amount",
            align: "right" as const,
            render: (_: unknown, r: TransferView) => (
                <Typography.Text className={styles.amountValue}>
                    {formatTransferAmount({
                        amount: r.order?.totalAmount?.amount ?? r.totalAmount,
                        currency: r.order?.totalAmount?.currency ?? "USD",
                        formatted: r.order?.totalAmount?.formatted,
                    })}
                </Typography.Text>
            ),
        },
        {
            title: t("headers.approval_operator"),
            key: "audit",
            render: (_: unknown, r: TransferView) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text>{r.auditOperator || "-"}</Typography.Text>
                    {r.auditDate && (
                        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                            {new Date(r.auditDate).toLocaleString()}
                        </Typography.Text>
                    )}
                </Space>
            ),
        },
        ...(mode === "REVIEW" ? [
            {
                title: t("headers.review_operator"),
                key: "review",
                render: (_: unknown, r: TransferView) => (
                    <Space direction="vertical" size={0}>
                        <Typography.Text>{r.reviewOperator || "-"}</Typography.Text>
                        {r.reviewDate && (
                            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                {new Date(r.reviewDate).toLocaleString()}
                            </Typography.Text>
                        )}
                    </Space>
                ),
            }
        ] : []),
        {
            title: t("headers.created_at"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (val: string) => (
                <Typography.Text className={styles.secondaryMeta}>
                    {new Date(val).toLocaleString()}
                </Typography.Text>
            ),
        },
        {
            title: t("headers.actions"),
            key: "actions",
            fixed: "right" as const,
            width: 150,
            align: "right" as const,
            render: (_: unknown, r: TransferView) => (
                <Space>
                    <Button type="link" size="small" onClick={() => handleOpenModal(r.id, true)}>
                        {t("view_btn")}
                    </Button>
                    {(currentStatus === "PENDING" || currentStatus === "INITIAL") && (
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => handleOpenModal(r.id, false)}
                        >
                            {mode === "AUDIT" ? t("audit_btn") : t("confirm_btn")}
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const { tableLoading, locale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: transfers.length,
        emptyDescription: tCommon("no_data"),
        onRetry,
    });

    return (
        <>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {refreshBanner}
                <Table
                    columns={columns}
                    dataSource={transfers}
                    rowKey="id"
                    loading={tableLoading}
                    scroll={{ x: 1400 }}
                    size="middle"
                    locale={locale}
                    pagination={false}
                />
            </Space>
            {mode === "AUDIT" ? (
                <TransferAuditModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        onSuccess();
                    }}
                    transferId={selectedId ?? ""}
                    accessToken={accessToken}
                    viewOnly={viewOnly}
                />
            ) : (
                <TransferReviewModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        onSuccess();
                    }}
                    transferId={selectedId ?? ""}
                    accessToken={accessToken}
                    viewOnly={viewOnly}
                />
            )}
        </>
    );
}
