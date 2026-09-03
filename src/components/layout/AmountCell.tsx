"use client";


import { formatWalletAmountDisplay } from "@/lib/money/asset-display";
import { useLocale } from "next-intl";

interface AmountCellProps {
    /** The raw amount (number or string representation) */
    amount: number | string;
    /** The 3-letter currency code, e.g., 'USD', 'CNY' */
    currency: string;
    /** Whether to explicitly enforce right-alignment (usually handled by the Table column) */
    alignRight?: boolean;
}

/**
 * Unified AmountCell for all Merchant Center tables.
 * 
 * Provides consistent tabular-nums formatting, font-weight, and currency positioning.
 */
export default function AmountCell({ amount, currency, alignRight = false }: AmountCellProps) {
    const locale = useLocale();

    // The asset-display lib returns the localized symbol and the formatted number string
    const { symbol, amount: formattedAmount } = formatWalletAmountDisplay(
        typeof amount === "number" ? amount.toFixed(2) : String(amount),
        currency,
        locale,
    );

    return (
        <div style={{
            display: "inline-flex",
            alignItems: "baseline",
            justifyContent: alignRight ? "flex-end" : "flex-start",
            width: alignRight ? "100%" : "auto",
            fontVariantNumeric: "tabular-nums",
            fontFeatureSettings: '"tnum"',
            whiteSpace: "nowrap"
        }}>
            <span style={{ fontWeight: 600, color: "#0f172a", fontSize: 13, letterSpacing: "-0.01em" }}>
                {symbol}{formattedAmount}
            </span>
            {currency && (
                <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 500, color: "#64748b" }}>
                    {currency}
                </span>
            )}
        </div>
    );
}
