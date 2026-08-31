import { createProduct } from "./products";
import type { CreateCommerceProductBody } from "./types";

/** Stable clientRequestId for create-page attempt lifetime (retries share the same id). */
export async function createProductWithStableId(
    token: string,
    body: CreateCommerceProductBody,
): Promise<Awaited<ReturnType<typeof createProduct>>> {
    return createProduct(token, body);
}

export { createProductWithStableId as createProductAttempt };
