"use client";

import { Timeline, Typography } from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    FileDoneOutlined,
    FileTextOutlined,
    FlagOutlined,
    SyncOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { RiskEvent } from "@/lib/api";
import {
    localizeTimelineActor,
    localizeTimelineDescription,
    localizeTimelineTitle,
} from "@/components/disputes/dispute-labels";

interface ImmutableTimelineProps {
    events: readonly RiskEvent[];
}

function getTimelineTone(event: RiskEvent): {
    color: string;
    icon: React.ReactNode;
} {
    switch (event.type) {
        case "CASE_OPENED":
            return { color: "blue", icon: <FlagOutlined /> };
        case "EVIDENCE_DRAFT_SAVED":
            return { color: "gray", icon: <FileTextOutlined /> };
        case "EVIDENCE_SUBMITTED":
        case "EVIDENCE_FORWARDED_TO_CHANNEL":
            return { color: "blue", icon: <FileDoneOutlined /> };
        case "REVIEW_STARTED":
        case "CHANNEL_STATUS_CHANGED":
            return { color: "blue", icon: <SyncOutlined /> };
        case "CASE_RESOLVED":
            return { color: "green", icon: <CheckCircleOutlined /> };
        case "LIABILITY_ACCEPTED":
            return { color: "orange", icon: <WarningOutlined /> };
        case "CHANNEL_EVIDENCE_SUBMIT_FAILED":
            return { color: "red", icon: <CloseCircleOutlined /> };
        default: {
            const title = event.title.toLowerCase();
            if (title.includes("won") || title.includes("resolved") || title.includes("胜诉")) {
                return { color: "green", icon: <CheckCircleOutlined /> };
            }
            if (title.includes("lost") || title.includes("fail") || title.includes("败诉")) {
                return { color: "red", icon: <CloseCircleOutlined /> };
            }
            if (title.includes("open") || title.includes("开启") || title.includes("创建")) {
                return { color: "blue", icon: <FlagOutlined /> };
            }
            return { color: "blue", icon: <SyncOutlined /> };
        }
    }
}

export default function ImmutableTimeline({ events }: ImmutableTimelineProps) {
    const t = useTranslations("Disputes");

    const sortedEvents = [...events].sort(
        (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    );

    return (
        <div>
            <Typography.Title level={5} style={{ marginTop: 0 }}>
                {t("timeline.title")}
            </Typography.Title>
            <Timeline
                mode="left"
                items={sortedEvents.map((event) => {
                    const tone = getTimelineTone(event);
                    return {
                        key: event.id,
                        color: tone.color,
                        dot: tone.icon,
                        label: new Date(event.occurredAt).toLocaleString(),
                        children: (
                            <div>
                                <Typography.Text strong>{localizeTimelineTitle(event, t)}</Typography.Text>
                                {event.description ? (
                                    <Typography.Paragraph type="secondary" style={{ marginBottom: 0, marginTop: 4 }}>
                                        {localizeTimelineDescription(event.description, t)}
                                    </Typography.Paragraph>
                                ) : null}
                                {event.actor ? (
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        {t("timeline.actor", {
                                            actor: localizeTimelineActor(event.actor, t) ?? event.actor,
                                        })}
                                    </Typography.Text>
                                ) : null}
                            </div>
                        ),
                    };
                })}
            />
        </div>
    );
}
