export const RiskPriority = {
    CRITICAL: "CRITICAL",
    HIGH: "HIGH",
    MEDIUM: "MEDIUM",
    LOW: "LOW",
} as const;
export type RiskPriority = (typeof RiskPriority)[keyof typeof RiskPriority];

export const DisputeStatus = {
    DRAFT: "DRAFT",
    SUBMITTED: "SUBMITTED",
    UNDER_REVIEW: "UNDER_REVIEW",
    WON: "WON",
    LOST: "LOST",
    ACCEPTED: "ACCEPTED",
} as const;
export type DisputeStatus = (typeof DisputeStatus)[keyof typeof DisputeStatus];

export const EvidenceCategory = {
    RECEIPT: "RECEIPT",
    SHIPPING: "SHIPPING",
    COMMUNICATION: "COMMUNICATION",
    OTHER: "OTHER",
} as const;
export type EvidenceCategory = (typeof EvidenceCategory)[keyof typeof EvidenceCategory];

export const RiskEventType = {
    CASE_OPENED: "CASE_OPENED",
    EVIDENCE_DRAFT_SAVED: "EVIDENCE_DRAFT_SAVED",
    EVIDENCE_SUBMITTED: "EVIDENCE_SUBMITTED",
    LIABILITY_ACCEPTED: "LIABILITY_ACCEPTED",
    REVIEW_STARTED: "REVIEW_STARTED",
    CHANNEL_STATUS_CHANGED: "CHANNEL_STATUS_CHANGED",
    CASE_RESOLVED: "CASE_RESOLVED",
    EVIDENCE_FORWARDED_TO_CHANNEL: "EVIDENCE_FORWARDED_TO_CHANNEL",
    CHANNEL_EVIDENCE_SUBMIT_FAILED: "CHANNEL_EVIDENCE_SUBMIT_FAILED",
} as const;
export type RiskEventType = (typeof RiskEventType)[keyof typeof RiskEventType];

/** Append-only audit event; historical records must never be mutated. */
export interface RiskEvent {
    readonly id: string;
    readonly type: RiskEventType;
    readonly title: string;
    readonly description?: string;
    readonly actor?: string;
    readonly occurredAt: string;
}

export interface DisputeEvidence {
    category: EvidenceCategory;
    fileName: string;
    uploadedAt: string;
    fileId?: number;
    fileUrl?: string;
}

export const RiskReviewStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
} as const;
export type RiskReviewStatus = (typeof RiskReviewStatus)[keyof typeof RiskReviewStatus];

export const FraudEventStatus = {
    OPEN: "OPEN",
    INVESTIGATING: "INVESTIGATING",
    CLOSED: "CLOSED",
} as const;
export type FraudEventStatus = (typeof FraudEventStatus)[keyof typeof FraudEventStatus];

export const CoverageClaimStatus = {
    CREATED: "CREATED",
    UNDER_REVIEW: "UNDER_REVIEW",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    PAID: "PAID",
    CLOSED: "CLOSED",
} as const;
export type CoverageClaimStatus = (typeof CoverageClaimStatus)[keyof typeof CoverageClaimStatus];

export const CoverageClaimEventType = {
    CREATED: "CREATED",
    SUBMITTED: "SUBMITTED",
    UNDER_REVIEW: "UNDER_REVIEW",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    PAID: "PAID",
    CLOSED: "CLOSED",
} as const;
export type CoverageClaimEventType = (typeof CoverageClaimEventType)[keyof typeof CoverageClaimEventType];

export interface CoverageClaimEvent {
    readonly id: string;
    readonly eventType: CoverageClaimEventType;
    readonly status: CoverageClaimStatus;
    readonly reason?: string;
    readonly occurredAt: string;
    readonly sequenceNo: number;
}

export interface CoverageClaimView {
    readonly id: string;
    readonly provider: string;
    readonly status: CoverageClaimStatus;
    readonly statusLabel?: string;
    readonly claimAmount: number;
    readonly currency: string;
    readonly providerClaimId?: string | null;
    readonly assessmentPublicId?: string | null;
    readonly events: readonly CoverageClaimEvent[];
}

export interface CoverageAssessmentLogView {
    readonly id: string;
    readonly provider: string;
    readonly status: string;
    readonly evaluationStage: string;
    readonly source: string;
    readonly limitAmount?: number | null;
    readonly currency?: string | null;
    readonly reason?: string | null;
    readonly occurredAt: string;
    readonly primaryReferenceType?: string | null;
    readonly primaryReferenceMasked?: string | null;
}

