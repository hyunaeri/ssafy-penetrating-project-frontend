import { buildPendingPaymentToast } from "@/features/notification/lib/build-pending-payment-toast";
import { notifyPaymentToastOnce } from "@/features/notification/lib/notify-notification";
import type { PendingPaymentContext } from "@/features/payment/model/types";

/**
 * 결제 직후 프론트에서만 결제 완료 토스트를 띄운다.
 * 백엔드는 PAID 시점에 고객 SSE·알림 히스토리를 보내지 않는다.
 */
export function showOrderNotificationAfterPayment(
  pending: PendingPaymentContext | null
): void {
  if (!pending) return;
  notifyPaymentToastOnce(buildPendingPaymentToast(pending));
}
