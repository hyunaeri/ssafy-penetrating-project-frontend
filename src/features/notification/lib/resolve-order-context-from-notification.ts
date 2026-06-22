import type { NotificationResponse } from "@/entities/notification";
import type { OrderStatus } from "@/entities/order";

const STATUS_KEYWORDS: { status: OrderStatus; patterns: string[] }[] = [
  {
    status: "COMPLETED",
    patterns: ["배달 완료", "배달이 완료", "주문이 완료"],
  },
  {
    status: "CANCELED",
    patterns: ["주문 취소", "주문이 취소", "취소되었"],
  },
  {
    status: "DELIVERING",
    patterns: ["배달이 시작", "배달 시작", "배달 중", "배달을 시작"],
  },
  {
    status: "COOKING",
    patterns: ["조리", "요리를 시작", "메뉴를 준비", "준비하고"],
  },
  {
    status: "ACCEPTED",
    patterns: ["주문 확인", "주문 접수", "접수되", "주문을 확인"],
  },
];

export function inferOrderStatusFromNotification(
  notification: NotificationResponse
): OrderStatus | null {
  if (notification.orderStatus) {
    return notification.orderStatus;
  }

  const text = `${notification.title} ${notification.message}`;

  for (const { status, patterns } of STATUS_KEYWORDS) {
    if (patterns.some((pattern) => text.includes(pattern))) {
      return status;
    }
  }

  return null;
}

export function resolveOrderIdFromNotification(
  notification: NotificationResponse,
  fallbackOrderId?: number | null
): number | null {
  if (notification.orderId != null) {
    return notification.orderId;
  }

  if (fallbackOrderId != null) {
    return fallbackOrderId;
  }

  return null;
}
