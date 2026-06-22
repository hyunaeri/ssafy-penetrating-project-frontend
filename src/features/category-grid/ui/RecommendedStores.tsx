"use client";

import { findFoodCategoryById } from "@/entities/category";
import { useCategoryStoresPreview } from "@/features/category-stores/hooks/use-category-stores-infinite";
import { StoreCard } from "@/features/category-stores/ui/StoreCard";

/** 홈 하단 추천 매장 섹션. 기본 카테고리(프랜차이즈)의 매장을 보여준다. */
const RECOMMENDED_CATEGORY_ID = 1;
const MAX_ITEMS = 6;

export function RecommendedStores() {
  const { stores, loading, error } = useCategoryStoresPreview(
    RECOMMENDED_CATEGORY_ID,
    MAX_ITEMS
  );
  const category = findFoodCategoryById(RECOMMENDED_CATEGORY_ID);
  const items = stores;

  if (error) return null;

  return (
    <section className="rounded-card bg-white py-4 shadow-card">
      <div className="flex items-center justify-between px-4 pb-1">
        <h2 className="text-[16px] font-bold tracking-tight text-ink">
          금방 도착하는 가게
        </h2>
        {category && (
          <span className="text-[12px] font-semibold text-muted">
            {category.name}
          </span>
        )}
      </div>

      {loading && (
        <div className="px-3 pt-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex animate-pulse gap-3.5 border-b border-line py-4 last:border-0"
            >
              <div className="h-[88px] w-[88px] shrink-0 rounded-2xl bg-surface" />
              <div className="flex flex-1 flex-col justify-center gap-2 py-1">
                <div className="h-4 w-3/5 rounded-sm bg-surface" />
                <div className="h-3 w-full rounded-sm bg-surface" />
                <div className="h-3 w-2/5 rounded-sm bg-surface" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <p className="px-4 py-8 text-center text-[14px] text-muted">
          추천할 매장이 아직 없어요.
        </p>
      )}

      {!loading && items.length > 0 && (
        <ul className="divide-y divide-line/80 px-1">
          {items.map((store) => (
            <li key={store.id}>
              <StoreCard store={store} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
