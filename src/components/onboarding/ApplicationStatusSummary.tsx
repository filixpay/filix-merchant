"use client";

import { Button, Descriptions, Space, Tag, Typography, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { MerchantApplication } from "@/lib/api/domains/onboarding";
import {
    formatApplicationIdDisplay,
    formatOnboardingDateTime,
    getOnboardingStatusTagColor,
} from "@/components/onboarding/onboarding-status-ui";
import styles from "@/app/[locale]/dashboard/onboarding/status/onboarding-status.module.css";

type ApplicationStatusSummaryProps = {
    application: MerchantApplication;
    locale: string;
};

export default function ApplicationStatusSummary({
    application,
    locale,
}: ApplicationStatusSummaryProps) {
    const t = useTranslations("Onboarding");

    const handleCopyId = async () => {
        try {
            await navigator.clipboard.writeText(application.id);
            message.success(t("statusSummary.copySuccess"));
        } catch {
            message.error(t("statusSummary.copyFailed"));
        }
    };

    const applicationTypeLabel =
        application.applicationType === "UPGRADE"
            ? t("statusSummary.applicationTypeUpgrade")
            : t("statusSummary.applicationTypeNew");

    const submittedAtLabel = application.submittedAt
        ? formatOnboardingDateTime(application.submittedAt, locale)
        : t("statusSummary.notSubmitted");

    return (
        <div className={styles.summaryCard}>
            <div className={styles.summaryCardHeader}>{t("statusSummary.title")}</div>
            <div className={styles.summaryCardBody}>
                <Descriptions column={{ xs: 1, sm: 2 }} size="middle">
                    <Descriptions.Item label={t("statusSummary.applicationId")}>
                        <Space size={8}>
                            <Typography.Text code>{formatApplicationIdDisplay(application.id)}</Typography.Text>
                            <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                aria-label={t("statusSummary.copyId")}
                                onClick={handleCopyId}
                            />
                        </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label={t("statusSummary.applicationType")}>
                        {applicationTypeLabel}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("statusSummary.submittedAt")}>
                        {submittedAtLabel}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("statusSummary.currentStatus")}>
                        <Tag color={getOnboardingStatusTagColor(application.status)}>
                            {t(`status.${application.status}`)}
                        </Tag>
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </div>
    );
}
