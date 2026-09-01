import type { CommerceActivationPhase } from "@/lib/api/domains/commerce/activation";

export const ACTIVATION_POLL_INTERVAL_MS = 4_000;
export const ACTIVATION_POLL_TIMEOUT_MS = 60_000;

export type ActivationPollDecision =
    | { action: "continue" }
    | { action: "stop" }
    | { action: "timeout" };

/**
 * Decide whether to keep polling activation-status while phase is PUBLISHING.
 * Timeout stops polling and sets pollingTimedOut — it must NOT coerce phase to PUBLISH_FAILED.
 */
export function decideActivationPoll(
    phase: CommerceActivationPhase | undefined,
    elapsedMs: number,
): ActivationPollDecision {
    if (phase !== "PUBLISHING") {
        return { action: "stop" };
    }
    if (elapsedMs >= ACTIVATION_POLL_TIMEOUT_MS) {
        return { action: "timeout" };
    }
    return { action: "continue" };
}
