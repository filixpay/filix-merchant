import {
    DisputeStatus,
    EvidenceCategory,
    FraudEventStatus,
    CoverageClaimEventType,
    CoverageClaimStatus,
    RiskEventType,
    RiskPriority,
    RiskReviewStatus,
    type DisputeEvidence,
    type DisputeListItem,
    type DisputeView,
    type CoverageClaimEvent,
    type CoverageClaimView,
    type CoverageAssessmentLogView,
    type CoverageAssessmentSummaryView,
    type FraudEventDetail,
    type FraudEventListItem,
    type FraudEventSnippet,
    type PaymentRiskContext,
    type PaymentTimelineItem,
    type RelatedRiskSummary,
    type ReviewSnippet,
    type RiskDashboardMetrics,
    type RiskEvent,
    type RiskReviewDetail,
    type RiskReviewListItem,
    type RiskRuleView,
} from "./contracts";
import type {
    DashboardDto,
    CoverageClaimDto,
    CoverageClaimEventDto,
    CoverageAssessmentLogDto,
    DisputeDto,
    EvidenceDto,
    FraudEventDetailDto,
    FraudEventDto,
    FraudEventSnippetDto,
    PaymentRiskContextDto,
    RelatedRiskDto,
    ReviewDetailDto,
    ReviewSnippetDto,
    RiskEventDto,
    RiskReviewDto,
    RiskRuleDto,
    TimelineItemDto,
} from "./dto";

function asEnum<T extends Record<string, string>>(
    values: T,
    raw: string,
    fallback: T[keyof T],
): T[keyof T] {
    return (Object.values(values) as string[]).includes(raw) ? (raw as T[keyof T]) : fallback;
}

export function mapEvidenceDto(dto: EvidenceDto): DisputeEvidence {
    return {
        category: asEnum(EvidenceCategory, dto.category, EvidenceCategory.OTHER),
        fileName: dto.fileName,
        uploadedAt: dto.uploadedAt,
        fileId: dto.fileId,
        fileUrl: dto.fileUrl ?? undefined,
    };
}

export function mapRiskEventDto(dto: RiskEventDto): RiskEvent {
    return {
        id: dto.id,
        type: asEnum(RiskEventType, dto.type, RiskEventType.CASE_OPENED),
        title: dto.title,
        description: dto.description,
        actor: dto.actor,
        occurredAt: dto.occurredAt,
    };
}

function mapCoverageClaimEventDto(dto: CoverageClaimEventDto): CoverageClaimEvent {
    return {
        id: dto.id,
        eventType: asEnum(CoverageClaimEventType, dto.eventType, CoverageClaimEventType.CREATED),
        status: asEnum(CoverageClaimStatus, dto.status, CoverageClaimStatus.CREATED),
        reason: dto.reason ?? undefined,
        occurredAt: dto.occurredAt,
        sequenceNo: dto.sequenceNo,
    };
}

function mapCoverageClaimDto(dto: CoverageClaimDto): CoverageClaimView {
    return {
        id: dto.id,
        provider: dto.provider,
        status: asEnum(CoverageClaimStatus, dto.status, CoverageClaimStatus.CREATED),
        statusLabel: dto.statusLabel ?? undefined,
        claimAmount: dto.claimAmount,
        currency: dto.currency,
        providerClaimId: dto.providerClaimId ?? null,
        assessmentPublicId: dto.assessmentPublicId ?? null,
        events: (dto.events ?? []).map(mapCoverageClaimEventDto),
    };
}

function mapCoverageAssessmentLogDto(dto: CoverageAssessmentLogDto): CoverageAssessmentLogView {
    return {
        id: dto.id,
        provider: dto.provider,
        status: dto.status,
        evaluationStage: dto.evaluationStage,
        source: dto.source,
        limitAmount: dto.limitAmount ?? null,
        currency: dto.currency ?? null,
        reason: dto.reason ?? null,
        occurredAt: dto.occurredAt,
        primaryReferenceType: dto.primaryReferenceType ?? null,
        primaryReferenceMasked: dto.primaryReferenceMasked ?? null,
    };
}

