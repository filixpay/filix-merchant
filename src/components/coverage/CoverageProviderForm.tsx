"use client";

import { useEffect, useMemo } from "react";
import { Alert, Form, Input, InputNumber, Select } from "antd";
import { useTranslations } from "next-intl";
import type {
    CoverageConfigView,
    CoverageProviderSchema,
} from "@/types/coverageConfig";

export type CoverageProviderFormValues = {
    provider?: string;
    config: Record<string, string | number>;
    secrets: Record<string, string>;
};

type CoverageProviderFormProps = {
    mode: "create" | "edit";
    providers: CoverageProviderSchema[];
    initialConfig?: CoverageConfigView | null;
    showProviderWarning?: boolean;
};

function parseConfigJson(configJson: string): Record<string, string | number> {
    try {
        const parsed = JSON.parse(configJson) as Record<string, string | number>;
        return parsed ?? {};
    } catch {
        return {};
    }
}

export function buildConfigJson(
    providerSchema: CoverageProviderSchema | undefined,
    config: Record<string, string | number>,
): string {
    if (!providerSchema?.configFields?.length) {
        return JSON.stringify(config);
    }
    const payload: Record<string, string | number> = {};
    for (const field of providerSchema.configFields) {
        const value = config[field.name];
        if (value === undefined || value === "") {
            continue;
        }
        payload[field.name] = field.fieldType === "number" ? Number(value) : value;
    }
    return JSON.stringify(payload);
}

export function buildSecretsPayload(
    providerSchema: CoverageProviderSchema | undefined,
    secrets: Record<string, string>,
): Record<string, string> | undefined {
    if (!providerSchema?.secretFields?.length) {
        return undefined;
    }
    const payload: Record<string, string> = {};
    for (const field of providerSchema.secretFields) {
        const value = secrets[field.name]?.trim();
        if (!value) {
            continue;
        }
        payload[field.name] = value;
    }
    return Object.keys(payload).length > 0 ? payload : undefined;
}

export default function CoverageProviderForm({
    mode,
    providers,
    initialConfig,
    showProviderWarning = false,
}: CoverageProviderFormProps) {
    const t = useTranslations("CoverageConfig");
    const form = Form.useFormInstance<CoverageProviderFormValues>();
    const selectedProvider = Form.useWatch("provider", form);

    const enabledProviders = useMemo(
        () => providers.filter((provider) => provider.enabled),
        [providers],
    );

    const providerSchema = useMemo(() => {
        const providerType = mode === "edit" ? initialConfig?.provider : selectedProvider;
        return providers.find((provider) => provider.type === providerType);
    }, [providers, mode, initialConfig?.provider, selectedProvider]);

    useEffect(() => {
        if (mode !== "create" || !selectedProvider) {
            return;
        }
        form.setFieldValue("config", {});
        form.setFieldValue("secrets", {});
    }, [form, mode, selectedProvider]);

    useEffect(() => {
        if (mode !== "edit" || !initialConfig) {
            return;
        }
        form.setFieldsValue({
            provider: initialConfig.provider,
            config: parseConfigJson(initialConfig.configJson),
            secrets: {},
        });
    }, [form, mode, initialConfig]);

    return (
        <>
            {showProviderWarning ? (
                <Alert type="warning" showIcon message={t("provider_switch_warning")} style={{ marginBottom: 16 }} />
            ) : null}

            {mode === "create" ? (
                <Form.Item
                    name="provider"
                    label={t("fields.provider")}
                    rules={[{ required: true, message: t("validation.provider_required") }]}
                >
                    <Select
                        placeholder={t("fields.provider_placeholder")}
                        options={enabledProviders.map((provider) => ({
                            value: provider.type,
                            label: provider.type,
                        }))}
                    />
                </Form.Item>
            ) : (
                <Form.Item label={t("fields.provider")}>
                    <Input value={initialConfig?.provider} disabled />
                </Form.Item>
            )}

            {providerSchema?.configFields?.map((field) => {
                const label = t(`config_fields.${field.name}`, { defaultValue: field.name });
                const rules = field.required
                    ? [{ required: true, message: t("validation.field_required", { field: label }) }]
                    : [];

                if (field.fieldType === "enum") {
                    return (
                        <Form.Item
                            key={field.name}
                            name={["config", field.name]}
                            label={label}
                            rules={rules}
                        >
                            <Select
                                options={(field.options ?? []).map((option) => ({
                                    value: option,
                                    label: option,
                                }))}
                            />
                        </Form.Item>
                    );
                }

                if (field.fieldType === "number") {
                    return (
                        <Form.Item
                            key={field.name}
                            name={["config", field.name]}
                            label={label}
                            rules={rules}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    );
                }

                return (
                    <Form.Item
                        key={field.name}
                        name={["config", field.name]}
                        label={label}
                        rules={rules}
                    >
                        <Input />
                    </Form.Item>
                );
            })}

            {providerSchema?.secretFields?.map((field) => {
                const label = t(`secret_fields.${field.name}`, { defaultValue: field.name });
                const masked = initialConfig?.secrets?.[field.name];
                const rules =
                    mode === "create" && field.required
                        ? [{ required: true, message: t("validation.field_required", { field: label }) }]
                        : [];

                return (
                    <Form.Item
                        key={field.name}
                        name={["secrets", field.name]}
                        label={label}
                        rules={rules}
                        extra={mode === "edit" && masked ? t("secret_keep_hint", { masked }) : undefined}
                    >
                        <Input.Password placeholder={mode === "edit" ? t("secret_placeholder_edit") : undefined} />
                    </Form.Item>
                );
            })}
        </>
    );
}
