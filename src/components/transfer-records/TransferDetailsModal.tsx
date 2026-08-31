"use client";

import React, { useState, useEffect } from "react";
import { Modal, Descriptions, Table, Tag, Typography, Spin, Divider, Space, Button } from "antd";
import { useTranslations } from "next-intl";
import { api, OrderView, TransferView } from "@/lib/api";
import { getTransferStatusColor, formatAmount } from "./transfer-record-model";

interface TransferDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    record: OrderView | null;
    loading: boolean;
    accessToken: string;
}

export default function TransferDetailsModal({
    isOpen,
    onClose,
    record,
    loading,
    accessToken,
}: TransferDetailsModalProps) {
    const t = useTranslations("TransferRecords");
    const tCommon = useTranslations("Common");
    
    const [items, setItems] = useState<TransferView[]>([]);
    const [itemsLoading, setItemsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && record) {
            fetchTransferItems();
        } else {
            setItems([]);
        }
    }, [isOpen, record, accessToken]);

    const fetchTransferItems = async () => {
        if (!record) return;
        setItemsLoading(true);
        try {
            const response = await api.transfers.list({ orderId: record.id, page: 0, size: 100 }, accessToken);
            setItems(response.data || response.content || []);
        } catch (error) {
            console.error("Failed to fetch transfer items:", error);
        } finally {
            setItemsLoading(false);
        }
    };

    return (
        <Modal
            title={t("item_details.title")}
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    {tCommon("close")}
                </Button>
            ]}
            width={1000}
            destroyOnClose
        >
            <Spin spinning={loading}>
                {record ? (
                    <Space direction="vertical" size={24} style={{ width: "100%" }}>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label={t("headers.transfer_no")}>
                                <Typography.Text strong>{record.merchantOrderId}</Typography.Text>
                            </Descriptions.Item>
                            <Descriptions.Item label={tCommon("status")}>
                                <Tag color={getTransferStatusColor(record.tradeStatus)}>
                                    {record.tradeStatus}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.amount")}>
                                {formatAmount(record.totalAmount)}
                            </Descriptions.Item>
                            <Descriptions.Item label={t("headers.created_at")}>
                                {new Date(record.createdAt).toLocaleString()}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider titlePlacement="left" orientationMargin={0}>{t("item_details.title")}</Divider>
                        
                        <Table
                            dataSource={items}
                            loading={itemsLoading}
                            pagination={{ pageSize: 10, size: "small" }}
                            size="small"
                            rowKey="id"
                            scroll={{ x: 800 }}
                            columns={[
                                {
                                    title: t("item_details.headers.payee_name"),
                                    dataIndex: "payeeAccountHolder",
                                    key: "payeeAccountHolder",
                                    render: (val) => <Typography.Text strong>{val}</Typography.Text>
                                },
                                {
                                    title: t("item_details.headers.payee_account"),
                                    dataIndex: "payeeAccountNumber",
                                    key: "payeeAccountNumber",
                                    render: (val) => <Typography.Text style={{ fontFamily: "var(--font-mono)" }}>{val}</Typography.Text>
                                },
                                {
                                    title: t("item_details.headers.bank"),
                                    dataIndex: "payeeBankName",
                                    key: "payeeBankName",
                                },
                                {
                                    title: t("item_details.headers.amount"),
                                    key: "amount",
                                    align: "right",
                                    render: (_, r) => formatAmount({ amount: r.totalAmount, currency: "CNY" })
                                },
                                {
                                    title: t("item_details.headers.status"),
                                    dataIndex: "transferStatus",
                                    key: "transferStatus",
                                    render: (status) => (
                                        <Tag color={status === 'SUCCESS' ? 'success' : 'default'}>
                                            {status}
                                        </Tag>
                                    )
                                },
                                {
                                    title: t("item_details.headers.created_at"),
                                    dataIndex: "createdAt",
                                    key: "createdAt",
                                    render: (val) => val ? new Date(val).toLocaleString() : "-"
                                }
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
