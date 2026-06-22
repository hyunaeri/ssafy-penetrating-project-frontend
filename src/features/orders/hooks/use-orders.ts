"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders, type OrderResponse } from "@/entities/order";

import { ORDERS_QUERY_KEY } from "@/features/orders/lib/orders-query-key";

export function useOrders() {
  const query = useQuery<OrderResponse[], Error>({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: fetchMyOrders,
  });

  return {
    orders: query.data ?? [],
    loading: query.isLoading,
    error: query.isError ? query.error.message : null,
    reload: query.refetch,
  };
}
