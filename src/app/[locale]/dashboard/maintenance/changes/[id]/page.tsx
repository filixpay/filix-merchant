"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Descriptions,
    Form,
    Row,
    Select,
    Space,
    Tag,
    Typography,
    message,
} from "antd";
import { signIn, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    api,
    ApiError,
    CANCELABLE_CHANGE_STATUSES,
    type ApplicationSchemaDto,
    type MerchantChangeRequest,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import ChangeStatusTimeline from "@/components/maintenance/ChangeStatusTimeline";
import {
    buildChangeProfileDisplayRows,
    getChangeDetailContentMode,
    getMaintenanceStatusTagColor,
    truncateIdMiddle,
} from "@/components/maintenance/maintenance-change-ui";
import SchemaDynamicForm, {
    buildChangeProfileRequest,
    extractReturnHighlights,
    type SchemaFormValues,
} from "@/components/onboarding/SchemaDynamicForm";

function isMissingRegistrationCountry(err: unknown): boolean {
    return (
        err instanceof ApiError &&
        (err.code === "MERCHANT_MISSING_REGISTRATION_COUNTRY" ||
            err.message === "MERCHANT_MISSING_REGISTRATION_COUNTRY")
    );
}

export default function MaintenanceChangeDetailPage() {
    const t = useTranslations("Maintenance");
    const locale = useLocale();
    const params = useParams();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const changeId = params.id as string;

    const [changeRequest, setChangeRequest] = useState<MerchantChangeRequest | null>(null);
    const [schema, setSchema] = useState<ApplicationSchemaDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [needCountry, setNeedCountry] = useState(false);
    const [registrationCountry, setRegistrationCountry] = useState("CN");
    const [loadingSchema, setLoadingSchema] = useState(false);
    const [form] = Form.useForm<SchemaFormValues>();

    const highlightFields = useMemo(() => {
        const latestReview = changeRequest?.reviews?.[changeRequest.reviews.length - 1];
        return extractReturnHighlights(latestReview?.returnItems);
    }, [changeRequest?.reviews]);

    const contentMode = changeRequest
        ? getChangeDetailContentMode(changeRequest.status)
        : "view";
    const isEditable = contentMode === "edit";
    const canCancel =
        !!changeRequest && CANCELABLE_CHANGE_STATUSES.includes(changeRequest.status);
    const profileRows = useMemo(
        () => buildChangeProfileDisplayRows(changeRequest?.profile),
        [changeRequest?.profile],
    );

    const profileFieldLabel = useCallback(
        (key: string) => {
            const fieldKey = `fields.${key}` as Parameters<typeof t>[0];
            try {
                return t(fieldKey);
            } catch {
                return key;
            }
        },
        [t],
    );

    const loadSchema = useCallback(
        async (
            token: string,
            request: MerchantChangeRequest,
            countryOverride?: string,
        ) => {
            // Legacy merchants may lack idCountry; LEGAL_INFO schema resolution needs a country.
            // Prefer override → profile → UI selection (defaults to CN), so the first GET never
            // omits registrationCountry and trip MERCHANT_MISSING_REGISTRATION_COUNTRY.
            const country =
                countryOverride?.trim() ||
                request.profile?.registrationCountry?.trim() ||
                (request.changeType === "LEGAL_INFO"
                    ? registrationCountry.trim()
                    : undefined) ||
                undefined;
            console.warn("[change-schemas] loadSchema sources", {
                changeId: request.id,
                changeType: request.changeType,
                status: request.status,
                countryOverride,
                profileCountry: request.profile?.registrationCountry,
                uiCountry: registrationCountry,
                resolvedCountry: country,
            });
            try {
                const loadedSchema = await api.maintenance.getSchema(
                    token,
                    request.changeType,
                    country,
                );
                setSchema(loadedSchema);
                setNeedCountry(false);
            } catch (err) {
                setSchema(null);
                if (isMissingRegistrationCountry(err)) {
                    setNeedCountry(true);
                    message.error(t("errors.missingRegistrationCountry"));
                    return;
                }
                throw err;
            }
        },
        [registrationCountry, t],
    );

    const reload = useCallback(async () => {
        if (!accessToken || !changeId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const loaded = await api.maintenance.get(accessToken, changeId);
            setChangeRequest(loaded);
            if (loaded.profile?.registrationCountry) {
                setRegistrationCountry(loaded.profile.registrationCountry);
            }
            await loadSchema(accessToken, loaded);
        } catch (err) {
            if (!isMissingRegistrationCountry(err)) {
                message.error(err instanceof ApiError ? err.message : t("errors.generic"));
            }
        } finally {
            setLoading(false);
        }
    }, [accessToken, changeId, loadSchema, t]);

    useEffect(() => {
        if (!accessToken) {
            signIn();
            return;
        }
        reload();
    }, [accessToken, reload]);

    const handleLoadSchemaWithCountry = async () => {
        if (!accessToken || !changeRequest || !registrationCountry) {
            message.error(t("validation.countryRequired"));
            return;
        }
        setLoadingSchema(true);
        try {
            await loadSchema(accessToken, changeRequest, registrationCountry);
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("errors.generic"));
        } finally {
            setLoadingSchema(false);
        }
    };

    const handleSave = async (values: SchemaFormValues) => {
        if (!accessToken || !changeRequest) {
            return;
        }
        setSaving(true);
        try {
            const updated = await api.maintenance.updateProfile(
                accessToken,
                changeRequest.id,
                buildChangeProfileRequest(values),
            );
            setChangeRequest(updated);
            message.success(t("saveSuccess"));
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("errors.generic"));
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async () => {
        if (!accessToken || !changeRequest) {
            return;
        }
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            await api.maintenance.updateProfile(
                accessToken,
                changeRequest.id,
                buildChangeProfileRequest(values),
            );
            const submitted = await api.maintenance.submit(accessToken, changeRequest.id);
            setChangeRequest(submitted);
            await loadSchema(accessToken, submitted);
            message.success(t("submitSuccess"));
        } catch (err) {
            if (err && typeof err === "object" && "errorFields" in err) {
                return;
            }
            message.error(err instanceof ApiError ? err.message : t("errors.generic"));
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async () => {
        if (!accessToken || !changeRequest) {
            return;
        }
        try {
            const cancelled = await api.maintenance.cancel(accessToken, changeRequest.id);
            setChangeRequest(cancelled);
            await loadSchema(accessToken, cancelled);
            message.success(t("cancelSuccess"));
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("errors.generic"));
        }
    };

    return (
        <DashboardPage
            title={t("detailTitle")}
            subtitle={
                changeRequest ? (
                    <Space direction="vertical" size={4} style={{ marginTop: 4 }}>
                        <Space wrap size={8} align="center">
                            <Tag color={getMaintenanceStatusTagColor(changeRequest.status)}>
                                {t(`status.${changeRequest.status}`)}
                            </Tag>
                            <Typography.Text type="secondary">
                                {t(`changeType.${changeRequest.changeType}`)}
                            </Typography.Text>
                        </Space>
                        <Space wrap size={16}>
                            <span>
                                {t("requestIdLabel")}
                                {": "}
                                <Typography.Text
                                    copyable={{ text: String(changeRequest.id), tooltips: false }}
                                    style={{ fontFamily: "var(--font-mono)" }}
                                >
                                    {truncateIdMiddle(String(changeRequest.id), 8, 4)}
                                </Typography.Text>
                            </span>
                            {changeRequest.profile?.businessName ? (
                                <span>
                                    {t("columns.businessName")}
                                    {": "}
                                    <Typography.Text>{changeRequest.profile.businessName}</Typography.Text>
                                </span>
                            ) : null}
                        </Space>
                    </Space>
                ) : undefined
            }
            extra={
                <Space wrap>
                    <Link href={`/${locale}/dashboard/maintenance/changes`}>
                        <Button>{t("backToList")}</Button>
                    </Link>
                    {canCancel ? (
                        <Button danger onClick={handleCancel}>
                            {t("cancel")}
                        </Button>
                    ) : null}
                    <Button onClick={reload}>{t("refresh")}</Button>
                </Space>
            }
        >
            {loading ? (
                <Card loading />
            ) : changeRequest ? (
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    {changeRequest.status === "RETURNED" && changeRequest.returnedReason ? (
                        <Alert
                            type="warning"
                            showIcon
                            message={t("returnedAlert")}
                            description={changeRequest.returnedReason}
                        />
                    ) : null}

                    {changeRequest.status === "APPLY_FAILED" && changeRequest.lastApplyErrorCode ? (
                        <Alert
                            type="error"
                            showIcon
                            message={t("applyFailed")}
                            description={changeRequest.lastApplyErrorCode}
                        />
                    ) : null}

                    {needCountry && !schema ? (
                        <Alert
                            type="warning"
                            showIcon
                            message={t("errors.missingRegistrationCountry")}
                            description={
                                <Space direction="vertical" style={{ width: "100%" }}>
                                    <Typography.Text>
                                        {t("errors.missingRegistrationCountryHint")}
                                    </Typography.Text>
                                    <Space wrap>
                                        <Select
                                            style={{ minWidth: 180 }}
                                            value={registrationCountry}
                                            onChange={setRegistrationCountry}
                                            options={[
                                                { value: "CN", label: "CN" },
                                                { value: "US", label: "US" },
                                            ]}
                                        />
                                        <Button
                                            type="primary"
                                            loading={loadingSchema}
                                            onClick={handleLoadSchemaWithCountry}
                                        >
                                            {t("refresh")}
                                        </Button>
                                    </Space>
                                </Space>
                            }
                        />
                    ) : null}

                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={14}>
                            {isEditable && schema ? (
                                <Card title={t("editTitle")}>
                                    <SchemaDynamicForm
                                        form={form}
                                        schema={schema}
                                        initialProfile={changeRequest.profile}
                                        highlightFields={highlightFields}
                                        mode="maintenance"
                                        translationsNamespace="Maintenance"
                                        editable
                                        loading={saving || submitting}
                                        showDefaultSubmit
                                        submitLabel={t("save")}
                                        submitButtonType="default"
                                        onSubmit={handleSave}
                                        extraActions={
                                            <Button
                                                type="primary"
                                                loading={submitting}
                                                onClick={handleSubmit}
                                            >
                                                {t("submit")}
                                            </Button>
                                        }
                                    />
                                </Card>
                            ) : profileRows.length > 0 ? (
                                <Card title={t("viewTitle")}>
                                    <Descriptions
                                        column={1}
                                        size="middle"
                                        labelStyle={{ width: 140, color: "#64748b" }}
                                        contentStyle={{ color: "#0f172a" }}
                                    >
                                        {profileRows.map((row) => (
                                            <Descriptions.Item
                                                key={row.key}
                                                label={profileFieldLabel(row.key)}
                                            >
                                                {row.value}
                                            </Descriptions.Item>
                                        ))}
                                    </Descriptions>
                                </Card>
                            ) : (
                                <Card title={t("viewTitle")}>
                                    <Typography.Text type="secondary">{t("profileEmpty")}</Typography.Text>
                                </Card>
                            )}
                        </Col>
                        <Col xs={24} lg={10}>
                            <Card title={t("timelineTitle")}>
                                <ChangeStatusTimeline changeRequest={changeRequest} />
                            </Card>
                        </Col>
                    </Row>
                </Space>
            ) : (
                <Alert type="info" message={t("notFound")} />
            )}
        </DashboardPage>
    );
}
