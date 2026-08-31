"use client";

import { useState } from "react";
import { Form, Input, Modal, Select, message } from "antd";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";

interface CreateDepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accessToken: string;
}

interface DepositFormValues {
    currency: string;
    amount: string;
}

export default function CreateDepositModal({
    isOpen,
    onClose,
    onSuccess,
    accessToken,
}: CreateDepositModalProps) {
    const t = useTranslations("Deposits");
    const [form] = Form.useForm<DepositFormValues>();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (values: DepositFormValues) => {
        setSubmitting(true);
        try {
            const amountStr = `${values.currency} ${values.amount}`;
            await api.wallet.deposit({ amount: amountStr }, accessToken);
            message.success(t("create_modal.success"));
            form.resetFields();
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error(err);
            message.error(err instanceof Error ? err.message : "Failed to initiate recharge");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={t("create_modal.title")}
            open={isOpen}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={submitting}
            okText={t("create_modal.submit")}
            cancelText={t("create_modal.cancel")}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ currency: "USD", amount: "" }}
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="currency"
                    label={t("create_modal.currency")}
                    rules={[{ required: true }]}
                >
                    <Select
                        options={["USD", "CNY", "EUR", "HKD", "JPY", "GBP"].map((c) => ({
                            value: c,
                            label: c,
                        }))}
                    />
                </Form.Item>
                <Form.Item
                    name="amount"
                    label={t("create_modal.amount")}
                    rules={[{ required: true, message: t("create_modal.amount") }]}
                >
                    <Input type="number" step="0.01" placeholder="0.00" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
