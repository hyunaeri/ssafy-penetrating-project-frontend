"use client";

import { toast } from "sonner";
import type { NotificationResponse } from "@/entities/notification";
import type { PaymentToastPayload } from "@/features/notification/lib/build-pending-payment-toast";
import { NotificationContent } from "@/features/notification/ui/NotificationContent";
import { PaymentToastContent } from "@/features/notification/ui/PaymentToastContent";

type NotificationToastPayload = Pick<
  NotificationResponse,
  "title" | "message" | "type"
> & {
  id?: number;
  orderId?: number | null;
  orderStatus?: NotificationResponse["orderStatus"];
};

const shownToastKeys = new Set<string>();

const NOTIFICATION_TOAST_CLASS =
  "flex w-full items-start gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 shadow-[0_10px_34px_rgba(43,45,66,0.18)] ring-1 ring-black/5";

function getToastKey(notification: NotificationToastPayload): string {
  if (
    notification.type === "ORDER_STATUS" &&
    notification.orderId != null &&
    notification.orderStatus
  ) {
    return `order:${notification.orderId}:${notification.orderStatus}`;
  }
  if (notification.id != null) {
    return `id:${notification.id}`;
  }
  if (notification.orderId != null) {
    return `order:${notification.orderId}:${notification.title}:${notification.message}`;
  }
  return `msg:${notification.type}:${notification.title}:${notification.message}`;
}

/** 결제 완료 직후 프론트 전용 토스트를 띄운다. */
export function notifyPaymentToast(payload: PaymentToastPayload) {
  toast.custom(
    () => (
      <div className={NOTIFICATION_TOAST_CLASS}>
        <PaymentToastContent
          storeName={payload.storeName}
          menuSummary={payload.menuSummary}
        />
      </div>
    ),
    { duration: 3200 }
  );
}

/** 동일 주문의 결제 토스트가 중복 표시되지 않도록 한다. */
export function notifyPaymentToastOnce(payload: PaymentToastPayload) {
  const key = `payment:${payload.orderId}`;
  if (shownToastKeys.has(key)) return;
  shownToastKeys.add(key);
  notifyPaymentToast(payload);
}

/** 실시간 알림(SSE) 수신 시 알림 목록과 동일한 카드 스타일로 토스트를 띄운다. */
export function notifyNotification(notification: NotificationToastPayload) {
  toast.custom(
    () => (
      <div className={NOTIFICATION_TOAST_CLASS}>
        <NotificationContent
          type={notification.type}
          title={notification.title}
          message={notification.message}
          timeLabel="방금 전"
          variant="toast"
        />
      </div>
    ),
    { duration: 3200 }
  );
}

/** 동일 알림이 SSE·결제 완료 처리에서 중복 표시되지 않도록 한다. */
export function notifyNotificationOnce(notification: NotificationToastPayload) {
  const key = getToastKey(notification);
  if (shownToastKeys.has(key)) return;
  shownToastKeys.add(key);
  notifyNotification(notification);
}
