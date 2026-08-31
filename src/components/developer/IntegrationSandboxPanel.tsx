"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Flex, Form, Input, Space, Steps, Typography, message } from "antd";
import { ExperimentOutlined, ExportOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import {
    createSandboxSession,
    executeSandboxStep,
    getSandboxSession,
    revokeSandboxSession,
} from "@/lib/sandbox-client";
import {
    listApplicationCredentials,
    listApplications,
} from "@/lib/developer/applications-api";
import { pickDefaultSandboxCredential } from "./sandbox-credentials-model";
import type {
    ExecuteResult,
    SandboxSessionPublicView,
} from "@/lib/sandbox/types";
import { getScenario } from "@/lib/sandbox/scenario-registry";
import PaymentModal from "@/components/orders/PaymentModal";
import type { PaymentActionOrder } from "@/components/orders/order-action-model";
import IntegrationVerdictCard from "./IntegrationVerdictCard";
import SandboxStepForm from "./SandboxStepForm";
import SandboxTechnicalDetails from "./SandboxTechnicalDetails";
import {
    buildDefaultCreateOrderInput,
    buildSandboxCheckoutLink,
    buildSandboxPaymentOrder,
    formatSessionRemainingMinutes,
    getStepLabelKey,
} from "./sandbox-ui-model";
import { SANDBOX_WEBHOOK_POLL_INTERVAL_MS } from "@/lib/sandbox/sandbox-config";

interface IntegrationSandboxPanelProps {
    accessToken?: string;
    onNeedCredentials?: () => void;
    refreshKey?: number;
}

/* ── Shared card style ── */
const cardStyle: React.CSSProperties = {
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)",
};

