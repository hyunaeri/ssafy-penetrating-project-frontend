import type { OrderStatus } from "@/entities/order";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PAYMENT_PENDING: "결제 대기",
  PAID: "결제 완료",
  ACCEPTED: "주문 수락",
  COOKING: "조리 중",
  DELIVERING: "배달 중",
  COMPLETED: "배달 완료",
  CANCELED: "주문 취소",
};

const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  PAYMENT_PENDING: "bg-surface text-muted ring-line/80",
  PAID: "bg-brand-soft text-brand-dark ring-brand/20",
  ACCEPTED: "bg-brand-soft text-brand-dark ring-brand/20",
  COOKING: "bg-accent-warm text-accent-warm-text ring-accent-warm-text/15",
  DELIVERING: "bg-accent-blue text-accent-blue-text ring-accent-blue-text/15",
  COMPLETED: "bg-brand-soft text-brand-dark ring-brand/25",
  CANCELED: "bg-red-50 text-red-600 ring-red-200/80",
};

export function getOrderStatusLabel(status: OrderStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export function getOrderStatusBadgeClass(status: OrderStatus): string {
  return STATUS_BADGE_CLASS[status] ?? "bg-surface text-muted ring-line/80";
}
