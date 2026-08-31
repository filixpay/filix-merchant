import { ENDPOINTS } from "@/lib/api-config";
import { runAssert } from "./assert-engine";
import { buildDefaultCreateOrderInput } from "./create-order-defaults";
import { runExtract } from "./extract-engine";
import { findNextExecutableStep } from "./execution-graph";
import { runInternalHandler } from "./internal-handlers";
import { OpenApiGateway, openApiGateway } from "./openapi-gateway";
import { buildHttpRequest } from "./request-builder";
import { getScenario } from "./scenario-registry";
import { SANDBOX_SESSION_TTL_SECONDS, SANDBOX_WEBHOOK_POLL_MAX_ATTEMPTS } from "./sandbox-config";
import { toPublicSession } from "./session-public";
import { getSessionStore } from "./session-store";
import type { SessionStore } from "./session-store/types";
import type {
    ExecuteResult,
    SandboxSession,
    ScenarioStep,
    StepResult,
} from "./types";
import { evaluateVerdict } from "./verdict-registry";

export function getSessionVerdict(session: SandboxSession) {
    if (session.status !== "completed" && session.status !== "failed") {
        return undefined;
    }
    const scenario = getScenario(session.scenario);
    return evaluateVerdict(scenario.verdictEngine, session, scenario);
}

export interface CreateSessionParams {
    merchantUserId: string;
    clientId: string;
    clientSecret: string;
    scenarioId?: string;
}

export class SandboxRuntimeService {
    constructor(
        private store: SessionStore,
        private gateway: OpenApiGateway = openApiGateway,
    ) {}

    async createSession(params: CreateSessionParams): Promise<SandboxSession> {
        const scenario = getScenario(params.scenarioId ?? "payment-flow");
        const now = Date.now();
        const session: SandboxSession = {
            id: `sb_${crypto.randomUUID()}`,
            merchantUserId: params.merchantUserId,
            clientId: params.clientId,
            clientSecret: params.clientSecret,
            scenario: scenario.id,
            scenarioVersion: scenario.version,
            stepExecutions: scenario.steps.map((step) => ({
                stepId: step.id,
                status: "pending",
                attempts: 0,
            })),
            currentStepId: null,
            context: {},
            requestLog: [],
            completedStepResults: [],
            status: "in_progress",
            createdAt: now,
            expiresAt: now + SANDBOX_SESSION_TTL_SECONDS * 1000,
        };

        session.currentStepId = findNextExecutableStep(session, scenario)?.id ?? null;
        await this.store.set(session, SANDBOX_SESSION_TTL_SECONDS);
        return session;
    }

    async getSession(
        sessionId: string,
        merchantUserId: string,
    ): Promise<SandboxSession | null> {
        const session = await this.store.get(sessionId);
        if (!session || session.merchantUserId !== merchantUserId) return null;
        return session;
    }

    async revokeSession(sessionId: string, merchantUserId: string): Promise<void> {
        const session = await this.getSession(sessionId, merchantUserId);
        if (session) {
            await this.store.delete(sessionId);
        }
    }

