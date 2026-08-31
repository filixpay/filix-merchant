"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    Switch,
    message,
} from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { api, LocationView, type CollectionDestinationView } from "@/lib/api";
import AssetFlagIcon from "@/components/money/AssetFlagIcon";

import styles from "./CreateOrderModal.module.css";
import {
    buildCreateOrderPayload,
    calculateOrderTotal,
    createDefaultOrderFormValues,
    createDefaultOrderItem,
    formatOrderAmount,
    ORDER_CURRENCIES,
    ZERO_DECIMAL_CURRENCIES,
    type CreateOrderFormValues,
    type OrderCurrency,
} from "./create-order-form-model";

function formatDestinationLabel(destination: CollectionDestinationView): string {
    const bank = destination.bankName?.trim() || "Bank";
    const holder = destination.accountHolderName?.trim() || "-";
    const last4 =
        destination.accountNumberLast4?.trim() ||
        destination.accountNumberMasked?.replace(/\D/g, "").slice(-4) ||
        "-";
    const currency = destination.currency?.trim() || "";
    return `${bank} - ${holder} (····${last4})${currency ? ` · ${currency}` : ""}`;
}

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accessToken: string;
    initialValues?: CreateOrderFormValues | null;
}

function createInitialFormValues(): CreateOrderFormValues {
    const values = createDefaultOrderFormValues();

    return {
        ...values,
        paymentExpiredAt: dayjs(values.paymentExpiredAt as Date),
    };
}

function toModalFormValues(values: CreateOrderFormValues): CreateOrderFormValues {
    const expiry = values.paymentExpiredAt;
    const expiryInput =
        expiry instanceof Date
            ? expiry
            : typeof expiry?.toDate === "function"
              ? expiry.toDate()
              : typeof expiry?.toISOString === "function"
                ? expiry.toISOString()
                : new Date();

    return {
        ...values,
        paymentExpiredAt: dayjs(expiryInput),
    };
}

