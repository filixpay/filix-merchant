"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Flex,
    Input,
    Select,
    Space,
    Typography,
    message,
} from "antd";
import { ApiOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import {
    executeExplorer,
    listExplorerApplications,
    listExplorerOperations,
    type ExplorerApplication,
    type ExplorerExecuteResult,
    type ExplorerOperation,
} from "@/lib/developer/explorer-api";

const DEFAULT_API_ID = "payment-api";

const cardStyle: React.CSSProperties = {
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)",
};

const monoStyle: React.CSSProperties = {
    background: "#f1f5f9",
    padding: "10px 14px",
    borderRadius: 6,
    border: "1px solid #e2e8f0",
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    maxHeight: 360,
    overflow: "auto",
};

interface ExplorerPanelProps {
    accessToken: string;
}

function extractPathParams(pathTemplate: string): string[] {
    const names: string[] = [];
    const re = /\{([^}]+)\}/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(pathTemplate)) !== null) {
        if (match[1] && !names.includes(match[1])) {
            names.push(match[1]);
        }
    }
    return names;
}

export default function ExplorerPanel({ accessToken }: ExplorerPanelProps) {
    const t = useTranslations("Developer.explorer");
    const [applications, setApplications] = useState<ExplorerApplication[]>([]);
    const [operations, setOperations] = useState<ExplorerOperation[]>([]);
    const [applicationCode, setApplicationCode] = useState<string | undefined>();
    const [operationId, setOperationId] = useState<string | undefined>();
    const [pathParams, setPathParams] = useState<Record<string, string>>({});
    const [queryJson, setQueryJson] = useState("{}");
    const [headerJson, setHeaderJson] = useState("{}");
    const [bodyJson, setBodyJson] = useState("{\n  \n}");
    const [loadingApps, setLoadingApps] = useState(false);
    const [loadingOps, setLoadingOps] = useState(false);
    const [executing, setExecuting] = useState(false);
    const [result, setResult] = useState<ExplorerExecuteResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const selectedOperation = useMemo(
        () => operations.find((op) => op.operationId === operationId) ?? null,
        [operations, operationId],
    );

    const pathParamNames = useMemo(
        () => (selectedOperation ? extractPathParams(selectedOperation.path) : []),
        [selectedOperation],
    );

    const loadApplications = useCallback(async () => {
        setLoadingApps(true);
        setError(null);
        try {
            const apps = await listExplorerApplications(accessToken);
            const active = apps.filter(
                (app) => !app.status || app.status.toUpperCase() !== "ARCHIVED",
            );
            setApplications(active);
            if (active.length > 0 && !applicationCode) {
                setApplicationCode(active[0].applicationCode);
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : t("load_apps_failed"));
        } finally {
            setLoadingApps(false);
        }
    }, [accessToken, applicationCode, t]);

    const loadOperations = useCallback(async () => {
        setLoadingOps(true);
        setError(null);
        try {
            const ops = await listExplorerOperations(accessToken, DEFAULT_API_ID);
            setOperations(ops);
            if (ops.length > 0) {
                setOperationId((current) => current ?? ops[0].operationId);
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : t("load_ops_failed"));
            setOperations([]);
        } finally {
            setLoadingOps(false);
        }
    }, [accessToken, t]);

    useEffect(() => {
        void loadApplications();
        void loadOperations();
    }, [loadApplications, loadOperations]);

    useEffect(() => {
        if (!selectedOperation) return;
        const next: Record<string, string> = {};
        for (const name of extractPathParams(selectedOperation.path)) {
            next[name] = pathParams[name] ?? "";
        }
        setPathParams(next);
        // Reset path params when operation changes; intentional omit of pathParams deps
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOperation?.operationId, selectedOperation?.path]);

    const parseJsonObject = (raw: string, label: string): Record<string, string> | undefined => {
        const trimmed = raw.trim();
        if (!trimmed || trimmed === "{}") return undefined;
        try {
            const parsed = JSON.parse(trimmed) as unknown;
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                throw new Error(`${label} must be a JSON object`);
            }
            const out: Record<string, string> = {};
            for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
                out[key] = value == null ? "" : String(value);
            }
            return out;
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : `Invalid ${label} JSON`);
        }
    };

    const handleExecute = async () => {
        if (!applicationCode || !operationId) {
            message.warning(t("select_required"));
            return;
        }
        setExecuting(true);
        setError(null);
        setResult(null);
        try {
            const query = parseJsonObject(queryJson, "query");
            const header = parseJsonObject(headerJson, "header");
            let body: unknown;
            const bodyTrimmed = bodyJson.trim();
            if (bodyTrimmed && bodyTrimmed !== "{}") {
                body = JSON.parse(bodyTrimmed);
            }
            const path =
                pathParamNames.length > 0
                    ? Object.fromEntries(
                          pathParamNames.map((name) => [name, pathParams[name] ?? ""]),
                      )
                    : undefined;
            const data = await executeExplorer({
                applicationCode,
                operationId,
                parameters: { path, query, header },
                body,
            });
            setResult(data);
        } catch (err) {
            console.error(err);
            const msg = err instanceof Error ? err.message : t("execute_failed");
            setError(msg);
            message.error(msg);
        } finally {
            setExecuting(false);
        }
    };

    return (
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
            <Card
                style={cardStyle}
                title={
                    <Flex align="center" gap={10}>
                        <ApiOutlined style={{ fontSize: 18, color: "#2563eb" }} />
                        <span>{t("title")}</span>
                    </Flex>
                }
            >
                <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
                    {t("subtitle")}
                </Typography.Paragraph>

                {error ? (
                    <Alert
                        type="error"
                        showIcon
                        message={error}
                        style={{ marginBottom: 16 }}
                        action={
                            <Button size="small" onClick={() => { void loadApplications(); void loadOperations(); }}>
                                {t("retry")}
                            </Button>
                        }
                    />
                ) : null}

                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                    <div>
                        <Typography.Text strong>{t("application")}</Typography.Text>
                        <Select
                            style={{ width: "100%", marginTop: 8 }}
                            loading={loadingApps}
                            placeholder={t("application_placeholder")}
                            value={applicationCode}
                            onChange={setApplicationCode}
                            options={applications.map((app) => ({
                                value: app.applicationCode,
                                label: app.name
                                    ? `${app.name} (${app.applicationCode})`
                                    : app.applicationCode,
                            }))}
                            notFoundContent={t("no_applications")}
                        />
                    </div>

                    <div>
                        <Typography.Text strong>{t("operation")}</Typography.Text>
                        <Select
                            style={{ width: "100%", marginTop: 8 }}
                            loading={loadingOps}
                            placeholder={t("operation_placeholder")}
                            value={operationId}
                            onChange={setOperationId}
                            showSearch
                            optionFilterProp="label"
                            options={operations.map((op) => ({
                                value: op.operationId,
                                label: `${op.method} ${op.path} — ${op.operationId}`,
                            }))}
                            notFoundContent={t("no_operations")}
                        />
                        {selectedOperation?.summary ? (
                            <Typography.Text type="secondary" style={{ display: "block", marginTop: 6 }}>
                                {selectedOperation.summary}
                            </Typography.Text>
                        ) : null}
                    </div>

                    {pathParamNames.length > 0 ? (
                        <div>
                            <Typography.Text strong>{t("path_params")}</Typography.Text>
                            <Space direction="vertical" style={{ width: "100%", marginTop: 8 }}>
                                {pathParamNames.map((name) => (
                                    <Input
                                        key={name}
                                        addonBefore={name}
                                        value={pathParams[name] ?? ""}
                                        onChange={(e) =>
                                            setPathParams((prev) => ({ ...prev, [name]: e.target.value }))
                                        }
                                    />
                                ))}
                            </Space>
                        </div>
                    ) : null}

                    <div>
                        <Typography.Text strong>{t("query_json")}</Typography.Text>
                        <Input.TextArea
                            style={{ marginTop: 8, fontFamily: "var(--font-mono)" }}
                            rows={3}
                            value={queryJson}
                            onChange={(e) => setQueryJson(e.target.value)}
                        />
                    </div>

                    <div>
                        <Typography.Text strong>{t("header_json")}</Typography.Text>
                        <Typography.Text type="secondary" style={{ display: "block", marginTop: 4 }}>
                            {t("header_hint")}
                        </Typography.Text>
                        <Input.TextArea
                            style={{ marginTop: 8, fontFamily: "var(--font-mono)" }}
                            rows={3}
                            value={headerJson}
                            onChange={(e) => setHeaderJson(e.target.value)}
                        />
                    </div>

                    <div>
                        <Typography.Text strong>{t("body_json")}</Typography.Text>
                        <Input.TextArea
                            style={{ marginTop: 8, fontFamily: "var(--font-mono)" }}
                            rows={8}
                            value={bodyJson}
                            onChange={(e) => setBodyJson(e.target.value)}
                        />
                    </div>

                    <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        loading={executing}
                        onClick={() => void handleExecute()}
                        disabled={!applicationCode || !operationId}
                    >
                        {t("execute")}
                    </Button>
                </Space>
            </Card>

            {result ? (
                <Card style={cardStyle} title={t("response")}>
                    <Space direction="vertical" size={12} style={{ width: "100%" }}>
                        <Flex gap={16} wrap="wrap">
                            <Typography.Text>
                                {t("status")}: <strong>{result.status}</strong>
                            </Typography.Text>
                            {result.latencyMs != null ? (
                                <Typography.Text>
                                    {t("latency")}: {result.latencyMs} ms
                                </Typography.Text>
                            ) : null}
                            {result.traceId ? (
                                <Typography.Text type="secondary">
                                    {t("trace_id")}: {result.traceId}
                                </Typography.Text>
                            ) : null}
                        </Flex>
                        {result.headers && Object.keys(result.headers).length > 0 ? (
                            <div>
                                <Typography.Text strong>{t("headers")}</Typography.Text>
                                <pre style={monoStyle}>{JSON.stringify(result.headers, null, 2)}</pre>
                            </div>
                        ) : null}
                        <div>
                            <Typography.Text strong>{t("body")}</Typography.Text>
                            <pre style={monoStyle}>
                                {typeof result.body === "string"
                                    ? result.body
                                    : JSON.stringify(result.body ?? null, null, 2)}
                            </pre>
                        </div>
                    </Space>
                </Card>
            ) : null}
        </Space>
    );
}
