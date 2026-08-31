import { ApiError } from "@/lib/api";

export type PayeeLookupErrorCode =
    | "INVALID_CODE"
    | "MERCHANT_NOT_FOUND"
    | "MERCHANT_INACTIVE"
    | "SELF_TRANSFER_NOT_ALLOWED"
    | "UNKNOWN";

export type PayeeLookupStatus = "idle" | "loading" | "success" | "error";

export interface PayeeLookupItemState {
    payeeCustomerCode: string;
    amount: string;
    lookupStatus: PayeeLookupStatus;
    payeeName: string | null;
    lookupError: PayeeLookupErrorCode | null;
}

export function normalizePayeeCode(raw: string): string | null {
    const trimmed = raw.trim();
    if (!trimmed || !/^\d+$/.test(trimmed)) {
        return null;
    }
    return trimmed;
}

export function mapLookupError(err: unknown): PayeeLookupErrorCode {
    if (err instanceof ApiError) {
        const code = String(err.code ?? "");
        if (
            code === "INVALID_CODE" ||
            code === "MERCHANT_NOT_FOUND" ||
            code === "MERCHANT_INACTIVE" ||
            code === "SELF_TRANSFER_NOT_ALLOWED"
        ) {
            return code;
        }
    }
    return "UNKNOWN";
}

export function canSubmitTransferItems(items: PayeeLookupItemState[]): boolean {
    return items.every((item) => {
        if (!item.payeeCustomerCode.trim()) {
            return false;
        }
        return item.lookupStatus === "success" && !!item.payeeName;
    });
}
