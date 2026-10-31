"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import {
    Box,
    CircularProgress,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';
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
import PaymentModal from './PaymentModal';
import OrderDetailsModal from './OrderDetailsModal';
import CreateRefundModal from '../refunds/CreateRefundModal';
import MissingOrderModal from './MissingOrderModal';
import AmountCell from '@/components/layout/AmountCell';
import DateTimeCell from '@/components/layout/DateTimeCell';
import StatusBadge from '@/components/layout/StatusBadge';
import { type StatusBadgeTone } from '@/components/layout/StatusBadge';
import OrderIdCell from './OrderIdCell';
import {
    getOrderStatus,
    getRefundableAmount,
    normalizeOrderType,
    ORDER_TRADE_STATUS_OPTIONS,
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

interface OrderRowActionsCellProps {
    order: OrderView;
    status: string;
    refundableAmount: number;
    onInitiatePayment: (order: OrderView) => void;
    onMissingOrder: (merchantOrderId: string) => void;
    onRefund: (order: OrderView, refundableAmount: number) => void;
    onCopyOrder?: (merchantOrderId: string) => void;
}

function OrderRowActionsCell({
    order,
    status,
    refundableAmount,
    onInitiatePayment,
    onMissingOrder,
    onRefund,
    onCopyOrder,
}: OrderRowActionsCellProps) {
    const t = useTranslations('Orders');
    const tCommon = useTranslations('Common');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const actions: OrderRowAction[] = [];
    if (status === 'PENDING') {
        actions.push({
            key: 'payment',
            label: tCommon('initiate_payment'),
            icon: <CreditCard size={14} strokeWidth={2} />,
            onClick: () => onInitiatePayment(order),
        });
    }
    if (status !== 'SUCCESS') {
        actions.push({
            key: 'missing',
            label: t('missing_deal'),
            icon: <AlertCircle size={14} strokeWidth={2} />,
            onClick: () => onMissingOrder(order.merchantOrderId),
        });
    }
    if (status === 'SUCCESS' && refundableAmount > 0) {
        actions.push({
            key: 'refund',
            label: t('initiate_refund'),
            icon: <RotateCcw size={14} strokeWidth={2} />,
            onClick: () => onRefund(order, refundableAmount),
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
            {overflowActions.length > 0 && (
                <>
                    <button
                        type="button"
                        className={styles.moreButton}
                        aria-label={tCommon('actions')}
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                        <MoreHorizontal size={16} strokeWidth={2} />
                    </button>
                    <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 0.5,
                                    minWidth: 140,
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 16px rgba(15, 23, 42, 0.12)",
                                    border: "1px solid #eef2f6",
                                },
                            },
                        }}
                    >
                        {overflowActions.map((action) => (
                            <MenuItem
                                key={action.key}
                                onClick={() => {
                                    setAnchorEl(null);
                                    action.onClick();
                                }}
                                sx={{
                                    fontSize: 13,
                                    py: 0.75,
                                    px: 1.5,
                                    gap: 1,
                                    color: action.danger ? "error.main" : "text.primary",
                                    "&:hover": {
                                        bgcolor: action.danger ? "#fef2f2" : "#f1f5f9",
                                    },
                                }}
                            >
                                {action.icon}
                                <span>{action.label}</span>
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            )}
        </div>
    );
}

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
    const { enqueueSnackbar } = useSnackbar();

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
            enqueueSnackbar(err instanceof Error ? err.message : t("action_feedback.payment_failed"), {
                variant: "error",
            });
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
            enqueueSnackbar(err instanceof Error ? err.message : t("action_feedback.details_failed"), {
                variant: "error",
            });
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
            enqueueSnackbar(err instanceof Error ? err.message : t("action_feedback.missing_failed"), {
                variant: "error",
            });
            setShowMissingModal(false);
        } finally {
            setLoadingMissing(false);
        }
    };

    const orderTypeLabel = (orderType: string | null | undefined) => {
        const key = normalizeOrderType(orderType);
        if (!key) return '-';
        const messageKey = `orderTypes.${key}` as Parameters<typeof t>[0];
        return t.has(messageKey) ? t(messageKey) : key;
    };

    const mapStatusToTone = (status: string): StatusBadgeTone => {
        switch (status) {
            case "SUCCESS":
            case "PARTIAL_SUCCESS":
                return "success";
            case "PENDING":
                return "warning";
            case "PROCESSING":
                return "processing";
            case "FAILED":
                return "danger";
            case "DISPUTED":
                return "warning";
            case "REQUIRES_CAPTURE":
                return "info";
            default:
                return "neutral";
        }
    };

    const locationNameById = useMemo(
        () => new Map(locations.map((location) => [location.id, location.name])),
        [locations],
    );

    const subMerchantNameById = useMemo(
        () => new Map(subMerchants.map((subMerchant) => [subMerchant.id, subMerchant.name])),
        [subMerchants],
    );

    const { tableLoading, emptyComponent, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: orders.length,
        emptyDescription: emptyText || t('empty'),
        onRetry,
    });

    return (
        <>
            <Box sx={{ width: '100%', position: 'relative' }}>
                {refreshBanner}
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: "8px",
                        border: "1px solid #eef2f6",
                        overflowX: "auto",
                    }}
                >
                    <Table sx={{ minWidth: 1200 }} size="medium">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 280 }}>{t('headers.order_id')}</TableCell>
                                <TableCell sx={{ width: 120 }}>{t('headers.order_type')}</TableCell>
                                <TableCell sx={{ width: 190 }}>{t('headers.sub_merchant_location')}</TableCell>
                                <TableCell sx={{ width: 130 }}>{t('headers.payment_channel')}</TableCell>
                                <TableCell align="right" sx={{ width: 140 }}>{t('headers.amount')}</TableCell>
                                <TableCell sx={{ width: 130 }}>{t('headers.status')}</TableCell>
                                <TableCell sx={{ width: 160 }}>{t('headers.created_at')}</TableCell>
                                <TableCell align="right" sx={{ width: 140 }}>{tCommon('actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableLoading && orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                        <CircularProgress size={32} />
                                    </TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                        {emptyComponent}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => {
                                    const status = getOrderStatus(order);
                                    const refundableAmount = getRefundableAmount(order);
                                    const label = ORDER_TRADE_STATUS_OPTIONS.includes(status as any)
                                        ? t(`trade_status.${status}` as any)
                                        : status;

                                    return (
                                        <TableRow key={order.merchantOrderId} hover>
                                            <TableCell>
                                                <OrderIdCell
                                                    merchantOrderId={order.merchantOrderId}
                                                    tradeNo={order.tradeNo}
                                                    onOpenDetails={() => handleViewDetails(order)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {orderTypeLabel(order.orderType) === '-' ? '-' : (
                                                    <span className={styles.typeBadge}>
                                                        {orderTypeLabel(order.orderType)}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
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
                                            </TableCell>
                                            <TableCell>
                                                {order.channelCode ? (
                                                    <span className={styles.channelBadge}>{order.channelCode}</span>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                <AmountCell
                                                    amount={order.totalAmount?.amount ?? 0}
                                                    currency={order.totalAmount?.currency ?? ''}
                                                    alignRight
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge label={label} tone={mapStatusToTone(status)} />
                                            </TableCell>
                                            <TableCell>
                                                <DateTimeCell value={order.createdAt} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <OrderRowActionsCell
                                                    order={order}
                                                    status={status}
                                                    refundableAmount={refundableAmount}
                                                    onInitiatePayment={handleInitiatePayment}
                                                    onMissingOrder={handleMissingOrder}
                                                    onRefund={(ord, amt) => {
                                                        setRefundInitialData({
                                                            tradeNo: ord.tradeNo,
                                                            amount: amt,
                                                            currency: ord.totalAmount?.currency,
                                                        });
                                                        setShowRefundModal(true);
                                                    }}
                                                    onCopyOrder={onCopyOrder}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                    {total > 0 && (
                        <TablePagination
                            component="div"
                            count={total}
                            page={page}
                            rowsPerPage={pageSize}
                            rowsPerPageOptions={[10, 20, 50, 100]}
                            onPageChange={(_, newPage) => onPageChange?.(newPage, pageSize)}
                            onRowsPerPageChange={(e) => onPageChange?.(0, parseInt(e.target.value, 10))}
                            labelRowsPerPage={tCommon('pagination.rows_per_page')}
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}–${to} / ${count !== -1 ? count : `more than ${to}`}`
                            }
                        />
                    )}
                </TableContainer>
            </Box>

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
