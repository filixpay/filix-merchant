import { resolveBindingRef } from "./json-path";
import type { ScenarioStep } from "./types";

export function buildHttpRequest(
    step: ScenarioStep,
    sources: {
        context: Record<string, unknown>;
        input: Record<string, unknown>;
        defaults: Record<string, unknown>;
    },
): { method: string; path: string; body?: unknown } {
    const def = step.request;
    if (def.kind !== "http" || !def.method || !def.path) {
        throw new Error(`Step ${step.id} is not an HTTP request`);
    }

    let path = def.path;
    for (const [param, binding] of Object.entries(def.pathBindings ?? {})) {
        const value = resolveBindingRef(binding, sources);
        path = path.replace(`{${param}}`, encodeURIComponent(String(value ?? "")));
    }

    let body: unknown;
    if (def.body?.merge) {
        body = {};
        for (const part of def.body.merge) {
            Object.assign(
                body as object,
                part === "defaults" ? sources.defaults : sources.input,
            );
        }
    }

    return { method: def.method, path, body };
}
