"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStoresByCategoryCursor, type StoreResponse } from "@/entities/store";

/** @deprecated useCategoryStoresPreview 또는 useCategoryStoresInfinite 사용 */
export function useCategoryStores(categoryId: number) {
  const query = useQuery<StoreResponse[], Error>({
    queryKey: ["categoryStores", categoryId],
    queryFn: async () => {
      const result = await fetchStoresByCategoryCursor(categoryId, { size: 100 });
      return result.stores;
    },
    enabled: Number.isFinite(categoryId),
  });

  return {
    stores: query.data ?? [],
    loading: query.isLoading,
    error: query.isError ? query.error.message : null,
    reload: query.refetch,
  };
}
