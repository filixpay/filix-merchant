"use client";

import { Button, Popconfirm, Switch, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { PaymentConfigView } from "@/lib/api";
import { getChannelProviderTone } from "./config-model";
import styles from "./ConfigChannelRow.module.css";

interface ConfigChannelRowProps {
    config: PaymentConfigView;
    channelLabel: string;
    routeActiveLabel: string;
    routeStoppedLabel: string;
    deleteConfirmText: string;
    submitText: string;
    cancelText: string;
    statusUpdating?: boolean;
    onEdit: (config: PaymentConfigView) => void;
    onDelete: (id: number) => void;
    onToggleOpen: (config: PaymentConfigView, open: boolean) => void;
}

export default function ConfigChannelRow({
    config,
    channelLabel,
    routeActiveLabel,
    routeStoppedLabel,
    deleteConfirmText,
    submitText,
    cancelText,
    statusUpdating = false,
    onEdit,
    onDelete,
    onToggleOpen,
}: ConfigChannelRowProps) {
    const isOpen = config.openStatus === "OPENED";
    const tone = getChannelProviderTone(config.channelCode);

    return (
        <div className={`${styles.row} ${isOpen ? "" : styles.rowClosed}`.trim()}>
            <div className={styles.identity}>
                <span
                    className={styles.providerMark}
                    style={{ background: tone.background, color: tone.color }}
                    aria-hidden
                >
                    {tone.abbreviation}
                </span>
                <div className={styles.meta}>
                    <Typography.Text className={styles.label} ellipsis>
                        {channelLabel}
                    </Typography.Text>
                    <span className={`${styles.routeHint} ${isOpen ? styles.routeHintActive : ""}`}>
                        {isOpen ? `● ${routeActiveLabel}` : `○ ${routeStoppedLabel}`}
                    </span>
                </div>
            </div>

            <div className={styles.actions}>
                <Switch
                    size="small"
                    checked={isOpen}
                    loading={statusUpdating}
                    className={isOpen ? styles.switchOpen : styles.switchClosed}
                    onChange={(checked) => onToggleOpen(config, checked)}
                    aria-label={channelLabel}
                />
                <span className={styles.actionDivider} aria-hidden />
                <div className={styles.actionGroup}>
                    <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(config)}
                        aria-label="edit"
                    />
                    <Popconfirm
                        title={deleteConfirmText}
                        onConfirm={() => onDelete(config.id)}
                        okText={submitText}
                        cancelText={cancelText}
                    >
                        <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            aria-label="delete"
                        />
                    </Popconfirm>
                </div>
            </div>
        </div>
    );
}
