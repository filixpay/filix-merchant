"use client";

import { useEffect, type ReactNode } from "react";
import { Form, Input, Button, Space } from "antd";
import type { FormInstance } from "antd/es/form";
import { useTranslations } from "next-intl";
import type { ApplicationDocument, ApplicationSchemaDto } from "@/lib/api/domains/onboarding";
import { getFieldMeta, schemaFieldsWithMeta } from "@/lib/api/domains/onboarding";
import type { ChangeProfileRequest } from "@/lib/api/domains/maintenance";
import ApplicationDocumentField from "@/components/onboarding/ApplicationDocumentField";

export type SchemaFormValues = {
    businessName?: string;
    phone?: string;
    email?: string;
    extraAttributes?: Record<string, string>;
};

type ProfileLike = {
    businessName?: string;
    phone?: string;
    email?: string;
    extraAttributes?: Record<string, unknown>;
};

type SchemaDynamicFormProps = {
    schema: ApplicationSchemaDto;
    initialProfile?: ProfileLike;
    highlightFields?: Record<string, string>;
    onSubmit: (values: SchemaFormValues) => void | Promise<void>;
    submitLabel: string;
    loading?: boolean;
    mode?: "onboarding" | "maintenance";
    translationsNamespace?: string;
    form?: FormInstance<SchemaFormValues>;
    showDefaultSubmit?: boolean;
    submitButtonType?: "primary" | "default";
    extraActions?: ReactNode;
    applicationId?: string;
    documents?: ApplicationDocument[];
    onDocumentsChange?: () => void | Promise<void>;
    editable?: boolean;
};

function coerceExtraAttributes(
    extra?: Record<string, unknown>,
): Record<string, string> {
    if (!extra) {
        return {};
    }
    return Object.fromEntries(
        Object.entries(extra).map(([key, value]) => [
            key,
            value == null ? "" : String(value),
        ]),
    );
}

function filterSchemaFields(
    schema: ApplicationSchemaDto,
    mode: "onboarding" | "maintenance",
    editable = true,
) {
    const fields = schema.fields.filter((field) => {
        // registrationCountry is chosen in step 1 / schema resolve — never re-enter on onboarding.
        if (mode === "onboarding" && field.name === "registrationCountry") {
            return false;
        }
        return true;
    });
    if (mode !== "maintenance") {
        return fields;
    }
    if (!editable) {
        return fields;
    }
    return fields.filter(
        (field) => field.maintenance == null || field.maintenance.editable !== false,
    );
}

export function getMissingRequiredDocumentFieldCodes(
    schema: ApplicationSchemaDto,
    documents: ApplicationDocument[],
): string[] {
    const uploaded = new Set(documents.map((document) => document.fieldCode));
    return filterSchemaFields(schema, "onboarding")
        .filter((field) => (field.type ?? "text") === "document")
        .filter((field) => {
            const meta = getFieldMeta(field.name);
            return field.required ?? meta?.required ?? false;
        })
        .filter((field) => !uploaded.has(field.name))
        .map((field) => field.name);
}

