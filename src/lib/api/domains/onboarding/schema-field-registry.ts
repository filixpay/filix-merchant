import type { SchemaFieldDto } from "./types";

export type FieldInputType = "text" | "password";

export type FieldMeta = {
    labelKey: string;
    inputType: FieldInputType;
    required: boolean;
    storage: "core" | "extra";
};

const FIELD_REGISTRY: Record<string, FieldMeta> = {
    businessName: {
        labelKey: "fields.businessName",
        inputType: "text",
        required: true,
        storage: "core",
    },
    phone: {
        labelKey: "fields.phone",
        inputType: "text",
        required: true,
        storage: "core",
    },
    email: {
        labelKey: "fields.email",
        inputType: "text",
        required: true,
        storage: "core",
    },
    uscc: {
        labelKey: "fields.uscc",
        inputType: "text",
        required: true,
        storage: "extra",
    },
    legalPersonIdNumber: {
        labelKey: "fields.legalPersonIdNumber",
        inputType: "text",
        required: true,
        storage: "extra",
    },
    ein: {
        labelKey: "fields.ein",
        inputType: "text",
        required: true,
        storage: "extra",
    },
    stateOfIncorporation: {
        labelKey: "fields.stateOfIncorporation",
        inputType: "text",
        required: true,
        storage: "extra",
    },
    bankName: {
        labelKey: "fields.bankName",
        inputType: "text",
        required: true,
        storage: "extra",
    },
    accountHolderName: {
        labelKey: "fields.accountHolderName",
        inputType: "text",
        required: true,
        storage: "extra",
    },
    accountNumber: {
        labelKey: "fields.accountNumber",
        inputType: "password",
        required: true,
        storage: "extra",
    },
    swiftCode: {
        labelKey: "fields.swiftCode",
        inputType: "text",
        required: true,
        storage: "extra",
    },
    bankCountry: {
        labelKey: "fields.bankCountry",
        inputType: "text",
        required: true,
        storage: "extra",
    },
    businessLicense: {
        labelKey: "fields.businessLicense",
        inputType: "text",
        required: true,
        storage: "extra",
    },
};

export function getFieldMeta(name: string): FieldMeta | undefined {
    return FIELD_REGISTRY[name];
}

export function isKnownField(name: string): boolean {
    return name in FIELD_REGISTRY;
}

export function schemaFieldsWithMeta(fields: SchemaFieldDto[]) {
    return fields.map((field) => ({
        field,
        meta: getFieldMeta(field.name),
    }));
}
