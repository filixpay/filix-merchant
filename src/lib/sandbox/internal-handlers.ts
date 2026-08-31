import { pollWebhookDeliveryForOrder } from "./poll-webhook-delivery";
import type { SandboxSession } from "./types";

export type InternalHandlerContext = {
    session: SandboxSession;
    merchantAccessToken: string;
    selectedMerchantCode?: string;
};

export type InternalHandler = (
    context: InternalHandlerContext,
) => Promise<{ status: number; body: unknown }>;

export const internalHandlers: Record<string, InternalHandler> = {
    pollWebhookDelivery: async ({ session, merchantAccessToken, selectedMerchantCode }) => {
        const merchantOrderId = session.context.merchantOrderId;
        if (typeof merchantOrderId !== "string" || merchantOrderId.length === 0) {
            return {
                status: 400,
                body: {
                    success: false,
                    message: "Missing merchantOrderId in sandbox context",
                },
            };
        }

        try {
            const body = await pollWebhookDeliveryForOrder(
                merchantAccessToken,
                merchantOrderId,
                selectedMerchantCode,
            );
            return { status: 200, body };
        } catch (err) {
            const message = err instanceof Error ? err.message : "Webhook poll failed";
            return {
                status: 502,
                body: { success: false, message },
            };
        }
    },
};

export function runInternalHandler(
    handlerName: string,
    context: InternalHandlerContext,
): Promise<{ status: number; body: unknown }> {
    const handler = internalHandlers[handlerName];
    if (!handler) {
        throw new Error(`Internal handler not implemented: ${handlerName}`);
    }
    return handler(context);
}
