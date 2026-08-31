"use client";

import React, { useState, useEffect } from "react";
import { Modal, Descriptions, Input, Typography, Alert, Image, Divider, Form, Button, Checkbox } from "antd";
import { useTranslations } from "next-intl";
import { ApiError, TransferDetailResponse, TransferId, api } from "@/lib/api";
import {
    formatTransferAmount,
    formatTransferMetaValue,
    formatTransferPartyAccountHint,
    fourEyesErrorI18nKey,
} from "./transfer-audit-model";
import styles from "./TransferApprovalModal.module.css";

interface TransferReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    transferId: TransferId;
    accessToken: string;
    viewOnly?: boolean;
}

export default function TransferReviewModal({
    isOpen,
    onClose,
    onSuccess,
    transferId,
    accessToken,
    viewOnly = false,
}: TransferReviewModalProps) {
    const t = useTranslations("Reviews");
    const tAudit = useTranslations("Transfers.audit");
    const tCommon = useTranslations("Common");

    const [form] = Form.useForm();
    const [detail, setDetail] = useState<TransferDetailResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [reviewStatus, setReviewStatus] = useState<"SUCCESS" | "FAILED" | "RETURNED">("SUCCESS");

    useEffect(() => {
        if (isOpen && transferId) {
            loadDetail();
        } else {
            setDetail(null);
            setError("");
            form.resetFields();
            setReviewStatus("SUCCESS");
        }
    }, [isOpen, transferId]);

    const loadDetail = async () => {
        setLoading(true);
        try {
            const data = await api.transfers.get(transferId, accessToken);
            setDetail(data);

            if (data.transfer) {
                const reviewStatus = data.transfer.reviewStatus === "FAILED" ? "FAILED" as const : "SUCCESS" as const;
                form.setFieldsValue({
                    reviewStatus,
                    rejectedReason: data.transfer.rejectedReason ?? data.transfer.rejectReason ?? "",
                    checkerAck: false,
                });
                setReviewStatus(reviewStatus);
            }
        } catch (err) {
            console.error(err);
            setError(tCommon("error"));
        } finally {
            setLoading(false);
        }
    };

    const resolveError = (err: unknown) => {
        if (err instanceof ApiError) {
            const key = fourEyesErrorI18nKey(err.code) ?? fourEyesErrorI18nKey(err.message);
            if (key) {
                return tAudit(key);
            }
            return err.message;
        }
        return err instanceof Error ? err.message : tCommon("error");
    };

    const submitReview = async (nextReviewStatus: "SUCCESS" | "FAILED" | "RETURNED") => {
        if (viewOnly) {
            onClose();
            return;
        }

        form.setFieldValue("reviewStatus", nextReviewStatus);
        setReviewStatus(nextReviewStatus);

        try {
            if (nextReviewStatus === "SUCCESS") {
                await form.validateFields(["checkerAck"]);
            } else if (nextReviewStatus === "FAILED") {
                await form.validateFields(["checkerAck", "rejectedReason"]);
            }
            const values = form.getFieldsValue();
            setSubmitting(true);
            setError("");

            await api.transfers.confirm(
                transferId,
                {
                    reviewStatus: nextReviewStatus,
                    checkerAck: nextReviewStatus === "RETURNED" ? undefined : true,
                    rejectedReason: nextReviewStatus === "FAILED" ? values.rejectedReason : null,
                },
                accessToken,
            );
            onSuccess();
        } catch (err: unknown) {
            if (typeof err === "object" && err !== null && "errorFields" in err) return;
            console.error(err);
            setError(resolveError(err));
        } finally {
            setSubmitting(false);
        }
    };

    const proofImage = detail?.fileMeta?.fileBase64
        ? `data:${detail.fileMeta.mimeType};base64,${detail.fileMeta.fileBase64}`
        : null;

    return (
        <Modal
            title={viewOnly ? t("view_btn") : t("title")}
            open={isOpen}
            onCancel={onClose}
            width={960}
            destroyOnClose
            footer={
                viewOnly
                    ? [
                          <Button key="close" onClick={onClose}>
                              {tCommon("close")}
                          </Button>,
                      ]
                    : [
                          <Button key="cancel" onClick={onClose}>
                              {tCommon("cancel")}
                          </Button>,
                          <Button
                              key="return"
                              loading={submitting && reviewStatus === "RETURNED"}
                              onClick={() => void submitReview("RETURNED")}
                          >
                              {t("return_audit")}
                          </Button>,
                          <Button
                              key="reject"
                              danger
                              loading={submitting && reviewStatus === "FAILED"}
                              onClick={() => void submitReview("FAILED")}
                          >
                              {t("confirm_not_received")}
                          </Button>,
                          <Button
                              key="confirm"
                              type="primary"
                              loading={submitting && reviewStatus === "SUCCESS"}
                              onClick={() => void submitReview("SUCCESS")}
                          >
                              {t("confirm_received")}
                          </Button>,
                      ]
            }
        >
            {loading ? (
                <div style={{ padding: "40px", textAlign: "center" }}>{tCommon("loading")}</div>
            ) : detail ? (
                <div className={styles.modalBody}>
                    <div className={styles.modalLayout}>
                        <div className={styles.previewColumn}>
                            <Typography.Title level={5}>{tAudit("proof_image")}</Typography.Title>
                            <div className={styles.previewCard}>
                                {proofImage ? (
                                    <Image
                                        src={proofImage}
                                        alt="Transfer Proof"
                                        className={styles.previewImage}
                                        preview={{ mask: tAudit("zoom_in") }}
                                    />
                                ) : (
                                    <Typography.Text type="secondary">{tCommon("no_data")}</Typography.Text>
                                )}
                            </div>
                        </div>

                        <div className={styles.formColumn}>
                            <Typography.Title level={5}>{tAudit("buyer_evidence")}</Typography.Title>
                            <Descriptions column={1} size="small" className={styles.descriptionList}>
                                <Descriptions.Item label={tAudit("amount")}>
                                    <Typography.Text className={styles.amountValue}>
                                        {formatTransferAmount({
                                            amount:
                                                detail.transfer.invoice?.totalAmount?.amount ??
                                                detail.transfer.totalAmount,
                                            currency:
                                                detail.transfer.invoice?.totalAmount?.currency ?? "USD",
                                            formatted: detail.transfer.invoice?.totalAmount?.formatted,
                                        })}
                                    </Typography.Text>
                                </Descriptions.Item>
                                <Descriptions.Item label={tAudit("payee")}>
                                    <div className={styles.accountSummary}>
                                        <Typography.Text strong>
                                            {formatTransferMetaValue(detail.transfer.payeeAccountHolder)}
                                        </Typography.Text>
                                        <Typography.Text className={styles.metaText}>
                                            {formatTransferPartyAccountHint(
                                                detail.transfer.payeeBankName,
                                                detail.transfer.payeeAccountNumber,
                                            )}
                                        </Typography.Text>
                                    </div>
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider />

                            <Typography.Title level={5}>{tAudit("merchant_check")}</Typography.Title>
                            <Descriptions column={1} size="small" className={styles.descriptionList}>
                                <Descriptions.Item label={tAudit("payer_name")}>
                                    <div className={styles.accountSummary}>
                                        <Typography.Text strong>
                                            {formatTransferMetaValue(detail.transfer.payerAccountHolder)}
                                        </Typography.Text>
                                        <Typography.Text className={styles.metaText}>
                                            {formatTransferPartyAccountHint(
                                                detail.transfer.payerBankName,
                                                detail.transfer.payerAccountNumber,
                                            )}
                                        </Typography.Text>
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label={tAudit("transaction_id")}>
                                    <Typography.Text className={styles.metaText}>
                                        {formatTransferMetaValue(detail.transfer.transactionId)}
                                    </Typography.Text>
                                </Descriptions.Item>
                                <Descriptions.Item label={tAudit("actual_received_amount")}>
                                    {detail.transfer.actualReceivedAmount ?? "-"}
                                </Descriptions.Item>
                                <Descriptions.Item label={tAudit("bank_transaction_at")}>
                                    {detail.transfer.bankTransactionAt
                                        ? new Date(detail.transfer.bankTransactionAt).toLocaleString()
                                        : "-"}
                                </Descriptions.Item>
                                {detail.transfer.exceptionNote ? (
                                    <Descriptions.Item label={tAudit("exception_note")}>
                                        {detail.transfer.exceptionNote}
                                    </Descriptions.Item>
                                ) : null}
                                <Descriptions.Item label={t("approval_operator")}>
                                    {detail.transfer.auditOperator || "-"}
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider />

                            {!viewOnly ? (
                                <Form
                                    form={form}
                                    layout="vertical"
                                    initialValues={{ reviewStatus: "SUCCESS", checkerAck: false }}
                                >
                                    <Form.Item name="reviewStatus" hidden>
                                        <Input type="hidden" />
                                    </Form.Item>
                                    <Form.Item
                                        name="checkerAck"
                                        valuePropName="checked"
                                        rules={[
                                            {
                                                validator: async (_, value) => {
                                                    if (reviewStatus === "RETURNED" || value === true) {
                                                        return;
                                                    }
                                                    throw new Error(t("checker_ack_required"));
                                                },
                                            },
                                        ]}
                                    >
                                        <Checkbox>{t("checker_ack")}</Checkbox>
                                    </Form.Item>

                                    <Form.Item
                                        name="rejectedReason"
                                        label={tAudit("reject_reason")}
                                        rules={
                                            reviewStatus === "FAILED"
                                                ? [{ required: true, message: tAudit("reject_reason_required") }]
                                                : []
                                        }
                                    >
                                        <Input.TextArea rows={3} placeholder={tAudit("reject_reason_placeholder")} />
                                    </Form.Item>
                                </Form>
                            ) : (
                                <div className={styles.readonlySection}>
                                    <Typography.Title level={5}>{tAudit("approval_info") || "Audit Information"}</Typography.Title>
                                    <Descriptions column={1} size="small" className={styles.descriptionList}>
                                        <Descriptions.Item label={t("review_status") || "Review Status"}>
                                            <Typography.Text
                                                type={
                                                    detail.transfer.reviewStatus === "SUCCESS"
                                                        ? "success"
                                                        : detail.transfer.reviewStatus === "FAILED"
                                                        ? "danger"
                                                        : undefined
                                                }
                                            >
                                                {detail.transfer.reviewStatus}
                                            </Typography.Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={t("approval_operator")}>
                                            {detail.transfer.auditOperator || "-"}
                                        </Descriptions.Item>
                                        <Descriptions.Item label={t("review_operator")}>
                                            {detail.transfer.reviewOperator || "-"}
                                        </Descriptions.Item>
                                        {detail.transfer.reviewStatus === "FAILED" && (
                                            <Descriptions.Item label={tAudit("reject_reason")}>
                                                <Typography.Text type="danger">
                                                    {detail.transfer.rejectedReason ?? detail.transfer.rejectReason ?? "-"}
                                                </Typography.Text>
                                            </Descriptions.Item>
                                        )}
                                    </Descriptions>
                                </div>
                            )}
                        </div>
                    </div>
                    {error && <Alert message={error} type="error" showIcon style={{ marginTop: 16 }} />}
                </div>
            ) : (
                <div style={{ padding: "40px", textAlign: "center" }}>
                    <Typography.Text type="danger">{tCommon("error")}</Typography.Text>
                </div>
            )}
        </Modal>
    );
}
