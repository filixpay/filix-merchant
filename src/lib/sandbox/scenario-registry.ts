import type { SandboxScenario } from "./types";
import { paymentFlowScenario } from "./scenarios/payment-flow";

const scenarios: Record<string, SandboxScenario> = {
    [paymentFlowScenario.id]: paymentFlowScenario,
};

export function getScenario(id: string): SandboxScenario {
    const scenario = scenarios[id];
    if (!scenario) throw new Error(`Unknown scenario: ${id}`);
    return scenario;
}

export function listScenarios(): SandboxScenario[] {
    return Object.values(scenarios);
}
