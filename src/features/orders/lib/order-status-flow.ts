import type { OrderResponse, OrderStatus } from "@/entities/order";

const TRACKABLE_STATUSES: OrderStatus[] = [
  "PAID",
  "ACCEPTED",
  "COOKING",
  "DELIVERING",
];

export function isOrderTrackable(status: OrderStatus): boolean {
  return TRACKABLE_STATUSES.includes(status);
}

export function isOrderCompleted(status: OrderStatus): boolean {
  return status === "COMPLETED";
}

export function getOrderMenuSummary(order: Pick<OrderResponse, "items">): string {
  if (order.items.length === 0) return "주문 메뉴 없음";
  const first = order.items[0]!;
  const quantityLabel = first.quantity > 1 ? ` ${first.quantity}개` : "";
  const firstLine = `${first.menuName}${quantityLabel}`;
  if (order.items.length === 1) return firstLine;
  return `${firstLine} 외 ${order.items.length - 1}건`;
}

export function getOrderTrackingPath(orderId: number): string {
  return `/orders/${orderId}/tracking`;
}
