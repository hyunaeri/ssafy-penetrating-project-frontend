"use client";

import { useMemo, useState } from "react";
import type { CollectionItem } from "@/entities/catalog";
import { CartEntryButton } from "@/features/cart";
import { AlarmButton } from "@/features/notification";
import { BackHeader, PrimaryButton } from "@/shared/ui";
import { useCatalog } from "../hooks/use-catalog";
import {
  applyCatalogFilters,
  type CatalogCollectionFilter,
  type CatalogGradeFilter,
  type CatalogSortKey,
} from "../lib/catalog-filters";
import { CatalogFilterBar } from "./CatalogFilterBar";
import { CatalogSortControl } from "./CatalogSortControl";
import { CollectionCard } from "./CollectionCard";
import { CollectionDetailModal } from "./CollectionDetailModal";

export function CatalogScreen() {
  const { items, loading, error, reload } = useCatalog();
  const [gradeFilter, setGradeFilter] = useState<CatalogGradeFilter>("ALL");
  const [sortKey, setSortKey] = useState<CatalogSortKey>("GRADE");
  const [collectionFilter, setCollectionFilter] =
    useState<CatalogCollectionFilter>("ALL");
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);

  const filteredItems = useMemo(
    () => applyCatalogFilters(items, gradeFilter, sortKey, collectionFilter),
    [collectionFilter, gradeFilter, items, sortKey],
  );

  const collectedCount = items.filter((item) => item.collected).length;
  const showList = !loading && !error && filteredItems.length > 0;
  const isEmpty = !loading && !error && filteredItems.length === 0;

  return (
    <div className="screen-viewport flex flex-col bg-surface">
      <BackHeader
        title="도감"
        trailing={
          <>
            <AlarmButton />
            <CartEntryButton />
          </>
        }
      />

      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm">
        <p className="border-b border-line/80 px-4 py-2.5 text-[13px] text-muted">
          <span className="font-semibold text-brand-dark">{collectedCount}</span>
          <span className="text-muted"> / {items.length}</span>
          <span> 개 수집</span>
        </p>

        {!loading && !error && items.length > 0 && (
          <CatalogFilterBar
            gradeFilter={gradeFilter}
            collectionFilter={collectionFilter}
            onGradeFilterChange={setGradeFilter}
            onCollectionFilterChange={setCollectionFilter}
          />
        )}
      </div>

      <div className="screen-body">
        {loading && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 px-4 py-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex animate-pulse flex-col items-center">
                <div className="aspect-square w-full max-w-[168px] rounded-[1.1rem] bg-white" />
                <div className="mt-3 h-4 w-3/5 rounded-sm bg-white" />
              </div>
            ))}
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

        {showList && (
          <>
            <div className="flex justify-end px-4 pt-4">
              <CatalogSortControl
                sortKey={sortKey}
                onSortKeyChange={setSortKey}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 px-4 pb-6 pt-3">
              {filteredItems.map((item) => (
                <CollectionCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          </>
        )}

        {isEmpty && (
          <div className="screen-state gap-3">
            <span className="text-[36px]" aria-hidden>
              📖
            </span>
            <p className="text-[15px] font-bold text-ink">
              {collectionFilter === "UNCOLLECTED" && gradeFilter === "ALL"
                ? "미수집 도감 항목이 없어요"
                : collectionFilter === "UNCOLLECTED"
                  ? "해당 조건의 미수집 항목이 없어요"
                  : gradeFilter === "HIDDEN"
                    ? "히든 업적이 없어요"
                    : gradeFilter === "ALL"
                      ? "표시할 도감 항목이 없어요"
                      : "해당 등급의 도감 항목이 없어요"}
            </p>
            <p className="text-[13px] text-muted">
              {collectionFilter === "UNCOLLECTED"
                ? "모든 도감을 수집했어요!"
                : "다른 필터를 선택해 보세요."}
            </p>
          </div>
        )}

        {showList && (
          <p className="px-4 pb-8 text-center text-[12px] text-muted">
            카드를 탭하면 해금 방법을 확인할 수 있어요.
          </p>
        )}
      </div>

      {selectedItem && (
        <CollectionDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
