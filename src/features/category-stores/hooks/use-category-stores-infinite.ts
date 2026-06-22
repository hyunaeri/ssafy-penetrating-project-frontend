"use client";

import { useInfiniteQuery, useQuery, type InfiniteData } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import {
  CATEGORY_STORES_PAGE_SIZE,
  fetchStoresByCategoryCursor,
  type StoreResponse,
} from "@/entities/store";
import type { StoresCursorResult } from "@/entities/store/lib/parse-stores-cursor-response";

export type CategoryStoreListItem = {
  key: string;
  store: StoreResponse;
};

function getCategoryStoresInfiniteKey(categoryId: number, size: number) {
  return ["categoryStores", categoryId, "infinite", size] as const;
}

export function useCategoryStoresInfinite(
  categoryId: number,
  size: number = CATEGORY_STORES_PAGE_SIZE
) {
  const queryKey = getCategoryStoresInfiniteKey(categoryId, size);

  const query = useInfiniteQuery<
    StoresCursorResult,
    Error,
    InfiniteData<StoresCursorResult>,
    ReturnType<typeof getCategoryStoresInfiniteKey>,
    number | undefined
  >({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchStoresByCategoryCursor(categoryId, {
        cursor: pageParam,
        size,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext && lastPage.nextCursor != null
        ? lastPage.nextCursor
        : undefined,
    enabled: Number.isFinite(categoryId),
  });

  const storeItems = useMemo<CategoryStoreListItem[]>(
    () =>
      query.data?.pages.flatMap((page, pageIndex) =>
        page.stores.map((store) => ({
          key: `${pageIndex}-${store.id}`,
          store,
        }))
      ) ?? [],
    [query.data]
  );

  const hasNextPage = query.hasNextPage ?? false;
  const { fetchNextPage, isFetchingNextPage } = query;

  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    storeItems,
    hasNextPage,
    loading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    error: query.isError ? query.error.message : null,
    reload: query.refetch,
    loadMore,
  };
}

export function useCategoryStoresPreview(
  categoryId: number,
  limit: number = 6
) {
  const query = useQuery<StoreResponse[], Error>({
    queryKey: ["categoryStores", categoryId, "preview", limit],
    queryFn: async () => {
      const result = await fetchStoresByCategoryCursor(categoryId, {
        size: limit,
      });
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
