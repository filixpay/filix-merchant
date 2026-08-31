"use client";

import { useState } from "react";
import { Form, Input, InputNumber, Modal, Select, message } from "antd";
import { useTranslations } from "next-intl";
import { api, CreateCreditLineRequest } from "@/lib/api";

interface CreateCreditLineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accessToken: string;
}

const PAYMENT_TERM_TYPES = [
    "IMMEDIATE",
    "NET_DAYS",
    "END_OF_MONTH",
    "ON_DELIVERY",
    "STAGE_BASED",
] as const;

export default function CreateCreditLineModal({
    isOpen,
    onClose,
    onSuccess,
    accessToken,
}: CreateCreditLineModalProps) {
    const t = useTranslations("CreditLimit");
    const [form] = Form.useForm<CreateCreditLineRequest>();
    const [submitting, setSubmitting] = useState(false);
    const paymentTermType = Form.useWatch("paymentTermType", form);

    const handleSubmit = async (values: CreateCreditLineRequest) => {
        setSubmitting(true);
        try {
            await api.credit.createLine(values, accessToken);
            message.success(t("form.success"));
            form.resetFields();
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("form.error"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={t("create")}
            open={isOpen}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={submitting}
            okText={t("form.submit")}
            cancelText={t("form.cancel")}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    debitorCode: "",
                    creditLimit: 0,
                    paymentTermType: "NET_DAYS",
                    paymentTermDays: "30",
                }}
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="debitorCode"
                    label={t("form.debitor_code")}
                    rules={[{ required: true }]}
                >
                    <Input placeholder="10001" />
                </Form.Item>
                <Form.Item
                    name="creditLimit"
                    label={t("form.credit_limit")}
                    rules={[{ required: true }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} placeholder="100000" />
                </Form.Item>
                <Form.Item
                    name="paymentTermType"
                    label={t("form.payment_term_type")}
                    rules={[{ required: true }]}
                >
                    <Select
                        options={PAYMENT_TERM_TYPES.map((type) => ({
                            value: type,
                            label: t(`payment_terms.${type}`),
                        }))}
                    />
                </Form.Item>
                {paymentTermType === "NET_DAYS" && (
                    <Form.Item
                        name="paymentTermDays"
                        label={t("form.payment_term_days")}
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="30" />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
}
