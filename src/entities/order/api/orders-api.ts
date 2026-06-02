import { getAccessToken } from "@/entities/session";
import { getCurrentUser } from "@/entities/user";
import type { OrderResponse } from "@/entities/order/model/types";
import { getApiBaseUrl } from "@/shared/api";

function isOrderLike(value: unknown): value is OrderResponse {
  if (typeof value !== "object" || value === null) return false;
  const order = value as Partial<OrderResponse>;
  return (
    typeof order.id === "number" &&
    typeof order.storeId === "number" &&
    typeof order.finalPrice === "number" &&
    typeof order.status === "string" &&
    Array.isArray(order.items)
  );
}

function parseOrdersResponse(data: unknown): OrderResponse[] {
  if (Array.isArray(data)) {
    return data.filter(isOrderLike);
  }
  return [];
}

/** 로그인 사용자의 주문 이력 조회 */
export async function fetchMyOrders(): Promise<OrderResponse[]> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const user = await getCurrentUser();
  const params = new URLSearchParams({ userId: String(user.id) });
  const res = await fetch(`${getApiBaseUrl()}/api/orders?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as { message?: string };
    throw new Error(err.message ?? "주문 이력을 불러오지 못했습니다.");
  }

  return parseOrdersResponse(data);
}
