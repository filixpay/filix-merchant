"use client";

interface DateTimeCellProps {
    /** ISO 8601 string or Date object or timestamp */
    value: string | number | Date | null | undefined;
    /** Format type. Default: "datetime". Allows fallback to "date" only if needed later. */
    format?: "datetime" | "date";
}

/**
 * Unified DateTimeCell for all Merchant Center tables.
 * 
 * Provides consistent mono-spaced, secondary text formatting for timestamps.
 */
export default function DateTimeCell({ value, format = "datetime" }: DateTimeCellProps) {
    if (!value) return <span style={{ color: "#94a3b8" }}>—</span>;

    const date = new Date(value);
    
    if (isNaN(date.getTime())) {
        return <span style={{ color: "#94a3b8" }}>Invalid Date</span>;
    }

    // Default formatting rules:
    // We display 'YYYY-MM-DD HH:mm:ss' to be highly unambiguous in a B2B dashboard context.
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;

    if (format === "date") {
        return (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#475569", whiteSpace: "nowrap" }}>
                {formattedDate}
            </span>
        );
    }

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#475569", whiteSpace: "nowrap" }}>
            {formattedDate} <span style={{ color: "#94a3b8", fontSize: 11 }}>{formattedTime}</span>
        </span>
    );
}