export default function CreateOrderModal({
    isOpen,
    onClose,
    onSuccess,
    accessToken,
    initialValues = null,
}: CreateOrderModalProps) {
    const t = useTranslations("Orders");
    const [form] = Form.useForm<CreateOrderFormValues>();
    const watchedItems = Form.useWatch("orderItems", form);
    const watchedCurrency = (Form.useWatch("currency", form) || "USD") as OrderCurrency;
    const watchedOfflineTransfer = Form.useWatch("offlineTransfer", form);
    const totalAmount = useMemo(() => calculateOrderTotal(watchedItems), [watchedItems]);

    const [submitting, setSubmitting] = useState(false);
    const [destinations, setDestinations] = useState<CollectionDestinationView[]>([]);
    const [destinationsLoading, setDestinationsLoading] = useState(false);
    const [locations, setLocations] = useState<LocationView[]>([]);

    const loadCollectionDestinations = useCallback(async () => {
        setDestinationsLoading(true);
        try {
            const data = await api.orders.listCollectionDestinations(
                { purpose: "OFFLINE_MONEY_IN" },
                accessToken,
            );
            const items = (data.items ?? []).filter((item) => item.status === "ACTIVE");
            setDestinations(items);
            const preferred =
                (data.defaultDestinationId &&
                    items.find((item) => item.id === data.defaultDestinationId)?.id) ||
                items[0]?.id;
            form.setFieldValue("collectionDestinationId", preferred);
        } catch (error) {
            console.error("Failed to load collection destinations", error);
            setDestinations([]);
            form.setFieldValue("collectionDestinationId", undefined);
            message.error(t("create_modal.destinations_load_failed"));
        } finally {
            setDestinationsLoading(false);
        }
    }, [accessToken, form, t]);

    const loadLocations = useCallback(async () => {
        try {
            const data = await api.locations.list({ pageNumber: 0, pageSize: 100 }, accessToken);
            setLocations(data.data || []);
        } catch (error) {
            console.error("Failed to load locations", error);
        }
    }, [accessToken]);

    useEffect(() => {
        if (!isOpen) return;
        form.setFieldsValue(
            initialValues ? toModalFormValues(initialValues) : createInitialFormValues(),
        );
        setDestinations([]);
        loadLocations();
    }, [form, isOpen, initialValues, loadLocations]);

    useEffect(() => {
        if (!isOpen || !watchedOfflineTransfer) {
            if (!watchedOfflineTransfer) {
                form.setFieldValue("collectionDestinationId", undefined);
                setDestinations([]);
            }
            return;
        }
        void loadCollectionDestinations();
    }, [isOpen, watchedOfflineTransfer, loadCollectionDestinations, form]);

    const handleCreateOrder = async (values: CreateOrderFormValues) => {
        setSubmitting(true);

        try {
            const payload = buildCreateOrderPayload(values);
            await api.orders.create(payload, accessToken);
            onSuccess();
            onClose();
            form.setFieldsValue(createInitialFormValues());
            message.success(t("create_modal.create_success"));
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("create_modal.create_failed"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={t("create_modal.title")}
            open={isOpen}
            onCancel={onClose}
            width={720}
            footer={null}
            destroyOnHidden
            className={styles.modal}
        >
            <Form<CreateOrderFormValues>
                form={form}
                layout="vertical"
                size="small"
                initialValues={createInitialFormValues()}
                onFinish={handleCreateOrder}
                className={styles.form}
            >
                <div className={styles.basicGrid}>
                    <Form.Item
                        name="merchantOrderId"
                        label={t("create_modal.merchant_order_id")}
                        className={styles.span6}
                        rules={[{ required: true, message: t("create_modal.merchant_order_id") }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="subject"
                        label={t("create_modal.subject")}
                        className={styles.span6}
                        rules={[{ required: true, message: t("create_modal.subject") }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="paymentExpiredAt"
                        label={t("create_modal.expiry")}
                        className={styles.span5}
                        rules={[{ required: true, message: t("create_modal.expiry") }]}
                    >
                        <DatePicker showTime style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        name="currency"
                        label={t("create_modal.currency")}
                        className={styles.span3}
                        rules={[{ required: true, message: t("create_modal.currency") }]}
                    >
                        <Select
                            optionLabelProp="label"
                            options={ORDER_CURRENCIES.map((currency) => ({
                                value: currency,
                                label: (
                                    <span className={styles.currencyOption}>
                                        <AssetFlagIcon assetCode={currency} size={14} />
                                        <span>{currency}</span>
                                    </span>
                                ),
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        name="locationId"
                        label={t("create_modal.location")}
                        className={styles.span4}
                    >
                        <Select
                            allowClear
                            placeholder={t("create_modal.select_location")}
                            options={locations.map((location) => ({
                                label: location.name,
                                value: location.id,
                            }))}
                        />
                    </Form.Item>
                </div>

                <div className={styles.offlineRow}>
                    <Form.Item
                        name="offlineTransfer"
                        label={t("create_modal.offline_transfer")}
                        valuePropName="checked"
                        className={styles.offlineSwitch}
                    >
                        <Switch />
                    </Form.Item>
                    {watchedOfflineTransfer ? (
                        <Form.Item
                            name="collectionDestinationId"
                            label={
                                <span>
                                    {t("create_modal.bank_account")}
                                    <span className={styles.sectionHint}>
                                        {t("create_modal.bank_account_hint")}
                                    </span>
                                </span>
                            }
                            className={styles.destinationField}
                            rules={[
                                {
                                    required: true,
                                    message: t("create_modal.select_bank_account"),
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                loading={destinationsLoading}
                                placeholder={t("create_modal.select_bank_account")}
                                notFoundContent={
                                    destinationsLoading
                                        ? null
                                        : t("create_modal.destinations_empty")
                                }
                                options={destinations.map((destination) => ({
                                    label: formatDestinationLabel(destination),
                                    value: destination.id,
                                }))}
                            />
                        </Form.Item>
                    ) : null}
                </div>

                <Form.List name="orderItems">
                    {(fields, { add, remove }) => (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.sectionTitle}>{t("create_modal.items")}</span>
                                <Button
                                    type="link"
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={() => add(createDefaultOrderItem())}
                                    style={{ paddingInline: 0, height: "auto" }}
                                >
                                    {t("create_modal.add_item")}
                                </Button>
                            </div>

                            <div className={styles.itemsTable}>
                                <div className={styles.itemsHead}>
                                    <span>{t("create_modal.product_id")}</span>
                                    <span>{t("create_modal.desc")}</span>
                                    <span>{t("create_modal.qty")}</span>
                                    <span>{t("create_modal.price")}</span>
                                    <span />
                                </div>
                                {fields.map((field) => (
                                    <div key={field.key} className={styles.itemRow}>
                                        <div className={styles.itemCell}>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, "businessProductId"]}
                                            >
                                                <Input placeholder="SKU" />
                                            </Form.Item>
                                        </div>
                                        <div className={styles.itemCell}>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, "description"]}
                                            >
                                                <Input placeholder={t("create_modal.desc")} />
                                            </Form.Item>
                                        </div>
                                        <div className={styles.itemCell}>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, "quantity"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t("create_modal.qty"),
                                                    },
                                                ]}
                                            >
                                                <InputNumber min={0} controls={false} />
                                            </Form.Item>
                                        </div>
                                        <div className={styles.itemCell}>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, "unitPrice"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t("create_modal.price"),
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    min={0}
                                                    controls={false}
                                                    step={
                                                        ZERO_DECIMAL_CURRENCIES.has(watchedCurrency)
                                                            ? 1
                                                            : 0.01
                                                    }
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className={styles.removeCell}>
                                            <Button
                                                type="text"
                                                size="small"
                                                aria-label={t("create_modal.remove_item")}
                                                icon={<DeleteOutlined />}
                                                disabled={fields.length === 1}
                                                danger
                                                onClick={() => remove(field.name)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Form.List>

                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        {t("create_modal.buyer_information")}
                        <span className={styles.sectionHint}>{t("create_modal.buyer_optional")}</span>
                    </div>
                    <div className={styles.buyerGrid}>
                        <Form.Item name="customerName">
                            <Input placeholder={t("create_modal.customer_name")} />
                        </Form.Item>
                        <Form.Item
                            name="customerEmail"
                            rules={[{ type: "email", message: t("create_modal.customer_email") }]}
                        >
                            <Input placeholder={t("create_modal.customer_email")} />
                        </Form.Item>
                        <Form.Item name="customermobile">
                            <Input placeholder={t("create_modal.customer_mobile")} />
                        </Form.Item>
                    </div>
                </div>

                <div className={styles.footerBar}>
                    <div className={styles.amountInline}>
                        <span className={styles.amountLabel}>{t("create_modal.amount")}</span>
                        <span className={styles.amountValue}>
                            <AssetFlagIcon
                                assetCode={watchedCurrency}
                                size={16}
                                className={styles.amountFlag}
                            />
                            <span>
                                {watchedCurrency}{" "}
                                {formatOrderAmount(watchedCurrency, totalAmount)}
                            </span>
                        </span>
                    </div>
                    <Space>
                        <Button onClick={onClose}>{t("create_modal.cancel")}</Button>
                        <Button type="primary" htmlType="submit" loading={submitting}>
                            {t("create_modal.submit")}
                        </Button>
                    </Space>
                </div>
            </Form>
        </Modal>
    );
}
