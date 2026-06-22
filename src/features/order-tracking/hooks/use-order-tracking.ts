"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyOrders, type OrderResponse } from "@/entities/order";
import { ORDERS_QUERY_KEY } from "@/features/orders/lib/orders-query-key";

const TRACKING_REFETCH_MS = 30_000;

export function useOrderTracking(orderId: number | null) {
  const queryClient = useQueryClient();

  return useQuery<OrderResponse | null, Error>({
    queryKey: [...ORDERS_QUERY_KEY, "tracking", orderId],
    queryFn: async () => {
      const orders = await fetchMyOrders();
      return orders.find((order) => order.id === orderId) ?? null;
    },
    enabled: orderId != null,
    placeholderData: () => {
      const cachedOrders = queryClient.getQueryData<OrderResponse[]>(ORDERS_QUERY_KEY);
      return cachedOrders?.find((order) => order.id === orderId);
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "COMPLETED" || status === "CANCELED") {
        return false;
      }
      return TRACKING_REFETCH_MS;
    },
  });
}