export default function SchemaDynamicForm({
    schema,
    initialProfile,
    highlightFields = {},
    onSubmit,
    submitLabel,
    loading = false,
    mode = "onboarding",
    translationsNamespace = "Onboarding",
    form: externalForm,
    showDefaultSubmit = true,
    submitButtonType = "primary",
    extraActions,
    applicationId,
    documents = [],
    onDocumentsChange,
    editable = true,
}: SchemaDynamicFormProps) {
    const t = useTranslations(translationsNamespace);
    const [internalForm] = Form.useForm<SchemaFormValues>();
    const form = externalForm ?? internalForm;
    const profileValues: SchemaFormValues = {
        businessName: initialProfile?.businessName,
        phone: initialProfile?.phone,
        email: initialProfile?.email,
        extraAttributes: coerceExtraAttributes(initialProfile?.extraAttributes),
    };

    useEffect(() => {
        form.setFieldsValue(profileValues);
    }, [form, initialProfile, schema.schemaCode]);

    const fields = schemaFieldsWithMeta(filterSchemaFields(schema, mode, editable));
    const showActions = editable && (showDefaultSubmit || Boolean(extraActions));

    return (
        <Form
            form={form}
            layout="vertical"
            disabled={!editable}
            initialValues={profileValues}
            onFinish={onSubmit}
        >
            {fields.map(({ field, meta }) => {
                // Prefer localized field meta; backend schema labels are often English-only.
                const label = meta ? t(meta.labelKey) : (field.label ?? field.name);
                const required = editable
                    ? (field.required ?? meta?.required ?? false)
                    : false;
                const highlight = editable ? highlightFields[field.name] : undefined;
                const fieldType = field.type ?? "text";

                if (fieldType === "document") {
                    if (!applicationId || !onDocumentsChange) {
                        return null;
                    }
                    const document = documents.find((item) => item.fieldCode === field.name);
                    return (
                        <Form.Item
                            key={field.name}
                            label={label}
                            required={required}
                            validateStatus={highlight ? "error" : undefined}
                            help={highlight}
                        >
                            <ApplicationDocumentField
                                applicationId={applicationId}
                                fieldCode={field.name}
                                editable={editable}
                                document={document}
                                onDocumentChange={onDocumentsChange}
                            />
                        </Form.Item>
                    );
                }

                const inputType = meta?.inputType === "password" ? "password" : "text";

                if (field.storage === "core") {
                    return (
                        <Form.Item
                            key={field.name}
                            name={field.name as "businessName" | "phone" | "email"}
                            label={label}
                            rules={required ? [{ required: true, message: t("validation.required") }] : []}
                            validateStatus={highlight ? "error" : undefined}
                            help={highlight}
                        >
                            <Input type={inputType} autoComplete="off" readOnly={!editable} />
                        </Form.Item>
                    );
                }

                return (
                    <Form.Item
                        key={field.name}
                        name={["extraAttributes", field.name]}
                        label={label}
                        rules={required ? [{ required: true, message: t("validation.required") }] : []}
                        validateStatus={highlight ? "error" : undefined}
                        help={highlight}
                    >
                        <Input type={inputType} autoComplete="off" readOnly={!editable} />
                    </Form.Item>
                );
            })}

            {showActions ? (
                <Form.Item>
                    <Space>
                        {showDefaultSubmit ? (
                            <Button type={submitButtonType} htmlType="submit" loading={loading}>
                                {submitLabel}
                            </Button>
                        ) : null}
                        {extraActions}
                    </Space>
                </Form.Item>
            ) : null}
        </Form>
    );
}

export function buildProfileRequest(
    schema: ApplicationSchemaDto,
    values: SchemaFormValues,
): {
    registrationCountry: string;
    merchantType: ApplicationSchemaDto["merchantType"];
    schemaCode: string;
    businessName?: string;
    phone?: string;
    email?: string;
    extraAttributes?: Record<string, string>;
} {
    const textFieldNames = new Set(
        schema.fields
            .filter((field) => (field.type ?? "text") !== "document")
            .map((field) => field.name),
    );
    const extraAttributes = values.extraAttributes
        ? Object.fromEntries(
              Object.entries(values.extraAttributes).filter(([key]) => textFieldNames.has(key)),
          )
        : undefined;

    return {
        registrationCountry: schema.registrationCountry,
        merchantType: schema.merchantType,
        schemaCode: schema.schemaCode,
        businessName: values.businessName,
        phone: values.phone,
        email: values.email,
        extraAttributes,
    };
}

export function buildChangeProfileRequest(values: SchemaFormValues): ChangeProfileRequest {
    const extraAttributes = values.extraAttributes
        ? Object.fromEntries(
              Object.entries(values.extraAttributes).map(([key, value]) => [
                  key,
                  value == null ? "" : String(value),
              ]),
          )
        : undefined;

    return {
        businessName: values.businessName,
        phone: values.phone,
        email: values.email,
        extraAttributes,
    };
}

export function extractReturnHighlights(
    returnItems?: { fieldCode: string; reason: string }[],
): Record<string, string> {
    if (!returnItems?.length) {
        return {};
    }
    return Object.fromEntries(returnItems.map((item) => [item.fieldCode, item.reason]));
}

// keep registry referenced for tree-shaking tests
void getFieldMeta;
