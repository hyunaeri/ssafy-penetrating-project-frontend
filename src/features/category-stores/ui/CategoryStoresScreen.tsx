"use client";

import type { FoodCategory } from "@/entities/category";
import { CartEntryButton } from "@/features/cart";
import { useCategoryStores } from "@/features/category-stores/hooks/use-category-stores";
import { StoreCard } from "@/features/category-stores/ui/StoreCard";
import { AlarmButton } from "@/features/notification";
import { BackHeader, PrimaryButton } from "@/shared/ui";

type CategoryStoresScreenProps = {
  category: FoodCategory;
};

export function CategoryStoresScreen({ category }: CategoryStoresScreenProps) {
  const { stores, loading, error, reload } = useCategoryStores(category.id);

  return (
    <div className="flex min-h-full flex-col bg-surface">
      <BackHeader
        title={category.name}
        trailing={
          <>
            <AlarmButton />
            <CartEntryButton />
          </>
        }
      />

      {!loading && !error && stores.length > 0 && (
        <p className="border-b border-line/80 bg-white px-4 py-2.5 text-[13px] text-muted">
          <span className="font-semibold text-brand-dark">{stores.length}</span>개 매장
        </p>
      )}

      <div className="flex flex-1 flex-col">
        {loading && (
          <div className="px-4 py-6">
            {Array.from({ length: 4 }).map((_, index) => (
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
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
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

        {!loading && !error && stores.length === 0 && (
          <p className="px-4 py-16 text-center text-[14px] text-muted">
            이 카테고리에 등록된 매장이 없습니다.
          </p>
        )}

        {!loading && !error && stores.length > 0 && (
          <ul className="divide-y divide-line/80 bg-white px-3">
            {stores.map((store) => (
              <li key={store.id}>
                <StoreCard store={store} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
