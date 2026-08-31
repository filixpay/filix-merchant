import type { WebhookDeliveryView } from "@/lib/api/domains/developer";
import { listMerchantWebhookDeliveries } from "@/lib/developer/merchant-webhook-deliveries";

export type WebhookPollResult = {
    success: true;
    found: boolean;
    deliveryStatus: string;
    eventType?: string;
    deliveryId?: string;
    attemptsListed: number;
};

function parsePayload(payload: string): Record<string, unknown> | null {
    try {
        const parsed: unknown = JSON.parse(payload);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed)
            ? (parsed as Record<string, unknown>)
            : null;
    } catch {
        return null;
    }
}

function nestedValue(record: Record<string, unknown>, key: string): unknown {
    const nested = record.data;
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
        return (nested as Record<string, unknown>)[key] ?? record[key];
    }
    return record[key];
}

export function payloadMatchesMerchantOrder(payload: string, merchantOrderId: string): boolean {
    if (payload.includes(merchantOrderId)) {
        return true;
    }

    const parsed = parsePayload(payload);
    if (!parsed) {
        return false;
    }

    const candidates = [
        parsed.merchantOrderId,
        parsed.orderId,
        nestedValue(parsed, "merchantOrderId"),
        nestedValue(parsed, "orderId"),
    ];

    return candidates.some((value) => value != null && String(value) === merchantOrderId);
}

export function extractEventTypeFromPayload(payload: string): string | undefined {
    const parsed = parsePayload(payload);
    if (!parsed) {
        return undefined;
    }

    const raw =
        parsed.eventType ??
        parsed.event_type ??
        nestedValue(parsed, "eventType") ??
        nestedValue(parsed, "event_type");

    return raw != null && String(raw).length > 0 ? String(raw) : undefined;
}

export function findSuccessfulWebhookDelivery(
    deliveries: WebhookDeliveryView[],
    merchantOrderId: string,
): WebhookDeliveryView | undefined {
    return deliveries.find(
        (delivery) =>
            delivery.deliveryStatus === "SUCCESS" &&
            payloadMatchesMerchantOrder(delivery.payload, merchantOrderId),
    );
}

export async function pollWebhookDeliveryForOrder(
    accessToken: string,
    merchantOrderId: string,
    selectedMerchantCode?: string,
): Promise<WebhookPollResult> {
    const deliveries = await listMerchantWebhookDeliveries(accessToken, {
        page: 0,
        size: 50,
        selectedGroup: selectedMerchantCode,
    });
    const match = findSuccessfulWebhookDelivery(deliveries, merchantOrderId);

    if (!match) {
        return {
            success: true,
            found: false,
            deliveryStatus: "PENDING",
            attemptsListed: deliveries.length,
        };
    }

    return {
        success: true,
        found: true,
        deliveryStatus: match.deliveryStatus,
        eventType: extractEventTypeFromPayload(match.payload) ?? "payment.success",
        deliveryId: match.id,
        attemptsListed: deliveries.length,
    };
}
