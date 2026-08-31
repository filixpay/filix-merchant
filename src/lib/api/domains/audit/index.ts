import { listAuditLogs } from "./list-audit-logs";

export const auditApi = {
    list: listAuditLogs,
};

export type {
    AuditActorType,
    AuditActionCategory,
    AuditResult,
    AuditMetadata,
    AuditLogItem,
    AuditLogPage,
    AuditLogListQuery,
} from "./types";
