import { cancelApplication } from "./cancel-application";
import { createOrLoadApplication } from "./create-application";
import { deleteApplicationDocument } from "./delete-document";
import { getApplication } from "./get-application";
import { getCurrentApplication } from "./get-current-application";
import { getApplicationSchema } from "./get-schema";
import { listApplicationDocuments } from "./list-documents";
import { resolveAccessibleApplication } from "./resolve-accessible-application";
import { submitApplication } from "./submit-application";
import { updateApplicationProfile } from "./update-profile";
import { uploadApplicationDocument } from "./upload-document";

export const onboardingApi = {
    getSchema: getApplicationSchema,
    createOrLoad: createOrLoadApplication,
    get: getApplication,
    getCurrent: getCurrentApplication,
    resolveAccessible: resolveAccessibleApplication,
    updateProfile: updateApplicationProfile,
    submit: submitApplication,
    cancel: cancelApplication,
    uploadDocument: uploadApplicationDocument,
    listDocuments: listApplicationDocuments,
    deleteDocument: deleteApplicationDocument,
};

export { ApplicationConflictError } from "./create-application";
export {
    isApplicationAccessDeniedError,
    isApplicationNotFoundError,
} from "./resolve-accessible-application";
export type {
    ApplicationDocument,
    ApplicationMerchantType,
    ApplicationProfile,
    ApplicationProfileRequest,
    ApplicationReturnItem,
    ApplicationReview,
    ApplicationSchemaDto,
    ApplicationStatus,
    ApplicationType,
    CreateMerchantApplicationRequest,
    MerchantApplication,
    ReviewDecisionType,
    SchemaFieldDto,
    SchemaFieldType,
} from "./types";
export {
    APPLICATION_ID_STORAGE_KEY,
    EDITABLE_APPLICATION_STATUSES,
    REAPPLYABLE_APPLICATION_STATUSES,
    TERMINAL_APPLICATION_STATUSES,
    parseApplicationId,
} from "./types";
export { getFieldMeta, schemaFieldsWithMeta } from "./schema-field-registry";
