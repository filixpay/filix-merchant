"use client";

import { Card, Progress, Space, Tag, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { IntegrationVerdict } from "@/lib/sandbox/types";
import { getVerdictCheckLabelKey } from "./sandbox-ui-model";

interface IntegrationVerdictCardProps {
    verdict: IntegrationVerdict;
}

export default function IntegrationVerdictCard({ verdict }: IntegrationVerdictCardProps) {
    const t = useTranslations("Developer.sandbox");
    const passed = verdict.status === "PASS";

    return (
        <Card>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <Space align="center">
                    {passed ? (
                        <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 24 }} />
                    ) : (
                        <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 24 }} />
                    )}
                    <div>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            {t("verdict_title")}
                        </Typography.Title>
                        <Typography.Text type={passed ? "success" : "danger"}>
                            {passed ? t("verdict_pass") : t("verdict_fail")}
                        </Typography.Text>
                    </div>
                </Space>

                <Progress
                    percent={verdict.confidence}
                    status={passed ? "success" : "exception"}
                    format={() => t("verdict_confidence", { percent: verdict.confidence })}
                />

                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                    {verdict.checks.map((check) => (
                        <Space key={check.id}>
                            <Tag color={check.status === "OK" ? "success" : "error"}>
                                {check.status}
                            </Tag>
                            <Typography.Text>{t(getVerdictCheckLabelKey(check.id))}</Typography.Text>
                        </Space>
                    ))}
                </Space>

                <Typography.Text type="secondary">{verdict.summary}</Typography.Text>
            </Space>
        </Card>
    );
}
