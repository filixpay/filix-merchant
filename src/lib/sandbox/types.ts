export type JsonPath = { segments: (string | number)[] };

export type BindingRef =
    | { source: "context"; path: JsonPath }
    | { source: "input"; path: JsonPath }
    | { source: "literal"; value: unknown };

export interface RequestDefinition {
    kind: "http" | "internal";
    method?: "GET" | "POST";
    path?: string;
    pathBindings?: Record<string, BindingRef>;
    body?: { merge: ("defaults" | "input")[] };
    handler?: string;
}

export interface FieldRule {
    path: JsonPath;
    rule: "exists" | "nonEmpty" | "equals";
    value?: unknown;
}

export interface AssertionDefinition {
    httpStatus: number;
    body?: {
        success?: true;
        allOf?: FieldRule[];
        anyOf?: FieldRule[];
    };
}

export type ContextProjection = Record<
    string,
    { source: "response"; path: JsonPath }
>;

export interface ScenarioStep {
    id: string;
    label: string;
    type: "sync" | "async" | "poll";
    next: string | null;
    inputSchema: string;
    pollMaxAttempts?: number;
    request: RequestDefinition;
    assert: AssertionDefinition;
    extract?: ContextProjection;
}

export interface SandboxScenario {
    id: string;
    version: string;
    label: string;
    verdictEngine: string;
    steps: ScenarioStep[];
}

export type StepExecutionStatus =
    | "pending"
    | "running"
    | "passed"
    | "failed"
    | "skipped";

export interface StepExecution {
    stepId: string;
    status: StepExecutionStatus;
    attempts: number;
    startedAt?: number;
    completedAt?: number;
    lastError?: string;
}

export interface RequestLogEntry {
    stepId: string;
    method: string;
    path: string;
    status: number;
    durationMs: number;
    at: number;
}

export interface SandboxSession {
    id: string;
    merchantUserId: string;
    clientId: string;
    clientSecret: string;
    accessToken?: string;
    accessTokenExpiresAt?: number;
    oauthProven?: boolean;
    scenario: string;
    scenarioVersion: string;
    stepExecutions: StepExecution[];
    currentStepId: string | null;
    context: Record<string, unknown>;
    requestLog: RequestLogEntry[];
    completedStepResults: StepResult[];
    status: "in_progress" | "completed" | "failed";
    createdAt: number;
    expiresAt: number;
}

export interface IntegrationVerdict {
    status: "PASS" | "FAIL" | "PARTIAL";
    confidence: number;
    checks: { id: string; label: string; status: "OK" | "FAIL" | "SKIPPED" }[];
    summary: string;
}

export interface StepResult {
    stepId: string;
    stepLabel: string;
    type: ScenarioStep["type"];
    passed: boolean;
    durationMs: number;
    request: { method: string; path: string; body?: unknown };
    response: { status: number; body: unknown };
    error?: { code?: string; message: string; hint?: string };
}

export interface ExecuteResult {
    session: SandboxSessionPublicView;
    stepResult: StepResult;
    verdict?: IntegrationVerdict;
}

export type SandboxSessionPublicView = Omit<
    SandboxSession,
    "clientSecret" | "accessToken"
>;
