import type { BindingRef, JsonPath } from "./types";

export function getByPath(obj: unknown, path: JsonPath): unknown {
    return path.segments.reduce<unknown>((acc, segment) => {
        if (acc === null || acc === undefined) return undefined;
        if (typeof acc !== "object") return undefined;
        return (acc as Record<string | number, unknown>)[segment];
    }, obj);
}

export function resolveBindingRef(
    binding: BindingRef,
    sources: { context: Record<string, unknown>; input: Record<string, unknown> },
): unknown {
    if (binding.source === "literal") return binding.value;
    const root = binding.source === "context" ? sources.context : sources.input;
    return getByPath(root, binding.path);
}
