"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Space, message } from "antd";
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
    type MerchantApplication,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import ApplicationStatusTimeline from "@/components/onboarding/ApplicationStatusTimeline";

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
    const [loading, setLoading] = useState(true);
    const [reapplying, setReapplying] = useState(false);
    const [storedApplicationId, setStoredApplicationId] = useState<string | null>(null);
    const [storageReady, setStorageReady] = useState(false);

    const queryApplicationId = parseApplicationId(searchParams.get("id"));
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
            let loaded: MerchantApplication | null = null;
            if (applicationId) {
                loaded = await api.onboarding.get(accessToken, applicationId);
            } else {
                loaded = await api.onboarding.getCurrent(accessToken);
            }
            if (loaded) {
                setApplication(loaded);
                localStorage.setItem(APPLICATION_ID_STORAGE_KEY, loaded.id);
                if (!applicationId) {
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
    }, [accessToken, applicationId, storageReady, t]);

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

    const isEditable = application && EDITABLE_APPLICATION_STATUSES.includes(application.status);
    const isCompleted = application?.status === "COMPLETED";
    const isReapplyable = application && REAPPLYABLE_APPLICATION_STATUSES.includes(application.status);

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

    return (
        <DashboardPage title={t("statusTitle")} subtitle={application ? t(`status.${application.status}`) : undefined}>
            {loading ? (
                <Card loading />
            ) : application ? (
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    {isCompleted ? (
                        <Alert
                            type="success"
                            showIcon
                            message={t("completedTitle")}
                            description={t("completedDescription")}
                            action={
                                <Button size="small" onClick={() => signOut({ callbackUrl: `/${locale}/login` })}>
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

                    {isReapplyable ? (
                        <Alert
                            type="info"
                            showIcon
                            message={t(`status.${application.status}`)}
                            description={t("reapplyDescription")}
                        />
                    ) : null}

                    <Card title={t("timelineTitle")}>
                        <ApplicationStatusTimeline application={application} />
                    </Card>

                    <Space>
                        {isEditable ? (
                            <Link href={`/${locale}/dashboard/onboarding/apply?id=${application.id}`}>
                                <Button type="primary">{t("editApplication")}</Button>
                            </Link>
                        ) : null}
                        {application.status === "DRAFT" ||
                        application.status === "SUBMITTED" ||
                        application.status === "RETURNED" ? (
                            <Button
                                danger
                                onClick={async () => {
                                    if (!accessToken) return;
                                    try {
                                        await api.onboarding.cancel(accessToken, application.id);
                                        localStorage.removeItem(APPLICATION_ID_STORAGE_KEY);
                                        message.success(t("cancelSuccess"));
                                        setApplication({ ...application, status: "CANCELLED" });
                                    } catch (err) {
                                        message.error(
                                            err instanceof ApiError ? err.message : t("errors.generic"),
                                        );
                                    }
                                }}
                            >
                                {t("cancel")}
                            </Button>
                        ) : null}
                        {!TERMINAL_APPLICATION_STATUSES.includes(application.status) ? (
                            <Button onClick={reload}>{t("refresh")}</Button>
                        ) : null}
                        {isReapplyable ? (
                            <Button type="primary" loading={reapplying} onClick={handleReapply}>
                                {t("reapply")}
                            </Button>
                        ) : null}
                    </Space>
                </Space>
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
