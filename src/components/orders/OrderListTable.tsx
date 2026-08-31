"use client";

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { Dropdown, message, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import {
    AlertCircle,
    Copy,
    CreditCard,
    MoreHorizontal,
    RotateCcw,
} from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import type { LocationView, OrderView, SubMerchantView, TraceTimelineItem } from '@/lib/api';
import { buildCheckoutTokenUrl } from '@/lib/checkout/checkout-url';
import { formatWalletAmountDisplay } from '@/lib/money/asset-display';
import PaymentModal from './PaymentModal';
import OrderDetailsModal from './OrderDetailsModal';
import CreateRefundModal from '../refunds/CreateRefundModal';
import MissingOrderModal from './MissingOrderModal';
import OrderIdCell from './OrderIdCell';
import OrderStatusBadge from './OrderStatusBadge';
import {
    formatDateTime,
    getOrderStatus,
    getRefundableAmount,
    normalizeOrderType,
} from './order-list-model';
import type { MissingOrderData } from './order-action-model';
import { useDashboardTableFeedback } from '@/lib/dashboard/use-dashboard-table-feedback';
import styles from './OrderListTable.module.css';

type OrderRowAction = {
    key: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    danger?: boolean;
};

interface OrderListTableProps {
    orders: OrderView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    accessToken: string;
    total?: number;
    page?: number;
    pageSize?: number;
    emptyText?: string;
    onPageChange?: (page: number, pageSize: number) => void;
    onCopyOrder?: (merchantOrderId: string) => void;
    onRefresh?: () => void;
}

export default function OrderListTable({
    orders,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    accessToken,
    total = orders.length,
    page = 0,
    pageSize = 20,
    emptyText,
    onPageChange,
    onCopyOrder,
    onRefresh,
}: OrderListTableProps) {
    const t = useTranslations('Orders');
    const tCommon = useTranslations('Common');
    const locale = useLocale();

    const handleAuthError = (err: unknown) => {
        if (err instanceof ApiError && err.status === 401 && err.code !== 'MISSING_ACCESS_TOKEN') {
            signIn();
        }
    };

    const [selectedOrder, setSelectedOrder] = useState<OrderView | null>(null);
    const [lifecycleTimeline, setLifecycleTimeline] = useState<TraceTimelineItem[]>([]);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentLink, setPaymentLink] = useState('');
    const [paymentOrder, setPaymentOrder] = useState<OrderView | null>(null);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refundInitialData, setRefundInitialData] = useState<{
        tradeNo: string;
        amount: number;
        currency?: string;
    } | null>(null);
    const [locations, setLocations] = useState<LocationView[]>([]);
    const [subMerchants, setSubMerchants] = useState<SubMerchantView[]>([]);
    const [showMissingModal, setShowMissingModal] = useState(false);
    const [missingOrderData, setMissingOrderData] = useState<MissingOrderData | null>(null);
    const [loadingMissing, setLoadingMissing] = useState(false);
    const [missingOrderId, setMissingOrderId] = useState('');

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const [locRes, subRes] = await Promise.all([
                    api.locations.list({ pageNumber: 0, pageSize: 100 }, accessToken),
                    api.subMerchants.list({ page: 0, size: 100 }, accessToken),
                ]);
                setLocations(locRes.data || []);
                setSubMerchants(subRes.data || []);
            } catch (err) {
                console.error('Failed to fetch lists for order table:', err);
            }
        };

        fetchLists();
    }, [accessToken]);

    const handleInitiatePayment = async (order: OrderView) => {
        try {
            const paymentToken = await api.orders.getPaymentToken(order.merchantOrderId, accessToken);
            const checkoutUrl = buildCheckoutTokenUrl(paymentToken);
            if (!checkoutUrl) {
                throw new Error("Missing payment token");
            }
            setPaymentLink(checkoutUrl);
            setPaymentOrder(order);
            setShowPaymentModal(true);
        } catch (err) {
            console.error(err);
            handleAuthError(err);
            message.error(err instanceof Error ? err.message : t("action_feedback.payment_failed"));
        }
    };

    const handleViewDetails = async (order: OrderView) => {
        setLoadingDetail(true);
        setShowDetailModal(true);
        try {
            const detail = order.id
                ? await api.orders.getById(String(order.id), accessToken)
                : await api.orders.get(order.merchantOrderId, accessToken);
            setSelectedOrder(detail.order);
            setLifecycleTimeline(detail.lifecycleTimeline);
        } catch (err) {
            console.error(err);
            handleAuthError(err);
            message.error(err instanceof Error ? err.message : t("action_feedback.details_failed"));
            setShowDetailModal(false);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleMissingOrder = async (merchantOrderId: string) => {
        setLoadingMissing(true);
        setShowMissingModal(true);
        setMissingOrderId(merchantOrderId);
        try {
            const data = await api.orders.checkMissingOrder(merchantOrderId, accessToken);
            setMissingOrderData(data);
        } catch (err) {
            console.error(err);
            handleAuthError(err);
            message.error(err instanceof Error ? err.message : t("action_feedback.missing_failed"));
            setShowMissingModal(false);
        } finally {
            setLoadingMissing(false);
        }
    };

    const orderTypeLabel = (orderType: string | null | undefined) => {
        const key = normalizeOrderType(orderType);
        if (!key) {
            return '-';
        }
        const messageKey = `orderTypes.${key}` as Parameters<typeof t>[0];
        return t.has(messageKey) ? t(messageKey) : key;
    };

    const locationNameById = useMemo(
        () => new Map(locations.map((location) => [location.id, location.name])),
        [locations],
    );

    const subMerchantNameById = useMemo(
        () => new Map(subMerchants.map((subMerchant) => [subMerchant.id, subMerchant.name])),
        [subMerchants],
    );

    const columns: ColumnsType<OrderView> = [
        {
            title: t('headers.order_id'),
            width: 300,
            render: (_, order) => (
                <OrderIdCell
                    merchantOrderId={order.merchantOrderId}
                    tradeNo={order.tradeNo}
                    onOpenDetails={() => handleViewDetails(order)}
                />
            ),
        },
        {
            title: t('headers.order_type'),
            width: 120,
            render: (_, order) => {
                const label = orderTypeLabel(order.orderType);
                return label === '-' ? '-' : (
                    <span className={styles.typeBadge}>{label}</span>
                );
            },
        },
        {
            title: t('headers.sub_merchant_location'),
            width: 190,
            render: (_, order) => (
                <>
                    <span className={styles.merchantPrimary}>
                        {order.subMerchantId
                            ? subMerchantNameById.get(order.subMerchantId) || order.subMerchantId
                            : '-'}
                    </span>
                    <span className={styles.merchantSecondary}>
                        {order.locationId
                            ? locationNameById.get(order.locationId) || order.locationId
                            : '-'}
                    </span>
                </>
            ),
        },
        {
            title: t('headers.payment_channel'),
            dataIndex: 'channelCode',
            width: 130,
            render: (channelCode) =>
                channelCode ? (
                    <span className={styles.channelBadge}>{channelCode}</span>
                ) : (
                    '-'
                ),
        },
        {
            title: t('headers.amount'),
            width: 140,
            align: 'right',
            render: (_, order) => {
                const currency = order.totalAmount?.currency ?? '';
                const rawAmount = order.totalAmount?.amount ?? 0;
                const amountText =
                    typeof rawAmount === 'number'
                        ? rawAmount.toFixed(2)
                        : String(rawAmount);
                const { symbol, amount } = formatWalletAmountDisplay(
                    amountText,
                    currency,
                    locale,
                );

                return (
                    <div className={`${styles.amountCell} financial-amount`}>
                        {symbol}
                        {amount}
                        {currency ? (
                            <span className={styles.amountCurrency}>{currency}</span>
                        ) : null}
                    </div>
                );
            },
        },
        {
            title: t('headers.status'),
            width: 130,
            render: (_, order) => <OrderStatusBadge status={getOrderStatus(order)} />,
        },
        {
            title: t('headers.created_at'),
            width: 160,
            render: (_, order) => (
                <span className={styles.timeCell}>{formatDateTime(order.createdAt)}</span>
            ),
        },
        {
            title: tCommon('actions'),
            key: 'actions',
            align: 'right',
            fixed: 'right',
            width: 140,
            render: (_, order) => {
                const status = getOrderStatus(order);
                const refundableAmount = getRefundableAmount(order);
                const actions: OrderRowAction[] = [];

                if (status === 'PENDING') {
                    actions.push({
                        key: 'payment',
                        label: tCommon('initiate_payment'),
                        icon: <CreditCard size={14} strokeWidth={2} />,
                        onClick: () => handleInitiatePayment(order),
                    });
                }
                if (status !== 'SUCCESS') {
                    actions.push({
                        key: 'missing',
                        label: t('missing_deal'),
                        icon: <AlertCircle size={14} strokeWidth={2} />,
                        onClick: () => handleMissingOrder(order.merchantOrderId),
                    });
                }
                if (status === 'SUCCESS' && refundableAmount > 0) {
                    actions.push({
                        key: 'refund',
                        label: t('initiate_refund'),
                        icon: <RotateCcw size={14} strokeWidth={2} />,
                        onClick: () => {
                            setRefundInitialData({
                                tradeNo: order.tradeNo,
                                amount: refundableAmount,
                                currency: order.totalAmount?.currency,
                            });
                            setShowRefundModal(true);
                        },
                        danger: true,
                    });
                }
                if (onCopyOrder) {
                    actions.push({
                        key: 'copy',
                        label: t('copy_order'),
                        icon: <Copy size={14} strokeWidth={2} />,
                        onClick: () => onCopyOrder(order.merchantOrderId),
                    });
                }

                if (actions.length === 0) {
                    return <span className={styles.actionsEmpty}>-</span>;
                }

                const [primaryAction, ...overflowActions] = actions;
                const overflowMenu: MenuProps = {
                    items: overflowActions.map((action) => ({
                        key: action.key,
                        label: action.label,
                        icon: action.icon,
                        danger: action.danger,
                    })),
                    onClick: ({ key }) => {
                        overflowActions.find((action) => action.key === key)?.onClick();
                    },
                };

                return (
                    <div className={styles.actionsCell}>
                        <button
                            type="button"
                            className={[
                                styles.actionLink,
                                primaryAction.key === 'payment' ? styles.actionLinkPrimary : '',
                                primaryAction.danger ? styles.actionLinkDanger : '',
                            ]
                                .filter(Boolean)
                                .join(' ')}
                            onClick={primaryAction.onClick}
                        >
                            {primaryAction.label}
                        </button>
                        {overflowActions.length > 0 ? (
                            <Dropdown menu={overflowMenu} trigger={['click']}>
                                <button
                                    type="button"
                                    className={styles.moreButton}
                                    aria-label={tCommon('actions')}
                                >
                                    <MoreHorizontal size={16} strokeWidth={2} />
                                </button>
                            </Dropdown>
                        ) : null}
                    </div>
                );
            },
        },
    ];

    const { tableLoading, locale: tableLocale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: orders.length,
        emptyDescription: emptyText || t('empty'),
        onRetry,
    });

    return (
        <>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
                {refreshBanner}
                <div className={styles.tableWrap}>
                    <Table<OrderView>
                        rowKey="merchantOrderId"
                        size="middle"
                        columns={columns}
                        dataSource={orders}
                        loading={tableLoading}
                        scroll={{ x: 1340 }}
                        locale={tableLocale}
                        pagination={{
                            current: page + 1,
                            pageSize,
                            total,
                            showSizeChanger: true,
                            showTotal: (count) => `Total ${count}`,
                            onChange: onPageChange,
                        }}
                    />
                </div>
            </Space>

            <PaymentModal
                isOpen={showPaymentModal}
                order={paymentOrder}
                paymentLink={paymentLink}
                onClose={() => {
                    setShowPaymentModal(false);
                    setPaymentLink('');
                    setPaymentOrder(null);
                }}
            />

            <OrderDetailsModal
                isOpen={showDetailModal}
                order={selectedOrder}
                lifecycleTimeline={lifecycleTimeline}
                loading={loadingDetail}
                accessToken={accessToken}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedOrder(null);
                    setLifecycleTimeline([]);
                }}
            />

            <CreateRefundModal
                isOpen={showRefundModal}
                onClose={() => {
                    setShowRefundModal(false);
                    setRefundInitialData(null);
                }}
                onSuccess={() => onRefresh?.()}
                accessToken={accessToken}
                initialData={refundInitialData ?? undefined}
            />

            <MissingOrderModal
                isOpen={showMissingModal}
                onClose={() => {
                    setShowMissingModal(false);
                    setMissingOrderData(null);
                }}
                data={missingOrderData}
                loading={loadingMissing}
                merchantOrderId={missingOrderId}
                accessToken={accessToken}
                onSuccess={() => {
                    setShowMissingModal(false);
                    setMissingOrderData(null);
                    onRefresh?.();
                }}
            />
        </>
    );
}