export type CoverageAssessmentSummaryView = CoverageAssessmentLogView;

export interface RiskReviewListItem {
    id: string;
    resourceType: "ORDER" | "PAYOUT";
    resourceId: string;
    reason: string;
    status: RiskReviewStatus;
    priority: RiskPriority;
    createdAt: string;
    reviewType?: string;
    reasonCode?: string;
    paymentId?: number;
    fraudEventPublicId?: string;
}

export interface FraudEventListItem {
    id: string;
    eventType: string;
    severity: RiskPriority;
    description: string;
    relatedOrderId?: string;
    status: FraudEventStatus;
    detectedAt: string;
    riskType?: string;
    title?: string;
    paymentId?: number;
}

export interface FraudEventSnippet {
    id: string;
    riskType: string;
    severity: RiskPriority;
    detectedAt: string;
}

export interface ReviewSnippet {
    id: string;
    reviewType: string;
    reasonCode: string;
    status: RiskReviewStatus;
    decidedBy?: string;
    decidedAt?: string;
}

export interface RelatedRiskSummary {
    fraudEvents: FraudEventSnippet[];
    reviews: ReviewSnippet[];
}

export interface FraudEventDetail extends FraudEventListItem {
    merchantOrderId?: string;
    orderId?: number;
    score?: number;
    metadata?: Record<string, unknown>;
    metadataSchemaVersion?: number;
    provider?: string;
    ingestionType?: string;
    createdAt?: string;
    relatedRisk: RelatedRiskSummary;
    timeline: readonly RiskEvent[];
}

export interface RiskReviewDetail extends RiskReviewListItem {
    reviewType: string;
    reasonCode: string;
    decisionNote?: string;
    decidedBy?: string;
    decidedAt?: string;
    queuedAt?: string;
    provider?: string;
    ingestionType?: string;
    resumeUrl?: string;
    relatedRisk: RelatedRiskSummary;
    timeline: readonly RiskEvent[];
}

export interface PaymentTimelineItem {
    entityType: "FRAUD" | "REVIEW" | "DISPUTE" | "PAYMENT";
    id?: string;
    title: string;
    description?: string;
    occurredAt: string;
    actionPath?: string;
}

export interface PaymentRiskContext {
    paymentId: number;
    relatedRisk: RelatedRiskSummary;
    paymentTimeline: PaymentTimelineItem[];
    coverageAssessmentSummary?: CoverageAssessmentSummaryView | null;
    coverageAssessmentTimeline?: readonly CoverageAssessmentLogView[];
}

export interface RiskDashboardMetrics {
    pendingReviews: number;
    openDisputes: number;
    highFraudToday: number;
    blockedAmount: { value: number | null; supported: boolean };
    reviewSlaHours: number | null;
    fraudTrend: Array<{ date: string; count: number }>;
    chargebackRatio: number | null;
    rejectedToday: number;
    pendingReviewAttempts: number;
}

export interface RiskRuleView {
    id: string;
    ruleType: string;
    name: string;
    enabled: boolean;
    priority: number;
    severity: RiskPriority;
    enforcement: string;
    config: string;
    configVersion: number;
    configSchema: string;
    stage: string;
    merchantCode: number | null;
    platformRule: boolean;
}

export interface DisputeView {
    id: string;
    caseNumber: string;
    merchantOrderId: string;
    channelCode?: string | null;
    amount: number;
    currency: string;
    reason: string;
    reasonCode: string;
    status: DisputeStatus;
    priority: RiskPriority;
    responseDueAt: string;
    evidence: DisputeEvidence[];
    events: readonly RiskEvent[];
    createdAt: string;
    updatedAt: string;
    relatedRisk?: RelatedRiskSummary;
    coverageClaim?: CoverageClaimView | null;
    coverageAssessmentSummary?: CoverageAssessmentSummaryView | null;
    coverageAssessmentTimeline?: readonly CoverageAssessmentLogView[];
}

export interface DisputeListItem {
    id: string;
    caseNumber: string;
    merchantOrderId: string;
    channelCode?: string | null;
    amount: number;
    currency: string;
    reason: string;
    status: DisputeStatus;
    priority: RiskPriority;
    responseDueAt: string;
    createdAt: string;
}

export interface DisputeOperationalSummary {
    actionRequired: number;
    dueSoon: number;
    overdue: number;
}

export interface SaveDraftRequest {
    evidence: DisputeEvidence[];
}

export interface SubmitEvidenceRequest {
    evidence: DisputeEvidence[];
}
