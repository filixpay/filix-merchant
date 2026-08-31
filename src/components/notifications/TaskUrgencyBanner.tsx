"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "antd";
import { CloseOutlined, ExclamationCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { isTaskUrgent } from "./notification-model";
import { resolveActionPath } from "@/lib/notifications/resolve-action-path";
import { useOpenTasks } from "@/lib/notifications/use-open-tasks";
import styles from "./TaskUrgencyBanner.module.css";

export default function TaskUrgencyBanner({ layout = "inline" }: { layout?: "inline" | "strip" }) {
    const t = useTranslations("Notifications");
    const locale = useLocale();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const { summary } = useOpenTasks(accessToken);
    const [dismissedTaskId, setDismissedTaskId] = useState<string | null>(null);

    const topTask = summary.topTask;

    if (!topTask || !isTaskUrgent(topTask.priority) || dismissedTaskId === topTask.id) {
        return null;
    }

    const href = resolveActionPath(locale, topTask.actionPath);
    const isCritical = topTask.priority === "CRITICAL";

    return (
        <div
            className={`${styles.bar} ${layout === "strip" ? styles.stripBar : ""} ${isCritical ? styles.critical : styles.warning}`}
            role="status"
        >
            {isCritical ? (
                <ExclamationCircleOutlined className={styles.icon} aria-hidden />
            ) : (
                <WarningOutlined className={styles.icon} aria-hidden />
            )}
            <span className={styles.title}>{topTask.title}</span>
            {topTask.description ? (
                <>
                    <span className={styles.separator} aria-hidden>
                        ·
                    </span>
                    <span className={styles.message}>{topTask.description}</span>
                </>
            ) : null}
            <Link href={href}>
                <Button type="link" size="small" className={styles.action}>
                    {t("banner.action")}
                </Button>
            </Link>
            <Button
                type="text"
                size="small"
                className={styles.dismiss}
                icon={<CloseOutlined />}
                aria-label={t("banner.dismiss")}
                onClick={() => setDismissedTaskId(topTask.id)}
            />
        </div>
    );
}