    async execute(
        sessionId: string,
        merchantUserId: string,
        input: Record<string, unknown> = {},
        options: { merchantAccessToken?: string; selectedMerchantCode?: string } = {},
    ): Promise<ExecuteResult> {
        const session = await this.getSession(sessionId, merchantUserId);
        if (!session) {
            throw new Error("Sandbox session not found");
        }
        if (session.status !== "in_progress") {
            throw new Error(`Session is ${session.status}`);
        }

        const scenario = getScenario(session.scenario);
        const step = findNextExecutableStep(session, scenario);
        if (!step) {
            throw new Error("No executable step available");
        }

        const stepExecution = session.stepExecutions.find((e) => e.stepId === step.id);
        if (!stepExecution) {
            throw new Error(`Missing step execution for ${step.id}`);
        }

        stepExecution.status = step.type === "poll" ? "running" : "running";
        stepExecution.attempts += 1;
        stepExecution.startedAt = stepExecution.startedAt ?? Date.now();

        const defaults =
            step.inputSchema === "create-order" ? buildDefaultCreateOrderInput() : {};

        let httpResponse: { status: number; body: unknown };
        let builtRequest: { method: string; path: string; body?: unknown } | undefined;
        const started = Date.now();

        try {
            if (step.request.kind === "internal") {
                if (!step.request.handler) {
                    throw new Error("Internal step is missing handler");
                }
                if (!options.merchantAccessToken) {
                    throw new Error("Merchant access token is required for internal sandbox steps");
                }

                builtRequest = {
                    method: "INTERNAL",
                    path:
                        step.request.handler === "pollWebhookDelivery"
                            ? `${ENDPOINTS.PORTAL.DEVELOPER_WEBHOOK_DELIVERIES}?page=0&size=50`
                            : step.request.handler,
                };

                httpResponse = await runInternalHandler(step.request.handler, {
                    session,
                    merchantAccessToken: options.merchantAccessToken,
                    selectedMerchantCode: options.selectedMerchantCode,
                });
            } else {
                builtRequest = buildHttpRequest(step, {
                    context: session.context,
                    input,
                    defaults,
                });

                httpResponse = await this.gateway.httpRequest(
                    session,
                    builtRequest.method,
                    builtRequest.path,
                    builtRequest.body,
                );
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Request failed";
            stepExecution.status = "failed";
            stepExecution.lastError = message;
            stepExecution.completedAt = Date.now();
            session.status = "failed";
            session.currentStepId = null;
            const failedStepResult = this.buildFailedStepResult(
                step,
                builtRequest ?? { method: step.request.method ?? "?", path: step.request.path ?? "?" },
                message,
                started,
            );
            this.upsertCompletedStepResult(session, failedStepResult);
            await this.store.set(session, SANDBOX_SESSION_TTL_SECONDS);

            return {
                session: toPublicSession(session),
                stepResult: failedStepResult,
                verdict: evaluateVerdict(scenario.verdictEngine, session, scenario),
            };
        }

        const assertResult = runAssert(httpResponse, step.assert);
        const durationMs = Date.now() - started;

        session.requestLog.push({
            stepId: step.id,
            method: builtRequest.method,
            path: builtRequest.path,
            status: httpResponse.status,
            durationMs,
            at: Date.now(),
        });

        const stepResult: StepResult = {
            stepId: step.id,
            stepLabel: step.label,
            type: step.type,
            passed: assertResult.passed,
            durationMs,
            request: builtRequest,
            response: httpResponse,
            error: assertResult.passed
                ? undefined
                : {
                      message: assertResult.message ?? "Assertion failed",
                      hint: this.hintForFailure(httpResponse.body),
                  },
        };

        this.upsertCompletedStepResult(session, stepResult);

        if (assertResult.passed) {
            if (step.extract) {
                Object.assign(session.context, runExtract(httpResponse.body, step.extract));
            }
            stepExecution.status = "passed";
            stepExecution.completedAt = Date.now();
            stepExecution.lastError = undefined;
        } else if (step.type === "poll") {
            const maxAttempts = step.pollMaxAttempts ?? SANDBOX_WEBHOOK_POLL_MAX_ATTEMPTS;
            if (stepExecution.attempts >= maxAttempts) {
                stepExecution.status = "failed";
                stepExecution.completedAt = Date.now();
                stepExecution.lastError = assertResult.message ?? "Webhook poll exceeded max attempts";
                session.status = "failed";
                session.currentStepId = null;
                await this.store.set(session, SANDBOX_SESSION_TTL_SECONDS);
                return {
                    session: toPublicSession(session),
                    stepResult,
                    verdict: evaluateVerdict(scenario.verdictEngine, session, scenario),
                };
            }

            stepExecution.status = "running";
            stepExecution.lastError = assertResult.message;
            session.currentStepId = step.id;
            await this.store.set(session, SANDBOX_SESSION_TTL_SECONDS);

            return {
                session: toPublicSession(session),
                stepResult,
                verdict: evaluateVerdict(scenario.verdictEngine, session, scenario),
            };
        } else {
            stepExecution.status = "failed";
            stepExecution.completedAt = Date.now();
            stepExecution.lastError = assertResult.message;
            session.status = "failed";
            session.currentStepId = null;
            await this.store.set(session, SANDBOX_SESSION_TTL_SECONDS);
            return {
                session: toPublicSession(session),
                stepResult,
                verdict: evaluateVerdict(scenario.verdictEngine, session, scenario),
            };
        }

        const nextStep = findNextExecutableStep(session, scenario);
        session.currentStepId = nextStep?.id ?? null;

        if (!nextStep) {
            session.status = "completed";
        }

        await this.store.set(session, SANDBOX_SESSION_TTL_SECONDS);

        const verdict =
            session.status === "completed"
                ? evaluateVerdict(scenario.verdictEngine, session, scenario)
                : undefined;

        return {
            session: toPublicSession(session),
            stepResult,
            verdict,
        };
    }

    private upsertCompletedStepResult(session: SandboxSession, stepResult: StepResult): void {
        const index = session.completedStepResults.findIndex((r) => r.stepId === stepResult.stepId);
        if (index >= 0) {
            session.completedStepResults[index] = stepResult;
        } else {
            session.completedStepResults.push(stepResult);
        }
    }

    private buildFailedStepResult(
        step: ScenarioStep,
        request: { method: string; path: string; body?: unknown },
        message: string,
        started: number,
    ): StepResult {
        return {
            stepId: step.id,
            stepLabel: step.label,
            type: step.type,
            passed: false,
            durationMs: Date.now() - started,
            request,
            response: { status: 0, body: null },
            error: { message },
        };
    }

    private hintForFailure(body: unknown): string | undefined {
        if (body && typeof body === "object" && "code" in body) {
            const code = String((body as { code?: string }).code);
            if (code === "VALIDATION_ERROR") return "检查表单字段格式";
            if (code === "ORDER_NOT_FOUND") return "确认 merchantOrderId 与上一步一致";
            if (code === "ORDER_STATUS_INVALID") return "请用新的 merchantOrderId 重新开始";
        }
        return undefined;
    }
}

let runtimeSingleton: SandboxRuntimeService | null = null;

export function getSandboxRuntime(): SandboxRuntimeService {
    if (!runtimeSingleton) {
        runtimeSingleton = new SandboxRuntimeService(getSessionStore());
    }
    return runtimeSingleton;
}

export function resetSandboxRuntimeForTests(
    store?: SessionStore,
    gateway?: OpenApiGateway,
): SandboxRuntimeService {
    runtimeSingleton = new SandboxRuntimeService(store ?? getSessionStore(), gateway);
    return runtimeSingleton;
}
