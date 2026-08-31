import type { WebhookEndpointRequest } from "@/lib/api";

/**
 * LIVE webhook create payload — environment is hardcoded.
 * Never reuse a shared form that can flip env to SANDBOX.
 */
export function createLiveWebhookRequest(
    input: Omit<WebhookEndpointRequest, "environment">,
): WebhookEndpointRequest {
    return {
        ...input,
        environment: "LIVE",
    };
}
