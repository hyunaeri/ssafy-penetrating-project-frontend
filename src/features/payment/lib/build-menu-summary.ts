import type { CartResponse } from "@/entities/cart";

export function buildMenuSummaryFromCart(cart: CartResponse): string {
  if (cart.items.length === 0) return "주문";

  const first = cart.items[0]!.menuName.trim();
  if (cart.items.length === 1) return first;

  return `${first} 외 ${cart.items.length - 1}건`;
}

/** 백엔드 orderName(예: `메뉴A+메뉴B`)을 토스트용 짧은 문구로 줄인다. */
export function summarizeMenuOrderName(orderName: string): string {
  const trimmed = orderName.trim();
  if (!trimmed) return "주문";

  const plusParts = trimmed
    .split("+")
    .map((part) => part.trim())
    .filter(Boolean);

  if (plusParts.length > 1) {
    return `${plusParts[0]} 외 ${plusParts.length - 1}건`;
  }

  const dotParts = trimmed.split(/\s[-·]\s/);
  if (dotParts.length >= 2) {
    return dotParts.slice(1).join(" · ").trim();
  }

  return trimmed;
}
