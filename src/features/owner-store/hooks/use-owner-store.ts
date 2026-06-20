"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyOwnerStore } from "@/entities/owner-store";
import type { StoreDetailResponse } from "@/entities/store/model/types";

export function useOwnerStore() {
  const queryClient = useQueryClient();

  const query = useQuery<StoreDetailResponse | null, Error>({
    queryKey: ["owner-my-store"],
    queryFn: fetchMyOwnerStore,
  });

  const refreshStore = () =>
    queryClient.invalidateQueries({ queryKey: ["owner-my-store"] });

  return {
    storeId: query.data?.id ?? null,
    store: query.data ?? null,
    loading: query.isLoading,
    error: query.isError ? query.error.message : null,
    reload: query.refetch,
    refreshStore,
    hasStore: query.data != null,
  };
}
