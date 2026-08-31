"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Collapse, Descriptions, Segmented, Space, Table, Tabs, Typography, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import {
    formatJsonForDisplay,
    formatSandboxRequestUrl,
    generateAuthSample,
    generateStepSample,
    redactSensitiveJson,
    type CodeSampleLang,
} from "@/lib/sandbox/code-samples";
import type { RequestLogEntry, StepResult } from "@/lib/sandbox/types";
import { getStepLabelKey } from "./sandbox-ui-model";

interface SandboxTechnicalDetailsProps {
    completedStepResults: StepResult[];
    requestLog: RequestLogEntry[];
}

const LANGS: CodeSampleLang[] = ["curl", "node", "python", "java"];

function CodeBlock({ code, copyLabel, copiedLabel }: { code: string; copyLabel: string; copiedLabel: string }) {
    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        message.success(copiedLabel);
    };

    return (
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <Button size="small" icon={<CopyOutlined />} onClick={handleCopy}>
                {copyLabel}
            </Button>
            <pre
                style={{
                    margin: 0,
                    padding: 12,
                    background: "#fafafa",
                    borderRadius: 8,
                    overflow: "auto",
                    maxHeight: 320,
                    fontSize: 12,
                }}
            >
                {code}
            </pre>
        </Space>
    );
}

export default function SandboxTechnicalDetails({
    completedStepResults,
    requestLog,
}: SandboxTechnicalDetailsProps) {
    const t = useTranslations("Developer.sandbox");
    const tTechnical = useTranslations("Developer.sandbox.technical");

    const [selectedStepId, setSelectedStepId] = useState<string | undefined>(
        () => completedStepResults[completedStepResults.length - 1]?.stepId,
    );

    useEffect(() => {
        if (completedStepResults.length === 0) {
            setSelectedStepId(undefined);
            return;
        }
        if (!selectedStepId || !completedStepResults.some((r) => r.stepId === selectedStepId)) {
            setSelectedStepId(completedStepResults[completedStepResults.length - 1].stepId);
        }
    }, [completedStepResults, selectedStepId]);

    const selectedResult = completedStepResults.find((r) => r.stepId === selectedStepId);

    const langLabels = useMemo(
        () => ({
            curl: tTechnical("lang_curl"),
            node: tTechnical("lang_node"),
            python: tTechnical("lang_python"),
            java: tTechnical("lang_java"),
        }),
        [tTechnical],
    );

    const codeTabs = (getCode: (lang: CodeSampleLang) => string) =>
        LANGS.map((lang) => ({
            key: lang,
            label: langLabels[lang],
            children: (
                <CodeBlock
                    code={getCode(lang)}
                    copyLabel={tTechnical("copy_code")}
                    copiedLabel={tTechnical("copy_success")}
                />
            ),
        }));

    return (
        <Collapse
            items={[
                {
                    key: "technical",
                    label: t("technical_details"),
                    children: (
                        <>
                            {completedStepResults.length === 0 ? (
                                <Typography.Text type="secondary">{tTechnical("no_steps_yet")}</Typography.Text>
                            ) : (
                                <>
                                    <Typography.Text type="secondary">{tTechnical("step_select_label")}</Typography.Text>
                                    <Segmented
                                        style={{ marginTop: 8, marginBottom: 16 }}
                                        value={selectedStepId}
                                        onChange={(value) => setSelectedStepId(String(value))}
                                        options={completedStepResults.map((result) => ({
                                            label: t(getStepLabelKey(result.stepId)),
                                            value: result.stepId,
                                        }))}
                                    />

                                    <Typography.Title level={5} style={{ marginTop: 0 }}>
                                        {tTechnical("auth_example_title")}
                                    </Typography.Title>
                                    <Tabs items={codeTabs((lang) => generateAuthSample(lang))} />

                                    {selectedResult && (
                                        <>
                                            <Typography.Title level={5}>
                                                {tTechnical("actual_request_title")}
                                            </Typography.Title>
                                            <Descriptions size="small" column={1} bordered>
                                                <Descriptions.Item label={tTechnical("request_method")}>
                                                    {selectedResult.request.method}
                                                </Descriptions.Item>
                                                <Descriptions.Item label={tTechnical("request_url")}>
                                                    {formatSandboxRequestUrl(
                                                        selectedResult.request.method,
                                                        selectedResult.request.path,
                                                    )}
                                                </Descriptions.Item>
                                                <Descriptions.Item label={tTechnical("request_headers")}>
                                                    {`Authorization: Bearer ***\nAccept: application/json${
                                                        selectedResult.request.body !== undefined
                                                            ? "\nContent-Type: application/json"
                                                            : ""
                                                    }`}
                                                </Descriptions.Item>
                                                {selectedResult.request.body !== undefined && (
                                                    <Descriptions.Item label={tTechnical("request_body")}>
                                                        <pre
                                                            style={{
                                                                margin: 0,
                                                                whiteSpace: "pre-wrap",
                                                                wordBreak: "break-word",
                                                            }}
                                                        >
                                                            {formatJsonForDisplay(
                                                                redactSensitiveJson(selectedResult.request.body),
                                                            )}
                                                        </pre>
                                                    </Descriptions.Item>
                                                )}
                                            </Descriptions>

                                            <Typography.Title level={5}>
                                                {tTechnical("response_title")}
                                            </Typography.Title>
                                            <Typography.Text type="secondary">
                                                {selectedResult.response.status} · {selectedResult.durationMs}ms
                                            </Typography.Text>
                                            <pre
                                                style={{
                                                    marginTop: 8,
                                                    padding: 12,
                                                    background: "#fafafa",
                                                    borderRadius: 8,
                                                    overflow: "auto",
                                                    maxHeight: 320,
                                                }}
                                            >
                                                {formatJsonForDisplay(
                                                    redactSensitiveJson(selectedResult.response.body),
                                                )}
                                            </pre>

                                            <Typography.Title level={5}>
                                                {tTechnical("integration_example_title")}
                                            </Typography.Title>
                                            <Tabs
                                                items={codeTabs((lang) =>
                                                    generateStepSample(lang, selectedResult),
                                                )}
                                            />
                                        </>
                                    )}
                                </>
                            )}

                            <Typography.Title level={5} style={{ marginTop: 16 }}>
                                {t("request_history")}
                            </Typography.Title>
                            <Table
                                size="middle"
                                pagination={false}
                                rowKey={(row) => `${row.at}-${row.path}`}
                                dataSource={requestLog}
                                onRow={(row) => ({
                                    onClick: () => setSelectedStepId(row.stepId),
                                    style: { cursor: "pointer" },
                                })}
                                rowClassName={(row) =>
                                    row.stepId === selectedStepId ? "sandbox-log-row-active" : ""
                                }
                                columns={[
                                    {
                                        title: t("log_method"),
                                        dataIndex: "method",
                                        width: 80,
                                    },
                                    { title: t("log_path"), dataIndex: "path" },
                                    {
                                        title: t("log_status"),
                                        dataIndex: "status",
                                        width: 80,
                                    },
                                    {
                                        title: t("log_duration"),
                                        dataIndex: "durationMs",
                                        width: 100,
                                        render: (value: number) => `${value}ms`,
                                    },
                                ]}
                            />
                        </>
                    ),
                },
            ]}
        />
    );
}
