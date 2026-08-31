import type { SessionStore } from "./types";
import { MemorySessionStore } from "./memory-store";

let singleton: SessionStore | null = null;

export function getSessionStore(): SessionStore {
    if (!singleton) {
        singleton = new MemorySessionStore();
    }
    return singleton;
}

export function resetSessionStoreForTests(store?: SessionStore): void {
    singleton = store ?? new MemorySessionStore();
}
