/** 백엔드 `NotificationType` enum과 일치한다. */
export type NotificationType =
  | "ORDER_STATUS"
  | "ACHIEVEMENT"
  | "COUPON"
  | "RANKING"
  | "SYSTEM";

/** 백엔드 `NotificationResponse` DTO와 일치한다. */
export type NotificationResponse = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  orderId?: number | null;
  orderStatus?:
    | "PAYMENT_PENDING"
    | "PAID"
    | "ACCEPTED"
    | "COOKING"
    | "DELIVERING"
    | "COMPLETED"
    | "CANCELED"
    | null;
};
