"use client";

import { useEffect } from "react";
import { Form, Modal, Select, Typography } from "antd";
import { useTranslations } from "next-intl";
import type {
    FinancialInstitutionView,
    ChannelView,
    ScenarioView,
    SubMerchantView,
} from "@/lib/api";

import type { PaymentConfigCreateRequest } from "@/lib/api";

export type CreateConfigFormValues = PaymentConfigCreateRequest;

export type CreateConfigPrefill = Pick<
    CreateConfigFormValues,
    "subMerchantId" | "bankCode" | "scenarioCode"
>;

interface CreateConfigModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: CreateConfigFormValues) => Promise<void>;
    submitting: boolean;
    institutions: FinancialInstitutionView[];
    channels: ChannelView[];
    scenarios: ScenarioView[];
    subMerchants: SubMerchantView[];
    prefill?: CreateConfigPrefill | null;
}

export default function CreateConfigModal({
    open,
    onClose,
    onSubmit,
    submitting,
    institutions,
    channels,
    scenarios,
    subMerchants,
    prefill = null,
}: CreateConfigModalProps) {
    const t = useTranslations("Configs");
    const tCommon = useTranslations("Common");
    const [form] = Form.useForm<CreateConfigFormValues>();
    const isPrefillMode = Boolean(prefill);

    useEffect(() => {
        if (!open) return;
        if (prefill) {
            form.setFieldsValue({
                subMerchantId: prefill.subMerchantId,
                bankCode: prefill.bankCode,
                scenarioCode: prefill.scenarioCode,
                channelCode: undefined,
            });
            return;
        }
        form.setFieldsValue({
            subMerchantId: subMerchants[0]?.id,
            bankCode: institutions[0]?.institutionCode,
            channelCode: channels[0]?.channelCode,
            scenarioCode: scenarios[0]?.scenarioCode,
        });
    }, [open, prefill, institutions, channels, scenarios, subMerchants, form]);

    const prefillBrand =
        prefill &&
        institutions.find((item) => item.institutionCode === prefill.bankCode)?.institutionName
            ? institutions.find((item) => item.institutionCode === prefill.bankCode)!.institutionName
            : prefill?.bankCode;
    const prefillScenario =
        prefill && scenarios.find((s) => s.scenarioCode === prefill.scenarioCode)?.scenarioName
            ? scenarios.find((s) => s.scenarioCode === prefill.scenarioCode)!.scenarioName
            : prefill?.scenarioCode;
    const prefillSubMerchant =
        prefill && subMerchants.find((s) => s.id === prefill.subMerchantId)?.name
            ? subMerchants.find((s) => s.id === prefill.subMerchantId)!.name
            : prefill?.subMerchantId != null
              ? String(prefill.subMerchantId)
              : "";

    return (
        <Modal
            title={isPrefillMode ? t("add_channel") : t("add_config")}
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={submitting}
            okText={tCommon("submit")}
            cancelText={tCommon("cancel")}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                {isPrefillMode && prefill ? (
                    <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
                        {t("prefill_summary", {
                            brand: prefillBrand ?? "",
                            scenario: prefillScenario ?? "",
                            subMerchant: prefillSubMerchant,
                        })}
                    </Typography.Paragraph>
                ) : null}
                {!isPrefillMode ? (
                    <>
                        <Form.Item
                            name="subMerchantId"
                            label={t("headers.sub_merchant")}
                            rules={[{ required: true }]}
                        >
                            <Select
                                options={subMerchants.map((s) => ({ value: s.id, label: s.name }))}
                            />
                        </Form.Item>
                        <Form.Item
                            name="bankCode"
                            label={t("headers.payment_brand")}
                            rules={[{ required: true }]}
                        >
                            <Select
                                options={institutions.map((item) => ({
                                    value: item.institutionCode,
                                    label: `${item.institutionName} (${item.institutionCode})`,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item
                            name="scenarioCode"
                            label={t("headers.payment_scenario")}
                            rules={[{ required: true }]}
                        >
                            <Select
                                options={scenarios.map((s) => ({
                                    value: s.scenarioCode,
                                    label: `${s.scenarioName} (${s.scenarioCode})`,
                                }))}
                            />
                        </Form.Item>
                    </>
                ) : (
                    <>
                        <Form.Item name="subMerchantId" hidden>
                            <Select />
                        </Form.Item>
                        <Form.Item name="bankCode" hidden>
                            <Select />
                        </Form.Item>
                        <Form.Item name="scenarioCode" hidden>
                            <Select />
                        </Form.Item>
                    </>
                )}
                <Form.Item name="channelCode" label={t("headers.payment_channel")} rules={[{ required: true }]}>
                    <Select
                        options={channels.map((c) => ({
                            value: c.channelCode,
                            label: `${c.channelName} (${c.channelCode})`,
                        }))}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
