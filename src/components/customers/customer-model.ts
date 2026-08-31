import type { ClientView } from "@/lib/api";

export function getCustomerStatusColor(status: string): string {
    return status === "ACTIVE" ? "success" : "default";
}

export function formatCustomerCreatedAt(customer: ClientView): string {
    return new Date(customer.createdAt).toLocaleString();
}
