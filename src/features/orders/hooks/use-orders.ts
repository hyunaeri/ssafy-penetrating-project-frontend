"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders, type OrderResponse } from "@/entities/order";

export function useOrders() {
  const query = useQuery<OrderResponse[], Error>({
    queryKey: ["orders"],
    queryFn: fetchMyOrders,
  });

  return {
    orders: query.data ?? [],
    loading: query.isLoading,
    error: query.isError ? query.error.message : null,
    reload: query.refetch,
  };
}
