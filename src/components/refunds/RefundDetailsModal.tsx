"use client";

import { Alert, Descriptions, Drawer, Space, Spin, Steps, Tag, Timeline, Typography } from "antd";
import { useTranslations } from "next-intl";
import type { RefundTimelineEvent, RefundView } from "@/lib/api";
import {
    ensureTimeline,
    formatRefundAmount,
    getRefundStatusColor,
    presentRefundProgress,
    refundStatusI18nKey,
    timelineEventColor,
} from "./refund-model";

interface RefundDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    refund: RefundView | null;
    loading: boolean;
}

function formatAt(at?: string): string {
    if (!at) return "—";
    const date = new Date(at);
    return Number.isNaN(date.getTime()) ? at : date.toLocaleString();
}

export default function RefundDetailsModal({
    isOpen,
    onClose,
    refund,
    loading,
}: RefundDetailsModalProps) {
    const t = useTranslations("Refunds");
    const tCommon = useTranslations("Common");

    const statusLabel = (status: string) => {
        const key = refundStatusI18nKey(status);
        return key ? t(`status.${key}`) : status;
    };

    const timelineTitle = (event: RefundTimelineEvent) => {
        const translationKey = `timeline.events.${event.code}` as Parameters<typeof t>[0];
        const translated = t(translationKey);
        if (translated === translationKey) {
            return event.code;
        }
        return translated;
    };

    const progress = refund
        ? presentRefundProgress(refund.status, Boolean(refund.awaitingApproval))
        : null;
    const timeline = refund ? ensureTimeline(refund) : [];

    return (
        <Drawer
            title={t("details.title")}
            open={isOpen}
            onClose={onClose}
            width={640}
            destroyOnHidden
        >
            {loading ? (
                <div style={{ textAlign: "center", padding: 48 }}>
                    <Spin />
                </div>
            ) : refund ? (
                <Space direction="vertical" size={20} style={{ width: "100%" }}>
                    {refund.awaitingApproval ? (
                        <Alert
                            type="warning"
                            showIcon
                            message={t("timeline.awaiting_approval_title")}
                            description={t("timeline.awaiting_approval_desc", {
                                threshold: refund.autoExecuteThreshold ?? "100.00",
                            })}
                        />
                    ) : null}

                    {progress ? (
                        <div>
                            <Typography.Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                                {t("timeline.progress_title")}
                            </Typography.Text>
                            <Steps
                                size="small"
                                items={[
                                    {
                                        title: t("timeline.steps.requested"),
                                        status:
                                            progress.requested === "done"
                                                ? "finish"
                                                : progress.requested === "current"
                                                  ? "process"
                                                  : "wait",
                                    },
                                    ...(progress.approval === "skipped"
                                        ? []
                                        : [
                                              {
                                                  title: t("timeline.steps.approval"),
                                                  status:
                                                      progress.approval === "done"
                                                          ? ("finish" as const)
                                                          : progress.approval === "current"
                                                            ? ("process" as const)
                                                            : ("wait" as const),
                                              },
                                          ]),
                                    {
                                        title: t("timeline.steps.executing"),
                                        status:
                                            progress.executing === "done"
                                                ? "finish"
                                                : progress.executing === "current"
                                                  ? "process"
                                                  : progress.executing === "failed"
                                                    ? "error"
                                                    : "wait",
                                    },
                                    {
                                        title: t("timeline.steps.terminal"),
                                        status:
                                            progress.terminal === "done"
                                                ? "finish"
                                                : progress.terminal === "failed"
                                                  ? "error"
                                                  : progress.terminal === "current"
                                                    ? "process"
                                                    : "wait",
                                    },
                                ]}
                            />
                        </div>
                    ) : null}

                    <Descriptions column={2} size="small" bordered>
                        <Descriptions.Item label={t("details.refund_no")}>
                            {refund.refundId}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("details.status")}>
                            <Tag color={getRefundStatusColor(refund.status)}>
                                {statusLabel(refund.status)}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label={t("details.merchant_refund_id")}>
                            {refund.merchantRefundId}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("details.amount")}>
                            {formatRefundAmount(refund)}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("headers.order_id")}>
                            {refund.paymentId || "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("details.created_at")}>
                            {formatAt(refund.createdAt)}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("details.reason")} span={2}>
                            {refund.reason || "-"}
                        </Descriptions.Item>
                    </Descriptions>

                    <div>
                        <Typography.Text strong style={{ display: "block", marginBottom: 12 }}>
                            {t("timeline.title")}
                        </Typography.Text>
                        {timeline.length === 0 ? (
                            <Typography.Text type="secondary">{t("timeline.empty")}</Typography.Text>
                        ) : (
                            <Timeline
                                items={timeline.map((event, index) => ({
                                    color: timelineEventColor(event.code),
                                    key: `${event.code}-${index}`,
                                    children: (
                                        <div>
                                            <div>{timelineTitle(event)}</div>
                                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                                {formatAt(event.at)}
                                                {event.attemptNo != null
                                                    ? ` · #${event.attemptNo}`
                                                    : ""}
                                            </Typography.Text>
                                            {event.detail ? (
                                                <div>
                                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                                        {event.detail}
                                                    </Typography.Text>
                                                </div>
                                            ) : null}
                                        </div>
                                    ),
                                }))}
                            />
                        )}
                    </div>
                </Space>
            ) : (
                <div style={{ textAlign: "center", color: "#dc2626" }}>{tCommon("error")}</div>
            )}
        </Drawer>
    );
}
