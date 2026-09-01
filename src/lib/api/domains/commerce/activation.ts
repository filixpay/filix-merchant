import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";

export type CommerceActivationPhase =
    | "NO_PRODUCTS"
    | "HAS_DRAFT"
    | "PUBLISHING"
    | "PUBLISH_FAILED"
    | "ACTIVATED";

export type CommerceActivationStatus = {
    phase: CommerceActivationPhase;
    publishedCount: number;
    draftCount: number;
    profileComplete: boolean;
    activationProductId: string | null;
    activationProductName: string | null;
    storefrontPreviewUrl: string | null;
    publishError: string | null;
    shouldShowFirstPublishCelebration: boolean;
};

export async function getActivationStatus(token: string): Promise<CommerceActivationStatus> {
    return request<CommerceActivationStatus>(ENDPOINTS.PORTAL.COMMERCE_ACTIVATION_STATUS, {
        headers: authHeaders(token),
    });
}

export async function markCelebrationSeen(token: string): Promise<void> {
    await request<null>(ENDPOINTS.PORTAL.COMMERCE_ACTIVATION_CELEBRATION_SEEN, {
        method: "POST",
        headers: authHeaders(token),
    });
}
