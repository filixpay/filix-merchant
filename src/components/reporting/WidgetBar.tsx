"use client";

import { Col, Row } from "antd";
import type { WidgetResultDto } from "@/lib/api/domains/reporting/types";
import { MERCHANT_WIDGETS } from "@/lib/api/domains/reporting/widget-registry";
import WidgetCard from "./WidgetCard";

interface WidgetBarProps {
    results: Record<string, WidgetResultDto>;
    loading?: boolean;
    onRetry?: () => void;
}

export default function WidgetBar({ results, loading = false, onRetry }: WidgetBarProps) {
    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            {MERCHANT_WIDGETS.map((meta) => (
                <Col key={meta.id} xs={24} sm={12} lg={6}>
                    <WidgetCard meta={meta} result={results[meta.id]} loading={loading} onRetry={onRetry} />
                </Col>
            ))}
        </Row>
    );
}
