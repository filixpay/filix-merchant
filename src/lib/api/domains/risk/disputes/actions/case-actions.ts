import type { DisputeEvidence, DisputeView, SaveDraftRequest } from "../../shared/contracts";
import * as live from "../../transport/disputes";

export async function saveDisputeDraft(
    id: string,
    payload: SaveDraftRequest,
    token: string,
): Promise<DisputeView> {
    return live.postSaveDraft(id, payload, token);
}

export async function submitDisputeEvidence(
    id: string,
    payload: { evidence: DisputeEvidence[] },
    token: string,
): Promise<DisputeView> {
    return live.postSubmitEvidence(id, payload, token);
}

export async function acceptDisputeLiability(id: string, token: string): Promise<DisputeView> {
    return live.postAcceptLiability(id, token);
}

export async function uploadDisputeEvidence(
    id: string,
    file: File,
    category: string,
    token: string,
) {
    return live.uploadDisputeEvidenceFile(id, file, category, token);
}
