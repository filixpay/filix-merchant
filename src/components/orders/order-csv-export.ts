import type { OrderView } from "@/lib/api";
import { formatDateTime, formatAmount, getOrderStatus } from "./order-list-model";

const CSV_COLUMNS = [
    "merchantOrderId",
    "tradeNo",
    "orderType",
    "subject",
    "buyerCode",
    "subMerchantId",
    "locationId",
    "channelCode",
    "currency",
    "amount",
    "tradeStatus",
    "createdAt",
    "paidAt",
] as const;

const CSV_HEADERS: Record<(typeof CSV_COLUMNS)[number], string> = {
    merchantOrderId: "Merchant Order ID",
    tradeNo: "Trade No",
    orderType: "Order Type",
    subject: "Subject",
    buyerCode: "Customer Code",
    subMerchantId: "Sub-Merchant ID",
    locationId: "Location ID",
    channelCode: "Payment Channel",
    currency: "Currency",
    amount: "Amount",
    tradeStatus: "Status",
    createdAt: "Created At",
    paidAt: "Paid At",
};

function escapeCsvValue(value: string): string {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

function orderToRow(order: OrderView): string {
    const values: string[] = [
        order.merchantOrderId ?? "",
        order.tradeNo ?? "",
        order.orderType ?? "",
        order.subject ?? "",
        order.buyerCode != null ? String(order.buyerCode) : "",
        order.subMerchantId != null ? String(order.subMerchantId) : "",
        order.locationId != null ? String(order.locationId) : "",
        order.channelCode ?? "",
        order.totalAmount?.currency ?? "",
        order.totalAmount?.amount != null ? String(order.totalAmount.amount) : "",
        getOrderStatus(order),
        order.createdAt ? formatDateTime(order.createdAt) : "",
        order.paidAt ? formatDateTime(order.paidAt) : "",
    ];
    return values.map(escapeCsvValue).join(",");
}

export function exportOrdersCsv(orders: OrderView[]): void {
    const headerRow = CSV_COLUMNS.map((col) => CSV_HEADERS[col]).join(",");
    const dataRows = orders.map(orderToRow);
    const csvContent = [headerRow, ...dataRows].join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const filename = `orders-${dateStr}.csv`;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
