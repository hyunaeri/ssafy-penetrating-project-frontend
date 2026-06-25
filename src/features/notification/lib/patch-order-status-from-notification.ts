import type { QueryClient } from "@tanstack/react-query";
import type { NotificationResponse } from "@/entities/notification";
import type { OrderResponse } from "@/entities/order";
import {
  inferOrderStatusFromNotification,
  resolveOrderIdFromNotification,
} from "@/features/notification/lib/resolve-order-context-from-notification";
import { OWNER_ORDERS_QUERY_KEY } from "@/features/owner-orders/lib/owner-orders-query-key";
import { ORDERS_QUERY_KEY } from "@/features/orders/lib/orders-query-key";

type PatchOrderStatusOptions = {
  fallbackOrderId?: number | null;
  invalidateOwnerOrders?: boolean;
};

function patchOrderStatus(
  order: OrderResponse,
  status: OrderResponse["status"]
): OrderResponse {
  return { ...order, status };
}

function patchOwnerOrdersCache(
  queryClient: QueryClient,
  orderId: number,
  orderStatus: OrderResponse["status"]
): void {
  queryClient.setQueriesData<OrderResponse[]>(
    { queryKey: OWNER_ORDERS_QUERY_KEY },
    (current) => {
      if (!current) return current;

      const index = current.findIndex((order) => order.id === orderId);
      if (index < 0) return current;

      const next = [...current];
      next[index] = patchOrderStatus(next[index]!, orderStatus);
      return next;
    }
  );
}

/** SSE ORDER_STATUS 수신 시 사장 주문 목록을 즉시 동기화한다. */
export function refreshOwnerOrdersFromNotification(
  queryClient: QueryClient,
  notification: NotificationResponse,
  options?: { fallbackOrderId?: number | null }
): void {
  const orderId = resolveOrderIdFromNotification(
    notification,
    options?.fallbackOrderId
  );
  const orderStatus = inferOrderStatusFromNotification(notification);

  if (orderId != null && orderStatus != null) {
    patchOwnerOrdersCache(queryClient, orderId, orderStatus);
  }

  void queryClient.refetchQueries({
    queryKey: OWNER_ORDERS_QUERY_KEY,
    type: "active",
  });
}

/** SSE ORDER_STATUS 알림으로 주문·추적 캐시를 즉시 반영한다. */
export function patchOrderStatusFromNotification(
  queryClient: QueryClient,
  notification: NotificationResponse,
  options?: PatchOrderStatusOptions
) {
  if (notification.type !== "ORDER_STATUS") return;

  if (options?.invalidateOwnerOrders) {
    refreshOwnerOrdersFromNotification(queryClient, notification, {
      fallbackOrderId: options.fallbackOrderId,
    });
  }

  const orderId = resolveOrderIdFromNotification(
    notification,
    options?.fallbackOrderId
  );
  if (orderId == null) return;

  const orderStatus = inferOrderStatusFromNotification(notification);

  if (orderStatus != null) {
    queryClient.setQueryData<OrderResponse[]>(ORDERS_QUERY_KEY, (current) => {
      if (!current) return current;

      const index = current.findIndex((order) => order.id === orderId);
      if (index < 0) return current;

      const next = [...current];
      next[index] = patchOrderStatus(next[index]!, orderStatus);
      return next;
    });

    queryClient.setQueryData<OrderResponse | null>(
      [...ORDERS_QUERY_KEY, "tracking", orderId],
      (current) => {
        if (!current) return current;
        return patchOrderStatus(current, orderStatus);
      }
    );
  }

  void queryClient.refetchQueries({
    queryKey: [...ORDERS_QUERY_KEY, "tracking", orderId],
    type: "active",
  });
}
