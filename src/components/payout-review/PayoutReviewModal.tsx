"use client";

import React, { useState } from "react";
import { Modal, Descriptions, Radio, Input, Space, Typography, Alert } from "antd";
import { useTranslations } from "next-intl";
import { api, PayoutView } from "@/lib/api";

interface PayoutReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    payout: PayoutView | null;
    accessToken: string;
    onSuccess: () => void;
}

export default function PayoutReviewModal({
    isOpen,
    onClose,
    payout,
    accessToken,
    onSuccess,
}: PayoutReviewModalProps) {
    const t = useTranslations("PayoutReview");
    const tCommon = useTranslations("Common");

    const [loading, setLoading] = useState(false);
    const [reviewStatus, setReviewStatus] = useState<"SUCCESS" | "FAILED">("SUCCESS");
    const [rejectedReason, setRejectedReason] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (!payout) return;
        setLoading(true);
        setError(null);
        try {
            await api.payouts.reviewPlatformPayout(
                payout.id,
                {
                    reviewStatus: reviewStatus,
                    rejectedReason: reviewStatus === "FAILED" ? rejectedReason : null,
                },
                accessToken,
            );
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error("Failed to review platform payout:", err);
            setError(err instanceof Error ? err.message : "Review failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={t("review_modal.title")}
            open={isOpen}
            onCancel={onClose}
            onOk={handleConfirm}
            confirmLoading={loading}
            okText={tCommon("confirm")}
            cancelText={tCommon("cancel")}
            okButtonProps={{
                danger: reviewStatus === "FAILED",
                disabled: reviewStatus === "FAILED" && !rejectedReason,
            }}
            destroyOnClose
        >
            {payout && (
                <Space direction="vertical" size={24} style={{ width: "100%", marginTop: 16 }}>
                    <Descriptions column={1} size="small" bordered>
                        <Descriptions.Item label={t("review_modal.payout_id")}>
                            <Typography.Text strong>{payout.id}</Typography.Text>
                        </Descriptions.Item>
                        <Descriptions.Item label={t("review_modal.amount")}>
                            <Typography.Text strong style={{ fontSize: 16 }}>
                                {payout.totalAmount.toLocaleString()}
                            </Typography.Text>
                        </Descriptions.Item>
                        <Descriptions.Item label={t("headers.payee")}>
                            <Typography.Text>
                                {payout.payeeAccountHolder} ({payout.payeeAccountNumber})
                            </Typography.Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <div>
                        <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                            {t("review_modal.decision")}
                        </Typography.Text>
                        <Radio.Group
                            value={reviewStatus}
                            onChange={(e) => setReviewStatus(e.target.value)}
                            buttonStyle="solid"
                            style={{ width: "100%" }}
                        >
                            <Radio.Button value="SUCCESS" style={{ width: "50%", textAlign: "center" }}>
                                {t("review_modal.pass")}
                            </Radio.Button>
                            <Radio.Button value="FAILED" style={{ width: "50%", textAlign: "center" }}>
                                {t("review_modal.fail")}
                            </Radio.Button>
                        </Radio.Group>
                    </div>

                    {reviewStatus === "FAILED" && (
                        <div>
                            <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                                {t("review_modal.reason")}
                            </Typography.Text>
                            <Input.TextArea
                                placeholder={t("review_modal.reason_placeholder")}
                                value={rejectedReason}
                                onChange={(e) => setRejectedReason(e.target.value)}
                                rows={4}
                            />
                            {!rejectedReason && (
                                <Typography.Text type="danger" style={{ fontSize: 12 }}>
                                    {t("review_modal.reason_required")}
                                </Typography.Text>
                            )}
                        </div>
                    )}

                    {error && <Alert message={error} type="error" showIcon />}
                </Space>
            )}
        </Modal>
    );
}
