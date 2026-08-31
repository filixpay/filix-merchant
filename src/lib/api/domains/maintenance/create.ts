import { ENDPOINTS } from "@/lib/api-config";
import { ApiError, authHeaders, request } from "../../core";
import type {
    CreateMerchantChangeRequestRequest,
    MerchantChangeRequest,
} from "./types";

export class PendingChangeExistsError extends ApiError {
    constructor() {
        super("PENDING_CHANGE_EXISTS", 409, "PENDING_CHANGE_EXISTS");
        this.name = "PendingChangeExistsError";
    }
}

export async function createChangeRequest(
    token: string,
    body: CreateMerchantChangeRequestRequest,
): Promise<MerchantChangeRequest> {
    try {
        return await request<MerchantChangeRequest>(ENDPOINTS.PORTAL.MERCHANT_CHANGE_REQUESTS, {
            method: "POST",
            headers: authHeaders(token),
            body: JSON.stringify(body),
        });
    } catch (err) {
        if (
            err instanceof ApiError &&
            (err.status === 409 || err.code === "PENDING_CHANGE_EXISTS")
        ) {
            throw new PendingChangeExistsError();
        }
        throw err;
    }
}
