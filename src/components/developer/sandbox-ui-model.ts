import type { PaymentActionOrder } from "@/components/orders/order-action-model";
import {
  buildCheckoutTokenUrl,
  extractCheckoutToken,
  normalizeCheckoutUrl,
} from "@/lib/checkout/checkout-url";

export { buildDefaultCreateOrderInput } from "@/lib/sandbox/create-order-defaults";

export function buildSandboxCheckoutLink(context: Record<string, unknown>): string | null {
    const paymentToken = context.paymentToken;
    if (typeof paymentToken === "string" && paymentToken.length > 0) {
        return buildCheckoutTokenUrl(paymentToken);
    }

    const payUrl = context.payUrl;
    if (typeof payUrl !== "string" || payUrl.length === 0) {
        return null;
    }

    const token = extractCheckoutToken(payUrl);
    if (token) {
        return buildCheckoutTokenUrl(token);
    }

    return normalizeCheckoutUrl(payUrl);
}

export function buildSandboxPaymentOrder(
    context: Record<string, unknown>,
    createOrderInput: Record<string, unknown>,
): PaymentActionOrder {
    const totalAmount = createOrderInput.totalAmount as
        | { currency?: string; amount?: number }
        | undefined;

    return {
        merchantOrderId: String(context.merchantOrderId ?? ""),
        totalAmount: {
            currency: totalAmount?.currency ?? "USD",
            amount: Number(totalAmount?.amount ?? 10),
        },
    };
}

export function getStepLabelKey(stepId: string): string {
    switch (stepId) {
        case "create-order":
            return "step_create_order";
        case "get-order":
            return "step_get_order";
        case "get-payment-token":
            return "step_get_payment_token";
        case "webhook-received":
            return "step_webhook_received";
        default:
            return stepId;
    }
}

export function getVerdictCheckLabelKey(checkId: string): string {
    switch (checkId) {
        case "api_auth":
            return "check_api_auth";
        case "order_create":
            return "check_order_create";
        case "order_visibility":
            return "check_order_visibility";
        case "payment_capability":
            return "check_token_generation";
        case "webhook_delivery":
            return "check_webhook_delivery";
        default:
            return checkId;
    }
}

export function formatSessionRemainingMinutes(expiresAt: number): number {
    return Math.max(0, Math.ceil((expiresAt - Date.now()) / 60_000));
}
