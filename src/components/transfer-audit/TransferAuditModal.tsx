"use client";

import React, { useState, useEffect } from "react";
import {
    Modal,
    Descriptions,
    Input,
    InputNumber,
    Typography,
    Alert,
    Image,
    Divider,
    Form,
    Button,
    Checkbox,
    DatePicker,
} from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { ApiError, TransferDetailResponse, TransferId, api } from "@/lib/api";
import {
    formatTransferAmount,
    formatTransferMetaValue,
    formatTransferPartyAccountHint,
    fourEyesErrorI18nKey,
    getReceivableAmount,
    isAmountMismatch,
} from "./transfer-audit-model";
import styles from "./TransferApprovalModal.module.css";

interface TransferAuditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    transferId: TransferId;
    accessToken: string;
    viewOnly?: boolean;
}

export default function TransferAuditModal({
    isOpen,
    onClose,
    onSuccess,
    transferId,
    accessToken,
    viewOnly = false,
}: TransferAuditModalProps) {
    const t = useTranslations("Transfers.audit");
    const tCommon = useTranslations("Common");

    const [form] = Form.useForm();
    const [detail, setDetail] = useState<TransferDetailResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [approvalStatus, setApprovalStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
    const actualReceivedAmount = Form.useWatch("actualReceivedAmount", form);
    const receivable = detail ? getReceivableAmount(detail.transfer) : null;
    const amountMismatch = isAmountMismatch(actualReceivedAmount, receivable);

    useEffect(() => {
        if (isOpen && transferId) {
            loadDetail();
        } else {
            setDetail(null);
            setError("");
            form.resetFields();
            setApprovalStatus("APPROVED");
        }
    }, [isOpen, transferId]);

    const loadDetail = async () => {
        setLoading(true);
        try {
            const data = await api.transfers.get(transferId, accessToken);
            setDetail(data);

            if (data.transfer) {
                const receivableAmount = getReceivableAmount(data.transfer);
                const initialValues = {
                    transactionId: data.transfer.transactionId === "审核人员填入" ? "" : data.transfer.transactionId,
                    payerAccountHolder: data.transfer.payerAccountHolder === "审核人员填入" ? "" : data.transfer.payerAccountHolder,
                    payerAccountNumber: data.transfer.payerAccountNumber === "审核人员填入" ? "" : data.transfer.payerAccountNumber,
                    payerBankName: data.transfer.payerBankName === "审核人员填入" ? "" : data.transfer.payerBankName,
                    actualReceivedAmount: data.transfer.actualReceivedAmount ?? receivableAmount,
                    bankTransactionAt: data.transfer.bankTransactionAt
                        ? dayjs(data.transfer.bankTransactionAt)
                        : undefined,
                    exceptionNote: data.transfer.exceptionNote ?? "",
                    makerAck: false,
                    approvalStatus: data.transfer.approvalStatus === "REJECTED" ? "REJECTED" as const : "APPROVED" as const,
                    rejectedReason: data.transfer.rejectedReason ?? data.transfer.rejectReason ?? "",
                };
                form.setFieldsValue(initialValues);
                setApprovalStatus(initialValues.approvalStatus);
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
                return t(key);
            }
            return err.message;
        }
        return err instanceof Error ? err.message : tCommon("error");
    };

    const submitAudit = async (nextApprovalStatus: "APPROVED" | "REJECTED") => {
        if (viewOnly) {
            onClose();
            return;
        }

        form.setFieldValue("approvalStatus", nextApprovalStatus);
        setApprovalStatus(nextApprovalStatus);

        try {
            const values =
                nextApprovalStatus === "REJECTED"
                    ? await form.validateFields(["makerAck", "rejectedReason"])
                    : await form.validateFields();
            const allValues = { ...form.getFieldsValue(), ...values };
            setSubmitting(true);
            setError("");

            await api.transfers.audit(
                transferId,
                {
                    approvalStatus: nextApprovalStatus,
                    transactionId: allValues.transactionId,
                    payerAccountHolder: allValues.payerAccountHolder,
                    payerAccountNumber: allValues.payerAccountNumber,
                    payerBankName: allValues.payerBankName,
                    actualReceivedAmount: allValues.actualReceivedAmount,
                    bankTransactionAt: allValues.bankTransactionAt
                        ? dayjs(allValues.bankTransactionAt).toISOString()
                        : undefined,
                    exceptionNote: allValues.exceptionNote || undefined,
                    rejectedReason: nextApprovalStatus === "REJECTED" ? allValues.rejectedReason : undefined,
                    makerAck: true,
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
            title={viewOnly ? t("title_view") || t("title") : t("title")}
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
                              key="reject"
                              danger
                              loading={submitting && approvalStatus === "REJECTED"}
                              onClick={() => void submitAudit("REJECTED")}
                          >
                              {t("reject")}
                          </Button>,
                          <Button
                              key="approve"
                              type="primary"
                              loading={submitting && approvalStatus === "APPROVED"}
                              onClick={() => void submitAudit("APPROVED")}
                          >
                              {t("pass")}
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
                            <Typography.Title level={5}>{t("proof_image")}</Typography.Title>
                            <div className={styles.previewCard}>
                                {proofImage ? (
                                    <Image
                                        src={proofImage}
                                        alt="Transfer Proof"
                                        className={styles.previewImage}
                                        preview={{ mask: t("zoom_in") }}
                                    />
                                ) : (
                                    <Typography.Text type="secondary">{tCommon("no_data")}</Typography.Text>
                                )}
                            </div>
                        </div>

                        <div className={styles.formColumn}>
                            <Typography.Title level={5}>{t("buyer_evidence")}</Typography.Title>
                            <Descriptions column={1} size="small" className={styles.descriptionList}>
                                <Descriptions.Item label={t("amount")}>
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
                                <Descriptions.Item label={t("payee")}>
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

                            {!viewOnly ? (
                                <Form
                                    form={form}
                                    layout="vertical"
                                    initialValues={{ approvalStatus: "APPROVED", makerAck: false }}
                                >
                                    <Form.Item name="approvalStatus" hidden>
                                        <Input type="hidden" />
                                    </Form.Item>
                                    <Typography.Title level={5}>{t("merchant_check")}</Typography.Title>
                                    <Alert
                                        type="info"
                                        showIcon
                                        message={t("bank_check_hint")}
                                        style={{ marginBottom: 16 }}
                                    />
                                    <Form.Item
                                        name="transactionId"
                                        label={t("transaction_id")}
                                        rules={[
                                            {
                                                required: approvalStatus === "APPROVED",
                                                message: t("transaction_id_placeholder"),
                                            },
                                        ]}
                                    >
                                        <Input placeholder={t("transaction_id_placeholder")} />
                                    </Form.Item>
                                    <Form.Item
                                        name="actualReceivedAmount"
                                        label={t("actual_received_amount")}
                                        rules={[
                                            {
                                                required: approvalStatus === "APPROVED",
                                                message: t("actual_received_amount_required"),
                                            },
                                        ]}
                                    >
                                        <InputNumber style={{ width: "100%" }} min={0} precision={2} />
                                    </Form.Item>
                                    <Form.Item
                                        name="payerAccountHolder"
                                        label={t("payer_name")}
                                        rules={[{ required: approvalStatus === "APPROVED" }]}
                                    >
                                        <Input placeholder={t("payer_name")} />
                                    </Form.Item>
                                    <Form.Item
                                        name="payerAccountNumber"
                                        label={t("payer_account")}
                                        rules={[{ required: approvalStatus === "APPROVED" }]}
                                    >
                                        <Input placeholder={t("payer_account")} />
                                    </Form.Item>
                                    <Form.Item
                                        name="payerBankName"
                                        label={t("payer_bank")}
                                        rules={[{ required: approvalStatus === "APPROVED" }]}
                                    >
                                        <Input placeholder={t("payer_bank")} />
                                    </Form.Item>
                                    <Form.Item
                                        name="bankTransactionAt"
                                        label={t("bank_transaction_at")}
                                        rules={[
                                            {
                                                required: approvalStatus === "APPROVED",
                                                message: t("bank_transaction_at_required"),
                                            },
                                        ]}
                                    >
                                        <DatePicker showTime style={{ width: "100%" }} />
                                    </Form.Item>
                                    {amountMismatch && approvalStatus === "APPROVED" ? (
                                        <Form.Item
                                            name="exceptionNote"
                                            label={t("exception_note")}
                                            rules={[{ required: true, message: t("exception_note_required") }]}
                                        >
                                            <Input.TextArea rows={2} placeholder={t("exception_note_placeholder")} />
                                        </Form.Item>
                                    ) : (
                                        <Form.Item name="exceptionNote" hidden>
                                            <Input />
                                        </Form.Item>
                                    )}
                                    <Form.Item
                                        name="makerAck"
                                        valuePropName="checked"
                                        rules={[
                                            {
                                                validator: async (_, value) => {
                                                    if (value === true) {
                                                        return;
                                                    }
                                                    throw new Error(t("maker_ack_required"));
                                                },
                                            },
                                        ]}
                                    >
                                        <Checkbox>{t("maker_ack")}</Checkbox>
                                    </Form.Item>

                                    <Form.Item
                                        name="rejectedReason"
                                        label={t("reject_reason")}
                                        rules={
                                            approvalStatus === "REJECTED"
                                                ? [{ required: true, message: t("reject_reason_required") }]
                                                : []
                                        }
                                    >
                                        <Input.TextArea rows={3} placeholder={t("reject_reason_placeholder")} />
                                    </Form.Item>
                                </Form>
                            ) : (
                                <div className={styles.readonlySection}>
                                    <Typography.Title level={5}>{t("merchant_check")}</Typography.Title>
                                    <Descriptions column={1} size="small" className={styles.descriptionList}>
                                        <Descriptions.Item label={t("transaction_id")}>
                                            {detail.transfer.transactionId}
                                        </Descriptions.Item>
                                        <Descriptions.Item label={t("actual_received_amount")}>
                                            {detail.transfer.actualReceivedAmount ?? "-"}
                                        </Descriptions.Item>
                                        <Descriptions.Item label={t("payer_name")}>
                                            {detail.transfer.payerAccountHolder}
                                        </Descriptions.Item>
                                        <Descriptions.Item label={t("payer_account")}>
                                            {detail.transfer.payerAccountNumber}
                                        </Descriptions.Item>
                                        <Descriptions.Item label={t("payer_bank")}>
                                            {detail.transfer.payerBankName}
                                        </Descriptions.Item>
                                        <Descriptions.Item label={t("bank_transaction_at")}>
                                            {detail.transfer.bankTransactionAt
                                                ? new Date(detail.transfer.bankTransactionAt).toLocaleString()
                                                : "-"}
                                        </Descriptions.Item>
                                        <Descriptions.Item label={t("approval_operator")}>
                                            {detail.transfer.auditOperator || "-"}
                                        </Descriptions.Item>
                                        {detail.transfer.exceptionNote ? (
                                            <Descriptions.Item label={t("exception_note")}>
                                                {detail.transfer.exceptionNote}
                                            </Descriptions.Item>
                                        ) : null}
                                        {detail.transfer.approvalStatus === "REJECTED" && (
                                            <Descriptions.Item label={t("reject_reason")}>
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
