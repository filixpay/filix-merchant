import type { SandboxSession } from "../types";
import type { SessionStore } from "./types";

type Entry = { session: SandboxSession; expiresAt: number };

export class MemorySessionStore implements SessionStore {
    private entries = new Map<string, Entry>();

    async get(id: string): Promise<SandboxSession | null> {
        const entry = this.entries.get(id);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            this.entries.delete(id);
            return null;
        }
        return entry.session;
    }

    async set(session: SandboxSession, ttlSeconds: number): Promise<void> {
        this.entries.set(session.id, {
            session,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
    }

    async delete(id: string): Promise<void> {
        this.entries.delete(id);
    }
}
