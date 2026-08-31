"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Progress, Space, Tag, Typography, message, Modal } from "antd";
import { ReloadOutlined, CheckCircleFilled, MinusCircleOutlined } from "@ant-design/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    api,
    ApiError,
    ApplicationConflictError,
    APPLICATION_ID_STORAGE_KEY,
    EDITABLE_APPLICATION_STATUSES,
    REAPPLYABLE_APPLICATION_STATUSES,
    TERMINAL_APPLICATION_STATUSES,
    parseApplicationId,
    type ApplicationDocument,
    type ApplicationSchemaDto,
    type MerchantApplication,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import ApplicationStatusSummary from "@/components/onboarding/ApplicationStatusSummary";
import ApplicationStatusTimeline from "@/components/onboarding/ApplicationStatusTimeline";
import { formatOnboardingDateTime } from "@/components/onboarding/onboarding-status-ui";
import { buildDraftProgress } from "@/lib/api/domains/onboarding/draft-progress";
import { REGISTRATION_COUNTRY_GROUPS } from "@/lib/onboarding/registration-countries";
import { formatSettlementCurrencyLabel } from "@/lib/onboarding/settlement-currency";
import styles from "./onboarding-status.module.css";

function readStoredApplicationId(): string | null {
    try {
        return parseApplicationId(window.localStorage.getItem(APPLICATION_ID_STORAGE_KEY));
    } catch {
        return null;
    }
}

