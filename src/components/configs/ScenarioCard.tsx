"use client";

import { AlertOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { useTranslations } from "next-intl";
import type { ChannelView, PaymentConfigView } from "@/lib/api";
import ConfigChannelRow from "./ConfigChannelRow";
import { getChannelLabel } from "./config-model";
import {
    getScenarioStatusMessageKey,
    type ScenarioGroup,
} from "./scenario-group";
import styles from "./ScenarioCard.module.css";

interface ScenarioCardProps {
    group: ScenarioGroup;
    channels: ChannelView[];
    statusUpdatingId?: number | null;
    onEdit: (config: PaymentConfigView) => void;
    onDelete: (id: number) => void;
    onToggleOpen: (config: PaymentConfigView, open: boolean) => void;
    onAddChannel: (group: ScenarioGroup) => void;
}

export default function ScenarioCard({
    group,
    channels,
    statusUpdatingId = null,
    onEdit,
    onDelete,
    onToggleOpen,
    onAddChannel,
}: ScenarioCardProps) {
    const t = useTranslations("Configs");
    const tCommon = useTranslations("Common");
    const isUnavailable = group.status.level === "none";
    const badgeClass =
        group.status.level === "full"
            ? styles.badgeFull
            : group.status.level === "partial"
              ? styles.badgePartial
              : styles.badgeNone;

    return (
        <article className={`${styles.card} ${isUnavailable ? styles.cardMuted : ""}`.trim()}>
            <header className={styles.header}>
                <h3 className={styles.sceneName}>{group.scenarioName}</h3>
                <div className={styles.headerActions}>
                    <span className={`${styles.badge} ${badgeClass}`}>
                        <span className={styles.badgeDot} aria-hidden />
                        {t("availability_badge", {
                            available: group.status.available,
                            total: group.status.total,
                        })}
                    </span>
                    <Button
                        type="link"
                        size="small"
                        className={styles.addChannelBtn}
                        icon={<PlusOutlined />}
                        onClick={() => onAddChannel(group)}
                    >
                        {t("add_channel")}
                    </Button>
                </div>
            </header>

            <div className={styles.body}>
                <Typography.Text className={styles.subMerchant}>
                    {t("headers.sub_merchant")}: {group.subMerchantName}
                </Typography.Text>
                <div className={styles.metaRow}>
                    <span className={styles.metaChip}>
                        {t("headers.payment_brand")}: {group.institutionName}
                    </span>
                </div>

                <div className={styles.sectionLabel}>{t("channels_section")}</div>
                <div className={styles.channelList}>
                    {group.configs.map((config) => (
                        <ConfigChannelRow
                            key={config.id}
                            config={config}
                            channelLabel={getChannelLabel(config.channelCode, channels, config.channelName)}
                            routeActiveLabel={t("channel_route_active")}
                            routeStoppedLabel={t("channel_route_stopped")}
                            deleteConfirmText={t("confirm_delete")}
                            submitText={tCommon("submit")}
                            cancelText={tCommon("cancel")}
                            statusUpdating={statusUpdatingId === config.id}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleOpen={onToggleOpen}
                        />
                    ))}
                </div>

                {isUnavailable ? (
                    <div className={styles.alert} role="status">
                        <AlertOutlined className={styles.alertIcon} />
                        <span>{t(getScenarioStatusMessageKey(group))}</span>
                    </div>
                ) : null}
            </div>
        </article>
    );
}
