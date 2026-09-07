import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import {
    REQUIRED_ONBOARDING_ACCEPTANCES,
    type AgreementAcceptancePayload,
} from "@/lib/onboarding/required-agreements";
import type { MerchantApplication } from "./types";

export type SubmitApplicationRequest = {
    acceptances: AgreementAcceptancePayload[];
};

export async function submitApplication(
    token: string,
    id: string,
    body: SubmitApplicationRequest = { acceptances: REQUIRED_ONBOARDING_ACCEPTANCES },
): Promise<MerchantApplication> {
    return request<MerchantApplication>(`${ENDPOINTS.PORTAL.MERCHANT_APPLICATIONS}/${id}/submit`, {
        method: "POST",
        headers: {
            ...authHeaders(token),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}
