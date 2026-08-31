"use client";

import { useEffect } from "react";
import {
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Table,
    Typography,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { MerchantCheckoutRequest, PaymentConfigView } from "@/lib/api";

export type CheckoutFormState = Partial<MerchantCheckoutRequest> & {
    id?: number;
    currenciesStr?: string;
    buyerCountriesStr?: string;
};

interface CheckoutFormModalProps {
    open: boolean;
    checkout: CheckoutFormState | null;
    paymentConfigs: PaymentConfigView[];
    submitting: boolean;
    onClose: () => void;
    onSubmit: (data: MerchantCheckoutRequest) => Promise<void>;
}

export default function CheckoutFormModal({
    open,
    checkout,
    paymentConfigs,
    submitting,
    onClose,
    onSubmit,
}: CheckoutFormModalProps) {
    const t = useTranslations("Checkouts");
    const tCommon = useTranslations("Common");
    const [form] = Form.useForm<CheckoutFormState>();

    useEffect(() => {
        if (checkout && open) {
            form.setFieldsValue({
                ...checkout,
                currenciesStr: checkout.currencies?.join(",") || "",
                buyerCountriesStr: checkout.buyerCountries?.join(",") || "",
            });
        }
    }, [checkout, open, form]);

    const handleFinish = async (values: CheckoutFormState) => {
        const requestData: MerchantCheckoutRequest = {
            checkoutCode: values.checkoutCode!,
            titles: values.titles!,
            logo: values.logo,
            color: values.color,
            currencies: (values.currenciesStr || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            buyerCountries: (values.buyerCountriesStr || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            configs: values.configs || [],
        };
        await onSubmit(requestData);
    };

    return (
        <Modal
            title={checkout?.id ? t("edit_counter") : t("create_counter")}
            open={open && !!checkout}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={submitting}
            okText={tCommon("submit")}
            cancelText={tCommon("cancel")}
            width={800}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="checkoutCode"
                            label={t("form.checkout_code")}
                            rules={[{ required: true }]}
                        >
                            <Input disabled={!!checkout?.id} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={["titles", "en"]}
                            label={`${t("form.checkout_name")} (EN)`}
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name={["titles", "zh-CN"]} label={`${t("form.checkout_name")} (ZH)`}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name={["titles", "ja-JP"]} label={`${t("form.checkout_name")} (JA)`}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="logo" label="Logo URL">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="color" label="Brand Color">
                            <Input type="color" style={{ width: 60, padding: 2 }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="currenciesStr" label="Supported Currencies">
                            <Input placeholder="CNY,USD,*" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="buyerCountriesStr" label="Buyer Countries">
                            <Input placeholder="CN,US,*" />
                        </Form.Item>
                    </Col>
                </Row>

                <Typography.Title level={5}>Payment Configurations</Typography.Title>
                <Form.List name="configs">
                    {(fields, { add, remove }) => (
                        <>
                            <Table
                                size="small"
                                pagination={false}
                                rowKey="key"
                                dataSource={fields}
                                locale={{ emptyText: "No configurations added." }}
                                columns={[
                                    {
                                        title: "Payment Config",
                                        key: "merchantConfigId",
                                        render: (_, field) => (
                                            <Form.Item
                                                name={[field.name, "merchantConfigId"]}
                                                rules={[{ required: true }]}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <Select
                                                    placeholder="Select Configuration"
                                                    options={paymentConfigs.map((pc) => ({
                                                        value: pc.id,
                                                        label: `${pc.bankCode} - ${pc.channelCode} (${pc.rate}%)`,
                                                    }))}
                                                />
                                            </Form.Item>
                                        ),
                                    },
                                    {
                                        title: "Priority",
                                        width: 90,
                                        render: (_, field) => (
                                            <Form.Item
                                                name={[field.name, "priority"]}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <InputNumber min={1} style={{ width: "100%" }} />
                                            </Form.Item>
                                        ),
                                    },
                                    {
                                        title: "Rec.",
                                        width: 60,
                                        align: "center",
                                        render: (_, field) => (
                                            <Form.Item
                                                name={[field.name, "recommended"]}
                                                valuePropName="checked"
                                                style={{ marginBottom: 0 }}
                                            >
                                                <Checkbox />
                                            </Form.Item>
                                        ),
                                    },
                                    {
                                        title: "En.",
                                        width: 60,
                                        align: "center",
                                        render: (_, field) => (
                                            <Form.Item
                                                name={[field.name, "enabled"]}
                                                valuePropName="checked"
                                                style={{ marginBottom: 0 }}
                                            >
                                                <Checkbox />
                                            </Form.Item>
                                        ),
                                    },
                                    {
                                        title: "",
                                        width: 40,
                                        render: (_, field) => (
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => remove(field.name)}
                                            />
                                        ),
                                    },
                                ]}
                            />
                            <Button
                                type="dashed"
                                onClick={() =>
                                    add({
                                        merchantConfigId: 0,
                                        priority: fields.length + 1,
                                        enabled: true,
                                        recommended: false,
                                    })
                                }
                                icon={<PlusOutlined />}
                                block
                                style={{ marginTop: 12 }}
                            >
                                Add Config
                            </Button>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
}
