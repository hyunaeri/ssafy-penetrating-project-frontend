import type { OrderStatus } from "@/entities/order";

const NEXT_STATUS_LABELS: Partial<Record<OrderStatus, string>> = {
  ACCEPTED: "주문 수락",
  COOKING: "조리 시작",
  DELIVERING: "배달 시작",
  COMPLETED: "배달 완료",
  CANCELED: "주문 취소",
};

/** 점주가 변경할 수 있는 다음 주문 상태 목록 */
export function getOwnerNextStatuses(status: OrderStatus): OrderStatus[] {
  switch (status) {
    case "PAID":
      return ["ACCEPTED", "CANCELED"];
    case "ACCEPTED":
      return ["COOKING", "CANCELED"];
    case "COOKING":
      return ["DELIVERING", "CANCELED"];
    case "DELIVERING":
      return ["COMPLETED"];
    default:
      return [];
  }
}

export function getOwnerStatusActionLabel(status: OrderStatus): string {
  return NEXT_STATUS_LABELS[status] ?? status;
}

export function matchesOwnerOrderSearch(order: {
  id: number;
  items: { menuName: string }[];
}, query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;

  if (String(order.id).includes(trimmed)) return true;

  return order.items.some((item) =>
    item.menuName.toLowerCase().includes(trimmed)
  );
}
