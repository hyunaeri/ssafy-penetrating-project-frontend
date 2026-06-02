"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFavoriteStores } from "@/entities/favorite";
import { getAccessToken } from "@/entities/session";

export const FAVORITES_QUERY_KEY = ["favorites"] as const;

export function useFavorites() {
  const hasToken = typeof window !== "undefined" && Boolean(getAccessToken());

  const query = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: fetchFavoriteStores,
    enabled: hasToken,
  });

  return {
    stores: query.data ?? [],
    loading: query.isLoading,
    error: query.isError ? query.error.message : null,
    reload: query.refetch,
  };
}

export function isStoreFavorited(
  stores: { id: number }[],
  storeId: number
): boolean {
  return stores.some((store) => store.id === storeId);
}
