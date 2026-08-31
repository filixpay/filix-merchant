import type { RiskEvent } from "@/lib/api/domains/risk/shared/contracts";

export const DISPUTE_REASON_CODE_KEYS = [
    "fraudulent",
    "duplicate",
    "product_not_received",
    "unrecognized",
    "credit_not_processed",
    "general",
    "incorrect_account_details",
    "insufficient_funds",
    "bank_cannot_process",
    "debit_not_authorized",
    "customer_initiated",
    "merchandise_or_service_not_received",
    "unauthorized",
    "merchandise_or_service_not_as_described",
    "cancelled_recurring_billing",
    "non_receipt",
    "not_as_described",
    "duplicate_transaction",
    "credit_not_received",
] as const;

export const DISPUTE_TIMELINE_EVENT_KEYS = [
    "CASE_OPENED",
    "EVIDENCE_DRAFT_SAVED",
    "EVIDENCE_SUBMITTED",
    "REVIEW_STARTED",
    "CHANNEL_STATUS_CHANGED",
    "CASE_RESOLVED",
    "LIABILITY_ACCEPTED",
    "EVIDENCE_FORWARDED_TO_CHANNEL",
    "CHANNEL_EVIDENCE_SUBMIT_FAILED",
] as const;

export const DISPUTE_TIMELINE_TITLE_KEYS = [
    "dispute_opened",
    "dispute_resolved",
    "evidence_draft_saved",
    "evidence_submitted",
    "under_bank_review",
    "liability_accepted",
    "channel_status_updated",
    "evidence_forwarded_to_channel",
    "channel_evidence_submit_failed",
] as const;

export const DISPUTE_TIMELINE_DESCRIPTION_KEYS = [
    "charge_dispute_created",
    "charge_dispute_updated",
    "charge_dispute_closed",
    "charge_dispute_funds_withdrawn",
    "charge_dispute_funds_reinstated",
    "customer_dispute_created",
    "customer_dispute_updated",
    "customer_dispute_resolved",
    "case_locked_for_review",
    "merchant_accepted_chargeback_liability",
] as const;

export const DISPUTE_TIMELINE_ACTOR_KEYS = ["system", "merchant"] as const;

export const DISPUTE_CHANNEL_STATUS_KEYS = [
    "needs_response",
    "under_review",
    "won",
    "lost",
    "charge_refunded",
    "warning_needs_response",
    "warning_under_review",
    "warning_closed",
] as const;

export const DISPUTE_RESOLUTION_KEYS = [
    "MERCHANT_WON",
    "BUYER_WON",
    "MERCHANT_ACCEPTED",
    "PARTIAL",
] as const;

type DisputeTranslator = (key: string, values?: Record<string, string | number>) => string;

export function normalizeDisputeLabelKey(value: string): string {
    return value.trim().toLowerCase().replace(/[\s.-]+/g, "_");
}

export function localizeDisputeReason(
    value: string | undefined | null,
    t: DisputeTranslator,
): string {
    if (!value) {
        return "-";
    }
    const key = normalizeDisputeLabelKey(value);
    if ((DISPUTE_REASON_CODE_KEYS as readonly string[]).includes(key)) {
        return t(`reason_codes.${key}`);
    }
    return value;
}

export function localizeTimelineTitle(event: RiskEvent, t: DisputeTranslator): string {
    if ((DISPUTE_TIMELINE_EVENT_KEYS as readonly string[]).includes(event.type)) {
        return t(`timeline.events.${event.type}`);
    }
    const titleKey = normalizeDisputeLabelKey(event.title);
    if ((DISPUTE_TIMELINE_TITLE_KEYS as readonly string[]).includes(titleKey)) {
        return t(`timeline.titles.${titleKey}`);
    }
    return event.title;
}

function localizeChannelStatus(status: string, t: DisputeTranslator): string {
    const key = normalizeDisputeLabelKey(status);
    if ((DISPUTE_CHANNEL_STATUS_KEYS as readonly string[]).includes(key)) {
        return t(`timeline.channel_statuses.${key}`);
    }
    return status;
}

const TIMELINE_ACTOR_FALLBACKS: Record<(typeof DISPUTE_TIMELINE_ACTOR_KEYS)[number], string> = {
    system: "System auto-trigger",
    merchant: "Merchant action",
};

function resolveTimelineActorKey(actor: string): (typeof DISPUTE_TIMELINE_ACTOR_KEYS)[number] | null {
    const trimmed = actor.trim();
    const normalized = normalizeDisputeLabelKey(trimmed);
    if ((DISPUTE_TIMELINE_ACTOR_KEYS as readonly string[]).includes(normalized)) {
        return normalized as (typeof DISPUTE_TIMELINE_ACTOR_KEYS)[number];
    }

    const stripped = trimmed.replace(/^disputes\.timeline\.actors\./i, "");
    const strippedKey = normalizeDisputeLabelKey(stripped);
    if ((DISPUTE_TIMELINE_ACTOR_KEYS as readonly string[]).includes(strippedKey)) {
        return strippedKey as (typeof DISPUTE_TIMELINE_ACTOR_KEYS)[number];
    }

    // Guard against raw message paths leaking into persisted event payloads.
    const pathMatch = trimmed.match(/(?:^|\.)actors\.(system|merchant)$/i);
    if (pathMatch) {
        return pathMatch[1].toLowerCase() as (typeof DISPUTE_TIMELINE_ACTOR_KEYS)[number];
    }

    return null;
}

export function localizeTimelineActor(
    actor: string | undefined | null,
    t: DisputeTranslator,
): string | undefined {
    if (!actor) {
        return undefined;
    }

    const actorKey = resolveTimelineActorKey(actor);
    if (!actorKey) {
        return actor;
    }

    try {
        const translated = t(`timeline.actors.${actorKey}`);
        // next-intl returns the full message path when a key is missing.
        if (
            !translated
            || translated === `Disputes.timeline.actors.${actorKey}`
            || translated.includes("timeline.actors.")
        ) {
            return TIMELINE_ACTOR_FALLBACKS[actorKey];
        }
        return translated;
    } catch {
        return TIMELINE_ACTOR_FALLBACKS[actorKey];
    }
}

export function localizeTimelineDescription(
    description: string | undefined | null,
    t: DisputeTranslator,
): string | undefined {
    if (!description) {
        return undefined;
    }

    const submittedMatch = description.match(/^Submitted (\d+) file\(s\) to (.+)$/);
    if (submittedMatch) {
        return t("timeline.descriptions.submitted_files_to_channel", {
            count: submittedMatch[1],
            channel: submittedMatch[2],
        });
    }

    const filesAttachedMatch = description.match(/^(\d+) file\(s\) attached$/);
    if (filesAttachedMatch) {
        return t("timeline.descriptions.files_attached", { count: filesAttachedMatch[1] });
    }

    const statusTransitionMatch = description.match(/^(.+?) -> (.+)$/);
    if (statusTransitionMatch) {
        return t("timeline.descriptions.channel_status_transition", {
            oldStatus: localizeChannelStatus(statusTransitionMatch[1].trim(), t),
            newStatus: localizeChannelStatus(statusTransitionMatch[2].trim(), t),
        });
    }

    if ((DISPUTE_RESOLUTION_KEYS as readonly string[]).includes(description)) {
        return t(`timeline.resolutions.${description}`);
    }

    const key = normalizeDisputeLabelKey(description);
    if ((DISPUTE_TIMELINE_DESCRIPTION_KEYS as readonly string[]).includes(key)) {
        return t(`timeline.descriptions.${key}`);
    }

    return description;
}
