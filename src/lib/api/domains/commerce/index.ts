import { listCategories } from "./categories";
import { listProductTypes } from "./product-types";
import { uploadCommerceMedia } from "./media";
import {
    createProduct,
    deleteProduct,
    getProduct,
    listProducts,
    publishProduct,
    retrySyncProduct,
    unpublishProduct,
    updateProduct,
} from "./products";

export type {
    CommerceCategoryView,
    CommerceProductListQuery,
    CommerceProductTypeView,
    CommerceProductView,
    CreateCommerceProductBody,
    UpdateCommerceProductBody,
} from "./types";

export {
    canEdit,
    canPublish,
    canRetrySync,
    canUnpublish,
    displayBusinessStatus,
    integrationLabelKey,
    isInFlightIntegration,
    presentBusinessStatus,
} from "./presenters";

export const commerceApi = {
    products: {
        list: listProducts,
        get: getProduct,
        create: createProduct,
        update: updateProduct,
        publish: publishProduct,
        unpublish: unpublishProduct,
        retrySync: retrySyncProduct,
        delete: deleteProduct,
    },
    categories: {
        list: listCategories,
    },
    productTypes: {
        list: listProductTypes,
    },
    media: {
        upload: uploadCommerceMedia,
    },
};
