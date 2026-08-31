import { ENDPOINTS } from "../../api-config";
import type {
    CreditLineView,
    CreditLineAdjustmentView,
    CreditTransactionView,
} from "./credit";
import { pagedGet } from "../query";

export const memberCreditApi = {
    listLines: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<CreditLineView>(ENDPOINTS.PORTAL.DEBITOR_CREDIT_LINES, params, token),
    listAdjustments: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<CreditLineAdjustmentView>(ENDPOINTS.PORTAL.DEBITOR_CREDIT_LINE_ADJUSTMENTS, params, token),
    listTransactions: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<CreditTransactionView>(ENDPOINTS.PORTAL.DEBITOR_CREDIT_TRANSACTIONS, params, token),
};
