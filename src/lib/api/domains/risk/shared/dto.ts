import type {
    DisputeEvidence,
    DisputeView,
    FraudEventListItem,
    RiskEvent,
    RiskReviewListItem,
} from "../shared/contracts";

export interface MetricValueDto {
    value: number | null;
    supported: boolean;
}

export interface DashboardDto {
    pendingReviews: number;
    openDisputes: number;
    highFraudToday: number;
    blockedAmount: MetricValueDto;
    reviewSlaHours: number | null;
    fraudTrend: Array<Record<string, unknown>>;
    chargebackRatio: number | null;
    rejectedToday?: number;
    pendingReviewAttempts?: number;
}

export interface RiskRuleDto {
    id: string;
    ruleType: string;
    name: string;
    enabled: boolean;
    priority: number;
    severity: string;
    enforcement: string;
    config: string;
    configVersion: number;
    configSchema: string;
    stage: string;
    merchantCode: number | null;
    platformRule: boolean;
}

export interface FraudEventSnippetDto {
    id: string;
    riskType: string;
    severity: string;
    detectedAt: string;
}

export interface ReviewSnippetDto {
    id: string;
    reviewType: string;
    reasonCode: string;
    status: string;
    decidedBy?: string;
    decidedAt?: string;
}

export interface RelatedRiskDto {
    fraudEvents: FraudEventSnippetDto[];
    reviews: ReviewSnippetDto[];
}

export interface TimelineItemDto {
    entityType: "FRAUD" | "REVIEW" | "DISPUTE" | "PAYMENT";
    id?: string;
    title: string;
    description?: string;
    occurredAt: string;
    actionPath?: string;
}

export interface PaymentRiskContextDto {
    paymentId: number;
    relatedRisk: RelatedRiskDto;
    paymentTimeline: TimelineItemDto[];
    coverageAssessmentSummary?: CoverageAssessmentLogDto | null;
    coverageAssessmentTimeline?: CoverageAssessmentLogDto[];
}

export interface EvidenceDto {
    id?: string;
    category: string;
    fileName: string;
    fileId?: number;
    fileUrl?: string | null;
    uploadedAt: string;
}

export interface DisputeDto {
    id: string;
    caseNumber: string;
    merchantOrderId: string;
    channelCode?: string | null;
    amount: number;
    currency: string;
    reason: string;
    reasonCode: string;
    status: string;
    priority: string;
    responseDueAt: string;
    evidence: EvidenceDto[];
    events: RiskEventDto[];
    createdAt: string;
    updatedAt: string;
    relatedRisk?: RelatedRiskDto;
    coverageClaim?: CoverageClaimDto | null;
    coverageAssessmentSummary?: CoverageAssessmentLogDto | null;
    coverageAssessmentTimeline?: CoverageAssessmentLogDto[];
}

export interface CoverageAssessmentLogDto {
    id: string;
    provider: string;
    status: string;
    evaluationStage: string;
    source: string;
    limitAmount?: number | null;
    currency?: string | null;
    reason?: string | null;
    occurredAt: string;
    primaryReferenceType?: string | null;
    primaryReferenceMasked?: string | null;
}

export interface CoverageClaimEventDto {
    id: string;
    eventType: string;
    status: string;
    reason?: string | null;
    occurredAt: string;
    sequenceNo: number;
}

export interface CoverageClaimDto {
    id: string;
    provider: string;
    status: string;
    statusLabel?: string | null;
    claimAmount: number;
    currency: string;
    providerClaimId?: string | null;
    assessmentPublicId?: string | null;
    events: CoverageClaimEventDto[];
}

export interface RiskEventDto {
    id: string;
    type: string;
    title: string;
    description?: string;
    actor?: string;
    occurredAt: string;
}

export interface RiskReviewDto {
    id: string;
    resourceType: string;
    resourceId: string;
    reason: string;
    status: string;
    priority: string;
    createdAt: string;
    reviewType?: string;
    reasonCode?: string;
    paymentId?: number;
    fraudEventPublicId?: string;
}

export interface ReviewDetailDto extends RiskReviewDto {
    decisionNote?: string;
    decidedBy?: string;
    decidedAt?: string;
    queuedAt?: string;
    provider?: string;
    ingestionType?: string;
    resumeUrl?: string;
    relatedRisk: RelatedRiskDto;
    timeline: RiskEventDto[];
}

export interface FraudEventDto {
    id: string;
    eventType: string;
    severity: string;
    description: string;
    relatedOrderId?: string;
    status: string;
    detectedAt: string;
    riskType?: string;
    score?: number;
    title?: string;
    merchantOrderId?: string;
    paymentId?: number;
    orderId?: number;
    metadata?: Record<string, unknown>;
    metadataSchemaVersion?: number;
    provider?: string;
    ingestionType?: string;
    createdAt?: string;
}

export interface FraudEventDetailDto extends FraudEventDto {
    relatedRisk: RelatedRiskDto;
    timeline: RiskEventDto[];
}

export type { DisputeView, DisputeEvidence, RiskEvent, RiskReviewListItem, FraudEventListItem };
