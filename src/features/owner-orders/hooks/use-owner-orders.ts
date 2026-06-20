"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { OrderResponse, OrderStatus } from "@/entities/order";
import { fetchStoreOrders, updateOrderStatus } from "@/entities/owner-order";

export function useOwnerOrders(storeId: number | null) {
  const queryClient = useQueryClient();

  const query = useQuery<OrderResponse[], Error>({
    queryKey: ["owner-orders", storeId],
    queryFn: () => fetchStoreOrders(storeId!),
    enabled: storeId != null,
    refetchInterval: 30_000,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: number;
      status: OrderStatus;
    }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["owner-orders", storeId] });
    },
  });

  return {
    orders: query.data ?? [],
    loading: query.isLoading,
    error: query.isError ? query.error.message : null,
    reload: query.refetch,
    updateStatus: statusMutation.mutateAsync,
    updating: statusMutation.isPending,
  };
}
