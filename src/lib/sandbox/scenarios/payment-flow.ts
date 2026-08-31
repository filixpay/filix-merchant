import { ref } from "../binding-ref";
import type { SandboxScenario } from "../types";

export const paymentFlowScenario: SandboxScenario = {
    id: "payment-flow",
    version: "1.1.0",
    label: "支付接入验证",
    verdictEngine: "payment-flow",
    steps: [
        {
            id: "create-order",
            label: "创建订单",
            type: "sync",
            next: "get-order",
            inputSchema: "create-order",
            request: {
                kind: "http",
                method: "POST",
                path: "/orders",
                body: { merge: ["defaults", "input"] },
            },
            assert: {
                httpStatus: 200,
                body: {
                    success: true,
                    allOf: [
                        {
                            path: { segments: ["data", "merchantOrderId"] },
                            rule: "nonEmpty",
                        },
                    ],
                },
            },
            extract: {
                merchantOrderId: {
                    source: "response",
                    path: { segments: ["data", "merchantOrderId"] },
                },
                tradeNo: {
                    source: "response",
                    path: { segments: ["data", "tradeNo"] },
                },
            },
        },
        {
            id: "get-order",
            label: "查询订单",
            type: "sync",
            next: "get-payment-token",
            inputSchema: "readonly-context",
            request: {
                kind: "http",
                method: "GET",
                path: "/orders/{merchantOrderId}",
                pathBindings: {
                    merchantOrderId: ref.context("merchantOrderId"),
                },
            },
            assert: {
                httpStatus: 200,
                body: {
                    success: true,
                    allOf: [
                        {
                            path: { segments: ["data", "tradeStatus"] },
                            rule: "exists",
                        },
                    ],
                },
            },
        },
        {
            id: "get-payment-token",
            label: "获取支付令牌",
            type: "sync",
            next: "webhook-received",
            inputSchema: "readonly-context",
            request: {
                kind: "http",
                method: "GET",
                path: "/orders/{merchantOrderId}/payment-token",
                pathBindings: {
                    merchantOrderId: ref.context("merchantOrderId"),
                },
            },
            assert: {
                httpStatus: 200,
                body: {
                    success: true,
                    anyOf: [
                        {
                            path: { segments: ["data", "paymentToken"] },
                            rule: "nonEmpty",
                        },
                        {
                            path: { segments: ["data", "payUrl"] },
                            rule: "nonEmpty",
                        },
                    ],
                },
            },
            extract: {
                paymentToken: {
                    source: "response",
                    path: { segments: ["data", "paymentToken"] },
                },
                payUrl: {
                    source: "response",
                    path: { segments: ["data", "payUrl"] },
                },
            },
        },
        {
            id: "webhook-received",
            label: "Webhook 回调验证",
            type: "poll",
            next: null,
            inputSchema: "webhook-poll",
            pollMaxAttempts: 40,
            request: {
                kind: "internal",
                handler: "pollWebhookDelivery",
            },
            assert: {
                httpStatus: 200,
                body: {
                    success: true,
                    allOf: [
                        {
                            path: { segments: ["found"] },
                            rule: "equals",
                            value: true,
                        },
                        {
                            path: { segments: ["deliveryStatus"] },
                            rule: "equals",
                            value: "SUCCESS",
                        },
                        {
                            path: { segments: ["eventType"] },
                            rule: "equals",
                            value: "payment.success",
                        },
                    ],
                },
            },
            extract: {
                webhookDeliveryId: {
                    source: "response",
                    path: { segments: ["deliveryId"] },
                },
            },
        },
    ],
};
