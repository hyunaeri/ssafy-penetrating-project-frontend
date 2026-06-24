"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCatalogItemDetail } from "@/entities/catalog";

export const CATALOG_DETAIL_QUERY_KEY = ["catalog", "detail"] as const;

export function useCatalogItemDetail(achievementId: number | null) {
  const query = useQuery({
    queryKey: [...CATALOG_DETAIL_QUERY_KEY, achievementId],
    queryFn: () => fetchCatalogItemDetail(achievementId!),
    enabled: achievementId != null,
    staleTime: 60_000,
  });

  return {
    detail: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
