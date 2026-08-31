export type SupportConversationStatus = "OPEN" | "ANSWERED";
export type SupportMessageSenderType = "MERCHANT" | "OPERATOR";

export type SupportConversation = {
    id: string;
    conversationNumber: string;
    merchantId: string;
    status: SupportConversationStatus;
    subject: string;
    createdByUserId: string;
    createdAt: string;
    updatedAt: string;
    lastMessageAt: string;
};

export type SupportMessage = {
    id: string;
    conversationId: string;
    senderType: SupportMessageSenderType;
    senderId: string;
    content: string;
    createdAt: string;
};

export type SupportListQuery = {
    page: number;
    size: number;
    status?: SupportConversationStatus;
};

export type CreateSupportConversationRequest = {
    content: string;
};
