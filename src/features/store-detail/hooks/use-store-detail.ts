"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStoreDetail, type StoreDetailResponse } from "@/entities/store";

export function useStoreDetail(storeId: number) {
  const query = useQuery<StoreDetailResponse, Error>({
    queryKey: ["storeDetail", storeId],
    queryFn: () => fetchStoreDetail(storeId),
    enabled: Number.isFinite(storeId),
  });

  return {
    store: query.data ?? null,
    loading: query.isLoading,
    error: query.isError ? query.error.message : null,
    reload: query.refetch,
  };
}
