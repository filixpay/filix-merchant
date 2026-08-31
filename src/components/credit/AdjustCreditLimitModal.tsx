"use client";

import { useEffect, useState } from "react";
import { Descriptions, Form, InputNumber, Modal, Typography, message } from "antd";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { formatCreditAmount } from "./credit-model";

interface AdjustCreditLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
    creditLineId: number | null;
    debitorName: string;
    currentLimit: number;
    accessToken: string;
    onSuccess: () => void;
}

export default function AdjustCreditLimitModal({
    isOpen,
    onClose,
    creditLineId,
    debitorName,
    currentLimit,
    accessToken,
    onSuccess,
}: AdjustCreditLimitModalProps) {
    const t = useTranslations("CreditLimit");
    const tCommon = useTranslations("Common");
    const [form] = Form.useForm<{ amount: number }>();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            form.resetFields();
        }
    }, [isOpen, form]);

    const handleSubmit = async (values: { amount: number }) => {
        if (creditLineId === null) return;
        setSubmitting(true);
        try {
            await api.credit.adjustLimit(
                { creditLineId, amount: values.amount },
                accessToken,
            );
            message.success(t("adjust_modal.success"));
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("adjust_modal.error"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={t("adjust_modal.title")}
            open={isOpen && creditLineId !== null}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={submitting}
            okText={t("adjust_modal.submit")}
            cancelText={tCommon("cancel")}
            destroyOnHidden
        >
            <Descriptions column={1} size="small" bordered style={{ marginBottom: 16 }}>
                <Descriptions.Item label={t("headers.debitor")}>{debitorName}</Descriptions.Item>
                <Descriptions.Item label={t("headers.credit_limit")}>
                    {formatCreditAmount(currentLimit)}
                </Descriptions.Item>
            </Descriptions>

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="amount"
                    label={t("adjust_modal.amount")}
                    rules={[{ required: true }]}
                    extra={
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {t("adjust_modal.amount_hint")}
                        </Typography.Text>
                    }
                >
                    <InputNumber
                        step={0.01}
                        style={{ width: "100%" }}
                        placeholder="e.g. 5000 or -5000"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
