"use client";

import { useTranslations } from "next-intl";
import { getResponseDueInfo } from "./dispute-model";
import styles from "./DisputeOperationalKpis.module.css";

interface ResponseDueDisplayProps {
    responseDueAt: string;
    now?: number;
}

export default function ResponseDueDisplay({ responseDueAt, now }: ResponseDueDisplayProps) {
    const t = useTranslations("Disputes");
    const info = getResponseDueInfo(responseDueAt, now);
    const dateLabel = new Date(responseDueAt).toLocaleString();

    const hintClass = {
        normal: styles.dueHintNormal,
        soon: styles.dueHintSoon,
        critical: styles.dueHintCritical,
        overdue: styles.dueHintOverdue,
    }[info.urgency];

    const hintText = (() => {
        switch (info.urgency) {
            case "overdue":
                return t("response_due.overdue");
            case "critical":
                return t("response_due.hours_left", { hours: info.hoursRemaining });
            case "soon":
            case "normal":
                return t("response_due.days_left", { days: info.daysRemaining });
            default:
                return null;
        }
    })();

    return (
        <div className={styles.dueCell}>
            <span className={styles.dueDate}>{dateLabel}</span>
            {hintText ? <span className={`${styles.dueHint} ${hintClass}`}>{hintText}</span> : null}
        </div>
    );
}
