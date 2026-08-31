"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Checkbox, Input, Select, Space, Steps, Tag, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
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
import OnboardingConfirmSummary from "@/components/onboarding/OnboardingConfirmSummary";
import { buildDraftProgress } from "@/lib/api/domains/onboarding/draft-progress";
import { canUpgradeToFormal } from "@/lib/merchant/merchant-tier";
import { SETTLEMENT_CURRENCY_OPTIONS, formatSettlementCurrencyLabel } from "@/lib/onboarding/settlement-currency";
import { REGISTRATION_COUNTRY_GROUPS } from "@/lib/onboarding/registration-countries";
import styles from "./onboarding-apply.module.css";

type MerchantTypeChoice = "LEGAL_ENTITY" | "INDIVIDUAL";

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
    const [merchantType, setMerchantType] = useState<MerchantTypeChoice>("LEGAL_ENTITY");
    const [settlementCurrency, setSettlementCurrency] = useState<string>("USD");
    const [settlementConfirmed, setSettlementConfirmed] = useState(false);
    const [schema, setSchema] = useState<ApplicationSchemaDto | null>(null);
    const [application, setApplication] = useState<MerchantApplication | null>(null);
    const [applicationType, setApplicationType] = useState<ApplicationType>("NEW");
    const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
    const [initializing, setInitializing] = useState(true);

    const queryApplicationId = searchParams.get("id");
    const forceUpgrade = searchParams.get("type") === "UPGRADE";
    const stepParam = searchParams.get("step");
    const requestedStep =
        stepParam != null && stepParam !== "" && !Number.isNaN(Number(stepParam))
            ? Number(stepParam)
            : null;

    const highlightFields = useMemo(() => {
        const latestReview = application?.reviews?.[application.reviews.length - 1];
        return extractReturnHighlights(latestReview?.returnItems);
    }, [application?.reviews]);

    const countryLabel = useMemo(() => {
        const code = application?.profile?.registrationCountry ?? country;
        const key = REGISTRATION_COUNTRY_GROUPS.flatMap((group) => group.options).find(
            (item) => item.value === code,
        )?.labelKey;
        return key ? t(`countries.${key}`) : code;
    }, [application?.profile?.registrationCountry, country, t]);

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
            setInitializing(true);
            try {
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

                let loadedSchema: ApplicationSchemaDto | null = null;
                if (loaded.profile?.registrationCountry) {
                    loadedSchema = await api.onboarding.getSchema(
                        accessToken,
                        loaded.profile.registrationCountry,
                        loaded.profile.merchantType ?? "LEGAL_ENTITY",
                    );
                    setSchema(loadedSchema);
                }

                let resolvedStep = 0;
                if (requestedStep !== null && requestedStep >= 0 && requestedStep <= 2) {
                    resolvedStep = requestedStep;
                } else if (loaded.profile?.registrationCountry && loadedSchema) {
                    const progress = buildDraftProgress({
                        profile: loaded.profile,
                        status: loaded.status,
                        schema: loadedSchema,
                        documents: [],
                        countryLabel: loaded.profile.registrationCountry,
                        locale,
                        t,
                        formatCurrency: (code) => formatSettlementCurrencyLabel(code, locale),
                    });
                    resolvedStep = progress?.nextStep ?? 0;
                }
                setStep(resolvedStep);
            } finally {
                setInitializing(false);
            }
        },
        [accessToken, locale, requestedStep, router, t],
    );

    useEffect(() => {
        if (!accessToken) {
            setInitializing(false);
            return;
        }

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
                        setInitializing(false);
                        return;
                    }
                    if (
                        !queryApplicationId &&
                        !discardedPreferredId &&
                        TERMINAL_APPLICATION_STATUSES.includes(resolved.status)
                    ) {
                        localStorage.removeItem(APPLICATION_ID_STORAGE_KEY);
                        setInitializing(false);
                        return;
                    }
                    await loadExisting(resolved.id);
                    return;
                }

                const current = await api.onboarding.getCurrent(accessToken);
                if (current) {
                    localStorage.setItem(APPLICATION_ID_STORAGE_KEY, current.id);
                    await loadExisting(current.id);
                    return;
                }
                setInitializing(false);
            } catch (err) {
                console.error(err);
                setInitializing(false);
            }
        })();
    }, [accessToken, forceUpgrade, loadExisting, queryApplicationId, locale, router]);

    const handleCountryNext = async () => {
        if (!accessToken) {
            signIn();
            return;
        }
        if (merchantType !== "LEGAL_ENTITY") {
            message.info(t("merchantTypes.comingSoon"));
            return;
        }
        if (!isCurrencyLocked && !settlementCurrency) {
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
            const profilePayload: Parameters<typeof api.onboarding.updateProfile>[2] = {
                registrationCountry: country,
                merchantType: "LEGAL_ENTITY",
            };
            if (!isCurrencyLocked) {
                profilePayload.settlementCurrency = settlementCurrency;
            }
            const withCurrency = await api.onboarding.updateProfile(
                accessToken,
                created.id,
                profilePayload,
            );
            if (withCurrency.profile?.settlementCurrency) {
                setSettlementCurrency(withCurrency.profile.settlementCurrency);
            }
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
                ...(isCurrencyLocked
                    ? {}
                    : { settlementCurrency: application.profile?.settlementCurrency ?? settlementCurrency }),
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
    const isCurrencyLocked =
        applicationType === "UPGRADE" || application?.profile?.settlementCurrencyLocked === true;
    const currencyHint = isCurrencyLocked
        ? t("settlementCurrencyLockedHint")
        : t("settlementCurrencyHint");
    const settlementDisplayValue = displaySettlement
        ? formatSettlementCurrencyLabel(displaySettlement, locale)
        : "";

    return (
        <DashboardPage
            title={t("applyTitle")}
            subtitle={applicationType === "UPGRADE" ? t("upgradeSubtitle") : t("newSubtitle")}
        >
            {application?.status === "RETURNED" && application.returnedReason ? (
                <Alert type="warning" showIcon message={application.returnedReason} style={{ marginBottom: 16 }} />
            ) : null}

            {initializing ? (
                <Card className={styles.stepCard} loading />
            ) : (
                <>
            <Steps
                className={styles.steps}
                current={step}
                responsive
                items={[
                    { title: t("steps.country") },
                    { title: t("steps.profile") },
                    { title: t("steps.confirm") },
                ]}
            />

            {step === 0 ? (
                <Card className={styles.stepCard}>
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        <div>
                            <div style={{ marginBottom: 8 }}>{t("countryLabel")}</div>
                            <Select
                                style={{ width: "100%", maxWidth: 480 }}
                                showSearch
                                optionFilterProp="label"
                                options={REGISTRATION_COUNTRY_GROUPS.map((group) => ({
                                    label: t(`regions.${group.region}`),
                                    options: group.options.map((item) => ({
                                        value: item.value,
                                        label: t(`countries.${item.labelKey}`),
                                    })),
                                }))}
                                value={country}
                                onChange={setCountry}
                            />
                        </div>

                        <div>
                            <div style={{ marginBottom: 8 }}>{t("merchantTypeLabel")}</div>
                            <div className={styles.merchantTypeGroup}>
                                <button
                                    type="button"
                                    className={`${styles.merchantTypeCard} ${
                                        merchantType === "LEGAL_ENTITY"
                                            ? styles.merchantTypeCardSelected
                                            : ""
                                    }`}
                                    onClick={() => setMerchantType("LEGAL_ENTITY")}
                                >
                                    <div className={styles.merchantTypeCardContent}>
                                        <div className={styles.merchantTypeCardTitle}>
                                            {t("merchantTypes.LEGAL_ENTITY.title")}
                                        </div>
                                        <div className={styles.merchantTypeCardDesc}>
                                            {t("merchantTypes.LEGAL_ENTITY.description")}
                                        </div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.merchantTypeCard} ${styles.merchantTypeCardDisabled}`}
                                    onClick={() => message.info(t("merchantTypes.comingSoon"))}
                                >
                                    <div className={styles.merchantTypeCardContent}>
                                        <div className={styles.merchantTypeCardTitle}>
                                            {t("merchantTypes.INDIVIDUAL.title")}
                                            <Tag style={{ marginLeft: 8 }}>{t("merchantTypes.comingSoon")}</Tag>
                                        </div>
                                        <div className={styles.merchantTypeCardDesc}>
                                            {t("merchantTypes.INDIVIDUAL.description")}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <div style={{ marginBottom: 8 }}>{t("settlementCurrencyLabel")}</div>
                            {isCurrencyLocked ? (
                                <>
                                    <Input
                                        className={styles.lockedInput}
                                        style={{ maxWidth: 480 }}
                                        readOnly
                                        value={settlementDisplayValue}
                                        suffix={<LockOutlined />}
                                    />
                                    <div className={styles.fieldHint}>{currencyHint}</div>
                                </>
                            ) : (
                                <>
                                    <Select
                                        style={{ width: "100%", maxWidth: 480 }}
                                        showSearch
                                        optionFilterProp="label"
                                        options={SETTLEMENT_CURRENCY_OPTIONS.map((item) => ({
                                            value: item.value,
                                            label: formatSettlementCurrencyLabel(item.value, locale),
                                        }))}
                                        value={settlementCurrency}
                                        onChange={setSettlementCurrency}
                                    />
                                    <div className={styles.fieldHint}>{currencyHint}</div>
                                </>
                            )}
                        </div>

                        <Button type="primary" loading={loading} onClick={handleCountryNext}>
                            {t("continue")}
                        </Button>
                    </Space>
                </Card>
            ) : null}

            {step === 1 && schema ? (
                <Card className={styles.stepCard}>
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

            {step === 2 && application?.profile && schema ? (
                <Card className={styles.stepCard}>
                    <div className={styles.confirmIntro}>{t("confirmReviewTitle")}</div>
                    <OnboardingConfirmSummary
                        profile={application.profile}
                        schema={schema}
                        documents={documents}
                        countryLabel={countryLabel}
                        merchantTypeLabel={t("merchantTypes.LEGAL_ENTITY.title")}
                        locale={locale}
                        onEditStep={setStep}
                    />
                    <Checkbox
                        checked={settlementConfirmed}
                        onChange={(e) => setSettlementConfirmed(e.target.checked)}
                    >
                        {t("settlementConfirmAll", { currency: displaySettlement })}
                    </Checkbox>
                    <div className={styles.confirmActions}>
                        <Button onClick={() => setStep(1)}>{t("backToPrevious")}</Button>
                        <Button type="primary" loading={loading} onClick={handleSubmit}>
                            {t("submit")}
                        </Button>
                    </div>
                </Card>
            ) : null}
                </>
            )}
        </DashboardPage>
    );
}
