import type { CartOrderType } from "@/entities/cart/lib/parse-cart-response";

const STORAGE_KEY = "payment:checkout";

type CheckoutSession = {
  orderType: CartOrderType;
};

export function saveCheckoutOrderType(orderType: CartOrderType) {
  const data: CheckoutSession = { orderType };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getCheckoutOrderType(): CartOrderType {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return "delivery";
    const parsed = JSON.parse(raw) as CheckoutSession;
    return parsed.orderType === "pickup" ? "pickup" : "delivery";
  } catch {
    return "delivery";
  }
}

export function clearCheckoutOrderType() {
  sessionStorage.removeItem(STORAGE_KEY);
}
