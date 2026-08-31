"use client";

import type { ReactNode } from "react";
import { Button } from "antd";
import { EditOutlined, FileOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { ApplicationDocument, ApplicationProfile, ApplicationSchemaDto } from "@/lib/api/domains/onboarding";
import { getFieldMeta } from "@/lib/api/domains/onboarding";
import { formatSettlementCurrencyLabel } from "@/lib/onboarding/settlement-currency";
import { formatFileSize } from "@/lib/utils/format-file-size";
import styles from "@/app/[locale]/dashboard/onboarding/apply/onboarding-apply.module.css";

type OnboardingConfirmSummaryProps = {
    profile: ApplicationProfile;
    schema: ApplicationSchemaDto;
    documents: ApplicationDocument[];
    countryLabel: string;
    merchantTypeLabel: string;
    locale: string;
    onEditStep: (step: number) => void;
};

function SummaryItem({ label, value }: { label: string; value?: string | null }) {
    if (!value) {
        return null;
    }
    return (
        <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>{label}</span>
            <span className={styles.summaryValue}>{value}</span>
        </div>
    );
}

function SummaryCard({
    title,
    onEdit,
    editLabel,
    children,
}: {
    title: string;
    onEdit: () => void;
    editLabel: string;
    children: ReactNode;
}) {
    return (
        <div className={styles.summaryCard}>
            <div className={styles.summaryCardHeader}>
                <span className={styles.summaryCardTitle}>{title}</span>
                <Button type="link" size="small" icon={<EditOutlined />} onClick={onEdit}>
                    {editLabel}
                </Button>
            </div>
            <div className={styles.summaryCardBody}>
                <div className={styles.summaryGrid}>{children}</div>
            </div>
        </div>
    );
}

export default function OnboardingConfirmSummary({
    profile,
    schema,
    documents,
    countryLabel,
    merchantTypeLabel,
    locale,
    onEditStep,
}: OnboardingConfirmSummaryProps) {
    const t = useTranslations("Onboarding");
    const extra = profile.extraAttributes ?? {};

    const textFields = schema.fields.filter((field) => (field.type ?? "text") !== "document");
    const documentFields = schema.fields.filter((field) => field.type === "document");

    const settlementLabel = profile.settlementCurrency
        ? `${formatSettlementCurrencyLabel(profile.settlementCurrency, locale)}${
              profile.settlementCurrencyLocked ? ` (${t("settlementCurrencyLockedShort")})` : ""
          }`
        : undefined;

    return (
        <>
            <SummaryCard
                title={t("summary.basicInfo")}
                editLabel={t("editStep")}
                onEdit={() => onEditStep(0)}
            >
                <SummaryItem label={t("countryLabel")} value={countryLabel} />
                <SummaryItem label={t("merchantTypeLabel")} value={merchantTypeLabel} />
                <SummaryItem label={t("settlementCurrencyLabel")} value={settlementLabel} />
            </SummaryCard>

            <SummaryCard
                title={t("summary.qualification")}
                editLabel={t("editStep")}
                onEdit={() => onEditStep(1)}
            >
                <SummaryItem label={t("fields.businessName")} value={profile.businessName} />
                <SummaryItem label={t("fields.phone")} value={profile.phone} />
                <SummaryItem label={t("fields.email")} value={profile.email} />
                {textFields
                    .filter((field) => !["registrationCountry"].includes(field.name))
                    .filter((field) => !["businessName", "phone", "email"].includes(field.name))
                    .map((field) => {
                        const meta = getFieldMeta(field.name);
                        const label = meta ? t(meta.labelKey) : (field.label ?? field.name);
                        const value = extra[field.name];
                        if (value == null || value === "") {
                            return null;
                        }
                        return <SummaryItem key={field.name} label={label} value={String(value)} />;
                    })}
                {documentFields.map((field) => {
                    const meta = getFieldMeta(field.name);
                    const label = meta ? t(meta.labelKey) : (field.label ?? field.name);
                    const document = documents.find((item) => item.fieldCode === field.name);
                    if (!document) {
                        return (
                            <div key={field.name} className={styles.summaryItem}>
                                <span className={styles.summaryLabel}>{label}</span>
                                <span className={styles.summaryValue}>{t("documentMissing")}</span>
                            </div>
                        );
                    }
                    return (
                        <div key={field.name} className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>{label}</span>
                            <span className={styles.summaryDocument}>
                                <FileOutlined />
                                {document.fileName} ({formatFileSize(document.sizeBytes)})
                            </span>
                        </div>
                    );
                })}
            </SummaryCard>
        </>
    );
}