function mapFraudEventSnippetDto(dto: FraudEventSnippetDto): FraudEventSnippet {
    return {
        id: dto.id,
        riskType: dto.riskType,
        severity: asEnum(RiskPriority, dto.severity, RiskPriority.MEDIUM),
        detectedAt: dto.detectedAt,
    };
}

function mapReviewSnippetDto(dto: ReviewSnippetDto): ReviewSnippet {
    return {
        id: dto.id,
        reviewType: dto.reviewType,
        reasonCode: dto.reasonCode,
        status: asEnum(RiskReviewStatus, dto.status, RiskReviewStatus.PENDING),
        decidedBy: dto.decidedBy,
        decidedAt: dto.decidedAt,
    };
}

export function mapRelatedRiskDto(dto: RelatedRiskDto | undefined): RelatedRiskSummary {
    return {
        fraudEvents: (dto?.fraudEvents ?? []).map(mapFraudEventSnippetDto),
        reviews: (dto?.reviews ?? []).map(mapReviewSnippetDto),
    };
}

function mapFraudEventBase(dto: FraudEventDto): FraudEventListItem {
    return {
        id: dto.id,
        eventType: dto.eventType,
        severity: asEnum(RiskPriority, dto.severity, RiskPriority.MEDIUM),
        description: dto.description,
        relatedOrderId: dto.relatedOrderId ?? dto.merchantOrderId,
        status: asEnum(FraudEventStatus, dto.status, FraudEventStatus.OPEN),
        detectedAt: dto.detectedAt,
        riskType: dto.riskType,
        title: dto.title,
        paymentId: dto.paymentId,
    };
}

export function mapDisputeDto(dto: DisputeDto): DisputeView {
    return {
        id: dto.id,
        caseNumber: dto.caseNumber,
        merchantOrderId: dto.merchantOrderId,
        channelCode: dto.channelCode ?? null,
        amount: dto.amount,
        currency: dto.currency,
        reason: dto.reason,
        reasonCode: dto.reasonCode,
        status: asEnum(DisputeStatus, dto.status, DisputeStatus.DRAFT),
        priority: asEnum(RiskPriority, dto.priority, RiskPriority.MEDIUM),
        responseDueAt: dto.responseDueAt,
        evidence: (dto.evidence ?? []).map(mapEvidenceDto),
        events: (dto.events ?? []).map(mapRiskEventDto),
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
        relatedRisk: dto.relatedRisk ? mapRelatedRiskDto(dto.relatedRisk) : undefined,
        coverageClaim: dto.coverageClaim ? mapCoverageClaimDto(dto.coverageClaim) : undefined,
        coverageAssessmentSummary: dto.coverageAssessmentSummary
            ? mapCoverageAssessmentLogDto(dto.coverageAssessmentSummary)
            : undefined,
        coverageAssessmentTimeline: (dto.coverageAssessmentTimeline ?? []).map(mapCoverageAssessmentLogDto),
    };
}

export function mapDisputeListItem(dto: DisputeDto): DisputeListItem {
    const view = mapDisputeDto(dto);
    return {
        id: view.id,
        caseNumber: view.caseNumber,
        merchantOrderId: view.merchantOrderId,
        channelCode: view.channelCode ?? null,
        amount: view.amount,
        currency: view.currency,
        reason: view.reason,
        status: view.status,
        priority: view.priority,
        responseDueAt: view.responseDueAt,
        createdAt: view.createdAt,
    };
}

function mapRiskReviewBase(dto: RiskReviewDto): RiskReviewListItem {
    return {
        id: dto.id,
        resourceType: dto.resourceType as RiskReviewListItem["resourceType"],
        resourceId: dto.resourceId,
        reason: dto.reason,
        status: asEnum(RiskReviewStatus, dto.status, RiskReviewStatus.PENDING),
        priority: asEnum(RiskPriority, dto.priority, RiskPriority.MEDIUM),
        createdAt: dto.createdAt,
        reviewType: dto.reviewType,
        reasonCode: dto.reasonCode,
        paymentId: dto.paymentId,
        fraudEventPublicId: dto.fraudEventPublicId,
    };
}

export function mapRiskReviewDto(dto: RiskReviewDto): RiskReviewListItem {
    return mapRiskReviewBase(dto);
}

