import {
    createSupportConversation,
    fetchSupportConversation,
    fetchSupportConversations,
    fetchSupportMessages,
} from "./transport/support";
import type {
    CreateSupportConversationRequest,
    SupportConversation,
    SupportListQuery,
    SupportMessage,
} from "./shared/contracts";

export const supportApi = {
    list: (token: string, query: SupportListQuery) => fetchSupportConversations(token, query),
    get: (token: string, conversationId: string) => fetchSupportConversation(token, conversationId),
    listMessages: (token: string, conversationId: string) => fetchSupportMessages(token, conversationId),
    create: (token: string, body: CreateSupportConversationRequest) =>
        createSupportConversation(token, body),
};

export type {
    CreateSupportConversationRequest,
    SupportConversation,
    SupportConversationStatus,
    SupportListQuery,
    SupportMessage,
    SupportMessageSenderType,
} from "./shared/contracts";