export default function OnboardingStatusPage() {
    const t = useTranslations("Onboarding");
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const [application, setApplication] = useState<MerchantApplication | null>(null);
    const [schema, setSchema] = useState<ApplicationSchemaDto | null>(null);
    const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [reapplying, setReapplying] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [storedApplicationId, setStoredApplicationId] = useState<string | null>(null);
    const [storageReady, setStorageReady] = useState(false);

    const queryApplicationId = parseApplicationId(searchParams.get("id"));
    const desiredStep = Number(searchParams.get("step"));
    const applicationId = queryApplicationId ?? storedApplicationId;

    useEffect(() => {
        if (queryApplicationId) {
            setStoredApplicationId(null);
            setStorageReady(true);
            return;
        }
        setStoredApplicationId(readStoredApplicationId());
        setStorageReady(true);
    }, [queryApplicationId]);

    const reload = useCallback(async () => {
        if (!storageReady) {
            return;
        }
        if (!accessToken) {
            setApplication(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { application: loaded, discardedPreferredId } =
                await api.onboarding.resolveAccessible(accessToken, applicationId);

            if (discardedPreferredId) {
                localStorage.removeItem(APPLICATION_ID_STORAGE_KEY);
                setStoredApplicationId(null);
                if (queryApplicationId) {
                    router.replace(`/${locale}/dashboard/onboarding/status`);
                }
                if (loaded) {
                    message.info(t("errors.staleApplicationCleared"));
                } else {
                    message.warning(t("errors.applicationAccessDenied"));
                }
            }

            if (loaded) {
                setApplication(loaded);
                localStorage.setItem(APPLICATION_ID_STORAGE_KEY, loaded.id);
                if (!applicationId || discardedPreferredId) {
                    setStoredApplicationId(loaded.id);
                }
            } else {
                setApplication(null);
            }
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("errors.generic"));
        } finally {
            setLoading(false);
        }
    }, [accessToken, applicationId, locale, queryApplicationId, router, storageReady, t]);

    useEffect(() => {
        if (!accessToken) {
            signIn();
            return;
        }
        if (!storageReady) {
            return;
        }
        reload();
    }, [accessToken, reload, storageReady]);

    useEffect(() => {
        if (!accessToken || !application?.id || !application.profile?.registrationCountry) {
            setSchema(null);
            setDocuments([]);
            return;
        }

        let active = true;
        (async () => {
            try {
                const [loadedSchema, loadedDocuments] = await Promise.all([
                    api.onboarding.getSchema(
                        accessToken,
                        application.profile?.registrationCountry ?? "CN",
                        application.profile?.merchantType ?? "LEGAL_ENTITY",
                    ),
                    api.onboarding.listDocuments(accessToken, application.id),
                ]);
                if (!active) {
                    return;
                }
                setSchema(loadedSchema);
                setDocuments(loadedDocuments);
            } catch {
                if (!active) {
                    return;
                }
                setSchema(null);
                setDocuments([]);
            }
        })();

        return () => {
            active = false;
        };
    }, [accessToken, application?.id, application?.profile?.merchantType, application?.profile?.registrationCountry]);

    const isEditable = application && EDITABLE_APPLICATION_STATUSES.includes(application.status);
    const isCompleted = application?.status === "COMPLETED";
    const isDraft = application?.status === "DRAFT";
    const isReapplyable = application && REAPPLYABLE_APPLICATION_STATUSES.includes(application.status);
    const isCancelled = application?.status === "CANCELLED";
    const canCancel =
        application &&
        (application.status === "SUBMITTED" || application.status === "RETURNED");
    const showRefresh = application && !TERMINAL_APPLICATION_STATUSES.includes(application.status);

    const countryLabel = useMemo(() => {
        const code = application?.profile?.registrationCountry;
        if (!code) {
            return undefined;
        }
        const labelKey = REGISTRATION_COUNTRY_GROUPS.flatMap((group) => group.options).find(
            (item) => item.value === code,
        )?.labelKey;
        return labelKey ? t(`countries.${labelKey}`) : code;
    }, [application?.profile?.registrationCountry, t]);

    const draftProgress = useMemo(() => {
        if (!isDraft) {
            return null;
        }
        return buildDraftProgress({
            profile: application?.profile,
            status: application?.status ?? "DRAFT",
            schema,
            documents,
            countryLabel,
            locale,
            t,
            formatCurrency: (code) => formatSettlementCurrencyLabel(code, locale),
        });
    }, [application?.profile, application?.status, countryLabel, documents, isDraft, locale, schema, t]);

    const savedAtLabel = useMemo(() => {
        const savedAt = application?.updatedAt ?? application?.createdAt;
        return savedAt ? formatOnboardingDateTime(savedAt, locale) : undefined;
    }, [application?.createdAt, application?.updatedAt, locale]);

    const continueHref = useMemo(() => {
        if (!application) {
            return `/${locale}/dashboard/onboarding/apply`;
        }
        const step = draftProgress?.nextStep ?? 0;
        return `/${locale}/dashboard/onboarding/apply?id=${application.id}&step=${step}`;
    }, [application, draftProgress?.nextStep, locale]);

    const handleReapply = async () => {
        if (!accessToken || !application) return;
        setReapplying(true);
        try {
            localStorage.removeItem(APPLICATION_ID_STORAGE_KEY);
            const created = await api.onboarding.createOrLoad(accessToken, {
                applicationType: application.applicationType,
                registrationCountry: application.profile?.registrationCountry ?? "CN",
                merchantType: application.profile?.merchantType ?? "LEGAL_ENTITY",
            });
            localStorage.setItem(APPLICATION_ID_STORAGE_KEY, created.id);
            message.success(t("reapplySuccess"));
            router.push(`/${locale}/dashboard/onboarding/apply?id=${created.id}`);
        } catch (err) {
            if (err instanceof ApplicationConflictError) {
                message.error(t("errors.conflict"));
            } else {
                message.error(err instanceof ApiError ? err.message : t("errors.generic"));
            }
        } finally {
            setReapplying(false);
        }
    };

    const handleCancel = () => {
        if (!accessToken || !application) return;
        const isDraftCancel = application.status === "DRAFT";
        Modal.confirm({
            title: isDraftCancel ? t("draftStatus.discardConfirmTitle") : t("cancelConfirmTitle"),
            content: isDraftCancel ? t("draftStatus.discardConfirmContent") : t("cancelConfirmContent"),
            okText: isDraftCancel ? t("draftStatus.discardConfirmOk") : t("cancelConfirmOk"),
            cancelText: t("cancelConfirmDismiss"),
            okButtonProps: { danger: true },
            onOk: async () => {
                setCancelling(true);
                try {
                    await api.onboarding.cancel(accessToken, application.id);
                    localStorage.removeItem(APPLICATION_ID_STORAGE_KEY);
                    message.success(isDraftCancel ? t("draftStatus.discardSuccess") : t("cancelSuccess"));
                    await reload();
                } catch (err) {
                    message.error(err instanceof ApiError ? err.message : t("errors.generic"));
                } finally {
                    setCancelling(false);
                }
            },
        });
    };

    const cancelledDescription = application?.submittedAt
        ? t("cancelledDescriptionWithTime", {
              time: formatOnboardingDateTime(application.submittedAt, locale),
          })
        : t("reapplyDescription");

    return (
        <DashboardPage
            title={t("statusTitle")}
            subtitle={
                application
                    ? isDraft
                        ? t("statusSubtitleDraft")
                        : t("statusSubtitle", { status: t(`status.${application.status}`) })
                    : undefined
            }
        >
            {loading ? (
                <div className={styles.statusPageContent}>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryCardBody}>...</div>
                    </div>
                </div>
            ) : application ? (
                <div className={styles.statusPageContent}>
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        {isCompleted ? (
                            <Alert
                                type="success"
                                showIcon
                                message={t("completedTitle")}
                                description={t("completedDescription")}
                                action={
                                    <Button
                                        size="small"
                                        onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
                                    >
                                        {t("relogin")}
                                    </Button>
                                }
                            />
                        ) : null}

                        {application.status === "PROVISION_FAILED" && application.lastProvisionErrorCode ? (
                            <Alert
                                type="error"
                                showIcon
                                message={t("provisionFailed")}
                                description={application.lastProvisionErrorCode}
                            />
                        ) : null}

                        {isCancelled ? (
                            <Alert
                                type="info"
                                showIcon
                                message={t(`status.${application.status}`)}
                                description={cancelledDescription}
                            />
                        ) : isReapplyable && application.status === "REJECTED" ? (
                            <Alert
                                type="info"
                                showIcon
                                message={t(`status.${application.status}`)}
                                description={t("reapplyDescription")}
                            />
                        ) : null}

                        {!isCancelled && !isDraft ? (
                            <ApplicationStatusSummary application={application} locale={locale} />
                        ) : null}

                        {isDraft ? (
                            <>
                                <Alert
                                    type="warning"
                                    showIcon
                                    message={t("draftStatus.savedTitle")}
                                    description={
                                        savedAtLabel
                                            ? t("draftStatus.savedDescriptionWithTime", { time: savedAtLabel })
                                            : t("draftStatus.savedDescription")
                                    }
                                />
                                <div className={styles.timelineCard}>
                                    <div className={styles.timelineCardHeader}>
                                        {t("draftStatus.progressTitle")}
                                    </div>
                                    <div className={styles.timelineCardBody}>
                                        <div className={styles.draftProgressHeader}>
                                            <Typography.Text strong>
                                                {t("draftStatus.progressLabel", {
                                                    percent: draftProgress?.percent ?? 0,
                                                })}
                                            </Typography.Text>
                                        </div>
                                        <Progress percent={draftProgress?.percent ?? 0} showInfo={false} />
                                        <div className={styles.draftSteps}>
                                            {draftProgress?.steps.map((step) => (
                                                <div key={step.key} className={styles.draftStepRow}>
                                                    <div className={styles.draftStepMain}>
                                                        <div className={styles.draftStepTitleRow}>
                                                            {step.done ? (
                                                                <CheckCircleFilled
                                                                    style={{ color: "#52c41a", fontSize: 16 }}
                                                                />
                                                            ) : (
                                                                <MinusCircleOutlined
                                                                    style={{ color: "#bfbfbf", fontSize: 16 }}
                                                                />
                                                            )}
                                                            <Typography.Text strong>
                                                                {t("draftStatus.stepLabel", {
                                                                    step: step.key + 1,
                                                                    title: step.title,
                                                                })}
                                                            </Typography.Text>
                                                            <Tag color={step.done ? "success" : "default"}>
                                                                {step.done
                                                                    ? t("draftStatus.done")
                                                                    : t("draftStatus.pending")}
                                                            </Tag>
                                                        </div>
                                                        <Typography.Text type="secondary">
                                                            {step.description}
                                                        </Typography.Text>
                                                        {step.missing?.length ? (
                                                            <div className={styles.draftMissingList}>
                                                                <Typography.Text type="secondary">
                                                                    {t("draftStatus.missingLabel", {
                                                                        fields: step.missing.join("、"),
                                                                    })}
                                                                </Typography.Text>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                    <Link
                                                        href={`/${locale}/dashboard/onboarding/apply?id=${application.id}&step=${step.key}`}
                                                    >
                                                        <Button type="link">
                                                            {step.done
                                                                ? t("draftStatus.editStep")
                                                                : t("draftStatus.completeStep")}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={styles.timelineCard}>
                                <div className={styles.timelineCardHeader}>
                                    {isCancelled ? t("timeline.historyTitle") : t("timelineTitle")}
                                </div>
                                <div className={styles.timelineCardBody}>
                                    <ApplicationStatusTimeline application={application} />
                                </div>
                            </div>
                        )}

                        <div className={styles.actionsBar}>
                            <div className={styles.actionsGroup}>
                                {isEditable ? (
                                    <Link href={continueHref}>
                                        <Button type="primary">
                                            {isDraft ? t("draftStatus.continueEditing") : t("editApplication")}
                                        </Button>
                                    </Link>
                                ) : null}
                                {isReapplyable ? (
                                    <Button type="primary" loading={reapplying} onClick={handleReapply}>
                                        {t("reapply")}
                                    </Button>
                                ) : null}
                            </div>
                            <div className={styles.actionsGroup}>
                                {isDraft ? (
                                    <Button danger loading={cancelling} onClick={handleCancel}>
                                        {t("draftStatus.discard")}
                                    </Button>
                                ) : null}
                                {canCancel ? (
                                    <Button danger loading={cancelling} onClick={handleCancel}>
                                        {t("cancel")}
                                    </Button>
                                ) : null}
                                {showRefresh && !isDraft ? (
                                    <Button icon={<ReloadOutlined />} onClick={reload}>
                                        {t("refresh")}
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    </Space>
                </div>
            ) : (
                <Alert
                    type="info"
                    message={t("noApplication")}
                    action={
                        <Link href={`/${locale}/dashboard/onboarding/apply`}>
                            <Button size="small">{t("startApplication")}</Button>
                        </Link>
                    }
                />
            )}
        </DashboardPage>
    );
}
