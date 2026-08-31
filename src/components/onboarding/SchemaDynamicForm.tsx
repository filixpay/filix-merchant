"use client";

import { useEffect, type ReactNode } from "react";
import { Form, Input, Button, Space } from "antd";
import type { FormInstance, Rule } from "antd/es/form";
import { useTranslations } from "next-intl";
import type { ApplicationDocument, ApplicationSchemaDto } from "@/lib/api/domains/onboarding";
import { getFieldMeta, schemaFieldsWithMeta } from "@/lib/api/domains/onboarding";
import { organizeOnboardingFieldRows } from "@/lib/api/domains/onboarding/onboarding-field-layout";
import type { ChangeProfileRequest } from "@/lib/api/domains/maintenance";
import ApplicationDocumentField from "@/components/onboarding/ApplicationDocumentField";
import styles from "@/app/[locale]/dashboard/onboarding/apply/onboarding-apply.module.css";

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

    const filteredFields = filterSchemaFields(schema, mode, editable);
    const fieldRows =
        mode === "onboarding"
            ? organizeOnboardingFieldRows(filteredFields)
            : filteredFields.map((field) => [field]);
    const fieldsWithMeta = schemaFieldsWithMeta(filteredFields);
    const metaByName = new Map(fieldsWithMeta.map(({ field, meta }) => [field.name, meta]));
    const fieldByName = new Map(filteredFields.map((field) => [field.name, field]));
    const showActions = editable && (showDefaultSubmit || Boolean(extraActions));

    const renderField = (fieldName: string) => {
        const field = fieldByName.get(fieldName);
        if (!field) {
            return null;
        }
        const meta = metaByName.get(field.name);
        const label = meta ? t(meta.labelKey) : (field.label ?? field.name);
        const required = editable ? (field.required ?? meta?.required ?? false) : false;
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
        const rules: Rule[] = [];
        if (required) {
            rules.push({ required: true, message: t("validation.required") });
        }
        if (meta?.maxLength) {
            rules.push({
                max: meta.maxLength,
                message: t("validation.maxLength", { max: meta.maxLength }),
            });
        }
        const control =
            meta?.inputType === "textarea" ? (
                <Input.TextArea
                    rows={4}
                    maxLength={meta.maxLength}
                    showCount={Boolean(meta.maxLength)}
                    autoComplete="off"
                    readOnly={!editable}
                    placeholder={
                        meta.labelKey === "fields.businessDescription"
                            ? t("fields.businessDescriptionPlaceholder")
                            : undefined
                    }
                />
            ) : (
                <Input type={inputType} autoComplete="off" readOnly={!editable} />
            );

        const itemProps = {
            key: field.name,
            label,
            required,
            rules,
            validateStatus: highlight ? ("error" as const) : undefined,
            help: highlight,
        };

        if (field.storage === "core") {
            return (
                <Form.Item
                    {...itemProps}
                    name={field.name as "businessName" | "phone" | "email"}
                >
                    {control}
                </Form.Item>
            );
        }

        return (
            <Form.Item {...itemProps} name={["extraAttributes", field.name]}>
                {control}
            </Form.Item>
        );
    };

    return (
        <Form
            form={form}
            layout="vertical"
            disabled={!editable}
            initialValues={profileValues}
            onFinish={onSubmit}
        >
            <div className={mode === "onboarding" ? styles.formGrid : undefined}>
                {fieldRows.map((row, rowIndex) =>
                    row.map((field) => {
                        const isFullWidth =
                            mode !== "onboarding" || row.length === 1;
                        return (
                            <div
                                key={`${rowIndex}-${field.name}`}
                                className={isFullWidth ? styles.formGridFull : undefined}
                            >
                                {renderField(field.name)}
                            </div>
                        );
                    }),
                )}
            </div>

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

void getFieldMeta;
