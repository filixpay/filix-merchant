"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button, Flex, Form, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { api, type RiskReviewListItem, RiskPriority } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import RiskReviewTable from "@/components/risk-reviews/RiskReviewTable";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import {
    DEFAULT_REVIEW_LIST_QUERY,
    REVIEW_STATUS_OPTIONS,
    type ReviewListQuery,
    type ReviewSearchFormValues,
} from "@/components/risk-reviews/risk-review-list-model";

export default function RiskReviewsPage() {
    const t = useTranslations("RiskReviews");
    const tCommon = useTranslations("Common");
    const tCustomers = useTranslations("Customers");
    const tDisputes = useTranslations("Disputes");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const [form] = Form.useForm<ReviewSearchFormValues>();
    const [query, setQuery] = useState<ReviewListQuery>(DEFAULT_REVIEW_LIST_QUERY);

    const { items: reviews, total, loading, isRefreshing, error, reload } = usePagedResource<
        RiskReviewListItem,
        ReviewListQuery
    >({
        accessToken,
        params: query,
        fetcher: async (params, token) => {
            const result = await api.risk.reviews.listPaged(token, params);
            return {
                data: result.items,
                total: result.total,
            };
        },
    });

    const handleSearch = (values: ReviewSearchFormValues) => {
        setQuery({
            ...DEFAULT_REVIEW_LIST_QUERY,
            keyword: values.keyword ?? "",
            status: values.status ?? "",
            priority: values.priority ?? "",
            reviewType: values.reviewType ?? "",
            sortBy: query.sortBy,
            sortDir: query.sortDir,
        });
    };

    const handleReset = () => {
        form.resetFields();
        setQuery(DEFAULT_REVIEW_LIST_QUERY);
    };

    const statusOptions = useMemo(
        () =>
            REVIEW_STATUS_OPTIONS.map((status) => ({
                value: status,
                label: t(`status.${status}`),
            })),
        [t],
    );

    const priorityOptions = useMemo(
        () =>
            Object.values(RiskPriority).map((priority) => ({
                value: priority,
                label: tDisputes(`priority.${priority}`),
            })),
        [tDisputes],
    );

    const filterBar = (
        <Form<ReviewSearchFormValues>
            form={form}
            layout="inline"
            onFinish={handleSearch}
            style={{
                display: "flex",
                gap: 8,
                rowGap: 8,
                width: "100%",
                flexWrap: "wrap",
                alignItems: "center",
            }}
        >
            <Form.Item name="keyword" style={{ minWidth: 220, flex: "1 1 240px", marginInlineEnd: 0 }}>
                <Input allowClear prefix={<SearchOutlined />} placeholder={t("filters.keyword")} />
            </Form.Item>
            <Form.Item name="status" style={{ minWidth: 160, flex: "0 1 180px", marginInlineEnd: 0 }}>
                <Select allowClear options={statusOptions} placeholder={t("filters.status")} />
            </Form.Item>
            <Form.Item name="priority" style={{ minWidth: 160, flex: "0 1 180px", marginInlineEnd: 0 }}>
                <Select allowClear options={priorityOptions} placeholder={t("filters.priority")} />
            </Form.Item>
            <Form.Item name="reviewType" style={{ minWidth: 140, flex: "0 1 160px", marginInlineEnd: 0 }}>
                <Input allowClear placeholder={t("filters.review_type")} />
            </Form.Item>
            <Form.Item style={{ marginInlineEnd: 0, marginLeft: "auto" }}>
                <Flex gap={8}>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                        {tCustomers("search")}
                    </Button>
                    <Button onClick={handleReset} disabled={loading}>
                        {tCommon("reset")}
                    </Button>
                </Flex>
            </Form.Item>
        </Form>
    );

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")} filterBar={filterBar}>
            <RiskReviewTable
                reviews={reviews}
                loading={loading}
                isRefreshing={isRefreshing}
                error={error}
                onRetry={reload}
                total={total}
                query={query}
                onQueryChange={setQuery}
            />
        </DashboardPage>
    );
}
