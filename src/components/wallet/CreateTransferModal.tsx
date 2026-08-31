"use client";

import { useEffect, useRef, useState } from "react";
import {
    Button,
    Card,
    Form,
    Input,
    Modal,
    Space,
    Typography,
    message,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import {
    canSubmitTransferItems,
    mapLookupError,
    normalizePayeeCode,
    type PayeeLookupErrorCode,
    type PayeeLookupStatus,
} from "./payee-lookup";

interface CreateTransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accessToken: string;
    availableBalance: number;
    /** Canonical asset code for the selected balance (e.g. USD). */
    currency: string;
}

interface TransferItem {
    payeeCustomerCode: string;
    amount: string;
    memo: string;
    lookupStatus: PayeeLookupStatus;
    payeeName: string | null;
    lookupError: PayeeLookupErrorCode | null;
}

const EMPTY_ITEM = (): TransferItem => ({
    payeeCustomerCode: "",
    amount: "",
    memo: "",
    lookupStatus: "idle",
    payeeName: null,
    lookupError: null,
});

const LOOKUP_DEBOUNCE_MS = 400;

function currencyPrefix(assetCode?: string): string {
    if (!assetCode) return "";
    switch (assetCode.toUpperCase()) {
        case "CNY":
        case "RMB":
            return "¥";
        case "USD":
            return "$";
        case "EUR":
            return "€";
        case "GBP":
            return "£";
        default:
            return `${assetCode} `;
    }
}

