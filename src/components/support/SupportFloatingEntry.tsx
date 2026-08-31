"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Tooltip } from "antd";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import SupportDrawer from "./SupportDrawer";
import { useSupportUnreadCount } from "./useSupportUnreadCount";
import styles from "./SupportFloatingEntry.module.css";

const COLLAPSED_STORAGE_KEY = "filixpay.support.fab.collapsed";

export default function SupportFloatingEntry() {
    const t = useTranslations("Support");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const { count: unreadCount, refresh: refreshUnreadCount } = useSupportUnreadCount(accessToken, {
        pause: open,
    });

    useEffect(() => {
        try {
            setCollapsed(window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === "1");
        } catch {
            setCollapsed(false);
        }
    }, []);

    const persistCollapsed = (next: boolean) => {
        setCollapsed(next);
        try {
            window.localStorage.setItem(COLLAPSED_STORAGE_KEY, next ? "1" : "0");
        } catch {
            // Ignore storage failures (private mode / disabled storage).
        }
    };

    const handleClose = () => {
        setOpen(false);
        void refreshUnreadCount();
    };

    const entryLabel =
        unreadCount > 0 ? t("entry_label_with_unread", { count: unreadCount }) : t("entry_label");

    return (
        <>
            <div className={`${styles.supportFab} ${collapsed ? styles.collapsed : ""}`}>
                {collapsed ? (
                    <div className={styles.expandedWrap}>
                        <Tooltip title={entryLabel} placement="left">
                            <Badge
                                count={unreadCount}
                                size="small"
                                overflowCount={9}
                                offset={[-2, 2]}
                                className={styles.badge}
                            >
                                <button
                                    type="button"
                                    className={styles.collapsedButton}
                                    onClick={() => setOpen(true)}
                                    aria-label={entryLabel}
                                >
                                    <MessageCircle size={18} />
                                </button>
                            </Badge>
                        </Tooltip>
                        <Tooltip title={t("entry_expand")} placement="top">
                            <button
                                type="button"
                                className={styles.collapseControl}
                                onClick={() => persistCollapsed(false)}
                                aria-label={t("entry_expand")}
                            >
                                <ChevronUp size={12} />
                            </button>
                        </Tooltip>
                    </div>
                ) : (
                    <div className={styles.expandedWrap}>
                        <Badge
                            count={unreadCount}
                            size="small"
                            overflowCount={9}
                            offset={[-2, 2]}
                            className={styles.badge}
                        >
                            <Button
                                type="primary"
                                className={styles.fabButton}
                                icon={<MessageCircle size={18} />}
                                onClick={() => setOpen(true)}
                                aria-label={entryLabel}
                            >
                                {t("entry_label")}
                            </Button>
                        </Badge>
                        <Tooltip title={t("entry_collapse")} placement="top">
                            <button
                                type="button"
                                className={styles.collapseControl}
                                onClick={() => persistCollapsed(true)}
                                aria-label={t("entry_collapse")}
                            >
                                <ChevronDown size={12} />
                            </button>
                        </Tooltip>
                    </div>
                )}
            </div>
            <SupportDrawer
                open={open}
                onClose={handleClose}
                onConversationSeen={refreshUnreadCount}
            />
        </>
    );
}
