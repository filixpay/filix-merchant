import type { TraceTimelineItem, TraceTimelineMetadata } from "@/lib/api/orders";
import { isLikelyMaskedValue, truncateMiddleText } from "./order-detail-format";

export type LifecycleTimelineFilter = "all" | "payment" | "risk" | "review" | "system";

export type LifecycleMetadataRow = {
    key: string;
    label: string;
    value: string;
    copyable?: boolean;
    copyValue?: string;
    href?: string;
};

type MetadataLabels = {
    channel: string;
    provider: string;
    error: string;
    review: string;
    fraud: string;
    rule: string;
    action: string;
    statusChange: string;
    reason: string;
    maskedValue: string;
    attemptId: string;
    webhookSource: string;
};

export type LifecycleValueResolvers = {
    resolveChannel?: (code: string) => string;
    resolveStatus?: (status: string) => string;
};

export function buildLifecycleMetadataRows(
    item: TraceTimelineItem,
    labels: MetadataLabels,
    locale: string,
    resolvers?: LifecycleValueResolvers,
): LifecycleMetadataRow[] {
    const metadata = item.metadata;
    const rows: LifecycleMetadataRow[] = [];

    if (metadata?.channel) {
        rows.push({
            key: "channel",
            label: labels.channel,
            value: resolvers?.resolveChannel
                ? resolvers.resolveChannel(metadata.channel)
                : metadata.channel,
        });
    }
    if (metadata?.provider) {
        rows.push({
            key: "provider",
            label: labels.provider,
            value: metadata.provider,
        });
    }
    if (metadata?.previousStatus || metadata?.newStatus) {
        const prev = metadata.previousStatus ?? "-";
        const next = metadata.newStatus ?? "-";
        const map = resolvers?.resolveStatus;
        rows.push({
            key: "statusChange",
            label: labels.statusChange,
            value: `${map ? map(prev) : prev} → ${map ? map(next) : next}`,
        });
    }
    if (metadata?.reason) {
        rows.push({
            key: "reason",
            label: isLikelyMaskedValue(metadata.reason) ? labels.maskedValue : labels.reason,
            value: metadata.reason,
        });
    }
    if (metadata?.primaryRule) {
        rows.push({
            key: "rule",
            label: labels.rule,
            value: metadata.primaryRule,
        });
    }
    if (metadata?.errorCode) {
        rows.push({
            key: "error",
            label: labels.error,
            value: metadata.errorCode,
        });
    }
    if (metadata?.riskActionPublicId) {
        rows.push({
            key: "action",
            label: labels.action,
            value: truncateMiddleText(metadata.riskActionPublicId),
            copyable: true,
            copyValue: metadata.riskActionPublicId,
        });
    }
    if (metadata?.webhookSource) {
        rows.push({
            key: "webhookSource",
            label: labels.webhookSource,
            value: metadata.webhookSource,
        });
    }
    if (metadata?.reviewId) {
        rows.push({
            key: "review",
            label: labels.review,
            value: truncateMiddleText(metadata.reviewId),
            copyable: true,
            copyValue: metadata.reviewId,
            href: `/${locale}/dashboard/risk-reviews/${metadata.reviewId}`,
        });
    }
    if (metadata?.fraudEventId) {
        rows.push({
            key: "fraud",
            label: labels.fraud,
            value: truncateMiddleText(metadata.fraudEventId),
            copyable: true,
            copyValue: metadata.fraudEventId,
            href: `/${locale}/dashboard/fraud/${metadata.fraudEventId}`,
        });
    }
    appendExtensionMetadataRows(rows, metadata, labels);

    if (item.paymentAttemptId != null) {
        const fullId = String(item.paymentAttemptId);
        rows.push({
            key: "attemptId",
            label: labels.attemptId,
            value: truncateMiddleText(fullId),
            copyable: true,
            copyValue: fullId,
        });
    }

    return rows;
}

function appendExtensionMetadataRows(
    rows: LifecycleMetadataRow[],
    metadata: TraceTimelineMetadata | undefined,
    labels: MetadataLabels,
): void {
    if (!metadata?.extensions) {
        return;
    }
    for (const [key, rawValue] of Object.entries(metadata.extensions)) {
        if (rawValue == null || rawValue === "") {
            continue;
        }
        const value = String(rawValue);
        rows.push({
            key: `ext-${key}`,
            label: isLikelyMaskedValue(value) ? labels.maskedValue : key,
            value,
        });
    }
}

export function lifecycleEventTranslationKey(eventCode: string | undefined): string {
    return eventCode?.replace(/\./g, "_") ?? "unknown";
}

export function filterLifecycleTimelineItems(
    items: readonly TraceTimelineItem[],
    filter: LifecycleTimelineFilter,
    hideWebhookRetries: boolean,
): TraceTimelineItem[] {
    return items.filter((item) => {
        if (hideWebhookRetries && item.eventCode === "system.webhook_retry") {
            return false;
        }
        if (filter === "all") {
            return true;
        }
        const prefix = `${filter}.`;
        return item.eventCode?.startsWith(prefix) ?? false;
    });
}

export function buildLifecycleReplayPayload(item: TraceTimelineItem): Record<string, unknown> {
    const payload: Record<string, unknown> = {
        eventId: item.eventId,
        eventCode: item.eventCode,
        eventCategory: item.eventCategory,
        paymentAttemptId: item.paymentAttemptId,
        createdAt: item.createdAt,
    };
    if (item.metadata && Object.keys(item.metadata).length > 0) {
        payload.metadata = item.metadata;
    }
    return payload;
}
