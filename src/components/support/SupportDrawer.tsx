"use client";

import { useCallback, useEffect, useState } from "react";
import {
    App,
    Button,
    Drawer,
    Empty,
    Form,
    Input,
    Skeleton,
    Space,
    Tag,
} from "antd";
import { ChevronRight, Clock, Headphones, Plus, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { api, ApiError, type SupportConversation, type SupportMessage } from "@/lib/api";
import { isSupportConversationUnread, markSupportConversationSeen } from "./support-seen-state";
import styles from "./SupportDrawer.module.css";

type DrawerView = "list" | "create" | "detail";

type SupportDrawerProps = {
    open: boolean;
    onClose: () => void;
    onConversationSeen?: () => void;
};

function formatDateTime(value: string | undefined) {
    if (!value) return "—";
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("YYYY-MM-DD HH:mm") : value;
}

function formatTime(value: string | undefined) {
    if (!value) return "—";
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("HH:mm") : value;
}

function StatusBadge({ status, t }: { status: SupportConversation["status"]; t: (key: string) => string }) {
    return (
        <Tag className={status === "OPEN" ? styles.statusOpen : styles.statusAnswered} bordered={false}>
            {status === "OPEN" ? t("status.open") : t("status.answered")}
        </Tag>
    );
}

export default function SupportDrawer({ open, onClose, onConversationSeen }: SupportDrawerProps) {
    const t = useTranslations("Support");
    const { message } = App.useApp();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [view, setView] = useState<DrawerView>("list");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [conversations, setConversations] = useState<SupportConversation[]>([]);
    const [selected, setSelected] = useState<SupportConversation | null>(null);
    const [messages, setMessages] = useState<SupportMessage[]>([]);
    const [form] = Form.useForm<{ content: string }>();

    const resetToList = useCallback(() => {
        setView("list");
        setSelected(null);
        setMessages([]);
        form.resetFields();
    }, [form]);

    const loadList = useCallback(async () => {
        if (!accessToken) return;
        setLoading(true);
        try {
            const result = await api.support.list(accessToken, { page: 0, size: 50 });
            setConversations(result.items);
        } catch (error) {
            message.error(error instanceof ApiError ? error.message : t("errors.load_list"));
            setConversations([]);
        } finally {
            setLoading(false);
        }
    }, [accessToken, message, t]);

    const loadDetail = useCallback(
        async (conversationId: string) => {
            if (!accessToken) return;
            setLoading(true);
            try {
                const [conversation, thread] = await Promise.all([
                    api.support.get(accessToken, conversationId),
                    api.support.listMessages(accessToken, conversationId),
                ]);
                setSelected(conversation);
                setMessages(thread);
                markSupportConversationSeen(conversation.id, conversation.lastMessageAt);
                onConversationSeen?.();
            } catch (error) {
                message.error(error instanceof ApiError ? error.message : t("errors.load_detail"));
                resetToList();
            } finally {
                setLoading(false);
            }
        },
        [accessToken, message, onConversationSeen, resetToList, t],
    );

    useEffect(() => {
        if (!open) {
            resetToList();
            return;
        }
        if (view === "list") {
            void loadList();
        }
    }, [open, view, loadList, resetToList]);

    const handleRefresh = () => {
        if (view === "detail" && selected) {
            void loadDetail(selected.id);
            return;
        }
        void loadList();
    };

    const handleCreate = async (values: { content: string }) => {
        if (!accessToken) return;
        setSubmitting(true);
        try {
            const created = await api.support.create(accessToken, { content: values.content.trim() });
            message.success(t("create_success"));
            setView("detail");
            await loadDetail(created.id);
        } catch (error) {
            message.error(error instanceof ApiError ? error.message : t("errors.create"));
        } finally {
            setSubmitting(false);
        }
    };

    const drawerTitle =
        view === "create" ? (
            t("create_title")
        ) : view === "detail" && selected ? (
            <div className={styles.detailTitle}>
                <span>{t("ticket_title", { number: selected.conversationNumber })}</span>
                <StatusBadge status={selected.status} t={t} />
            </div>
        ) : (
            t("title")
        );

    const drawerExtra = (
        <Space>
            {view !== "list" ? (
                <Button type="link" onClick={() => resetToList()}>
                    {t("back_to_list")}
                </Button>
            ) : (
                <Button type="primary" icon={<Plus size={16} />} onClick={() => setView("create")}>
                    {t("new_question")}
                </Button>
            )}
            <Button icon={<RefreshCw size={16} />} onClick={handleRefresh} loading={loading}>
                {t("refresh")}
            </Button>
        </Space>
    );

    return (
        <Drawer
            title={drawerTitle}
            open={open}
            onClose={onClose}
            width={480}
            destroyOnHidden
            extra={drawerExtra}
            styles={{ body: { paddingBottom: 0 } }}
        >
            <div className={styles.drawerBody}>
                {view === "list" ? (
                    loading ? (
                        <Skeleton active paragraph={{ rows: 5 }} />
                    ) : conversations.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Empty description={t("empty.list")} />
                        </div>
                    ) : (
                        <div className={styles.list}>
                            {conversations.map((conversation) => {
                                const unread = isSupportConversationUnread(conversation);
                                return (
                                    <button
                                        key={conversation.id}
                                        type="button"
                                        className={`${styles.listItem} ${unread ? styles.listItemUnread : ""}`}
                                        onClick={() => {
                                            setView("detail");
                                            void loadDetail(conversation.id);
                                        }}
                                    >
                                        <div className={styles.listItemHeader}>
                                            <span className={styles.listItemNumber}>
                                                {unread ? <span className={styles.unreadDot} aria-hidden /> : null}
                                                {conversation.conversationNumber}
                                            </span>
                                            <StatusBadge status={conversation.status} t={t} />
                                        </div>
                                        <div className={styles.listItemSubject}>
                                            <span className={styles.subjectLabel}>{t("subject_label")}</span>
                                            {conversation.subject}
                                        </div>
                                        <div className={styles.listItemFooter}>
                                            <span className={styles.listItemTime}>
                                                <Clock size={13} aria-hidden />
                                                {formatDateTime(conversation.lastMessageAt)}
                                            </span>
                                            <span className={styles.viewDetail}>
                                                {t("view_detail")}
                                                <ChevronRight size={14} aria-hidden />
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )
                ) : null}

                {view === "create" ? (
                    <Form form={form} layout="vertical" onFinish={handleCreate} className={styles.createForm}>
                        <Form.Item
                            name="content"
                            label={t("question_label")}
                            rules={[{ required: true, whitespace: true, message: t("errors.blank_content") }]}
                        >
                            <Input.TextArea rows={6} placeholder={t("question_placeholder")} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={submitting} block>
                            {t("submit_question")}
                        </Button>
                    </Form>
                ) : null}

                {view === "detail" && selected ? (
                    <div className={styles.detailBody}>
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 4 }} />
                        ) : messages.length === 0 ? (
                            <Empty description={t("empty.messages")} />
                        ) : (
                            <div className={styles.messageList}>
                                {messages.map((item) => {
                                    const isMerchant = item.senderType === "MERCHANT";
                                    return (
                                        <div
                                            key={item.id}
                                            className={`${styles.messageRow} ${
                                                isMerchant ? styles.messageRowMerchant : styles.messageRowOperator
                                            }`}
                                        >
                                            <div className={styles.messageMeta}>
                                                {isMerchant ? (
                                                    <>
                                                        <span>{t("sender.merchant")}</span>
                                                        <span>{formatTime(item.createdAt)}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Headphones size={13} aria-hidden />
                                                        <span>{t("sender.operator")}</span>
                                                        <span>{formatTime(item.createdAt)}</span>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                className={`${styles.messageBubble} ${
                                                    isMerchant
                                                        ? styles.messageBubbleMerchant
                                                        : styles.messageBubbleOperator
                                                }`}
                                            >
                                                <div className={styles.messageContent}>{item.content}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {selected.status === "ANSWERED" ? (
                            <div className={styles.answeredFooter}>
                                <span>{t("answered_hint")}</span>
                                <Button type="link" className={styles.newTicketLink} onClick={() => setView("create")}>
                                    {t("create_new_ticket")}
                                </Button>
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </Drawer>
    );
}