export function mapRiskReviewDetailDto(dto: ReviewDetailDto): RiskReviewDetail {
    const base = mapRiskReviewBase(dto);
    return {
        ...base,
        reviewType: dto.reviewType ?? base.reviewType ?? "MANUAL",
        reasonCode: dto.reasonCode ?? base.reasonCode ?? "",
        decisionNote: dto.decisionNote,
        decidedBy: dto.decidedBy,
        decidedAt: dto.decidedAt,
        queuedAt: dto.queuedAt,
        provider: dto.provider,
        ingestionType: dto.ingestionType,
        resumeUrl: dto.resumeUrl,
        relatedRisk: mapRelatedRiskDto(dto.relatedRisk),
        timeline: (dto.timeline ?? []).map(mapRiskEventDto),
    };
}

export function mapFraudEventDto(dto: FraudEventDto): FraudEventListItem {
    return mapFraudEventBase(dto);
}

export function mapFraudEventDetailDto(dto: FraudEventDetailDto): FraudEventDetail {
    const base = mapFraudEventBase(dto);
    return {
        ...base,
        merchantOrderId: dto.merchantOrderId,
        orderId: dto.orderId,
        score: dto.score,
        metadata: dto.metadata,
        metadataSchemaVersion: dto.metadataSchemaVersion,
        provider: dto.provider,
        ingestionType: dto.ingestionType,
        createdAt: dto.createdAt,
        relatedRisk: mapRelatedRiskDto(dto.relatedRisk),
        timeline: (dto.timeline ?? []).map(mapRiskEventDto),
    };
}

function mapFraudTrendPoint(raw: Record<string, unknown>): { date: string; count: number } {
    const date = typeof raw.date === "string" ? raw.date : String(raw.day ?? raw.occurredAt ?? "");
    const count = typeof raw.count === "number" ? raw.count : Number(raw.value ?? 0);
    return { date, count: Number.isFinite(count) ? count : 0 };
}

export function mapDashboardDto(dto: DashboardDto): RiskDashboardMetrics {
    return {
        pendingReviews: dto.pendingReviews,
        openDisputes: dto.openDisputes,
        highFraudToday: dto.highFraudToday,
        blockedAmount: {
            value: dto.blockedAmount?.value ?? null,
            supported: dto.blockedAmount?.supported ?? false,
        },
        reviewSlaHours: dto.reviewSlaHours,
        fraudTrend: (dto.fraudTrend ?? []).map(mapFraudTrendPoint),
        chargebackRatio: dto.chargebackRatio,
        rejectedToday: dto.rejectedToday ?? 0,
        pendingReviewAttempts: dto.pendingReviewAttempts ?? 0,
    };
}

export function mapRiskRuleDto(dto: RiskRuleDto): RiskRuleView {
    return {
        id: dto.id,
        ruleType: dto.ruleType,
        name: dto.name,
        enabled: dto.enabled,
        priority: dto.priority,
        severity: asEnum(RiskPriority, dto.severity, RiskPriority.MEDIUM),
        enforcement: dto.enforcement,
        config: dto.config,
        configVersion: dto.configVersion,
        configSchema: dto.configSchema,
        stage: dto.stage,
        merchantCode: dto.merchantCode,
        platformRule: dto.platformRule,
    };
}

function mapTimelineItemDto(dto: TimelineItemDto): PaymentTimelineItem {
    return {
        entityType: dto.entityType,
        id: dto.id,
        title: dto.title,
        description: dto.description,
        occurredAt: dto.occurredAt,
        actionPath: dto.actionPath,
    };
}

export function mapPaymentRiskContextDto(dto: PaymentRiskContextDto): PaymentRiskContext {
    return {
        paymentId: dto.paymentId,
        relatedRisk: mapRelatedRiskDto(dto.relatedRisk),
        paymentTimeline: (dto.paymentTimeline ?? []).map(mapTimelineItemDto),
        coverageAssessmentSummary: dto.coverageAssessmentSummary
            ? mapCoverageAssessmentLogDto(dto.coverageAssessmentSummary)
            : null,
        coverageAssessmentTimeline: (dto.coverageAssessmentTimeline ?? []).map(mapCoverageAssessmentLogDto),
    };
}
