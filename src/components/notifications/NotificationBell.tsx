"use client";

import Link from "next/link";
import { Badge, Button, Dropdown, Skeleton } from "antd";
import { Bell, CheckSquare } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import NotificationList from "./NotificationList";
import TaskList from "./TaskList";
import { useNotifications } from "@/lib/notifications/use-notifications";
import { useOpenTasks } from "@/lib/notifications/use-open-tasks";
import styles from "./NotificationBell.module.css";

function SectionSkeleton() {
    return <Skeleton active paragraph={{ rows: 2 }} title={false} />;
}

export default function NotificationBell({ triggerClassName }: { triggerClassName?: string }) {
    const t = useTranslations("Notifications");
    const locale = useLocale();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const {
        items: unreadNotifications,
        total: unreadTotal,
        loading: notificationsLoading,
    } = useNotifications(accessToken, {
        page: 0,
        size: 3,
        unread: true,
    });
    const { summary, total: openTaskTotal, loading: tasksLoading } = useOpenTasks(accessToken, 1);

    // Badge follows list totals (same source as dropdown / notifications page),
    // not getCounts — counts can stay stale at 0 after new notifications arrive.
    const badgeCount = unreadTotal + openTaskTotal;
    const topTask = summary.topTask;
    const centerHref = `/${locale}/dashboard/notifications`;

    const dropdownContent = (
        <div className={styles.dropdownPanel}>
            <div className={styles.dropdownHeader}>{t("title")}</div>

            <div className={styles.dropdownSection}>{t("counts.unread")}</div>
            <div className={styles.sectionBody}>
                {notificationsLoading ? (
                    <SectionSkeleton />
                ) : (
                    <NotificationList
                        compact
                        items={unreadNotifications}
                        emptyText={t("empty.unread")}
                    />
                )}
            </div>

            <div className={styles.dropdownSection}>{t("counts.open_tasks")}</div>
            <div className={styles.sectionBody}>
                {tasksLoading ? (
                    <SectionSkeleton />
                ) : topTask ? (
                    <TaskList compact items={[topTask]} />
                ) : (
                    <div className={styles.emptyInline}>{t("empty.tasks")}</div>
                )}
            </div>

            <div className={styles.dropdownFooter}>
                <Link href={centerHref}>{t("view_all")}</Link>
            </div>
        </div>
    );

    return (
        <Dropdown
            popupRender={() => dropdownContent}
            trigger={["click"]}
            placement="bottomRight"
            classNames={{ root: styles.dropdownOverlay }}
        >
            <Badge count={badgeCount} size="small" offset={[-2, 2]} className={styles.bellBadge}>
                <Button
                    type="text"
                    className={`${styles.bellButton} ${triggerClassName ?? ""}`.trim()}
                    aria-label={t("title")}
                >
                    <span className={styles.bellIcons}>
                        <Bell size={18} strokeWidth={1.5} />
                        {openTaskTotal > 0 ? (
                            <CheckSquare size={12} strokeWidth={1.5} className={styles.taskHint} />
                        ) : null}
                    </span>
                </Button>
            </Badge>
        </Dropdown>
    );
}
