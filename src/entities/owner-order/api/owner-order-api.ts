import { parseOrdersResponse } from "@/entities/order/lib/parse-orders-response";
import type { OrderResponse, OrderStatus } from "@/entities/order/model/types";
import { authHeaders, parseJsonResponse } from "@/entities/owner-store/lib/owner-api-utils";
import { getAccessToken } from "@/entities/session";
import { getApiBaseUrl } from "@/shared/api";

/** 매장별 주문 목록 조회 */
export async function fetchStoreOrders(storeId: number): Promise<OrderResponse[]> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch(`${getApiBaseUrl()}/api/orders/stores/${storeId}`, {
    headers: authHeaders(token),
  });

  const data = await parseJsonResponse<unknown>(
    res,
    "주문 목록을 불러오지 못했습니다."
  );

  return parseOrdersResponse(data);
}

/** 주문 상태 변경 */
export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus
): Promise<OrderResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch(`${getApiBaseUrl()}/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: authHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify({ status }),
  });

  const data = await parseJsonResponse<unknown>(
    res,
    "주문 상태 변경에 실패했습니다."
  );

  const [order] = parseOrdersResponse([data]);
  if (!order) {
    throw new Error("주문 응답 형식이 올바르지 않습니다.");
  }

  return order;
}
