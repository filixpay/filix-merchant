"use client";

import Link from "next/link";
import { Button, Card, Skeleton, Space, Tag, Typography } from "antd";
import { CheckSquare } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { getTaskPriorityColor } from "./notification-model";
import { resolveActionPath } from "@/lib/notifications/resolve-action-path";
import { useOpenTasks } from "@/lib/notifications/use-open-tasks";

export default function ActionCenterWidget() {
    const t = useTranslations("Notifications");
    const locale = useLocale();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const { summary, loading } = useOpenTasks(accessToken);

    if (loading) {
        return <Skeleton active paragraph={{ rows: 3 }} />;
    }

    if (summary.openTasks === 0) {
        return null;
    }

    const topTask = summary.topTask;
    const centerHref = `/${locale}/dashboard/notifications?tab=tasks`;

    return (
        <Card
            size="small"
            title={
                <Space>
                    <CheckSquare size={18} strokeWidth={1.5} />
                    {t("widget.action_center")}
                </Space>
            }
            extra={
                <Link href={centerHref}>
                    <Button type="link" size="small">
                        {t("view_all")}
                    </Button>
                </Link>
            }
        >
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Typography.Text type="secondary">
                    {t("widget.summary", {
                        openTasks: summary.openTasks,
                        overdue: summary.overdue,
                    })}
                </Typography.Text>
                {topTask ? (
                    <div>
                        <Space size={4} wrap>
                            <Tag color={getTaskPriorityColor(topTask.priority)}>
                                {t(`priority.${topTask.priority}`)}
                            </Tag>
                            <Typography.Text strong>{topTask.title}</Typography.Text>
                        </Space>
                        {topTask.description ? (
                            <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
                                {topTask.description}
                            </Typography.Paragraph>
                        ) : null}
                        <Link href={resolveActionPath(locale, topTask.actionPath)}>
                            <Button size="small">{t("task.action")}</Button>
                        </Link>
                    </div>
                ) : null}
            </Space>
        </Card>
    );
}
