import type { ApiCredentialView } from "@/lib/developer/applications-api";
import type { WebhookEndpointView } from "@/lib/api";
import { hasActiveLiveCredential } from "./production-access-model";

export type ReadinessState = "PASS" | "FAIL";

export type ReadinessCheckId = "live_credential" | "live_webhook";

export type ReadinessCheck = {
    id: ReadinessCheckId;
    state: ReadinessState;
};

/**
 * Configuration preview only — never gates Create LIVE.
 */
export function isCreateLiveAllowedByReadiness(): boolean {
    return true;
}

export function hasActiveLiveWebhook(
    webhooks: readonly Pick<WebhookEndpointView, "environment" | "status">[],
): boolean {
    return webhooks.some(
        (w) =>
            (w.environment || "").toUpperCase() === "LIVE" &&
            (w.status || "").toUpperCase() === "ACTIVE",
    );
}

export function deriveProductionAccessChecklist(
    credentials: readonly Pick<ApiCredentialView, "environment" | "status">[],
    webhooks: readonly Pick<WebhookEndpointView, "environment" | "status">[],
): ReadinessCheck[] {
    return [
        {
            id: "live_credential",
            state: hasActiveLiveCredential(credentials) ? "PASS" : "FAIL",
        },
        {
            id: "live_webhook",
            state: hasActiveLiveWebhook(webhooks) ? "PASS" : "FAIL",
        },
    ];
}
