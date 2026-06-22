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

/** SSE ORDER_STATUS 알림으로 주문·추적 캐시를 즉시 반영한다. */
export function patchOrderStatusFromNotification(
  queryClient: QueryClient,
  notification: NotificationResponse,
  options?: PatchOrderStatusOptions
) {
  if (notification.type !== "ORDER_STATUS") return;

  if (options?.invalidateOwnerOrders) {
    void queryClient.invalidateQueries({ queryKey: OWNER_ORDERS_QUERY_KEY });
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
  });
}
