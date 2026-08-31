import { cancelCloseRequest } from "./cancel";
import { createCloseRequest } from "./create";
import { getCloseRequest } from "./get";
import { listCloseRequests } from "./list";
import { submitCloseRequest } from "./submit";

export const lifecycleApi = {
    create: createCloseRequest,
    list: listCloseRequests,
    get: getCloseRequest,
    submit: submitCloseRequest,
    cancel: cancelCloseRequest,
};

export type {
    CloseReasonCode,
    CloseRequestStatus,
    CreateMerchantCloseRequestRequest,
    MerchantCloseRequest,
} from "./types";
export {
    CANCELABLE_CLOSE_STATUSES,
    CLOSE_REASON_CODES,
    SUBMITTABLE_CLOSE_STATUSES,
} from "./types";
