"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { MerchantNotification } from "@/lib/api";
import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import {
    extractReferenceCode,
    formatNotificationDetailLines,
    formatNotificationTime,
    getSeverityColor,
    isNotificationUnread,
    splitNotificationHeading,
    truncateText,
} from "./notification-model";
import { resolveActionPath } from "@/lib/notifications/resolve-action-path";
import {
    isExternalUrl,
    resolveResumeLinkUrl,
} from "@/lib/notifications/resolve-notification-link";
import { normalizeCheckoutUrl } from "@/lib/checkout/checkout-url";
import { invalidateNotificationState } from "@/lib/notifications/invalidate";
import styles from "./NotificationList.module.css";

type NotificationListProps = {
    items: MerchantNotification[];
    emptyText?: string;
    compact?: boolean;
    pageMode?: boolean;
};

export default function NotificationList({
    items,
    emptyText,
    compact = false,
    pageMode = false,
}: NotificationListProps) {
    const t = useTranslations("Notifications");
    const locale = useLocale();
    const router = useRouter();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    if (items.length === 0) {
        return (
            <div className={compact ? styles.emptyCompact : styles.empty}>
                {emptyText ?? t("empty.notifications")}
            </div>
        );
    }

    const handleClick = async (notification: MerchantNotification) => {
        if (accessToken && isNotificationUnread(notification.readAt)) {
            try {
                await api.notifications.markRead(notification.id, accessToken);
                invalidateNotificationState();
            } catch {
                // Navigation still proceeds if mark-read fails.
            }
        }

        if (notification.actionPath) {
            if (isExternalUrl(notification.actionPath)) {
                window.open(
                    normalizeCheckoutUrl(notification.actionPath),
                    "_blank",
                    "noopener,noreferrer",
                );
                return;
            }
            router.push(resolveActionPath(locale, notification.actionPath));
        }
    };

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
            {items.map((notification) => {
                const unread = isNotificationUnread(notification.readAt);
                const linkUrl = resolveResumeLinkUrl({
                    actionPath: notification.actionPath,
                    content: notification.content,
                });
                const heading = splitNotificationHeading(notification.title);
                const referenceCode = heading.referenceCode ?? extractReferenceCode(notification.content);
                const detailLines = formatNotificationDetailLines(notification.content, locale);
                return (
                    <button
                        key={notification.id}
                        type="button"
                        className={[
                            styles.item,
                            compact ? styles.itemCompact : "",
                            pageMode ? styles.itemPage : "",
                            unread ? styles.itemUnread : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        onClick={() => void handleClick(notification)}
                    >
                        <span
                            className={styles.severityBar}
                            style={{ background: getSeverityColor(notification.severity) }}
                            aria-hidden
                        />
                        {pageMode ? (
                            <div className={styles.pageGrid}>
                                <div className={styles.pageTitleCell}>
                                    <div className={styles.pageTitleRow}>
                                        {unread ? <span className={styles.unreadDot} aria-hidden /> : null}
                                        <span className={styles.pageTypeTag}>
                                            {t(`severity.${notification.severity}`)}
                                        </span>
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
                                    ) : notification.content ? (
                                        <div className={styles.summary}>{truncateText(notification.content, 160)}</div>
                                    ) : (
                                        <div className={styles.summary}>—</div>
                                    )}
                                    {linkUrl ? (
                                        <a
                                            className={styles.inlineLink}
                                            href={linkUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                window.open(linkUrl, "_blank", "noopener,noreferrer");
                                            }}
                                        >
                                            {t("resume_link")}
                                        </a>
                                    ) : null}
                                </div>
                                <div className={styles.pageMetaCell}>
                                    <div className={styles.pageColumnLabel}>{t("columns.status_time")}</div>
                                    <div className={styles.pageMetaStatus}>
                                        {unread ? t("status.unread") : t("status.read")}
                                    </div>
                                    <div className={styles.meta}>
                                        {formatNotificationTime(notification.createdAt, locale)}
                                    </div>
                                </div>
                                <div className={styles.pageActionCell}>
                                    <span className={styles.pageActionLabel}>{t("actions.view_details")}</span>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.content}>
                                <div className={styles.title}>
                                    {unread ? <span className={styles.unreadDot} aria-hidden /> : null}
                                    {notification.title}
                                </div>
                                {notification.content ? (
                                    <div className={styles.summary}>
                                        {truncateText(notification.content, 120)}
                                        {linkUrl ? (
                                            <>
                                                {" "}
                                                <a
                                                    className={styles.inlineLink}
                                                    href={linkUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        window.open(linkUrl, "_blank", "noopener,noreferrer");
                                                    }}
                                                >
                                                    {t("resume_link")}
                                                </a>
                                            </>
                                        ) : null}
                                    </div>
                                ) : null}
                                <div className={styles.meta}>{formatNotificationTime(notification.createdAt, locale)}</div>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
