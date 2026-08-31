/**
 * Helper functions for Offline Collection Audit & Review.
 */

type TransferAmountInput = {
    amount?: number | null;
    currency?: string | null;
    formatted?: string | null;
};

export function getTransferStatusColor(status: string): string {
    switch (status) {
        case "APPROVED":
        case "SUCCESS":
            return "success";
        case "PENDING":
            return "processing";
        case "REJECTED":
        case "FAILED":
            return "error";
        default:
            return "default";
    }
}

export function formatTransferMetaValue(value?: string | null): string {
    const trimmed = value?.trim();
    return trimmed ? trimmed : "待填入";
}

export function formatTransferPartyAccountHint(bankName?: string | null, accountNumber?: string | null): string {
    const bank = formatTransferMetaValue(bankName);
    const account = formatTransferMetaValue(accountNumber);
    if (account === "待填入") {
        return bank;
    }
    if (account.length <= 8) {
        return `${bank} (${account})`;
    }
    return `${bank} (${account.slice(0, 4)}...${account.slice(-4)})`;
}

export function getReceivableAmount(transfer: {
    totalAmount?: number | null;
    invoice?: { totalAmount?: { amount?: number | null } | null } | null;
    order?: { totalAmount?: { amount?: number | null } | null } | null;
}): number | null {
    const value =
        transfer.invoice?.totalAmount?.amount ??
        transfer.order?.totalAmount?.amount ??
        transfer.totalAmount;
    return value == null ? null : Number(value);
}

export function isAmountMismatch(
    actual: number | string | null | undefined,
    receivable: number | null,
): boolean {
    if (actual == null || actual === "" || receivable == null || Number.isNaN(Number(actual))) {
        return false;
    }
    return Number(actual) !== Number(receivable);
}

export function fourEyesErrorI18nKey(codeOrMessage?: string | number | null): string | null {
    const code = String(codeOrMessage ?? "").trim();
    switch (code) {
        case "CONFIRMATION_FIELDS_REQUIRED":
            return "errors.confirmation_fields_required";
        case "EXCEPTION_NOTE_REQUIRED":
            return "errors.exception_note_required";
        case "CHECKER_ACK_REQUIRED":
            return "errors.checker_ack_required";
        case "FOUR_EYES_SAME_OPERATOR":
            return "errors.four_eyes_same_operator";
        case "BANK_TXN_REF_REUSED":
            return "errors.bank_txn_ref_reused";
        case "RECEIPT_NOT_CONFIRMABLE":
            return "errors.not_confirmable";
        default:
            return null;
    }
}

export function formatTransferAmount({ amount, currency, formatted }: TransferAmountInput): string {
    const normalizedFormatted = formatted?.trim();
    if (normalizedFormatted && /[\$,¥€£]|,\d{3}|\.\d{2}/.test(normalizedFormatted)) {
        return normalizedFormatted;
    }
    if (amount == null || !currency) {
        return "—";
    }
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} ${currency}`;
    }
}
