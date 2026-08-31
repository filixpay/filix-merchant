"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { api, type OrderView, type TraceTimelineItem } from "@/lib/api";
import OrderDetailsModal from "./OrderDetailsModal";

interface OrderDetailFromQueryProps {
    accessToken?: string;
}

export default function OrderDetailFromQuery({ accessToken }: OrderDetailFromQueryProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const locale = useLocale();
    const [order, setOrder] = useState<OrderView | null>(null);
    const [lifecycleTimeline, setLifecycleTimeline] = useState<TraceTimelineItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const orderId = searchParams.get("id");
    const merchantOrderId = searchParams.get("merchantOrderId");
    const viewDetail = searchParams.get("view") === "detail";
    const hasLookupKey = Boolean(orderId || merchantOrderId);

    useEffect(() => {
        if (!viewDetail || !hasLookupKey || !accessToken) {
            setOpen(false);
            return;
        }

        let cancelled = false;
        setOpen(true);
        setLoading(true);
        setOrder(null);
        setLifecycleTimeline([]);

        const load = orderId
            ? api.orders.getById(orderId, accessToken)
            : api.orders.get(merchantOrderId!, accessToken);

        load
            .then((detail) => {
                if (!cancelled) {
                    setOrder(detail.order);
                    setLifecycleTimeline(detail.lifecycleTimeline);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setOrder(null);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [viewDetail, hasLookupKey, orderId, merchantOrderId, accessToken]);

    if (!viewDetail || !hasLookupKey) {
        return null;
    }

    return (
        <OrderDetailsModal
            isOpen={open}
            onClose={() => {
                setOpen(false);
                router.replace(`/${locale}/dashboard/orders`);
            }}
            order={order}
            lifecycleTimeline={lifecycleTimeline}
            loading={loading}
            accessToken={accessToken}
        />
    );
}
