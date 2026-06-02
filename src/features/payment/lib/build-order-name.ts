import type { CartResponse } from "@/entities/cart";

export function buildOrderName(cart: CartResponse): string {
  const storeName = cart.storeName?.trim() || "주문";
  const firstItem = cart.items[0]?.menuName?.trim();
  const extra = cart.items.length > 1 ? ` 외 ${cart.items.length - 1}건` : "";

  if (firstItem) {
    return `${storeName} · ${firstItem}${extra}`;
  }

  return storeName;
}
