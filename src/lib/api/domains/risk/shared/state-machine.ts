import { DisputeStatus } from "./contracts";

const ALLOWED_TRANSITIONS: Record<DisputeStatus, DisputeStatus[]> = {
    [DisputeStatus.DRAFT]: [DisputeStatus.SUBMITTED, DisputeStatus.ACCEPTED],
    [DisputeStatus.SUBMITTED]: [DisputeStatus.UNDER_REVIEW],
    [DisputeStatus.UNDER_REVIEW]: [DisputeStatus.WON, DisputeStatus.LOST],
    [DisputeStatus.WON]: [],
    [DisputeStatus.LOST]: [],
    [DisputeStatus.ACCEPTED]: [],
};

export type DisputeAction = "SAVE_DRAFT" | "SUBMIT" | "ACCEPT_LIABILITY";

const ACTIONS_BY_STATUS: Record<DisputeStatus, DisputeAction[]> = {
    [DisputeStatus.DRAFT]: ["SAVE_DRAFT", "SUBMIT", "ACCEPT_LIABILITY"],
    [DisputeStatus.SUBMITTED]: [],
    [DisputeStatus.UNDER_REVIEW]: [],
    [DisputeStatus.WON]: [],
    [DisputeStatus.LOST]: [],
    [DisputeStatus.ACCEPTED]: [],
};

export function canTransition(from: DisputeStatus, to: DisputeStatus): boolean {
    return ALLOWED_TRANSITIONS[from].includes(to);
}

export function canEditEvidence(status: DisputeStatus): boolean {
    return status === DisputeStatus.DRAFT;
}

export function getAvailableActions(status: DisputeStatus): DisputeAction[] {
    return ACTIONS_BY_STATUS[status];
}

export function isTerminalStatus(status: DisputeStatus): boolean {
    return (
        status === DisputeStatus.WON ||
        status === DisputeStatus.LOST ||
        status === DisputeStatus.ACCEPTED
    );
}

export function assertTransition(from: DisputeStatus, to: DisputeStatus): void {
    if (!canTransition(from, to)) {
        throw new Error(`Invalid dispute transition: ${from} -> ${to}`);
    }
}
