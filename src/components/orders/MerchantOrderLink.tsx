"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { buildOrderDetailHrefByMerchantOrderId } from "./order-list-model";

interface MerchantOrderLinkProps {
    merchantOrderId?: string | null;
}

export default function MerchantOrderLink({ merchantOrderId }: MerchantOrderLinkProps) {
    const locale = useLocale();

    if (!merchantOrderId) {
        return <>-</>;
    }

    return (
        <Link href={buildOrderDetailHrefByMerchantOrderId(locale, merchantOrderId)}>
            {merchantOrderId}
        </Link>
    );
}
