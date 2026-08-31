import type { SupportConversation } from "@/lib/api";

const STORAGE_KEY = "filixpay.support.seen";

type SeenMap = Record<string, string>;

function readSeenMap(): SeenMap {
    if (typeof window === "undefined") return {};
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw) as unknown;
        return parsed && typeof parsed === "object" ? (parsed as SeenMap) : {};
    } catch {
        return {};
    }
}

function writeSeenMap(map: SeenMap) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function markSupportConversationSeen(conversationId: string, lastMessageAt: string) {
    const map = readSeenMap();
    const previous = map[conversationId];
    if (previous && previous >= lastMessageAt) return;
    map[conversationId] = lastMessageAt;
    writeSeenMap(map);
}

export function isSupportConversationUnread(conversation: SupportConversation): boolean {
    if (conversation.status !== "ANSWERED") return false;
    const seenAt = readSeenMap()[conversation.id];
    return !seenAt || seenAt < conversation.lastMessageAt;
}

export function countUnreadSupportReplies(conversations: SupportConversation[]): number {
    return conversations.filter(isSupportConversationUnread).length;
}
