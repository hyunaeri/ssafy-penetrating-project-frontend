import type { NotificationResponse } from "@/entities/notification";
import type { OrderStatus } from "@/entities/order";

const TERMINAL_ORDER_STATUSES: OrderStatus[] = ["COMPLETED", "CANCELED"];

/** 배달 완료·주문 취소 등으로 SSE 구독을 종료해야 하는 알림인지 판별한다. */
export function shouldStopNotificationStream(
  notification: NotificationResponse
): boolean {
  if (notification.type !== "ORDER_STATUS") return false;

  if (
    notification.orderStatus &&
    TERMINAL_ORDER_STATUSES.includes(notification.orderStatus)
  ) {
    return true;
  }

  const text = `${notification.title} ${notification.message}`;
  return (
    text.includes("배달 완료") ||
    text.includes("배달이 완료") ||
    text.includes("주문이 완료") ||
    text.includes("주문 취소")
  );
}
