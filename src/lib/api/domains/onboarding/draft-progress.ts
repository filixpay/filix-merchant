import type { ApplicationDocument, ApplicationProfile, ApplicationSchemaDto } from "@/lib/api/domains/onboarding";
import { getFieldMeta } from "@/lib/api/domains/onboarding";

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

export type DraftProgressStep = {
    key: number;
    title: string;
    done: boolean;
    description: string;
    missing?: string[];
};

export type DraftProgress = {
    percent: number;
    steps: DraftProgressStep[];
    nextStep: number;
};

type BuildDraftProgressInput = {
    profile?: ApplicationProfile;
    status: string;
    schema: ApplicationSchemaDto | null;
    documents: ApplicationDocument[];
    countryLabel?: string;
    locale: string;
    t: (key: string, values?: Record<string, string | number>) => string;
    formatCurrency: (code: string) => string;
};

export function buildDraftProgress({
    profile,
    status,
    schema,
    documents,
    countryLabel,
    t,
    formatCurrency,
}: BuildDraftProgressInput): DraftProgress | null {
    if (!profile) {
        return null;
    }

    const extra = profile.extraAttributes ?? {};
    const requiredTextFields =
        schema?.fields.filter((field) => (field.type ?? "text") !== "document").filter((field) => {
            const meta = getFieldMeta(field.name);
            return field.required ?? meta?.required ?? false;
        }) ?? [];
    const requiredDocumentFields =
        schema?.fields.filter((field) => {
            const meta = getFieldMeta(field.name);
            return (field.type ?? "text") === "document" && (field.required ?? meta?.required ?? false);
        }) ?? [];
    const uploaded = new Set(documents.map((document) => document.fieldCode));
    const registrationIdField = schema?.fields.find((field) => REGISTRATION_ID_FIELDS.has(field.name));

    const hasFieldValue = (fieldName: string) => {
        switch (fieldName) {
            case "registrationCountry":
                return Boolean(profile.registrationCountry);
            case "businessName":
                return Boolean(profile.businessName?.trim());
            case "phone":
                return Boolean(profile.phone?.trim());
            case "email":
                return Boolean(profile.email?.trim());
            default:
                return Boolean(String(extra[fieldName] ?? "").trim());
        }
    };

    const basicDone = Boolean(
        profile.registrationCountry && profile.merchantType && profile.settlementCurrency,
    );
    const missingTextLabels = requiredTextFields
        .filter((field) => !hasFieldValue(field.name))
        .map((field) => {
            const meta = getFieldMeta(field.name);
            return meta ? t(meta.labelKey) : field.label ?? field.name;
        });
    const missingDocumentLabels = requiredDocumentFields
        .filter((field) => !uploaded.has(field.name))
        .map((field) => {
            const meta = getFieldMeta(field.name);
            return meta ? t(meta.labelKey) : field.label ?? field.name;
        });

    const profileDone = basicDone && missingTextLabels.length === 0 && missingDocumentLabels.length === 0;
    const confirmDone = status !== "DRAFT";
    const stepsDone = [basicDone, profileDone, confirmDone];
    const completedSteps = stepsDone.filter(Boolean).length;
    const percent = Math.round((completedSteps / 3) * 100);
    const nextStep = stepsDone.findIndex((done) => !done);
    const resolvedNextStep = nextStep === -1 ? 2 : nextStep;

    const registrationSummary =
        basicDone && countryLabel && profile.settlementCurrency
            ? t("draftStatus.step1Done", {
                  country: countryLabel,
                  currency: formatCurrency(profile.settlementCurrency),
              })
            : t("draftStatus.step1Pending");

    let profileSummary = t("draftStatus.step2Pending");
    const businessName = profile.businessName?.trim();
    const registrationIdValue =
        registrationIdField && extra[registrationIdField.name] != null
            ? String(extra[registrationIdField.name]).trim()
            : "";
    const hasRequiredDocument = requiredDocumentFields.some((field) => uploaded.has(field.name));

    if (profileDone) {
        profileSummary = t("draftStatus.step2Done", {
            businessName: businessName ?? "",
        });
    } else if (businessName || registrationIdValue || hasRequiredDocument) {
        const parts: string[] = [];
        if (businessName) {
            parts.push(t("draftStatus.step2PartialBusinessName", { businessName }));
        }
        if (registrationIdValue && registrationIdField) {
            const meta = getFieldMeta(registrationIdField.name);
            const label = meta ? t(meta.labelKey) : registrationIdField.label ?? registrationIdField.name;
            parts.push(t("draftStatus.step2PartialRegistrationId", { label, value: registrationIdValue }));
        }
        if (hasRequiredDocument) {
            parts.push(t("draftStatus.step2PartialDocumentUploaded"));
        }
        profileSummary = parts.join(t("draftStatus.step2PartialSeparator"));
    }

    return {
        percent,
        nextStep: resolvedNextStep,
        steps: [
            {
                key: 0,
                title: t("steps.country"),
                done: basicDone,
                description: registrationSummary,
            },
            {
                key: 1,
                title: t("steps.profile"),
                done: profileDone,
                description: profileSummary,
                missing: [...missingTextLabels, ...missingDocumentLabels],
            },
            {
                key: 2,
                title: t("steps.confirm"),
                done: confirmDone,
                description: t("draftStatus.step3Pending"),
            },
        ],
    };
}
