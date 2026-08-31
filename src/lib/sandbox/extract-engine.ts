import { getByPath } from "./json-path";
import type { ContextProjection } from "./types";

export function runExtract(
    responseBody: unknown,
    extract: ContextProjection,
): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, projection] of Object.entries(extract)) {
        if (projection.source === "response") {
            result[key] = getByPath(responseBody, projection.path);
        }
    }
    return result;
}
