import type { IntegrationVerdict, SandboxSession, SandboxScenario } from "./types";
import { evaluatePaymentFlowVerdict } from "./verdicts/payment-flow-verdict";

type VerdictFn = (session: SandboxSession, scenario: SandboxScenario) => IntegrationVerdict;

const registry: Record<string, VerdictFn> = {
    "payment-flow": evaluatePaymentFlowVerdict,
};

export function evaluateVerdict(
    engine: string,
    session: SandboxSession,
    scenario: SandboxScenario,
): IntegrationVerdict {
    const fn = registry[engine];
    if (!fn) throw new Error(`Unknown verdict engine: ${engine}`);
    return fn(session, scenario);
}
