"use client";

import { useEffect, useState } from "react";
import { Col, Form, Input, Modal, Radio, Row, Select, Switch, message } from "antd";
import { useTranslations } from "next-intl";
import { api, LocationUpsertRequest, LocationView, SubMerchantView } from "@/lib/api";

interface EditLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accessToken: string;
    location: LocationView | null;
}

type LocationFormValues = LocationUpsertRequest;

export default function EditLocationModal({
    isOpen,
    onClose,
    onSuccess,
    accessToken,
    location,
}: EditLocationModalProps) {
    const t = useTranslations("Locations");
    const tCommon = useTranslations("Common");
    const [form] = Form.useForm<LocationFormValues>();
    const [submitting, setSubmitting] = useState(false);
    const [subMerchants, setSubMerchants] = useState<SubMerchantView[]>([]);

    useEffect(() => {
        if (isOpen) {
            api.subMerchants
                .list({ page: 0, size: 100 }, accessToken)
                .then((res) => setSubMerchants(res.data || []))
                .catch((err) => console.error("Failed to fetch sub-merchants:", err));
        }
    }, [isOpen, accessToken]);

    useEffect(() => {
        if (location) {
            form.setFieldsValue({
                name: location.name || "",
                subMerchantId: location.subMerchantId,
                address: location.address || "",
                country: location.country || "",
                mobilePhone: location.mobilePhone || "",
                cantactEmail: location.cantactEmail || "",
                servicePhone: location.servicePhone || "",
                status: location.status || "ACTIVE",
                default: location.default ?? false,
            });
        }
    }, [location, form]);

    const handleSubmit = async (values: LocationFormValues) => {
        if (!location) return;
        setSubmitting(true);
        try {
            await api.locations.update(location.id, values, accessToken);
            message.success(t("form.edit_success"));
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error(err);
            message.error(err instanceof Error ? err.message : "Failed to update location");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={t("edit_location")}
            open={isOpen && !!location}
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
                    <Input />
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
                    <Input />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="country" label={t("form.country")}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="mobilePhone" label={t("form.mobile_phone")}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="cantactEmail" label={t("form.email")}>
                            <Input type="email" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="servicePhone" label={t("form.service_phone")}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label={t("form.status")}
                            rules={[{ required: true, message: t("form.status_required") }]}
                        >
                            <Radio.Group>
                                <Radio value="ACTIVE">{t("status_active")}</Radio>
                                <Radio value="INACTIVE">{t("status_inactive")}</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="default"
                            label={t("form.default")}
                            valuePropName="checked"
                        >
                            <Switch checkedChildren={tCommon("yes")} unCheckedChildren={tCommon("no")} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
