import type { NotificationResponse } from "@/entities/notification";

const INITIAL_ORDER_STATUSES = new Set(["PAYMENT_PENDING", "PAID"]);

/**
 * 고객에게 PAID(주문 대기) 알림은 결제 완료 시 프론트 토스트로만 보여준다.
 * 백엔드 SSE로 동일 알림이 오더라도 토스트·목록 갱신 대상에서 제외한다.
 */
export function shouldSkipSseOrderNotification(
  notification: NotificationResponse
): boolean {
  if (notification.type !== "ORDER_STATUS") return false;

  if (
    notification.orderStatus &&
    INITIAL_ORDER_STATUSES.has(notification.orderStatus)
  ) {
    return true;
  }

  const text = `${notification.title} ${notification.message}`;
  return (
    text.includes("접수 대기") ||
    text.includes("결제가 완료") ||
    text.includes("결제 완료")
  );
}
