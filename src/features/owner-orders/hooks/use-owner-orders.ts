"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { OrderResponse, OrderStatus } from "@/entities/order";
import { fetchStoreOrders, updateOrderStatus } from "@/entities/owner-order";
import { OWNER_ORDERS_QUERY_KEY } from "@/features/owner-orders/lib/owner-orders-query-key";

export function useOwnerOrders(storeId: number | null) {
  const queryClient = useQueryClient();

  const query = useQuery<OrderResponse[], Error>({
    queryKey: [...OWNER_ORDERS_QUERY_KEY, storeId],
    queryFn: () => fetchStoreOrders(storeId!),
    enabled: storeId != null,
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
      void queryClient.invalidateQueries({
        queryKey: [...OWNER_ORDERS_QUERY_KEY, storeId],
      });
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
