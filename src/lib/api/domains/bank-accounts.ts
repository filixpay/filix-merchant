import type { PagedResponse } from "../types";

/**
 * @deprecated Removed with CustomerBankAccount hard-cut (2026-08-16).
 * Use `api.money.listExternalAccounts` / createExternalAccount / disableExternalAccount
 * and `/dashboard/money/external-accounts`. Backend `/portal/bank-accounts` no longer exists.
 */
export interface BankAccountView {
    id: string | number;
    bankName: string;
    bankBranchName: string;
    bankAccountHolder: string;
    bankAccountNumber?: string | null;
    accountNumber?: string | null;
    bankAccountNo?: string | null;
    accountLast4?: string | null;
    city: string;
    status: string;
    primary: boolean;
    customerId: string | number;
    currency?: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}

/** @deprecated See module header. */
export interface BankAccountCreateRequest {
    bankName: string;
    bankBranchName: string;
    bankAccountHolder: string;
    bankAccountNumber: string;
    city: string;
    primary: boolean;
}

function removed(): never {
    throw new Error(
        "bankAccountsApi removed: use api.money ExternalAccount APIs (/portal/money/external-accounts)",
    );
}

/** @deprecated Hard-cut stub — all methods throw. */
export const bankAccountsApi = {
    list: (_params: Record<string, string | number> = {}, _token: string): Promise<PagedResponse<BankAccountView>> =>
        removed(),
    create: (_data: BankAccountCreateRequest, _token: string): Promise<BankAccountView> => removed(),
    delete: (_id: string | number, _token: string): Promise<void> => removed(),
};
