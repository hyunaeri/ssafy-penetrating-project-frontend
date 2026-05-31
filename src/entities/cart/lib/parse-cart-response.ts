import type { CartLineResponse, CartResponse } from "@/entities/cart/model/types";

export type CartOrderType = "delivery" | "pickup";

export type CartOrderSummary = {
  subtotal: number;
  deliveryFee: number;
  total: number;
  minOrderPrice: number;
  remainingMinOrderPrice: number;
  meetsMinOrder: boolean;
};

function isCartLineLike(value: unknown): value is CartLineResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as CartLineResponse).id === "number" &&
    typeof (value as CartLineResponse).menuId === "number" &&
    typeof (value as CartLineResponse).quantity === "number" &&
    typeof (value as CartLineResponse).menuName === "string" &&
    typeof (value as CartLineResponse).unitPrice === "number"
  );
}

function readNumber(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === "string" ? value : null;
}

/** 백엔드 `CartResponse` JSON을 프론트 타입으로 정규화 */
export function parseCartResponse(data: unknown): CartResponse {
  if (typeof data !== "object" || data === null) {
    return { items: [] };
  }

  const record = data as Record<string, unknown>;
  const rawItems = record.items;
  const items = Array.isArray(rawItems)
    ? rawItems.filter(isCartLineLike)
    : [];

  const storeId = readNumber(record, "storeId");
  const minOrderPrice = readNumber(record, "minOrderPrice") ?? 0;
  const deliveryFee = readNumber(record, "deliveryFee") ?? 0;
  const totalMenuPrice =
    readNumber(record, "totalMenuPrice") ?? getCartSubtotal(items);
  const remainingMinOrderPrice =
    readNumber(record, "remainingMinOrderPrice") ??
    Math.max(minOrderPrice - totalMenuPrice, 0);
  const totalPaymentPrice =
    readNumber(record, "totalPaymentPrice") ?? totalMenuPrice + deliveryFee;

  return {
    storeId,
    storeName: readString(record, "storeName"),
    storeImageUrl: readString(record, "storeImageUrl"),
    minOrderPrice,
    deliveryFee,
    totalMenuPrice,
    totalPaymentPrice,
    remainingMinOrderPrice,
    items,
  };
}

export function getCartLineTotal(line: CartLineResponse): number {
  return line.unitPrice * line.quantity;
}

export function getCartSubtotal(items: CartLineResponse[]): number {
  return items.reduce((sum, line) => sum + getCartLineTotal(line), 0);
}

/** 장바구니 응답·수령방법 기준 결제 요약 (백엔드 금액 필드 우선) */
export function getCartOrderSummary(
  cart: CartResponse,
  orderType: CartOrderType
): CartOrderSummary {
  const subtotal = cart.totalMenuPrice ?? getCartSubtotal(cart.items);
  const minOrderPrice = cart.minOrderPrice ?? 0;
  const deliveryFee =
    orderType === "delivery" ? (cart.deliveryFee ?? 0) : 0;
  const remainingMinOrderPrice =
    cart.remainingMinOrderPrice ?? Math.max(minOrderPrice - subtotal, 0);
  const total =
    orderType === "delivery"
      ? subtotal + deliveryFee
      : subtotal;
  const meetsMinOrder =
    minOrderPrice === 0 || remainingMinOrderPrice === 0;

  return {
    subtotal,
    deliveryFee,
    total,
    minOrderPrice,
    remainingMinOrderPrice,
    meetsMinOrder,
  };
}
