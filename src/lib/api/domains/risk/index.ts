import { getRiskDashboard } from "./dashboard/get-dashboard";
import { getFraudEvent } from "./fraud/get-fraud";
import { listFraudEvents, listFraudEventsPaged } from "./fraud/list-fraud";
import { acceptDisputeLiability, saveDisputeDraft, submitDisputeEvidence, uploadDisputeEvidence } from "./disputes/actions/case-actions";
import { getDispute, listDisputes } from "./disputes/list-disputes";
import { getRiskReview } from "./reviews/get-review";
import { listRiskReviews, listRiskReviewsPaged } from "./reviews/list-reviews";
import { listRiskRules } from "./rules/list-rules";
import {
    activateCoverageConfig,
    createCoverageConfig,
    deactivateCoverageConfig,
    enterCoverageMaintenance,
    getActiveCoverageConfig,
    listCoverageConfigs,
    listCoverageProviders,
    resumeCoverageFromMaintenance,
    testCoverageConnection,
    updateCoverageConfig,
} from "./transport/coverage-config";
import {
    getCoverageSubscription,
    subscribeCoverage,
    unsubscribeCoverage,
} from "./transport/coverage-subscription";
import { fetchPaymentRiskContext } from "./transport/payment-context";

export const riskApi = {
    dashboard: {
        get: getRiskDashboard,
    },
    disputes: {
        list: listDisputes,
        get: getDispute,
        saveDraft: saveDisputeDraft,
        submitEvidence: submitDisputeEvidence,
        acceptLiability: acceptDisputeLiability,
        uploadEvidence: uploadDisputeEvidence,
    },
    reviews: {
        list: listRiskReviews,
        listPaged: listRiskReviewsPaged,
        get: getRiskReview,
    },
    fraud: {
        list: listFraudEvents,
        listPaged: listFraudEventsPaged,
        get: getFraudEvent,
    },
    paymentContext: {
        get: fetchPaymentRiskContext,
    },
    rules: {
        list: listRiskRules,
    },
    coverageConfig: {
        list: listCoverageConfigs,
        getActive: getActiveCoverageConfig,
        listProviders: listCoverageProviders,
        create: createCoverageConfig,
        update: updateCoverageConfig,
        activate: activateCoverageConfig,
        deactivate: deactivateCoverageConfig,
        enterMaintenance: enterCoverageMaintenance,
        resumeFromMaintenance: resumeCoverageFromMaintenance,
        testConnection: testCoverageConnection,
    },
    coverageSubscription: {
        get: getCoverageSubscription,
        subscribe: subscribeCoverage,
        unsubscribe: unsubscribeCoverage,
    },
};

export type {
    DisputeView,
    DisputeListItem,
    DisputeOperationalSummary,
    DisputeEvidence,
    RiskEvent,
    RiskReviewListItem,
    RiskReviewDetail,
    FraudEventListItem,
    FraudEventDetail,
    RelatedRiskSummary,
    PaymentRiskContext,
    PaymentTimelineItem,
    RiskDashboardMetrics,
    RiskRuleView,
    CoverageClaimView,
    CoverageClaimEvent,
    CoverageAssessmentLogView,
    CoverageAssessmentSummaryView,
} from "./shared/contracts";
export {
    DisputeStatus,
    RiskPriority,
    EvidenceCategory,
    RiskEventType,
    RiskReviewStatus,
    FraudEventStatus,
    CoverageClaimStatus,
    CoverageClaimEventType,
} from "./shared/contracts";
export { canEditEvidence, getAvailableActions } from "./shared/state-machine";
