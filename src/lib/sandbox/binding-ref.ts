import type { BindingRef } from "./types";

export const ref = {
    context: (key: string): BindingRef => ({
        source: "context",
        path: { segments: [key] },
    }),
    input: (key: string): BindingRef => ({
        source: "input",
        path: { segments: [key] },
    }),
    literal: (value: unknown): BindingRef => ({
        source: "literal",
        value,
    }),
};
