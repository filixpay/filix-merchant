"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Checkbox, Select, Space, Steps, message } from "antd";
import { useSession, signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import {
    api,
    ApiError,
    ApplicationConflictError,
    APPLICATION_ID_STORAGE_KEY,
    EDITABLE_APPLICATION_STATUSES,
    TERMINAL_APPLICATION_STATUSES,
    parseApplicationId,
    type ApplicationDocument,
    type ApplicationSchemaDto,
    type ApplicationType,
    type MerchantApplication,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import SchemaDynamicForm, {
    buildProfileRequest,
    extractReturnHighlights,
    getMissingRequiredDocumentFieldCodes,
    type SchemaFormValues,
} from "@/components/onboarding/SchemaDynamicForm";
import { canUpgradeToFormal } from "@/lib/merchant/merchant-tier";
import { SETTLEMENT_CURRENCY_OPTIONS, formatSettlementCurrencyLabel } from "@/lib/onboarding/settlement-currency";

const COUNTRY_OPTIONS = [
    { value: "CN", label: "China (CN)" },
    { value: "US", label: "United States (US)" },
];

export default function OnboardingApplyPage() {
    const t = useTranslations("Onboarding");
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [country, setCountry] = useState("CN");
    const [settlementCurrency, setSettlementCurrency] = useState<string>("USD");
    const [settlementConfirmed, setSettlementConfirmed] = useState(false);
    const [schema, setSchema] = useState<ApplicationSchemaDto | null>(null);
    const [application, setApplication] = useState<MerchantApplication | null>(null);
    const [applicationType, setApplicationType] = useState<ApplicationType>("NEW");
    const [documents, setDocuments] = useState<ApplicationDocument[]>([]);

    const queryApplicationId = searchParams.get("id");
    const forceUpgrade = searchParams.get("type") === "UPGRADE";

    const highlightFields = useMemo(() => {
        const latestReview = application?.reviews?.[application.reviews.length - 1];
        return extractReturnHighlights(latestReview?.returnItems);
    }, [application?.reviews]);

    const loadDocuments = useCallback(async () => {
        if (!accessToken || !application?.id) {
            setDocuments([]);
            return;
        }
        try {
            const loaded = await api.onboarding.listDocuments(accessToken, application.id);
            setDocuments(loaded);
        } catch (err) {
            console.error(err);
        }
    }, [accessToken, application?.id]);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    const loadExisting = useCallback(
        async (id: string) => {
            if (!accessToken) return;
            const loaded = await api.onboarding.get(accessToken, id);
            setApplication(loaded);
            if (loaded.profile?.registrationCountry) {
                setCountry(loaded.profile.registrationCountry);
            }
            if (loaded.profile?.settlementCurrency) {
                setSettlementCurrency(loaded.profile.settlementCurrency);
            }
            if (!EDITABLE_APPLICATION_STATUSES.includes(loaded.status)) {
                router.replace(`/${locale}/dashboard/onboarding/status?id=${loaded.id}`);
                return;
            }
            if (loaded.profile?.registrationCountry) {
                const loadedSchema = await api.onboarding.getSchema(
                    accessToken,
                    loaded.profile.registrationCountry,
                    "LEGAL_ENTITY",
                );
                setSchema(loadedSchema);
                setStep(1);
            }
        },
        [accessToken, locale, router],
    );

    useEffect(() => {
        if (!accessToken) return;

        (async () => {
            try {
                const merchant = await api.merchants.getDetail(accessToken);
                const resolvedType: ApplicationType =
                    forceUpgrade || canUpgradeToFormal(merchant) ? "UPGRADE" : "NEW";
                setApplicationType(resolvedType);

                const preferredId =
                    parseApplicationId(queryApplicationId) ??
                    parseApplicationId(localStorage.getItem(APPLICATION_ID_STORAGE_KEY));
                if (preferredId) {
                    const { application: resolved, discardedPreferredId } =
                        await api.onboarding.resolveAccessible(accessToken, preferredId);
                    if (discardedPreferredId) {
                        localStorage.removeItem(APPLICATION_ID_STORAGE_KEY);
                        if (queryApplicationId) {
                            router.replace(
                                forceUpgrade
                                    ? `/${locale}/dashboard/onboarding/apply?type=UPGRADE`
                                    : `/${locale}/dashboard/onboarding/apply`,
                            );
                        }
                    }
                    if (!resolved) {
                        return;
                    }
                    if (
                        !queryApplicationId &&
                        !discardedPreferredId &&
                        TERMINAL_APPLICATION_STATUSES.includes(resolved.status)
                    ) {
                        localStorage.removeItem(APPLICATION_ID_STORAGE_KEY);
                        return;
                    }
                    await loadExisting(resolved.id);
                    return;
                }

                const current = await api.onboarding.getCurrent(accessToken);
                if (current) {
                    localStorage.setItem(APPLICATION_ID_STORAGE_KEY, current.id);
                    await loadExisting(current.id);
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [accessToken, forceUpgrade, loadExisting, queryApplicationId]);

    const handleCountryNext = async () => {
        if (!accessToken) {
            signIn();
            return;
        }
        if (!settlementCurrency) {
            message.error(t("settlementCurrencyRequired"));
            return;
        }
        setLoading(true);
        try {
            const loadedSchema = await api.onboarding.getSchema(accessToken, country, "LEGAL_ENTITY");
            setSchema(loadedSchema);
            const created = await api.onboarding.createOrLoad(accessToken, {
                applicationType,
                registrationCountry: country,
                merchantType: "LEGAL_ENTITY",
            });
            const withCurrency = await api.onboarding.updateProfile(accessToken, created.id, {
                registrationCountry: country,
                merchantType: "LEGAL_ENTITY",
                settlementCurrency,
            });
            setApplication(withCurrency);
            localStorage.setItem(APPLICATION_ID_STORAGE_KEY, created.id);
            setStep(1);
        } catch (err) {
            if (err instanceof ApplicationConflictError) {
                const conflictId =
                    err.existingApplication?.id ??
                    parseApplicationId(localStorage.getItem(APPLICATION_ID_STORAGE_KEY));
                if (conflictId) {
                    localStorage.setItem(APPLICATION_ID_STORAGE_KEY, conflictId);
                    await loadExisting(conflictId);
                } else {
                    message.error(t("errors.conflict"));
                }
            } else if (err instanceof ApiError) {
                message.error(err.message);
            } else {
                message.error(t("errors.generic"));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAndContinue = async (values: SchemaFormValues) => {
        if (!accessToken || !application || !schema) return;
        const missingDocuments = getMissingRequiredDocumentFieldCodes(schema, documents);
        if (missingDocuments.length > 0) {
            message.error(t("documentsRequired"));
            return;
        }
        setLoading(true);
        try {
            const updated = await api.onboarding.updateProfile(accessToken, application.id, {
                ...buildProfileRequest(schema, values),
                settlementCurrency: application.profile?.settlementCurrency ?? settlementCurrency,
            });
            setApplication(updated);
            setSettlementConfirmed(false);
            setStep(2);
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("errors.generic"));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!accessToken || !application || !schema) return;
        if (!settlementConfirmed) {
            message.error(t("settlementConfirmRequired"));
            return;
        }
        const missingDocuments = getMissingRequiredDocumentFieldCodes(schema, documents);
        if (missingDocuments.length > 0) {
            message.error(t("documentsRequired"));
            return;
        }
        setLoading(true);
        try {
            const submitted = await api.onboarding.submit(accessToken, application.id);
            const id = submitted?.id ?? application.id;
            setApplication(submitted ?? { ...application, status: "SUBMITTED" });
            localStorage.setItem(APPLICATION_ID_STORAGE_KEY, id);
            message.success(t("submitSuccess"));
            router.push(`/${locale}/dashboard/onboarding/status?id=${id}`);
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("errors.generic"));
        } finally {
            setLoading(false);
        }
    };

    const displaySettlement = application?.profile?.settlementCurrency ?? settlementCurrency;

    return (
        <DashboardPage
            title={t("applyTitle")}
            subtitle={applicationType === "UPGRADE" ? t("upgradeSubtitle") : t("newSubtitle")}
        >
            {application?.status === "RETURNED" && application.returnedReason ? (
                <Alert type="warning" showIcon message={application.returnedReason} style={{ marginBottom: 16 }} />
            ) : null}

            <Steps
                current={step}
                style={{ marginBottom: 24 }}
                items={[
                    { title: t("steps.country") },
                    { title: t("steps.profile") },
                    { title: t("steps.confirm") },
                ]}
            />

            {step === 0 ? (
                <Card>
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        <div>
                            <div style={{ marginBottom: 8 }}>{t("countryLabel")}</div>
                            <Select
                                style={{ width: "100%", maxWidth: 360 }}
                                options={COUNTRY_OPTIONS}
                                value={country}
                                onChange={setCountry}
                            />
                        </div>
                        <div>
                            <div style={{ marginBottom: 8 }}>{t("settlementCurrencyLabel")}</div>
                            <Select
                                style={{ width: "100%", maxWidth: 360 }}
                                showSearch
                                optionFilterProp="label"
                                options={SETTLEMENT_CURRENCY_OPTIONS.map((item) => ({
                                    value: item.value,
                                    label: formatSettlementCurrencyLabel(item.value, locale),
                                }))}
                                value={settlementCurrency}
                                onChange={setSettlementCurrency}
                            />
                            <Alert
                                type="info"
                                showIcon
                                style={{ marginTop: 12, maxWidth: 560 }}
                                message={t("settlementCurrencyHint")}
                            />
                        </div>
                        <Button type="primary" loading={loading} onClick={handleCountryNext}>
                            {t("continue")}
                        </Button>
                    </Space>
                </Card>
            ) : null}

            {step === 1 && schema ? (
                <Card>
                    <Alert
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                        message={`${t("settlementCurrencyLabel")}: ${displaySettlement}`}
                        description={t("settlementCurrencyHint")}
                    />
                    <SchemaDynamicForm
                        schema={schema}
                        initialProfile={application?.profile}
                        highlightFields={highlightFields}
                        loading={loading}
                        submitLabel={t("saveAndContinue")}
                        onSubmit={handleSaveAndContinue}
                        applicationId={application?.id}
                        documents={documents}
                        onDocumentsChange={loadDocuments}
                    />
                </Card>
            ) : null}

            {step === 2 && application?.profile ? (
                <Card>
                    <Space direction="vertical" size="middle">
                        <div>{t("confirmHint")}</div>
                        <div>
                            <strong>{t("fields.businessName")}:</strong> {application.profile.businessName}
                        </div>
                        <div>
                            <strong>{t("fields.phone")}:</strong> {application.profile.phone}
                        </div>
                        <div>
                            <strong>{t("fields.email")}:</strong> {application.profile.email}
                        </div>
                        <div>
                            <strong>{t("settlementCurrencyLabel")}:</strong> {displaySettlement}
                        </div>
                        <Checkbox
                            checked={settlementConfirmed}
                            onChange={(e) => setSettlementConfirmed(e.target.checked)}
                        >
                            {t("settlementConfirm", { currency: displaySettlement })}
                        </Checkbox>
                        <Space>
                            <Button onClick={() => setStep(1)}>{t("back")}</Button>
                            <Button type="primary" loading={loading} onClick={handleSubmit}>
                                {t("submit")}
                            </Button>
                        </Space>
                    </Space>
                </Card>
            ) : null}
        </DashboardPage>
    );
}
