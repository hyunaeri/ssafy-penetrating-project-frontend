import type { PendingPaymentContext } from "@/features/payment/model/types";
import { summarizeMenuOrderName } from "@/features/payment/lib/build-menu-summary";

export type PaymentToastPayload = {
  storeName: string;
  menuSummary: string;
  orderId: number;
};

function resolveStoreName(pending: PendingPaymentContext): string {
  const stored = pending.storeName?.trim();
  if (stored) return stored;

  const parts = pending.orderName.split(/\s[-·]\s/);
  if (parts.length >= 2) {
    return parts[0]!.trim();
  }

  return "매장";
}

function resolveMenuSummary(pending: PendingPaymentContext): string {
  const stored = pending.menuSummary?.trim();
  if (stored) return stored;

  return summarizeMenuOrderName(pending.orderName);
}

/**
 * 결제 완료 직후 고객에게 보여줄 로컬 토스트 payload.
 * 백엔드 알림/SSE와 분리된 프론트 전용 피드백이다.
 */
export function buildPendingPaymentToast(
  pending: PendingPaymentContext
): PaymentToastPayload {
  return {
    storeName: resolveStoreName(pending),
    menuSummary: resolveMenuSummary(pending),
    orderId: pending.paymentOrderId,
  };
}
