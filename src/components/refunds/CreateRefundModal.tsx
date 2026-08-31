"use client";

import { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Select, Space, message } from "antd";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import {
    buildRefundCreatePayload,
    createRefundFormValues,
    ORDER_ACTION_CURRENCIES,
    ZERO_DECIMAL_ACTION_CURRENCIES,
    type RefundCreateFormValues,
    type RefundCreateInitialData,
} from "@/components/orders/order-action-model";

interface CreateRefundModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accessToken: string;
    initialData?: RefundCreateInitialData;
}

export default function CreateRefundModal({ isOpen, onClose, onSuccess, accessToken, initialData }: CreateRefundModalProps) {
    const t = useTranslations('Refunds');
    const [form] = Form.useForm<RefundCreateFormValues>();
    const watchedCurrency = Form.useWatch("currency", form) || "USD";
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            form.setFieldsValue(createRefundFormValues(initialData, t("create_modal.default_reason")));
        }
    }, [form, initialData, isOpen, t]);

    const handleCreateRefund = async (values: RefundCreateFormValues) => {
        setSubmitting(true);
        try {
            const payload = buildRefundCreatePayload(values);
            await api.refunds.create(payload, accessToken);
            onSuccess();
            onClose();
            form.setFieldsValue(createRefundFormValues(undefined, ""));
            message.success(t("create_modal.create_success"));
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("create_modal.create_failed"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={t("create_modal.title")}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={620}
            destroyOnHidden
        >
            <Form<RefundCreateFormValues>
                form={form}
                layout="vertical"
                initialValues={createRefundFormValues(initialData, t("create_modal.default_reason"))}
                onFinish={handleCreateRefund}
            >
                <Form.Item
                    name="tradeNo"
                    label={t("create_modal.trade_no")}
                    rules={[{ required: true, message: t("create_modal.trade_no") }]}
                >
                    <Input placeholder="Example: 2026020495454172307767424702" />
                </Form.Item>
                <Form.Item
                    name="merchantRefundId"
                    label={t("create_modal.merchant_refund_id")}
                    rules={[{ required: true, message: t("create_modal.merchant_refund_id") }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="reason"
                    label={t("create_modal.reason")}
                    rules={[{ required: true, message: t("create_modal.reason") }]}
                >
                    <Input.TextArea rows={4} placeholder={t("create_modal.reason")} />
                </Form.Item>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
                    <Form.Item name="currency" label={t("create_modal.currency")}>
                        <Select
                            options={ORDER_ACTION_CURRENCIES.map((currency) => ({
                                label: currency,
                                value: currency,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        name="amount"
                        label={t("create_modal.amount")}
                        rules={[{ required: true, message: t("create_modal.amount") }]}
                    >
                        <InputNumber
                            min={0}
                            step={ZERO_DECIMAL_ACTION_CURRENCIES.has(watchedCurrency) ? 1 : 0.01}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Space>
                        <Button onClick={onClose}>{t("create_modal.cancel")}</Button>
                        <Button type="primary" htmlType="submit" loading={submitting}>
                            {t("create_modal.submit")}
                        </Button>
                    </Space>
                </div>
            </Form>
        </Modal>
    );
}
