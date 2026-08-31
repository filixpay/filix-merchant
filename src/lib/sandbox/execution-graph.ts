import type { SandboxScenario, ScenarioStep, StepExecution } from "./types";

export function getStepPredecessors(scenario: SandboxScenario, stepId: string): string[] {
    const preds: string[] = [];
    for (const step of scenario.steps) {
        if (step.next === stepId) preds.push(step.id);
    }
    return preds;
}

function executionMap(executions: StepExecution[]): Map<string, StepExecution> {
    return new Map(executions.map((e) => [e.stepId, e]));
}

export function findNextExecutableStep(
    session: { stepExecutions: StepExecution[] },
    scenario: SandboxScenario,
): ScenarioStep | null {
    const map = executionMap(session.stepExecutions);

    const running = scenario.steps.find((s) => map.get(s.id)?.status === "running");
    if (running) return running;

    for (const step of scenario.steps) {
        const exec = map.get(step.id);
        if (!exec || exec.status !== "pending") continue;

        const preds = getStepPredecessors(scenario, step.id);
        const predsOk =
            preds.length === 0 || preds.every((id) => map.get(id)?.status === "passed");
        if (predsOk) return step;
    }

    return null;
}

export function findStepById(
    scenario: SandboxScenario,
    stepId: string,
): ScenarioStep | undefined {
    return scenario.steps.find((s) => s.id === stepId);
}

export function getStepExecution(
    session: { stepExecutions: StepExecution[] },
    stepId: string,
): StepExecution | undefined {
    return session.stepExecutions.find((e) => e.stepId === stepId);
}
