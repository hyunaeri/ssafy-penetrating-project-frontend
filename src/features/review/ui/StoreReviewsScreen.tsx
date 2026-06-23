"use client";

import { useMemo, useState } from "react";
import type { ReviewResponse } from "@/entities/review";
import { useStoreDetail } from "@/features/store-detail/hooks/use-store-detail";
import { formatReviewCount, formatRating } from "@/features/review/lib/format-review";
import { ReviewListItem } from "@/features/review/ui/ReviewListItem";
import { StarRating } from "@/features/review/ui/StarRating";
import { BackHeader, PrimaryButton } from "@/shared/ui";

type SortKey = "latest" | "rating";

type StoreReviewsScreenProps = {
  storeId: number;
};

function sortReviews(reviews: ReviewResponse[], sort: SortKey) {
  const copied = [...reviews];
  if (sort === "rating") {
    return copied.sort((a, b) => b.rating - a.rating || b.id - a.id);
  }
  return copied.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function StoreReviewsScreen({ storeId }: StoreReviewsScreenProps) {
  const { store, loading, error, reload } = useStoreDetail(storeId);
  const [sort, setSort] = useState<SortKey>("latest");

  const reviews = useMemo(() => {
    if (!store?.reviews) return [];
    return sortReviews(store.reviews, sort);
  }, [store?.reviews, sort]);

  const reviewCount = store?.reviewCount ?? reviews.length;
  const averageRating = store?.averageRating ?? 0;

  return (
    <div className="screen-viewport bg-white">
      <BackHeader title={store?.name ?? "리뷰"} />

      {loading && (
        <div className="screen-state">
          <p className="text-[14px] text-muted">리뷰를 불러오는 중입니다</p>
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

      {!loading && !error && store && (
        <>
          <div className="border-b border-line/80 px-4 py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[20px] font-bold text-ink">리뷰가 있어요</h2>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[11px] font-bold text-muted ring-1 ring-inset ring-line">
                i
              </span>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[14px] text-muted">
              <span>평균</span>
              <StarRating rating={averageRating} size="sm" />
              <span className="font-semibold text-ink">
                {formatRating(averageRating)}점
              </span>
              <span aria-hidden>·</span>
              <span>리뷰 {formatReviewCount(reviewCount)}개</span>
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 border-b border-line/80 px-4 py-3 text-[13px]">
            <button
              type="button"
              onClick={() => setSort("latest")}
              className={
                sort === "latest"
                  ? "font-bold text-ink"
                  : "text-muted transition-colors hover:text-ink"
              }
            >
              작성순
            </button>
            <span className="text-line" aria-hidden>
              |
            </span>
            <button
              type="button"
              onClick={() => setSort("rating")}
              className={
                sort === "rating"
                  ? "font-bold text-ink"
                  : "text-muted transition-colors hover:text-ink"
              }
            >
              별점순
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="screen-state gap-2">
              <p className="text-[16px] font-bold text-ink">
                아직 리뷰가 없어요
              </p>
              <p className="text-[14px] text-muted">
                첫 리뷰를 남겨보세요.
              </p>
            </div>
          ) : (
            <ul>
              {reviews.map((review) => (
                <li key={review.id}>
                  <ReviewListItem review={review} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
