"use client";

import React, { useState } from "react";
import { Modal, Descriptions, Radio, Input, Space, Typography, Alert } from "antd";
import { useTranslations } from "next-intl";
import { api, PayoutApplicationView } from "@/lib/api";

interface PayoutAuditModalProps {
    isOpen: boolean;
    onClose: () => void;
    application: PayoutApplicationView | null;
    accessToken: string;
    onSuccess: () => void;
}

export default function PayoutAuditModal({
    isOpen,
    onClose,
    application,
    accessToken,
    onSuccess,
}: PayoutAuditModalProps) {
    const t = useTranslations("PayoutAudit");
    const tCommon = useTranslations("Common");

    const [loading, setLoading] = useState(false);
    const [auditStatus, setAuditStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
    const [rejectedReason, setRejectedReason] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (!application) return;
        setLoading(true);
        setError(null);
        try {
            await api.payouts.auditApplication(
                application.id,
                {
                    approvalStatus: auditStatus,
                    rejectedReason: auditStatus === "REJECTED" ? rejectedReason : null,
                },
                accessToken,
            );
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error("Failed to audit payout application:", err);
            setError(err instanceof Error ? err.message : "Audit failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={t("audit_modal.title")}
            open={isOpen}
            onCancel={onClose}
            onOk={handleConfirm}
            confirmLoading={loading}
            okText={tCommon("confirm")}
            cancelText={tCommon("cancel")}
            okButtonProps={{
                danger: auditStatus === "REJECTED",
                disabled: auditStatus === "REJECTED" && !rejectedReason,
            }}
            destroyOnClose
        >
            {application && (
                <Space direction="vertical" size={24} style={{ width: "100%", marginTop: 16 }}>
                    <Descriptions column={1} size="small" bordered>
                        <Descriptions.Item label={t("audit_modal.application_id")}>
                            <Typography.Text strong>{application.orderId}</Typography.Text>
                        </Descriptions.Item>
                        <Descriptions.Item label={t("audit_modal.amount")}>
                            <Typography.Text strong style={{ fontSize: 16 }}>
                                {application.totalAmount.toLocaleString()}
                            </Typography.Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <div style={{ marginBottom: 8 }}>
                        <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                            {t("audit_modal.decision")}
                        </Typography.Text>
                        <Radio.Group
                            value={auditStatus}
                            onChange={(e) => setAuditStatus(e.target.value)}
                            buttonStyle="solid"
                            style={{ width: "100%" }}
                        >
                            <Radio.Button value="APPROVED" style={{ width: "50%", textAlign: "center" }}>
                                {t("audit_modal.approve")}
                            </Radio.Button>
                            <Radio.Button value="REJECTED" style={{ width: "50%", textAlign: "center" }}>
                                {t("audit_modal.reject")}
                            </Radio.Button>
                        </Radio.Group>
                    </div>

                    {auditStatus === "REJECTED" && (
                        <div>
                            <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                                {t("audit_modal.reason")}
                            </Typography.Text>
                            <Input.TextArea
                                placeholder={t("audit_modal.reason_placeholder")}
                                value={rejectedReason}
                                onChange={(e) => setRejectedReason(e.target.value)}
                                rows={4}
                            />
                        </div>
                    )}

                    {error && <Alert message={error} type="error" showIcon />}
                </Space>
            )}
        </Modal>
    );
}
