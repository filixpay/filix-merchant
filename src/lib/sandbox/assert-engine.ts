import { getByPath } from "./json-path";
import type { AssertionDefinition, FieldRule } from "./types";

function checkFieldRule(body: unknown, rule: FieldRule): boolean {
    const value = getByPath(body, rule.path);
    switch (rule.rule) {
        case "exists":
            return value !== undefined && value !== null;
        case "nonEmpty":
            return value !== undefined && value !== null && String(value).length > 0;
        case "equals":
            return value === rule.value;
        default:
            return false;
    }
}

export function runAssert(
    response: { status: number; body: unknown },
    assert: AssertionDefinition,
): { passed: boolean; message?: string } {
    if (response.status !== assert.httpStatus) {
        return {
            passed: false,
            message: `Expected HTTP ${assert.httpStatus}, got ${response.status}`,
        };
    }

    const body = response.body as Record<string, unknown> | null;

    if (assert.body?.success === true && body?.success !== true) {
        return { passed: false, message: "Expected success: true in response body" };
    }

    if (assert.body?.allOf?.length) {
        for (const rule of assert.body.allOf) {
            if (!checkFieldRule(body, rule)) {
                return {
                    passed: false,
                    message: `allOf rule failed at ${rule.path.segments.join(".")}`,
                };
            }
        }
    }

    if (assert.body?.anyOf?.length) {
        const anyPassed = assert.body.anyOf.some((rule) => checkFieldRule(body, rule));
        if (!anyPassed) {
            return { passed: false, message: "anyOf rules all failed" };
        }
    }

    return { passed: true };
}
