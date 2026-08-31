import { ENDPOINTS } from "@/lib/api-config";
import { ApiError, authHeaders, request } from "../../core";
import type {
    CreateMerchantApplicationRequest,
    MerchantApplication,
} from "./types";
import { parseApplicationId } from "./types";

export class ApplicationConflictError extends ApiError {
    existingApplication: MerchantApplication | null;

    constructor(existingApplication: MerchantApplication | null = null) {
        super("NON_TERMINAL_APPLICATION_EXISTS", 409, "NON_TERMINAL_APPLICATION_EXISTS", existingApplication);
        this.name = "ApplicationConflictError";
        this.existingApplication = existingApplication;
    }
}

function asMerchantApplication(data: unknown): MerchantApplication | null {
    if (!data || typeof data !== "object") {
        return null;
    }
    const id = parseApplicationId((data as { id?: unknown }).id);
    if (!id) {
        return null;
    }
    return data as MerchantApplication;
}

export async function createOrLoadApplication(
    token: string,
    body: CreateMerchantApplicationRequest,
): Promise<MerchantApplication> {
    try {
        return await request<MerchantApplication>(ENDPOINTS.PORTAL.MERCHANT_APPLICATIONS, {
            method: "POST",
            headers: authHeaders(token),
            body: JSON.stringify(body),
        });
    } catch (err) {
        if (
            err instanceof ApiError &&
            (err.status === 409 || err.code === "NON_TERMINAL_APPLICATION_EXISTS")
        ) {
            throw new ApplicationConflictError(asMerchantApplication(err.data));
        }
        throw err;
    }
}
