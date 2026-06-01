"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStoresByCategory, type StoreResponse } from "@/entities/store";

export function useCategoryStores(categoryId: number) {
  const query = useQuery<StoreResponse[], Error>({
    queryKey: ["categoryStores", categoryId],
    queryFn: () => fetchStoresByCategory(categoryId),
    enabled: Number.isFinite(categoryId),
  });

  return {
    stores: query.data ?? [],
    loading: query.isLoading,
    error: query.isError ? query.error.message : null,
    reload: query.refetch,
  };
}
