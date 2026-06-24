"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCatalogItems } from "@/entities/catalog";
import { useAccessToken } from "@/entities/session";

export const CATALOG_QUERY_KEY = ["catalog"] as const;

export function useCatalog() {
  const accessToken = useAccessToken();

  const query = useQuery({
    queryKey: CATALOG_QUERY_KEY,
    queryFn: fetchCatalogItems,
    enabled: Boolean(accessToken),
  });

  return {
    items: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    reload: () => query.refetch(),
  };
}
