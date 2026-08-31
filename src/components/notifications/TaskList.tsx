"use client";

import Link from "next/link";
import { Button, Tag } from "antd";
import { useLocale, useTranslations } from "next-intl";
import type { ActionTaskView } from "@/lib/api";
import {
    extractReferenceCode,
    formatNotificationDetailLines,
    formatNotificationTime,
    getTaskPriorityColor,
    isTaskOverdue,
    splitNotificationHeading,
} from "./notification-model";
import { resolveActionPath } from "@/lib/notifications/resolve-action-path";
import styles from "./TaskList.module.css";

type TaskListProps = {
    items: ActionTaskView[];
    showResolvedReason?: boolean;
    emptyText?: string;
    compact?: boolean;
    pageMode?: boolean;
};

export default function TaskList({
    items,
    showResolvedReason = false,
    emptyText,
    compact = false,
    pageMode = false,
}: TaskListProps) {
    const t = useTranslations("Notifications");
    const locale = useLocale();

    const resolveActionLabel = (task: ActionTaskView) => {
        const haystack = `${task.title} ${task.taskType}`.toLowerCase();
        return haystack.includes("review") || task.title.includes("审核")
            ? t("task.review_action")
            : t("task.action");
    };

    if (items.length === 0) {
        return (
            <div className={compact ? styles.emptyCompact : styles.empty}>
                {emptyText ?? t("empty.tasks")}
            </div>
        );
    }

    return (
        <div
            className={[
                styles.list,
                compact ? styles.listCompact : "",
                pageMode ? styles.listPage : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {items.map((task) => {
                const overdue = task.dueAt ? isTaskOverdue(task.dueAt) : false;
                const heading = splitNotificationHeading(task.title);
                const referenceCode =
                    heading.referenceCode ??
                    extractReferenceCode(task.description) ??
                    extractReferenceCode(task.resolvedReason);
                const detailLines = formatNotificationDetailLines(task.description, locale);
                const timeValue = task.createdAt ?? task.dueAt;
                const statusLabel = showResolvedReason ? t("tasks.completed") : t("tasks.open");
                return (
                    <div
                        key={task.id}
                        className={[
                            styles.item,
                            compact ? styles.itemCompact : "",
                            pageMode ? styles.itemPage : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    >
                        {pageMode ? (
                            <div className={styles.pageGrid}>
                                <div className={styles.pageTitleCell}>
                                    <div className={styles.pageTitleRow}>
                                        <Tag color={getTaskPriorityColor(task.priority)}>
                                            {t(`priority.${task.priority}`)}
                                        </Tag>
                                        <span className={styles.title}>{heading.title}</span>
                                    </div>
                                </div>
                                <div className={styles.pageRefCell}>
                                    <div className={styles.pageColumnLabel}>{t("columns.reference")}</div>
                                    <div className={styles.pageReference}>{referenceCode ?? "—"}</div>
                                </div>
                                <div className={styles.pageDetailCell}>
                                    <div className={styles.pageColumnLabel}>{t("columns.details")}</div>
                                    {detailLines.length > 0 ? (
                                        detailLines.map((line) => (
                                            <div key={line} className={styles.pageDetailLine}>
                                                {line}
                                            </div>
                                        ))
                                    ) : task.description ? (
                                        <div className={styles.description}>{task.description}</div>
                                    ) : (
                                        <div className={styles.description}>—</div>
                                    )}
                                    {showResolvedReason && task.resolvedReason ? (
                                        <div className={styles.description}>{task.resolvedReason}</div>
                                    ) : null}
                                </div>
                                <div className={styles.pageMetaCell}>
                                    <div className={styles.pageColumnLabel}>{t("columns.status_time")}</div>
                                    <div className={styles.pageMetaStatus}>{statusLabel}</div>
                                    {timeValue ? (
                                        <div className={styles.due}>
                                            {showResolvedReason
                                                ? formatNotificationTime(timeValue, locale)
                                                : overdue
                                                  ? t("task.overdue", {
                                                        time: formatNotificationTime(task.dueAt ?? timeValue, locale),
                                                    })
                                                  : t("task.due", {
                                                        time: formatNotificationTime(task.dueAt ?? timeValue, locale),
                                                    })}
                                        </div>
                                    ) : null}
                                </div>
                                <div className={styles.pageActionCell}>
                                    <Link href={resolveActionPath(locale, task.actionPath)}>
                                        <Button type="primary" size="middle">
                                            {resolveActionLabel(task)}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={styles.body}>
                                    <div>
                                        <Tag color={getTaskPriorityColor(task.priority)}>
                                            {t(`priority.${task.priority}`)}
                                        </Tag>
                                        <span className={styles.title}>{task.title}</span>
                                    </div>
                                    {task.description ? (
                                        <div className={styles.description}>{task.description}</div>
                                    ) : null}
                                    {task.dueAt ? (
                                        <div className={`${styles.due} ${overdue ? styles.dueOverdue : ""}`}>
                                            {overdue
                                                ? t("task.overdue", {
                                                      time: formatNotificationTime(task.dueAt, locale),
                                                  })
                                                : t("task.due", {
                                                      time: formatNotificationTime(task.dueAt, locale),
                                                  })}
                                        </div>
                                    ) : null}
                                    {showResolvedReason && task.resolvedReason ? (
                                        <div className={styles.description}>{task.resolvedReason}</div>
                                    ) : null}
                                </div>
                                <Link href={resolveActionPath(locale, task.actionPath)}>
                                    <Button type="primary" size="small">
                                        {resolveActionLabel(task)}
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
