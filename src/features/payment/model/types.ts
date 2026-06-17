import type { CartOrderType } from "@/entities/cart/lib/parse-cart-response";

export type PaymentMethod = "CARD" | "TRANSFER";

export type PaymentPrepareRequest = {
  storeId: number;
  couponId: number | null;
};

export type PaymentPrepareResponse = {
  orderId: number;
  tossOrderId: string;
  orderName: string;
  amount: number;
};

export type PendingPaymentContext = {
  paymentOrderId: number;
  orderId: string;
  amount: number;
  orderName: string;
  storeName: string;
  menuSummary: string;
  orderType: CartOrderType;
};

export type ConfirmPaymentRequest = {
  paymentKey: string;
  orderId: string;
  amount: number;
};

export type TossPaymentError = {
  code?: string;
  message?: string;
};

export type ConfirmPaymentResponse = Record<string, unknown>;

export type PaymentFailRequest = {
  orderId: string;
  code: string;
  message: string;
};
