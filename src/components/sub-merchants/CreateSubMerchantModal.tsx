"use client";

import { useState } from "react";
import { Form, Input, Modal, message } from "antd";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";

interface CreateSubMerchantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accessToken: string;
}

interface SubMerchantFormValues {
    name: string;
    alias: string;
}

export default function CreateSubMerchantModal({
    isOpen,
    onClose,
    onSuccess,
    accessToken,
}: CreateSubMerchantModalProps) {
    const t = useTranslations("SubMerchants");
    const tCommon = useTranslations("Common");
    const [form] = Form.useForm<SubMerchantFormValues>();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (values: SubMerchantFormValues) => {
        setSubmitting(true);
        try {
            await api.subMerchants.create(values, accessToken);
            message.success(t("form.success"));
            form.resetFields();
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error(err);
            message.error(err instanceof Error ? err.message : "Failed to create sub-merchant");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={t("create_sub_merchant")}
            open={isOpen}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={submitting}
            okText={tCommon("submit")}
            cancelText={tCommon("cancel")}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="name"
                    label={t("form.name")}
                    rules={[{ required: true }]}
                >
                    <Input placeholder="e.g. Beijing Branch" />
                </Form.Item>
                <Form.Item
                    name="alias"
                    label={t("form.alias")}
                    rules={[{ required: true }]}
                >
                    <Input placeholder="e.g. BJ Branch Settlement" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
