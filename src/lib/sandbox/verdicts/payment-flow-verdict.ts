import type { IntegrationVerdict, SandboxSession, SandboxScenario } from "../types";

function stepPassed(session: SandboxSession, stepId: string): boolean {
    return session.stepExecutions.find((e) => e.stepId === stepId)?.status === "passed";
}

export function evaluatePaymentFlowVerdict(
    session: SandboxSession,
    scenario: SandboxScenario,
): IntegrationVerdict {
    void scenario;
    const checks = [
        {
            id: "api_auth",
            label: "API 认证",
            status: session.oauthProven ? ("OK" as const) : ("FAIL" as const),
        },
        {
            id: "order_create",
            label: "订单创建能力",
            status:
                typeof session.context.merchantOrderId === "string" &&
                session.context.merchantOrderId.length > 0
                    ? ("OK" as const)
                    : ("FAIL" as const),
        },
        {
            id: "order_visibility",
            label: "订单生命周期可见",
            status: stepPassed(session, "get-order") ? ("OK" as const) : ("FAIL" as const),
        },
        {
            id: "payment_capability",
            label: "支付令牌生成",
            status:
                session.context.paymentToken || session.context.payUrl
                    ? ("OK" as const)
                    : ("FAIL" as const),
        },
        {
            id: "webhook_delivery",
            label: "Webhook 回调",
            status: stepPassed(session, "webhook-received")
                ? ("OK" as const)
                : stepPassed(session, "get-payment-token") && session.status === "in_progress"
                  ? ("SKIPPED" as const)
                  : ("FAIL" as const),
        },
    ];

    const required = checks.filter((check) => check.status !== "SKIPPED");
    const passed = required.filter((c) => c.status === "OK").length;
    const confidence = required.length
        ? Math.round((passed / required.length) * 100)
        : 0;

    let status: IntegrationVerdict["status"] = "FAIL";
    if (session.status === "completed" && passed === required.length) {
        status = "PASS";
    } else if (passed > 0 && session.status === "in_progress") {
        status = "PARTIAL";
    }

    return {
        status,
        confidence,
        checks,
        summary:
            status === "PASS"
                ? "支付与 Webhook 接入验证通过"
                : status === "PARTIAL"
                  ? "部分验证项已完成"
                  : "接入验证未通过",
    };
}