export default function CreateTransferModal({
    isOpen,
    onClose,
    onSuccess,
    accessToken,
    availableBalance,
    currency,
}: CreateTransferModalProps) {
    const t = useTranslations("Balance");
    const tCommon = useTranslations("Common");
    const prefix = currencyPrefix(currency);
    const [submitting, setSubmitting] = useState(false);
    const [items, setItems] = useState<TransferItem[]>([EMPTY_ITEM()]);
    const lookupCacheRef = useRef<Map<string, string>>(new Map());
    const debounceTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
    const itemsRef = useRef(items);
    itemsRef.current = items;

    useEffect(() => {
        return () => {
            debounceTimersRef.current.forEach((timer) => clearTimeout(timer));
            debounceTimersRef.current.clear();
        };
    }, []);

    const clearDebounce = (index: number) => {
        const existing = debounceTimersRef.current.get(index);
        if (existing) {
            clearTimeout(existing);
            debounceTimersRef.current.delete(index);
        }
    };

    const patchItem = (index: number, patch: Partial<TransferItem>) => {
        setItems((prev) => {
            const next = [...prev];
            if (!next[index]) {
                return prev;
            }
            next[index] = { ...next[index], ...patch };
            return next;
        });
    };

    const lookupErrorMessage = (code: PayeeLookupErrorCode | null) => {
        switch (code) {
            case "MERCHANT_NOT_FOUND":
                return t("transfer_modal.payee_not_found");
            case "MERCHANT_INACTIVE":
                return t("transfer_modal.payee_inactive");
            case "SELF_TRANSFER_NOT_ALLOWED":
                return t("transfer_modal.payee_self_transfer");
            case "INVALID_CODE":
                return t("transfer_modal.payee_invalid_code");
            default:
                return t("transfer_modal.payee_lookup_failed");
        }
    };

    const runLookup = async (index: number, rawCode: string) => {
        const normalized = normalizePayeeCode(rawCode);
        if (!rawCode.trim()) {
            patchItem(index, {
                lookupStatus: "idle",
                payeeName: null,
                lookupError: null,
            });
            return;
        }
        if (!normalized) {
            patchItem(index, {
                lookupStatus: "error",
                payeeName: null,
                lookupError: "INVALID_CODE",
            });
            return;
        }

        const cached = lookupCacheRef.current.get(normalized);
        if (cached) {
            patchItem(index, {
                lookupStatus: "success",
                payeeName: cached,
                lookupError: null,
            });
            return;
        }

        patchItem(index, {
            lookupStatus: "loading",
            payeeName: null,
            lookupError: null,
        });

        try {
            const result = await api.merchants.lookupByCode(normalized, accessToken);
            const current = itemsRef.current[index];
            if (!current || normalizePayeeCode(current.payeeCustomerCode) !== normalized) {
                return;
            }
            lookupCacheRef.current.set(normalized, result.name);
            patchItem(index, {
                lookupStatus: "success",
                payeeName: result.name,
                lookupError: null,
            });
        } catch (err: unknown) {
            const current = itemsRef.current[index];
            if (!current || normalizePayeeCode(current.payeeCustomerCode) !== normalized) {
                return;
            }
            patchItem(index, {
                lookupStatus: "error",
                payeeName: null,
                lookupError: mapLookupError(err),
            });
        }
    };

    const scheduleLookup = (index: number, rawCode: string) => {
        clearDebounce(index);
        const timer = setTimeout(() => {
            debounceTimersRef.current.delete(index);
            void runLookup(index, rawCode);
        }, LOOKUP_DEBOUNCE_MS);
        debounceTimersRef.current.set(index, timer);
    };

    const addItem = () => {
        setItems((prev) => [...prev, EMPTY_ITEM()]);
    };

    const removeItem = (index: number) => {
        clearDebounce(index);
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const updateItemField = (
        index: number,
        field: "payeeCustomerCode" | "amount" | "memo",
        value: string,
    ) => {
        if (field === "payeeCustomerCode") {
            patchItem(index, {
                payeeCustomerCode: value,
                lookupStatus: "idle",
                payeeName: null,
                lookupError: null,
            });
            scheduleLookup(index, value);
            return;
        }
        patchItem(index, { [field]: value });
    };

    const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const lookupsReady = canSubmitTransferItems(items);

    const handleSubmit = async () => {
        if (items.some((item) => !item.payeeCustomerCode || !item.amount)) {
            message.error(t("transfer_modal.payee_required"));
            return;
        }
        if (!lookupsReady) {
            message.error(t("transfer_modal.payee_lookup_failed"));
            return;
        }
        if (totalAmount > availableBalance) {
            message.error(t("transfer_modal.insufficient_balance"));
            return;
        }

        setSubmitting(true);
        try {
            await api.wallet.createTransfer(
                {
                    currency,
                    transferItems: items.map((item) => ({
                        payeeCustomerCode: item.payeeCustomerCode,
                        amount: parseFloat(item.amount),
                        memo: item.memo,
                    })),
                },
                accessToken,
            );
            message.success(t("transfer_modal.success"));
            setItems([EMPTY_ITEM()]);
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error(err);
            message.error(err instanceof Error ? err.message : "Failed to initiate transfer");
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        debounceTimersRef.current.forEach((timer) => clearTimeout(timer));
        debounceTimersRef.current.clear();
        setItems([EMPTY_ITEM()]);
        onClose();
    };

    return (
        <Modal
            title={t("transfer_modal.title")}
            open={isOpen}
            onCancel={handleClose}
            onOk={handleSubmit}
            confirmLoading={submitting}
            okText={t("transfer_modal.submit")}
            cancelText={t("transfer_modal.cancel")}
            okButtonProps={{
                disabled:
                    items.length === 0 ||
                    totalAmount <= 0 ||
                    totalAmount > availableBalance ||
                    !lookupsReady,
            }}
            width={640}
            destroyOnHidden
        >
            <Card size="small" style={{ marginBottom: 16, background: "#f8fafc" }}>
                <Typography.Text type="secondary">{t("transfer_modal.available_balance")}</Typography.Text>
                <div>
                    <Typography.Text strong style={{ fontSize: 18 }}>
                        {prefix}{availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Typography.Text>
                </div>
            </Card>

            <Space direction="vertical" size={12} style={{ width: "100%", maxHeight: 400, overflowY: "auto" }}>
                {items.map((item, index) => (
                    <Card
                        key={index}
                        size="small"
                        extra={
                            items.length > 1 ? (
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeItem(index)}
                                />
                            ) : null
                        }
                    >
                        <Form layout="vertical" style={{ marginBottom: 0 }}>
                            <Space wrap style={{ width: "100%" }} align="start">
                                <Form.Item
                                    label={t("transfer_modal.payee_code")}
                                    style={{ flex: 1, minWidth: 200, marginBottom: 8 }}
                                    help={
                                        item.lookupStatus === "loading" ? (
                                            <Typography.Text type="secondary">
                                                {t("transfer_modal.payee_looking_up")}
                                            </Typography.Text>
                                        ) : item.lookupStatus === "success" && item.payeeName ? (
                                            <Typography.Text type="secondary">
                                                {item.payeeName}
                                            </Typography.Text>
                                        ) : item.lookupStatus === "error" ? (
                                            <Typography.Text type="danger">
                                                {lookupErrorMessage(item.lookupError)}
                                            </Typography.Text>
                                        ) : null
                                    }
                                    validateStatus={
                                        item.lookupStatus === "error"
                                            ? "error"
                                            : item.lookupStatus === "success"
                                              ? "success"
                                              : undefined
                                    }
                                >
                                    <Input
                                        value={item.payeeCustomerCode}
                                        onChange={(e) =>
                                            updateItemField(index, "payeeCustomerCode", e.target.value)
                                        }
                                        onBlur={() => {
                                            clearDebounce(index);
                                            void runLookup(index, item.payeeCustomerCode);
                                        }}
                                        placeholder="28599813471529"
                                    />
                                </Form.Item>
                                <Form.Item label={t("transfer_modal.amount")} style={{ flex: 1, minWidth: 140 }}>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={item.amount}
                                        onChange={(e) => updateItemField(index, "amount", e.target.value)}
                                        placeholder="0.00"
                                    />
                                </Form.Item>
                            </Space>
                            <Form.Item label={t("transfer_modal.memo")} style={{ marginBottom: 0 }}>
                                <Input
                                    value={item.memo}
                                    onChange={(e) => updateItemField(index, "memo", e.target.value)}
                                    placeholder={t("transfer_modal.memo")}
                                />
                            </Form.Item>
                        </Form>
                    </Card>
                ))}
            </Space>

            <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={addItem}
                style={{ marginTop: 12 }}
            >
                {t("transfer_modal.add_item")}
            </Button>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
                <Typography.Text type="secondary">{tCommon("total")}: </Typography.Text>
                <Typography.Text
                    strong
                    style={{ color: totalAmount > availableBalance ? "#ff4d4f" : undefined }}
                >
                    {prefix}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Typography.Text>
            </div>
        </Modal>
    );
}
