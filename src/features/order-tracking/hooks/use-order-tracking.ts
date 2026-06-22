"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders, type OrderResponse } from "@/entities/order";

export function useOrderTracking(orderId: number | null) {
  return useQuery<OrderResponse | null, Error>({
    queryKey: ["orders", "tracking", orderId],
    queryFn: async () => {
      const orders = await fetchMyOrders();
      return orders.find((order) => order.id === orderId) ?? null;
    },
    enabled: orderId != null,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "COMPLETED" || status === "CANCELED") {
        return false;
      }
      return 10_000;
    },
  });
}
