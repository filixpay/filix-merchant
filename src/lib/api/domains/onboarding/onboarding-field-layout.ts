import type { SchemaFieldDto } from "./types";

const REGISTRATION_ID_FIELDS = new Set([
    "uscc",
    "brn",
    "ein",
    "uen",
    "ssmNumber",
    "companyRegistrationNumber",
    "companyNumber",
    "handelsregisterNumber",
    "krsNumber",
    "cnpj",
]);

const CORE_CONTACT_FIELDS = new Set(["businessName", "phone", "email"]);

export function isFullWidthOnboardingField(field: SchemaFieldDto): boolean {
    if ((field.type ?? "text") === "document") {
        return true;
    }
    if (field.name === "businessDescription") {
        return true;
    }
    return false;
}

export function organizeOnboardingFieldRows(fields: SchemaFieldDto[]): SchemaFieldDto[][] {
    const textFields = fields.filter((field) => (field.type ?? "text") !== "document");
    const documentFields = fields.filter((field) => field.type === "document");
    const byName = new Map(textFields.map((field) => [field.name, field]));

    const rows: SchemaFieldDto[][] = [];
    const placed = new Set<string>();

    const businessName = byName.get("businessName");
    const registrationId = textFields.find((field) => REGISTRATION_ID_FIELDS.has(field.name));

    if (businessName && registrationId) {
        rows.push([businessName, registrationId]);
        placed.add(businessName.name);
        placed.add(registrationId.name);
    } else if (businessName) {
        rows.push([businessName]);
        placed.add(businessName.name);
    }

    const phone = byName.get("phone");
    const email = byName.get("email");
    if (phone && email) {
        rows.push([phone, email]);
        placed.add(phone.name);
        placed.add(email.name);
    }

    const businessDescription = byName.get("businessDescription");
    if (businessDescription) {
        rows.push([businessDescription]);
        placed.add(businessDescription.name);
    }

    const remaining = textFields.filter((field) => !placed.has(field.name));
    for (let index = 0; index < remaining.length; index += 1) {
        const current = remaining[index];
        const next = remaining[index + 1];
        if (next && !isFullWidthOnboardingField(current) && !isFullWidthOnboardingField(next)) {
            rows.push([current, next]);
            index += 1;
        } else {
            rows.push([current]);
        }
    }

    for (const document of documentFields) {
        rows.push([document]);
    }

    return rows;
}

export function isCoreContactField(fieldName: string): boolean {
    return CORE_CONTACT_FIELDS.has(fieldName);
}
