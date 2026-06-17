import type { OrderStatus } from "@/entities/order";

const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  "PAID",
  "ACCEPTED",
  "COOKING",
  "DELIVERING",
];

export function isActiveOrderStatus(status: OrderStatus): boolean {
  return ACTIVE_ORDER_STATUSES.includes(status);
}
