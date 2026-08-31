import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { MerchantContactView } from "./types";

type MerchantContactApiPayload = {
    merchantId?: string;
    email?: string | null;
    notificationEmail?: string | null;
    supportEmail?: string | null;
    phone?: string | null;
    mobile?: string | null;
};

function trimOrNull(value: string | null | undefined): string | null {
    const trimmed = value?.trim();
    return trimmed || null;
}

export function normalizeMerchantContact(raw: MerchantContactApiPayload): MerchantContactView {
    return {
        merchantId: raw.merchantId,
        email: trimOrNull(raw.email ?? raw.notificationEmail),
        supportEmail: trimOrNull(raw.supportEmail),
        phone: trimOrNull(raw.phone ?? raw.mobile),
    };
}

export async function getMerchantContact(token: string): Promise<MerchantContactView> {
    const data = await request<MerchantContactApiPayload>(ENDPOINTS.PORTAL.MERCHANT_CONTACT, {
        headers: authHeaders(token),
    });
    return normalizeMerchantContact(data);
}
