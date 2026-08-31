"use client";

import { useState } from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Descriptions, Modal, Result, Spin, Tag, Typography, message } from "antd";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import type { MissingOrderData } from "./order-action-model";

interface MissingOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: MissingOrderData | null;
    loading: boolean;
    merchantOrderId: string;
    accessToken: string;
    onSuccess: () => void;
}

function localizeEnum(
    t: ReturnType<typeof useTranslations>,
    group: "mismatch_types" | "deal_types" | "statuses",
    value: string | null | undefined
): string {
    if (!value) return "-";
    const normalized = value.trim();
    const map = t.raw(`missing_modal.${group}`) as Record<string, string> | undefined;
    if (map && typeof map === "object") {
        const direct = map[normalized];
        if (typeof direct === "string" && direct.length > 0) return direct;
        const upper = map[normalized.toUpperCase()];
        if (typeof upper === "string" && upper.length > 0) return upper;
    }
    return normalized;
}

export default function MissingOrderModal({
    isOpen,
    onClose,
    data,
    loading,
    merchantOrderId,
    accessToken,
    onSuccess
}: MissingOrderModalProps) {
    const t = useTranslations('Orders');
    const tCommon = useTranslations('Common');
    const [patching, setPatching] = useState(false);

    const handlePatch = () => {
        Modal.confirm({
            title: t("missing_modal.confirm_patch_title"),
            content: t("missing_modal.confirm_patch_content"),
            icon: <ExclamationCircleFilled />,
            okText: t("patch_order"),
            cancelText: tCommon("cancel"),
            onOk: async () => {
                if (!data?.id) return;

                setPatching(true);
                try {
                    await api.orders.patchOrder(data.id, accessToken);
                    message.success(t("missing_modal.patch_success"));
                    onSuccess();
                    onClose();
                } catch (err) {
                    console.error(err);
                    message.error(err instanceof Error ? err.message : t("missing_modal.patch_failed"));
                } finally {
                    setPatching(false);
                }
            },
        });
    };

    return (
        <Modal
            title={t("missing_deal")}
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    {tCommon("close")}
                </Button>,
            ]}
            width={620}
            centered
            destroyOnHidden
        >
            {loading ? (
                <div style={{ padding: 48, textAlign: "center" }}>
                    <Spin />
                    <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>
                        {tCommon("loading")}
                    </Typography.Paragraph>
                </div>
            ) : data ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <Descriptions size="small" column={1} bordered>
                        <Descriptions.Item label={t("missing_modal.merchant_order_id")}>
                            <Typography.Text copyable>{merchantOrderId}</Typography.Text>
                        </Descriptions.Item>
                        <Descriptions.Item label={t("missing_modal.mismatch_type")}>
                            {localizeEnum(t, "mismatch_types", data.mismatchType)}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("missing_modal.internal_id")}>
                            {data.id}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("missing_modal.deal_type")}>
                            <Tag color={data.dealType === "PATCH" ? "warning" : "default"}>
                                {localizeEnum(t, "deal_types", data.dealType)}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label={t("missing_modal.amount")}>
                            <Typography.Text strong type="success">{data.amount ?? "-"}</Typography.Text>
                        </Descriptions.Item>
                        <Descriptions.Item label={t("missing_modal.channel")}>
                            {data.channelCode || "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("missing_modal.channel_transaction_id")}>
                            <Typography.Text copyable style={{ wordBreak: "break-all" }}>
                                {data.channelTransactionId || "-"}
                            </Typography.Text>
                        </Descriptions.Item>
                        <Descriptions.Item label={t("missing_modal.local_status")}>
                            <Tag color={data.localStatus === "SUCCESS" ? "success" : "default"}>
                                {localizeEnum(t, "statuses", data.localStatus)}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label={t("missing_modal.upstream_status")}>
                            <Tag color={data.upstreamStatus === "SUCCESS" ? "success" : "default"}>
                                {localizeEnum(t, "statuses", data.upstreamStatus)}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label={t("missing_modal.created_at")}>
                            {data.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}
                        </Descriptions.Item>
                    </Descriptions>

                    {data.dealType === "PATCH" && (
                        <Result
                            status="warning"
                            title={t("missing_modal.patch_available_title")}
                            subTitle={t("missing_modal.patch_available_desc")}
                            extra={
                                <Button type="primary" loading={patching} onClick={handlePatch}>
                                    {t("patch_order")}
                                </Button>
                            }
                        />
                    )}
                </div>
            ) : (
                <Result
                    status="success"
                    title={t("missing_modal.no_data_title")}
                    subTitle={t("missing_modal.no_data_desc")}
                />
            )}
        </Modal>
    );
}
