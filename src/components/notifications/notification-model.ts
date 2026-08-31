import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import type { NotificationSeverity, TaskPriority } from "@/lib/api";

dayjs.extend(relativeTime);

function resolveDayjsLocale(locale?: string): string {
    if (!locale) {
        return "en";
    }
    return locale.toLowerCase().startsWith("zh") ? "zh-cn" : "en";
}

function trimTrailingPunctuation(value: string): string {
    return value.replace(/[。.,，\s]+$/u, "").trim();
}

function formatNumericAmount(value: number, locale: string): string {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatNotificationTime(
    value: string,
    locale = "en",
    now: Date = new Date(),
): string {
    return dayjs(value).locale(resolveDayjsLocale(locale)).from(dayjs(now));
}

export function extractReferenceCode(value: string | undefined): string | null {
    if (!value) {
        return null;
    }
    const match = value.match(/\b\d{8,}\b/u);
    return match?.[0] ?? null;
}

export function splitNotificationHeading(value: string | undefined): {
    title: string;
    referenceCode: string | null;
} {
    const raw = value?.trim() ?? "";
    const referenceCode = extractReferenceCode(raw);
    if (!referenceCode) {
        return { title: raw, referenceCode: null };
    }
    const title = raw
        .replace(new RegExp(`[:：#\\s-]*${referenceCode}\\s*$`, "u"), "")
        .replace(/[:：#\s-]+$/u, "")
        .trim();

    return { title, referenceCode };
}

export function formatNotificationDetailLines(
    value: string | undefined,
    locale = "en",
): string[] {
    if (!value) {
        return [];
    }

    const lines: string[] = [];
    const amountMatch = value.match(/金额[:：]?\s*([¥￥$])?\s*([\d,]+(?:\.\d+)?)/u);
    if (amountMatch) {
        const symbol = amountMatch[1] ?? (locale.toLowerCase().startsWith("zh") ? "¥" : "");
        const amount = Number.parseFloat(amountMatch[2].replace(/,/g, ""));
        if (Number.isFinite(amount)) {
            lines.push(`金额：${symbol}${formatNumericAmount(amount, locale)}`);
        }
    }

    const accountMatch = value.match(/(?:收款账户|账户)[:：]?\s*([^，。,]+)/u);
    if (accountMatch) {
        lines.push(`账户：${trimTrailingPunctuation(accountMatch[1])}`);
    }

    if (lines.length > 0) {
        return lines;
    }

    return value
        .split(/[|，,]/u)
        .map((part) => trimTrailingPunctuation(part))
        .filter(Boolean);
}

export function getSeverityColor(severity: NotificationSeverity): string {
    switch (severity) {
        case "ERROR":
            return "#ef4444";
        case "WARNING":
            return "#f59e0b";
        case "SUCCESS":
            return "#22c55e";
        case "INFO":
        default:
            return "#3b82f6";
    }
}

export function getTaskPriorityColor(priority: TaskPriority): string {
    switch (priority) {
        case "CRITICAL":
            return "red";
        case "HIGH":
            return "orange";
        case "MEDIUM":
            return "gold";
        case "LOW":
            return "blue";
        default:
            return "default";
    }
}

export function isTaskUrgent(priority: TaskPriority): boolean {
    return priority === "CRITICAL" || priority === "HIGH";
}

export function isNotificationUnread(readAt?: string | null): boolean {
    return !readAt;
}

export function truncateText(value: string | undefined, maxLength: number): string | undefined {
    if (!value) {
        return undefined;
    }
    if (value.length <= maxLength) {
        return value;
    }
    return `${value.slice(0, maxLength - 1)}…`;
}

export function isTaskOverdue(dueAt: string | undefined, now = new Date()): boolean {
    if (!dueAt) {
        return false;
    }
    return new Date(dueAt).getTime() <= now.getTime();
}
