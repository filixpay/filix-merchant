"use client";

import { useEffect, useState } from "react";
import { Form, Input, Modal, message } from "antd";
import { useTranslations } from "next-intl";
import { api, SubMerchantView } from "@/lib/api";

interface EditSubMerchantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accessToken: string;
    subMerchant: SubMerchantView | null;
}

interface SubMerchantFormValues {
    name: string;
    alias: string;
}

export default function EditSubMerchantModal({
    isOpen,
    onClose,
    onSuccess,
    accessToken,
    subMerchant,
}: EditSubMerchantModalProps) {
    const t = useTranslations("SubMerchants");
    const tCommon = useTranslations("Common");
    const [form] = Form.useForm<SubMerchantFormValues>();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (subMerchant) {
            form.setFieldsValue({ name: subMerchant.name, alias: subMerchant.alias });
        }
    }, [subMerchant, form]);

    const handleSubmit = async (values: SubMerchantFormValues) => {
        if (!subMerchant) return;
        setSubmitting(true);
        try {
            await api.subMerchants.update(subMerchant.id, values, accessToken);
            message.success(t("form.edit_success"));
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error(err);
            message.error(err instanceof Error ? err.message : "Failed to update sub-merchant");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={t("edit_sub_merchant")}
            open={isOpen && !!subMerchant}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={submitting}
            okText={tCommon("submit")}
            cancelText={tCommon("cancel")}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="name" label={t("form.name")} rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="alias" label={t("form.alias")} rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}
