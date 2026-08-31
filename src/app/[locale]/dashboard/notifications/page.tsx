"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Badge, Button, Segmented, Tabs } from "antd";
import { api, type ActionTaskView, type MerchantNotification } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import NotificationList from "@/components/notifications/NotificationList";
import TaskList from "@/components/notifications/TaskList";
import { invalidateNotificationState } from "@/lib/notifications/invalidate";
import { useNotifications } from "@/lib/notifications/use-notifications";
import { useOpenTasks } from "@/lib/notifications/use-open-tasks";
import { useSelectedOrganizationCode } from "@/lib/organization/use-selected-organization-code";
import styles from "./page.module.css";

type NotificationFilter = "all" | "unread";
type CenterTab = "notifications" | "tasks";
type TaskFilter = "open" | "completed";

export default function NotificationsPage() {
    const t = useTranslations("Notifications");
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const organizationCode = useSelectedOrganizationCode();

    const activeTab: CenterTab = searchParams.get("tab") === "tasks" ? "tasks" : "notifications";
    const [notificationFilter, setNotificationFilter] = useState<NotificationFilter>("all");
    const [taskFilter, setTaskFilter] = useState<TaskFilter>("open");
    const [markingAll, setMarkingAll] = useState(false);
    const [completedTasks, setCompletedTasks] = useState<ActionTaskView[]>([]);
    const [completedLoading, setCompletedLoading] = useState(false);

    const unreadOnly = notificationFilter === "unread" ? true : undefined;
    const {
        items: notifications,
        total: notificationTotal,
        loading: notificationsLoading,
    } = useNotifications(accessToken, { page: 0, size: 50, unread: unreadOnly });
    const { total: unreadTotal } = useNotifications(accessToken, {
        page: 0,
        size: 1,
        unread: true,
    });

    const {
        tasks: openTasks,
        total: openTaskTotal,
        loading: openTasksLoading,
    } = useOpenTasks(accessToken, 100);

    const loadCompletedTasks = useCallback(async () => {
        if (!accessToken || !organizationCode) {
            return;
        }
        setCompletedLoading(true);
        try {
            const response = await api.notifications.listTasks(accessToken, {
                page: 0,
                size: 50,
                status: "COMPLETED",
            });
            setCompletedTasks(response.items);
        } catch {
            setCompletedTasks([]);
        } finally {
            setCompletedLoading(false);
        }
    }, [accessToken, organizationCode]);

    useEffect(() => {
        if (activeTab === "tasks") {
            void loadCompletedTasks();
        }
    }, [activeTab, loadCompletedTasks]);

    const handleTabChange = (key: string) => {
        const next = key === "tasks" ? "tasks" : "notifications";
        router.replace(`/${locale}/dashboard/notifications?tab=${next}`);
    };

    const handleMarkAllRead = async () => {
        if (!accessToken) {
            return;
        }
        setMarkingAll(true);
        try {
            await api.notifications.markAllRead(accessToken);
            invalidateNotificationState();
        } finally {
            setMarkingAll(false);
        }
    };

    const notificationItems: MerchantNotification[] = notifications;
    const activeTaskItems = taskFilter === "completed" ? completedTasks : openTasks;
    const activeTaskLoading = taskFilter === "completed" ? completedLoading : openTasksLoading;
    const activeTaskTotal = taskFilter === "completed" ? completedTasks.length : openTaskTotal;
    const activeTaskEmptyText =
        taskFilter === "completed" ? t("empty.completed_tasks") : t("empty.tasks");

    return (
        <DashboardPage
            title={t("title")}
            subtitle={t("subtitle")}
            extra={
                activeTab === "notifications" ? (
                    <Button loading={markingAll} onClick={() => void handleMarkAllRead()}>
                        {t("mark_all_read")}
                    </Button>
                ) : null
            }
            plain
        >
            <div className={styles.pageBody}>
                <Tabs
                    className={styles.tabs}
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    items={[
                        {
                            key: "notifications",
                            label: t("tab.notifications"),
                            children: (
                                <div className={styles.listSection}>
                                    <div className={styles.toolbar}>
                                        <Segmented
                                            value={notificationFilter}
                                            onChange={(value) => setNotificationFilter(value as NotificationFilter)}
                                            options={[
                                                { label: t("filter.all"), value: "all" },
                                                {
                                                    label: (
                                                        <span className={styles.filterLabel}>
                                                            <span>{t("filter.unread")}</span>
                                                            {unreadTotal > 0 ? (
                                                                <Badge count={unreadTotal} size="small" />
                                                            ) : null}
                                                        </span>
                                                    ),
                                                    value: "unread",
                                                },
                                            ]}
                                        />
                                        <div className={styles.summary}>
                                            {t("showing_count", {
                                                shown: notificationItems.length,
                                                total: notificationTotal,
                                            })}
                                        </div>
                                    </div>
                                    {notificationsLoading ? (
                                        <div>{t("loading")}</div>
                                    ) : (
                                        <NotificationList
                                            items={notificationItems}
                                            pageMode
                                            emptyText={
                                                notificationFilter === "unread"
                                                    ? t("empty.unread")
                                                    : t("empty.notifications")
                                            }
                                        />
                                    )}
                                </div>
                            ),
                        },
                        {
                            key: "tasks",
                            label: (
                                <span className={styles.tabLabel}>
                                    <span>{t("tab.tasks")}</span>
                                    {openTaskTotal > 0 ? (
                                        <Badge count={openTaskTotal} size="small" />
                                    ) : null}
                                </span>
                            ),
                            children: (
                                <div className={styles.listSection}>
                                    <div className={styles.toolbar}>
                                        <Segmented
                                            value={taskFilter}
                                            onChange={(value) => setTaskFilter(value as TaskFilter)}
                                            options={[
                                                { label: t("tasks.open"), value: "open" },
                                                { label: t("tasks.completed"), value: "completed" },
                                            ]}
                                        />
                                        <div className={styles.summary}>
                                            {t("showing_count", {
                                                shown: activeTaskItems.length,
                                                total: activeTaskTotal,
                                            })}
                                        </div>
                                    </div>
                                    {activeTaskLoading ? (
                                        <div>{t("loading")}</div>
                                    ) : (
                                        <TaskList
                                            items={activeTaskItems}
                                            pageMode
                                            showResolvedReason={taskFilter === "completed"}
                                            emptyText={activeTaskEmptyText}
                                        />
                                    )}
                                    {!activeTaskLoading && taskFilter === "open" && openTaskTotal > openTasks.length ? (
                                        <div className={styles.resultHint}>
                                            {t("showing_count", {
                                                shown: openTasks.length,
                                                total: openTaskTotal,
                                            })}
                                        </div>
                                    ) : null}
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </DashboardPage>
    );
}