export default function IntegrationSandboxPanel({
    accessToken,
    onNeedCredentials,
    refreshKey = 0,
}: IntegrationSandboxPanelProps) {
    const t = useTranslations("Developer.sandbox");
    const tDev = useTranslations("Developer");
    const tOrders = useTranslations("Orders.payment_modal");
    const locale = useLocale();
    const [session, setSession] = useState<SandboxSessionPublicView | null>(null);
    const [loading, setLoading] = useState(true);
    const [executing, setExecuting] = useState(false);
    const [starting, setStarting] = useState(false);
    const [prefilling, setPrefilling] = useState(false);
    const [lastResult, setLastResult] = useState<ExecuteResult | null>(null);
    const [loadedVerdict, setLoadedVerdict] = useState<ExecuteResult["verdict"]>();
    const [formInput, setFormInput] = useState<Record<string, unknown>>(
        buildDefaultCreateOrderInput(),
    );
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentLink, setPaymentLink] = useState("");
    const [paymentOrder, setPaymentOrder] = useState<PaymentActionOrder | null>(null);
    const [credentialForm] = Form.useForm<{ clientId: string; clientSecret: string }>();

    const openCheckoutModal = useCallback(
        (context: Record<string, unknown>, orderInput: Record<string, unknown>) => {
            const link = buildSandboxCheckoutLink(context);
            if (!link) return false;

            setPaymentLink(link);
            setPaymentOrder(buildSandboxPaymentOrder(context, orderInput));
            setShowPaymentModal(true);
            return true;
        },
        [],
    );

    const scenario = useMemo(() => getScenario("payment-flow"), []);

    const loadSession = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getSandboxSession();
            setSession(res?.session ?? null);
            setLoadedVerdict(res?.verdict);
        } catch (err) {
            console.error(err);
            setSession(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const prefillCredentials = useCallback(async () => {
        if (!accessToken) return;
        setPrefilling(true);
        try {
            const apps = await listApplications(accessToken);
            const credentialsByApp: Record<string, Awaited<ReturnType<typeof listApplicationCredentials>>> =
                {};
            await Promise.all(
                apps.map(async (app) => {
                    if ((app.status || "").toUpperCase() === "ARCHIVED") return;
                    try {
                        credentialsByApp[app.applicationCode] = await listApplicationCredentials(
                            accessToken,
                            app.applicationCode,
                        );
                    } catch {
                        credentialsByApp[app.applicationCode] = [];
                    }
                }),
            );
            const picked = pickDefaultSandboxCredential(apps, credentialsByApp);
            if (picked?.clientId) {
                credentialForm.setFieldsValue({ clientId: picked.clientId });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setPrefilling(false);
        }
    }, [accessToken, credentialForm]);

    useEffect(() => {
        void loadSession();
    }, [loadSession, refreshKey]);

    useEffect(() => {
        if (!session && accessToken) {
            void prefillCredentials();
        }
    }, [session, accessToken, prefillCredentials, refreshKey]);

    const handleStartVerification = async (values: {
        clientId: string;
        clientSecret: string;
    }) => {
        setStarting(true);
        try {
            const created = await createSandboxSession({
                clientId: values.clientId,
                clientSecret: values.clientSecret,
            });
            setSession(created.session);
            setLastResult(null);
            setLoadedVerdict(undefined);
            message.success(t("start_success"));
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("session_create_failed"));
        } finally {
            setStarting(false);
        }
    };

    const handleRestartVerification = async () => {
        setStarting(true);
        try {
            await revokeSandboxSession();
            setSession(null);
            setLastResult(null);
            setLoadedVerdict(undefined);
            setFormInput(buildDefaultCreateOrderInput());
            message.success(t("restart_success"));
            if (accessToken) {
                void prefillCredentials();
            }
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("restart_failed"));
        } finally {
            setStarting(false);
        }
    };

    const currentStep = useMemo(() => {
        if (!session?.currentStepId) return null;
        return scenario.steps.find((step) => step.id === session.currentStepId) ?? null;
    }, [scenario.steps, session?.currentStepId]);

    const currentStepExecution = useMemo(() => {
        if (!session?.currentStepId) return null;
        return session.stepExecutions.find((exec) => exec.stepId === session.currentStepId) ?? null;
    }, [session?.currentStepId, session?.stepExecutions]);

    const handleExecute = useCallback(
        async (options?: { silent?: boolean }) => {
            if (!session || !currentStep) return;
            setExecuting(true);
            try {
                const input =
                    currentStep.inputSchema === "create-order" ? formInput : {};
                const result = await executeSandboxStep(input);
                setSession(result.session);
                setLastResult(result);
                if (result.stepResult.stepId === "get-payment-token" && result.stepResult.passed) {
                    openCheckoutModal(result.session.context, formInput);
                }
                if (!options?.silent) {
                    if (result.verdict?.status === "PASS") {
                        message.success(t("verdict_pass"));
                    } else if (result.stepResult.passed) {
                        message.success(t("step_success"));
                    } else if (currentStep.type === "poll") {
                        message.info(t("webhook_poll_pending"));
                    } else {
                        message.error(result.stepResult.error?.message ?? t("step_failed"));
                    }
                } else if (result.verdict?.status === "PASS") {
                    message.success(t("verdict_pass"));
                }
            } catch (err) {
                console.error(err);
                if (!options?.silent) {
                    message.error(err instanceof Error ? err.message : t("step_failed"));
                }
            } finally {
                setExecuting(false);
            }
        },
        [session, currentStep, formInput, openCheckoutModal, t],
    );

    useEffect(() => {
        if (!session || session.status !== "in_progress" || currentStep?.type !== "poll" || executing) {
            return;
        }

        const timer = window.setInterval(() => {
            void handleExecute({ silent: true });
        }, SANDBOX_WEBHOOK_POLL_INTERVAL_MS);

        return () => window.clearInterval(timer);
    }, [session, currentStep?.type, executing, handleExecute]);

    if (loading) {
        return <Typography.Text type="secondary">{t("loading")}</Typography.Text>;
    }

    /* ── No session: enter Client ID / Secret and start ── */
    if (!session) {
        return (
            <Card style={cardStyle} styles={{ body: { padding: 24 } }}>
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                    <Flex align="center" gap={10}>
                        <ExperimentOutlined style={{ fontSize: 20, color: "#2563eb" }} />
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            {t("title")}
                        </Typography.Title>
                    </Flex>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        {t("subtitle")}
                    </Typography.Text>
                    <Alert
                        type="info"
                        showIcon
                        style={{ borderRadius: 8 }}
                        message={t("credentials_form_hint")}
                    />
                    <Form
                        form={credentialForm}
                        layout="vertical"
                        onFinish={(values) => void handleStartVerification(values)}
                        style={{ maxWidth: 520 }}
                    >
                        <Form.Item
                            name="clientId"
                            label={tDev("client_id")}
                            rules={[{ required: true, message: t("client_id_required") }]}
                            style={{ marginBottom: 16 }}
                        >
                            <Input
                                placeholder={t("client_id_placeholder")}
                                disabled={prefilling}
                                style={{ fontFamily: "var(--font-mono)" }}
                                autoComplete="off"
                            />
                        </Form.Item>
                        <Form.Item
                            name="clientSecret"
                            label={tDev("client_secret")}
                            rules={[{ required: true, message: t("client_secret_required") }]}
                            extra={t("client_secret_hint")}
                            style={{ marginBottom: 20 }}
                        >
                            <Input.Password
                                placeholder={t("client_secret_placeholder")}
                                style={{ fontFamily: "var(--font-mono)" }}
                                autoComplete="off"
                            />
                        </Form.Item>
                        <Flex gap={12} wrap="wrap">
                            <Button type="primary" htmlType="submit" loading={starting}>
                                {t("start_verification")}
                            </Button>
                            {onNeedCredentials ? (
                                <Button onClick={onNeedCredentials}>
                                    {t("go_to_applications")}
                                </Button>
                            ) : null}
                        </Flex>
                    </Form>
                </Space>
            </Card>
        );
    }

    /* ── Completed: show verdict ── */
    if (session.status === "completed") {
        const verdict = lastResult?.verdict ?? loadedVerdict;
        if (!verdict) {
            return <Typography.Text type="secondary">{t("loading")}</Typography.Text>;
        }
        return (
            <Space direction="vertical" size={20} style={{ width: "100%" }}>
                <IntegrationVerdictCard verdict={verdict} />
                <Flex gap={12} wrap="wrap">
                    {buildSandboxCheckoutLink(session.context) && (
                        <Button
                            type="primary"
                            icon={<ExportOutlined />}
                            onClick={() => openCheckoutModal(session.context, formInput)}
                        >
                            {tOrders("go_to_pay")}
                        </Button>
                    )}
                    <Link href="https://www.filixpay.com/openapi/v1/swagger" target="_blank">
                        <Button>{t("view_swagger")}</Button>
                    </Link>
                    <Link href={`/${locale}/dashboard/developer`}>
                        <Button>{t("configure_webhook")}</Button>
                    </Link>
                    <Button loading={starting} onClick={() => void handleRestartVerification()}>
                        {t("restart_verification")}
                    </Button>
                </Flex>
                <Card style={cardStyle} styles={{ body: { padding: 24 } }}>
                    <SandboxTechnicalDetails
                        completedStepResults={session.completedStepResults ?? []}
                        requestLog={session.requestLog}
                    />
                </Card>
                <PaymentModal
                    isOpen={showPaymentModal}
                    order={paymentOrder}
                    paymentLink={paymentLink}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setPaymentLink("");
                        setPaymentOrder(null);
                    }}
                />
            </Space>
        );
    }

    /* ── In progress ── */
    const completedCount = session.stepExecutions.filter((s) => s.status === "passed").length;
    const totalSteps = session.stepExecutions.length;
    const remainingMinutes = formatSessionRemainingMinutes(session.expiresAt);

    return (
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
            {/* ── Steps Progress Card ── */}
            <Card
                title={
                    <Flex align="center" gap={10}>
                        <ExperimentOutlined style={{ fontSize: 18, color: "#2563eb" }} />
                        <span>{t("title")}</span>
                    </Flex>
                }
                extra={
                    <Flex align="center" gap={12} wrap="wrap">
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                            {t("progress", { current: completedCount, total: totalSteps })}
                            {" · "}
                            {t("session_expires", { minutes: remainingMinutes })}
                        </Typography.Text>
                        <Button size="small" loading={starting} onClick={() => void handleRestartVerification()}>
                            {t("restart_verification")}
                        </Button>
                    </Flex>
                }
                style={cardStyle}
                styles={{
                    header: {
                        borderBottom: "1px solid #f1f5f9",
                        padding: "16px 24px",
                    },
                    body: { padding: 24 },
                }}
            >
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        {t("subtitle")}
                    </Typography.Text>

                    <Alert
                        type="info"
                        showIcon
                        style={{ borderRadius: 8 }}
                        message={t("session_active_hint")}
                    />

                    {session.status === "failed" && lastResult?.verdict && (
                        <IntegrationVerdictCard verdict={lastResult.verdict} />
                    )}

                    {lastResult?.stepResult && !lastResult.stepResult.passed ? (
                        <Alert
                            type="error"
                            showIcon
                            style={{ borderRadius: 8 }}
                            message={lastResult.stepResult.error?.message ?? t("step_failed")}
                            description={t("step_failed_hint")}
                        />
                    ) : null}

                    <Steps
                        direction="vertical"
                        size="small"
                        current={completedCount}
                        items={session.stepExecutions.map((exec) => ({
                            title: t(getStepLabelKey(exec.stepId)),
                            status:
                                exec.status === "passed"
                                    ? "finish"
                                    : exec.stepId === session.currentStepId
                                      ? "process"
                                      : exec.status === "failed"
                                        ? "error"
                                        : "wait",
                        }))}
                    />
                </Space>
            </Card>

            {/* ── Current Step Execution Card ── */}
            {currentStep && session.status === "in_progress" && (
                <Card
                    style={cardStyle}
                    styles={{ body: { padding: 24 } }}
                >
                    <Space direction="vertical" size={16} style={{ width: "100%" }}>
                        {currentStep.type === "poll" ? (
                            <Alert
                                type="info"
                                showIcon
                                message={t("webhook_poll_title")}
                                description={t("webhook_poll_description")}
                                style={{ borderRadius: 8 }}
                            />
                        ) : null}
                        <SandboxStepForm
                            inputSchema={currentStep.inputSchema}
                            context={session.context}
                            disabled={executing}
                            onChange={setFormInput}
                        />
                        {currentStep.type === "poll" && currentStepExecution ? (
                            <Typography.Text type="secondary">
                                {t("webhook_poll_attempts", {
                                    current: currentStepExecution.attempts,
                                })}
                            </Typography.Text>
                        ) : null}
                        <Button type="primary" loading={executing} onClick={() => void handleExecute()}>
                            {currentStep.type === "poll" ? t("check_webhook_delivery") : t("execute_step")}
                        </Button>
                    </Space>
                </Card>
            )}

            {/* ── Technical Details Card ── */}
            <Card style={cardStyle} styles={{ body: { padding: 24 } }}>
                <SandboxTechnicalDetails
                    completedStepResults={session.completedStepResults ?? []}
                    requestLog={session.requestLog}
                />
            </Card>

            <PaymentModal
                isOpen={showPaymentModal}
                order={paymentOrder}
                paymentLink={paymentLink}
                onClose={() => {
                    setShowPaymentModal(false);
                    setPaymentLink("");
                    setPaymentOrder(null);
                }}
            />
        </Space>
    );
}
