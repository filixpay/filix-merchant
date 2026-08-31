import { cancelChangeRequest } from "./cancel";
import { createChangeRequest } from "./create";
import { getChangeRequest } from "./get";
import { getChangeSchema } from "./get-schema";
import { listChangeRequests } from "./list";
import { submitChangeRequest } from "./submit";
import { getMerchantContact } from "./get-contact";
import { updateMerchantContact } from "./update-contact";
import { updateChangeProfile } from "./update-profile";

export const maintenanceApi = {
    create: createChangeRequest,
    list: listChangeRequests,
    get: getChangeRequest,
    updateProfile: updateChangeProfile,
    submit: submitChangeRequest,
    cancel: cancelChangeRequest,
    getSchema: getChangeSchema,
    getContact: getMerchantContact,
    updateContact: updateMerchantContact,
};

export { PendingChangeExistsError } from "./create";
export type {
    ApplyPhase,
    ChangeProfileRequest,
    ChangeRequestStatus,
    ChangeType,
    ContactType,
    CreateMerchantChangeRequestRequest,
    ListChangeRequestsQuery,
    MerchantChangeProfile,
    MerchantChangeRequest,
    MerchantChangeRequestListItem,
    MerchantChangeReturnItem,
    MerchantChangeReview,
    MerchantContactView,
    UpdateMerchantContactRequest,
} from "./types";
export {
    CANCELABLE_CHANGE_STATUSES,
    CHANGE_TYPES,
    CONTACT_TYPES,
    EDITABLE_CHANGE_STATUSES,
} from "./types";
