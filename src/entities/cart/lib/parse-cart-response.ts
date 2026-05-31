import type { CartLineResponse, CartResponse } from "@/entities/cart/model/types";

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

  return {
    storeId,
    storeName: readString(record, "storeName"),
    storeImageUrl: readString(record, "storeImageUrl"),
    minOrderPrice: readNumber(record, "minOrderPrice"),
    deliveryFee: readNumber(record, "deliveryFee"),
    items,
  };
}

export function getCartLineTotal(line: CartLineResponse): number {
  return line.unitPrice * line.quantity;
}

export function getCartSubtotal(items: CartLineResponse[]): number {
  return items.reduce((sum, line) => sum + getCartLineTotal(line), 0);
}
