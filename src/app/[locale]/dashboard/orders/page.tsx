"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button, DatePicker, Flex, Form, Input, InputNumber, Select, Space, Tag, message } from 'antd';
import { Download, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { api } from '@/lib/api';
import type { ChannelView, LocationView, OrderView, SubMerchantView } from '@/lib/api';
import DashboardPage from '@/components/layout/DashboardPage';
import OrderListTable from '@/components/orders/OrderListTable';
import OrderStatsCards from '@/components/orders/OrderStatsCards';
import CreateOrderModal from '@/components/orders/CreateOrderModal';
import OrderDetailFromQuery from '@/components/orders/OrderDetailFromQuery';
import { exportOrdersCsv } from '@/components/orders/order-csv-export';
import { usePagedResource } from '@/lib/dashboard/use-paged-resource';
import {
    buildOrderSearchParams,
    DEFAULT_ORDER_LIST_QUERY,
    getOrderRows,
    ORDER_TRADE_STATUS_OPTIONS,
    type OrderListQuery,
    type OrderSearchFormValues,
    toApiDateTime,
} from '@/components/orders/order-list-model';
import {
    buildCopyOrderFormValues,
    type CreateOrderFormValues,
} from '@/components/orders/create-order-form-model';
import styles from './orders-page.module.css';

export default function OrdersPage() {
    const [form] = Form.useForm<OrderSearchFormValues>();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createPrefill, setCreatePrefill] = useState<CreateOrderFormValues | null>(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [query, setQuery] = useState<OrderListQuery>(DEFAULT_ORDER_LIST_QUERY);
    const [locations, setLocations] = useState<LocationView[]>([]);
    const [subMerchants, setSubMerchants] = useState<SubMerchantView[]>([]);
    const [channels, setChannels] = useState<ChannelView[]>([]);

    const t = useTranslations('Orders');
    const tCustomers = useTranslations('Customers');
    const tCommon = useTranslations('Common');
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const fetchFilterOptions = useCallback(async () => {
        if (!accessToken) return;
        try {
            const [locRes, subRes, channelRes] = await Promise.all([
                api.locations.list({ pageNumber: 0, pageSize: 100 }, accessToken),
                api.subMerchants.list({ page: 0, size: 100 }, accessToken),
                api.channels.list({ page: 0, size: 100 }, accessToken),
            ]);
            setLocations(locRes.data || []);
            setSubMerchants(subRes.data || []);
            setChannels(channelRes.data || []);
        } catch (err) {
            console.error('Failed to fetch order filter options:', err);
        }
    }, [accessToken]);

    useEffect(() => {
        fetchFilterOptions();
    }, [fetchFilterOptions]);

    const requestParams = useMemo(
        () => buildOrderSearchParams(query),
        [query],
    );

    const { items: orders, total, loading, isRefreshing, error, reload } = usePagedResource<
        OrderView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: (params, token) => api.orders.search(params, token),
        normalize: (response) => {
            const result = getOrderRows(response);
            return { items: result.orders, total: result.total };
        },
    });

    const statusOptions = useMemo(
        () =>
            ORDER_TRADE_STATUS_OPTIONS.map((status) => ({
                value: status,
                label: t(`trade_status.${status}`),
            })),
        [t],
    );

    const subMerchantOptions = useMemo(
        () =>
            subMerchants.map((item) => ({
                value: item.id,
                label: item.name,
            })),
        [subMerchants],
    );

    const locationOptions = useMemo(
        () =>
            locations.map((item) => ({
                value: item.id,
                label: item.name,
            })),
        [locations],
    );

    const channelOptions = useMemo(
        () =>
            channels.map((item) => ({
                value: item.channelCode,
                label: item.channelName || item.channelCode,
            })),
        [channels],
    );

    const watchedSubMerchantId = Form.useWatch('subMerchantId', form);
    const watchedLocationId = Form.useWatch('locationId', form);
    const watchedChannelCode = Form.useWatch('channelCode', form);
    const watchedMinAmount = Form.useWatch('minAmount', form);
    const watchedMaxAmount = Form.useWatch('maxAmount', form);
    const watchedCreatedTimeRange = Form.useWatch('createdTimeRange', form);
    const watchedPaidTimeRange = Form.useWatch('paidTimeRange', form);
    const watchedBuyerCode = Form.useWatch('buyerCode', form);

    interface ActiveFilterTag {
        key: string;
        label: string;
        fieldName: keyof OrderSearchFormValues;
    }

    const activeFilterTags = useMemo((): ActiveFilterTag[] => {
        const tags: ActiveFilterTag[] = [];
        if (watchedBuyerCode) {
            tags.push({ key: 'buyerCode', label: `${t('headers.buyer_code')}: ${watchedBuyerCode}`, fieldName: 'buyerCode' });
        }
        if (watchedSubMerchantId != null) {
            const name = subMerchantOptions.find((o) => o.value === watchedSubMerchantId)?.label ?? watchedSubMerchantId;
            tags.push({ key: 'subMerchantId', label: `${t('filters.sub_merchant')}: ${name}`, fieldName: 'subMerchantId' });
        }
        if (watchedLocationId != null) {
            const name = locationOptions.find((o) => o.value === watchedLocationId)?.label ?? watchedLocationId;
            tags.push({ key: 'locationId', label: `${t('filters.location')}: ${name}`, fieldName: 'locationId' });
        }
        if (watchedChannelCode) {
            const name = channelOptions.find((o) => o.value === watchedChannelCode)?.label ?? watchedChannelCode;
            tags.push({ key: 'channelCode', label: `${t('filters.payment_channel')}: ${name}`, fieldName: 'channelCode' });
        }
        if (watchedMinAmount != null) {
            tags.push({ key: 'minAmount', label: `${t('filters.min_amount')}: ${watchedMinAmount}`, fieldName: 'minAmount' });
        }
        if (watchedMaxAmount != null) {
            tags.push({ key: 'maxAmount', label: `${t('filters.max_amount')}: ${watchedMaxAmount}`, fieldName: 'maxAmount' });
        }
        if (watchedCreatedTimeRange?.[0] && watchedCreatedTimeRange?.[1]) {
            tags.push({ key: 'createdTimeRange', label: `${t('headers.created_at_range')}`, fieldName: 'createdTimeRange' });
        }
        if (watchedPaidTimeRange?.[0] && watchedPaidTimeRange?.[1]) {
            tags.push({ key: 'paidTimeRange', label: `${t('filters.paid_start')} ~ ${t('filters.paid_end')}`, fieldName: 'paidTimeRange' });
        }
        return tags;
    }, [
        watchedBuyerCode, watchedSubMerchantId, watchedLocationId, watchedChannelCode,
        watchedMinAmount, watchedMaxAmount, watchedCreatedTimeRange, watchedPaidTimeRange,
        t, subMerchantOptions, locationOptions, channelOptions,
    ]);

    const handleRemoveFilterTag = (fieldName: keyof OrderSearchFormValues) => {
        form.setFieldValue(fieldName, undefined);
        form.submit();
    };

    const handleSearch = (values: OrderSearchFormValues) => {
        const [createdStart, createdEnd] = values.createdTimeRange ?? [];
        const [paidStart, paidEnd] = values.paidTimeRange ?? [];
        setQuery({
            ...DEFAULT_ORDER_LIST_QUERY,
            merchantOrderId: values.merchantOrderId ?? '',
            tradeNo: values.tradeNo ?? '',
            buyerCode: values.buyerCode ?? '',
            tradeStatus: values.tradeStatus ?? '',
            subMerchantId: values.subMerchantId != null ? String(values.subMerchantId) : '',
            locationId: values.locationId != null ? String(values.locationId) : '',
            channelCode: values.channelCode ?? '',
            minAmount: values.minAmount != null ? String(values.minAmount) : '',
            maxAmount: values.maxAmount != null ? String(values.maxAmount) : '',
            startTime: toApiDateTime(createdStart),
            endTime: toApiDateTime(createdEnd),
            paidStartTime: toApiDateTime(paidStart),
            paidEndTime: toApiDateTime(paidEnd),
        });
    };

    const handleReset = () => {
        form.resetFields();
        setQuery(DEFAULT_ORDER_LIST_QUERY);
    };

    const handlePageChange = (pageNumber: number, nextPageSize: number) => {
        setQuery((current) => ({
            ...current,
            page: pageNumber - 1,
            size: nextPageSize,
        }));
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setCreatePrefill(null);
    };

    const handleOpenCreateModal = () => {
        setCreatePrefill(null);
        setShowCreateModal(true);
    };

    const handleCopyOrder = async (merchantOrderId: string) => {
        if (!accessToken) return;
        try {
            const detail = await api.orders.get(merchantOrderId, accessToken);
            setCreatePrefill(buildCopyOrderFormValues(detail.order));
            setShowCreateModal(true);
        } catch (err) {
            console.error(err);
            message.error(
                err instanceof Error ? err.message : t('action_feedback.copy_load_failed'),
            );
        }
    };

    const filterBar = (
        <Form<OrderSearchFormValues>
            form={form}
            layout="inline"
            onFinish={handleSearch}
            className={styles.filterShell}
        >
            <div className={styles.filterRow}>
                <Form.Item name="merchantOrderId" className={styles.filterField}>
                    <Input
                        allowClear
                        prefix={<Search size={14} strokeWidth={2} color="#94a3b8" />}
                        placeholder={t('filters.merchant_order_id')}
                    />
                </Form.Item>
                <Form.Item name="tradeNo" className={styles.filterField}>
                    <Input
                        allowClear
                        prefix={<Search size={14} strokeWidth={2} color="#94a3b8" />}
                        placeholder={t('headers.trade_no')}
                    />
                </Form.Item>
                <Form.Item name="tradeStatus" className={styles.filterFieldCompact}>
                    <Select allowClear options={statusOptions} placeholder={t('filters.status')} />
                </Form.Item>
                <Form.Item className={styles.filterToggle}>
                    <Button
                        icon={<SlidersHorizontal size={14} strokeWidth={2} />}
                        type="default"
                        onClick={() => setShowAdvancedFilters((prev) => !prev)}
                    >
                        {showAdvancedFilters ? t('toolbar.collapse_filters') : t('toolbar.advanced_filters')}
                    </Button>
                </Form.Item>
                <Form.Item className={styles.filterActions} style={{ marginLeft: 'auto' }}>
                    <Flex gap={8}>
                        <Button
                            type="default"
                            htmlType="submit"
                            icon={<Search size={14} strokeWidth={2} />}
                            loading={loading}
                        >
                            {tCustomers('search')}
                        </Button>
                        <Button onClick={handleReset} disabled={loading}>
                            {tCommon('reset')}
                        </Button>
                    </Flex>
                </Form.Item>
            </div>

            <div
                className={`${styles.advancedPanel} ${
                    showAdvancedFilters ? styles.advancedPanelOpen : styles.advancedPanelClosed
                }`}
            >
                <div className={styles.advancedRow}>
                    <Form.Item name="buyerCode" className={styles.filterField}>
                        <Input
                            allowClear
                            prefix={<Search size={14} strokeWidth={2} color="#94a3b8" />}
                            placeholder={t('headers.buyer_code')}
                        />
                    </Form.Item>
                    <Form.Item name="subMerchantId" className={styles.filterField}>
                        <Select allowClear showSearch optionFilterProp="label" options={subMerchantOptions} placeholder={t('filters.sub_merchant')} />
                    </Form.Item>
                    <Form.Item name="locationId" className={styles.filterField}>
                        <Select allowClear showSearch optionFilterProp="label" options={locationOptions} placeholder={t('filters.location')} />
                    </Form.Item>
                    <Form.Item name="channelCode" className={styles.filterField}>
                        <Select allowClear showSearch optionFilterProp="label" options={channelOptions} placeholder={t('filters.payment_channel')} />
                    </Form.Item>
                </div>
                <div className={styles.advancedRow}>
                    <Form.Item className={styles.filterField}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Form.Item name="minAmount" noStyle>
                                <InputNumber style={{ width: '50%' }} min={0} placeholder={t('filters.min_amount')} />
                            </Form.Item>
                            <Form.Item name="maxAmount" noStyle>
                                <InputNumber style={{ width: '50%' }} min={0} placeholder={t('filters.max_amount')} />
                            </Form.Item>
                        </Space.Compact>
                    </Form.Item>
                    <Form.Item name="createdTimeRange" className={styles.filterField}>
                        <DatePicker.RangePicker style={{ width: '100%' }} showTime placeholder={[t('filters.created_start'), t('filters.created_end')]} />
                    </Form.Item>
                    <Form.Item name="paidTimeRange" className={styles.filterField}>
                        <DatePicker.RangePicker style={{ width: '100%' }} showTime placeholder={[t('filters.paid_start'), t('filters.paid_end')]} />
                    </Form.Item>
                </div>
            </div>
        </Form>
    );

    const extra = (
        <Flex gap={8} align="center">
            <Button
                className={styles.exportButton}
                icon={<Download size={14} strokeWidth={2} />}
                disabled={orders.length === 0}
                onClick={() => exportOrdersCsv(orders)}
            >
                {t('toolbar.export_csv')}
            </Button>
            <Button type="primary" icon={<Plus size={14} strokeWidth={2} />} onClick={handleOpenCreateModal}>
                {t('create_order')}
            </Button>
        </Flex>
    );

    return (
        <DashboardPage title={t('title')} subtitle={t('subtitle')} filterBar={filterBar} extra={extra}>
            {/* KPI Stats Cards */}
            <OrderStatsCards orders={orders} total={total} />

            {activeFilterTags.length > 0 ? (
                <Flex gap={4} wrap="wrap" align="center" className={styles.toolbarMeta}>
                    {activeFilterTags.map((tag) => (
                        <Tag key={tag.key} closable onClose={() => handleRemoveFilterTag(tag.fieldName)}>
                            {tag.label}
                        </Tag>
                    ))}
                </Flex>
            ) : null}

            {/* Order Table */}
            {accessToken ? (
                <OrderListTable
                    orders={orders}
                    loading={loading}
                    isRefreshing={isRefreshing}
                    error={error}
                    onRetry={reload}
                    total={total}
                    page={query.page}
                    pageSize={query.size}
                    accessToken={accessToken}
                    onPageChange={handlePageChange}
                    onCopyOrder={handleCopyOrder}
                    onRefresh={reload}
                />
            ) : null}
            {accessToken ? (
                <CreateOrderModal
                    isOpen={showCreateModal}
                    onClose={handleCloseCreateModal}
                    onSuccess={reload}
                    accessToken={accessToken}
                    initialValues={createPrefill}
                />
            ) : null}
            {accessToken ? (
                <Suspense fallback={null}>
                    <OrderDetailFromQuery accessToken={accessToken} />
                </Suspense>
            ) : null}
        </DashboardPage>
    );
}
