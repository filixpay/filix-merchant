"use client";

import { useEffect, useState } from "react";
import { Col, Form, Input, Modal, Row, Select, message } from "antd";
import { useTranslations } from "next-intl";
import { api, LocationUpsertRequest, SubMerchantView } from "@/lib/api";

interface CreateLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accessToken: string;
}

type LocationFormValues = LocationUpsertRequest;

export default function CreateLocationModal({
    isOpen,
    onClose,
    onSuccess,
    accessToken,
}: CreateLocationModalProps) {
    const t = useTranslations("Locations");
    const tCommon = useTranslations("Common");
    const [form] = Form.useForm<LocationFormValues>();
    const [submitting, setSubmitting] = useState(false);
    const [subMerchants, setSubMerchants] = useState<SubMerchantView[]>([]);

    useEffect(() => {
        if (isOpen) {
            api.subMerchants
                .list({ page: 0, size: 100 }, accessToken)
                .then((res) => {
                    const list = res.data || [];
                    setSubMerchants(list);
                    if (list.length > 0) {
                        form.setFieldValue("subMerchantId", list[0].id);
                    }
                })
                .catch((err) => console.error("Failed to fetch sub-merchants:", err));
        }
    }, [isOpen, accessToken, form]);

    const handleSubmit = async (values: LocationFormValues) => {
        setSubmitting(true);
        try {
            await api.locations.create(values, accessToken);
            message.success(t("form.success"));
            form.resetFields();
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error(err);
            message.error(err instanceof Error ? err.message : "Failed to create location");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={t("create_location")}
            open={isOpen}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={submitting}
            okText={tCommon("submit")}
            cancelText={tCommon("cancel")}
            width={560}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="name" label={t("form.name")} rules={[{ required: true }]}>
                    <Input placeholder="e.g. Headquarters" />
                </Form.Item>
                <Form.Item
                    name="subMerchantId"
                    label={t("form.sub_merchant")}
                    rules={[{ required: true }]}
                >
                    <Select
                        options={subMerchants.map((m) => ({
                            value: m.id,
                            label: m.name,
                        }))}
                    />
                </Form.Item>
                <Form.Item name="address" label={t("form.address")}>
                    <Input placeholder="123 Business St, City" />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="country" label={t("form.country")}>
                            <Input placeholder="e.g. China" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="mobilePhone" label={t("form.mobile_phone")}>
                            <Input placeholder="+86 138..." />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="cantactEmail" label={t("form.email")}>
                            <Input type="email" placeholder="office@example.com" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="servicePhone" label={t("form.service_phone")}>
                            <Input placeholder="400-xxx-xxxx" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
