import type { SandboxSession } from "../types";

export interface SessionStore {
    get(id: string): Promise<SandboxSession | null>;
    set(session: SandboxSession, ttlSeconds: number): Promise<void>;
    delete(id: string): Promise<void>;
}
