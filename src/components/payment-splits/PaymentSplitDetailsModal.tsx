"use client";

import React from "react";
import { Modal, Descriptions, Table, Tag, Typography, Spin, Divider, Space } from "antd";
import { useTranslations } from "next-intl";
import { PaymentSplitDetailView } from "@/lib/api";
import { getStatusTagColor, formatAmount } from "./payment-split-model";
import TradeNoText from "../TradeNoText";

interface PaymentSplitDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    record: PaymentSplitDetailView | null;
    loading: boolean;
}

export default function PaymentSplitDetailsModal({
    isOpen,
    onClose,
    record,
    loading,
}: PaymentSplitDetailsModalProps) {
    const t = useTranslations("PaymentSplits");

    return (
        <Modal
            title={t("details.title")}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={800}
            destroyOnHidden
        >
            <Spin spinning={loading}>
                {record ? (
                    <Space direction="vertical" size={24} style={{ width: "100%" }}>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label={t("headers.trade_no")} span={2}>
                                <TradeNoText value={record.tradeNo} />
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.status")}>
                                <Tag color={getStatusTagColor(record.paymentSplitStatus)}>
                                    {t(`statuses.${record.paymentSplitStatus}`) || record.paymentSplitStatus}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.type")}>
                                {t(`types.${record.paymentSplitType}`) || record.paymentSplitType}
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.order_amount")}>
                                {formatAmount(record.orderAmount)}
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.split_amount")}>
                                <Typography.Text strong type="success">
                                    {formatAmount(record.splitAmount)}
                                </Typography.Text>
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.created_at")} span={2}>
                                {record.createdAt ? new Date(record.createdAt).toLocaleString() : "-"}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider titlePlacement="left" orientationMargin={0}>{t("details.receivers")}</Divider>

                        <Table
                            dataSource={record.receivers || []}
                            pagination={false}
                            size="small"
                            rowKey="id"
                            columns={[
                                {
                                    title: t("details.receiver_id"),
                                    dataIndex: "receiverId",
                                    key: "receiverId",
                                },
                                {
                                    title: t("details.receiver_name"),
                                    dataIndex: "receiverName",
                                    key: "receiverName",
                                },
                                {
                                    title: t("details.amount"),
                                    key: "actualAmount",
                                    render: (_, r) => formatAmount(r.actualAmount),
                                },
                                {
                                    title: t("details.status"),
                                    dataIndex: "status",
                                    key: "status",
                                    render: (status) => (
                                        <Tag color={getStatusTagColor(status)}>
                                            {t(`statuses.${status}`) || status}
                                        </Tag>
                                    ),
                                },
                            ]}
                        />
                    </Space>
                ) : (
                    <div style={{ height: 200 }} />
                )}
            </Spin>
        </Modal>
    );
}
