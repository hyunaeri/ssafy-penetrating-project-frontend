"use client";

import { useAppRouter } from "@/shared/lib/use-app-router";
import { useInfiniteScrollSentinel } from "@/shared/lib/use-infinite-scroll-sentinel";
import { useCallback, useMemo, useState } from "react";
import type { FoodCategory } from "@/entities/category";
import { CartEntryButton } from "@/features/cart";
import { useCategoryStoresInfinite } from "@/features/category-stores/hooks/use-category-stores-infinite";
import { CategoryTabs } from "@/features/category-stores/ui/CategoryTabs";
import { StoreCard } from "@/features/category-stores/ui/StoreCard";
import { AlarmButton } from "@/features/notification";
import { PrimaryButton } from "@/shared/ui";

type CategoryStoresScreenProps = {
  category: FoodCategory;
};

function StoreListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse gap-3.5 border-b border-line py-4"
        >
          <div className="h-[88px] w-[88px] shrink-0 rounded-2xl bg-white" />
          <div className="flex flex-1 flex-col justify-center gap-2 py-1">
            <div className="h-4 w-3/5 rounded-sm bg-surface" />
            <div className="h-3 w-full rounded-sm bg-surface" />
            <div className="h-3 w-2/5 rounded-sm bg-surface" />
          </div>
        </div>
      ))}
    </>
  );
}

export function CategoryStoresScreen({ category }: CategoryStoresScreenProps) {
  const router = useAppRouter();
  const {
    storeItems,
    hasNextPage,
    loading,
    isFetchingNextPage,
    error,
    reload,
    loadMore,
  } = useCategoryStoresInfinite(category.id);
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim().toLowerCase();
  const filteredStoreItems = useMemo(() => {
    if (!trimmedQuery) return storeItems;
    return storeItems.filter(({ store }) => {
      const name = store.name.toLowerCase();
      const description = store.description?.toLowerCase() ?? "";
      return name.includes(trimmedQuery) || description.includes(trimmedQuery);
    });
  }, [storeItems, trimmedQuery]);

  const canLoadMore = hasNextPage && !trimmedQuery;
  const sentinelRef = useInfiniteScrollSentinel(
    useCallback(() => loadMore(), [loadMore]),
    canLoadMore
  );

  return (
    <div className="screen-viewport bg-surface">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center gap-0.5 px-3 py-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="이전 페이지로 돌아가기"
            className="-ml-1 flex h-10 w-10 shrink-0 items-center justify-center text-ink transition-colors hover:text-muted active:scale-95"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M14 6 8 12l6 6" />
            </svg>
          </button>
          <h1 className="min-w-0 flex-1 text-[17px] font-bold tracking-tight text-ink">
            음식배달
          </h1>
          <div className="flex shrink-0 items-center gap-0.5">
            <AlarmButton />
            <CartEntryButton />
          </div>
        </div>

        <CategoryTabs activeId={category.id} />

        {!loading && !error && (
          <div className="border-b border-line/80 px-4 py-2.5">
            <div className="flex items-center gap-2 rounded-xl bg-surface px-3.5 py-2.5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-muted"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`${category.name} 매장 검색`}
                aria-label={`${category.name} 매장 검색`}
                className="min-w-0 flex-1 bg-transparent text-[14px] text-ink placeholder:text-muted/70 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="검색어 지우기"
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted/30 text-white transition-colors hover:bg-muted/50"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="screen-body">
        {loading && (
          <div className="screen-state items-stretch justify-start px-4 py-6 text-left">
            <StoreListSkeleton />
          </div>
        )}

        {!loading && error && (
          <div className="screen-state gap-4">
            <p className="text-[14px] text-red-600">{error}</p>
            <PrimaryButton
              type="button"
              variant="outline"
              className="max-w-[200px]"
              onClick={() => void reload()}
            >
              다시 시도
            </PrimaryButton>
          </div>
        )}

        {!loading && !error && storeItems.length === 0 && (
          <div className="screen-state">
            <p className="text-[14px] text-muted">
              이 카테고리에 등록된 매장이 없습니다.
            </p>
          </div>
        )}

        {!loading && !error && storeItems.length > 0 && filteredStoreItems.length === 0 && (
          <div className="screen-state gap-1.5">
            <p className="text-[15px] font-bold text-ink">
              검색 결과가 없어요
            </p>
            <p className="text-[13px] text-muted">
              ‘{query.trim()}’와 일치하는 매장을 찾지 못했어요.
            </p>
          </div>
        )}

        {!loading && !error && filteredStoreItems.length > 0 && (
          <ul className="divide-y divide-line/80 bg-white px-3">
            {filteredStoreItems.map(({ key, store }) => (
              <li key={key}>
                <StoreCard store={store} />
              </li>
            ))}
          </ul>
        )}

        {!loading && !error && canLoadMore && (
          <div ref={sentinelRef} className="px-4 py-4" aria-hidden>
            {isFetchingNextPage && <StoreListSkeleton count={2} />}
          </div>
        )}
      </div>
    </div>
  );
}
