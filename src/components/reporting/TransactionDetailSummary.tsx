"use client";

import { Card, Descriptions, Tag } from "antd";
import { useTranslations } from "next-intl";
import type { TransactionReportDetail } from "@/lib/api/domains/reporting/types";
import {
    formatOptionalDateTime,
} from "./transaction-detail-model";
import { formatTransactionAmount } from "./transaction-list-model";

interface TransactionDetailSummaryProps {
    detail: TransactionReportDetail;
}

export default function TransactionDetailSummary({ detail }: TransactionDetailSummaryProps) {
    const t = useTranslations("Reporting.transactions.detail");
    const tList = useTranslations("Reporting.transactions");

    const orderTypeLabel = (() => {
        const key = detail.orderType?.trim().toUpperCase() ?? "";
        if (!key) return "—";
        const messageKey = `orderTypes.${key}` as Parameters<typeof tList>[0];
        return tList.has(messageKey) ? tList(messageKey) : detail.orderType;
    })();

    return (
        <Card size="small">
            <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label={t("fields.merchant_order_id")}>
                    {detail.merchantOrderId}
                </Descriptions.Item>
                <Descriptions.Item label={t("fields.trade_no")}>{detail.tradeNo}</Descriptions.Item>
                <Descriptions.Item label={t("fields.status")}>
                    <Tag>{detail.status}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t("fields.order_type")}>{orderTypeLabel}</Descriptions.Item>
                <Descriptions.Item label={t("fields.amount")}>
                    {formatTransactionAmount(detail.amount, detail.currency)}
                </Descriptions.Item>
                <Descriptions.Item label={t("fields.paid_amount")}>
                    {formatTransactionAmount(detail.paidAmount, detail.currency)}
                </Descriptions.Item>
                <Descriptions.Item label={t("fields.refunded_amount")}>
                    {formatTransactionAmount(detail.refundedAmount, detail.currency)}
                </Descriptions.Item>
                <Descriptions.Item label={t("fields.currency")}>{detail.currency}</Descriptions.Item>
                <Descriptions.Item label={t("fields.channel")}>{detail.channel || "-"}</Descriptions.Item>
                <Descriptions.Item label={t("fields.subject")}>{detail.subject || "-"}</Descriptions.Item>
                <Descriptions.Item label={t("fields.created_at")}>
                    {formatOptionalDateTime(detail.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label={t("fields.paid_at")}>
                    {formatOptionalDateTime(detail.paidAt)}
                </Descriptions.Item>
                <Descriptions.Item label={t("fields.updated_at")}>
                    {formatOptionalDateTime(detail.updatedAt)}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
}
