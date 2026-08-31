import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "@/lib/api/core";
import type { PaymentRiskContextDto } from "../shared/dto";
import { mapPaymentRiskContextDto } from "../shared/mappers";

export async function fetchPaymentRiskContext(paymentId: number, token: string) {
    const dto = await request<PaymentRiskContextDto>(
        ENDPOINTS.PORTAL.RISK_PAYMENT_CONTEXT(paymentId),
        { headers: authHeaders(token) },
    );
    return mapPaymentRiskContextDto(dto);
}
