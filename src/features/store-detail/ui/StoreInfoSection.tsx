"use client";

import Link from "next/link";
import { useState } from "react";
import { FavoriteButton, useFavoriteToggle } from "@/features/favorite";
import {
  formatRating,
  formatReviewCount,
} from "@/features/review/lib/format-review";

type StoreInfoSectionProps = {
  storeId: number;
  name: string;
  description?: string | null;
  address?: string | null;
  averageRating?: number | null;
  reviewCount?: number | null;
};

export function StoreInfoSection({
  storeId,
  name,
  description,
  address,
  averageRating,
  reviewCount,
}: StoreInfoSectionProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const { favorited, toggle, statusLoading } = useFavoriteToggle(storeId);

  const trimmedDescription = description?.trim();
  const trimmedAddress = address?.trim();
  const safeReviewCount =
    typeof reviewCount === "number" && reviewCount >= 0 ? reviewCount : 0;
  const safeRating =
    typeof averageRating === "number" && Number.isFinite(averageRating)
      ? averageRating
      : 0;

  return (
    <section className="border-b border-line/80 bg-white px-4 pb-4 pt-3">
      <div className="flex items-center gap-1">
        <h1 className="min-w-0 flex-1 py-1 text-[22px] font-bold leading-tight tracking-tight text-ink">
          {name}
        </h1>
        <FavoriteButton
          pressed={favorited}
          disabled={statusLoading}
          onToggle={toggle}
        />
      </div>

      <Link
        href={`/stores/${storeId}/reviews`}
        className="mt-1 inline-flex items-center gap-1 rounded-lg py-1 text-[14px] font-semibold text-ink transition-colors hover:text-brand-dark"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden
          className="text-amber-400"
          fill="currentColor"
        >
          <path d="M12 2.5 14.9 9h7.1l-5.7 4.2 2.2 7-6.5-4.5L6.5 20.2l2.2-7L3 9h7.1L12 2.5Z" />
        </svg>
        <span>{formatRating(safeRating)}</span>
        <span className="font-medium text-muted">
          ({formatReviewCount(safeReviewCount)})
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted"
          aria-hidden
        >
          <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {trimmedDescription && (
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">
          {trimmedDescription}
        </p>
      )}

      <div className="mt-2">
        <button
          type="button"
          aria-expanded={infoOpen}
          aria-controls="store-info-panel"
          onClick={() => setInfoOpen((prev) => !prev)}
          className="flex w-full items-center justify-between gap-2 rounded-lg py-1 text-left text-[13px] font-medium text-muted transition-colors hover:text-ink"
        >
          <span>가게정보·원산지</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`shrink-0 transition-transform duration-200 ${
              infoOpen ? "rotate-180" : "-rotate-90"
            }`}
            aria-hidden
          >
            <path
              d="M6 9l6 6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {infoOpen && (trimmedAddress || trimmedDescription) && (
        <div
          id="store-info-panel"
          className="mt-3 rounded-2xl bg-surface px-3.5 py-3 text-[13px] leading-relaxed text-ink"
        >
          {trimmedAddress && (
            <p>
              <span className="font-semibold text-muted">주소</span>
              <br />
              {trimmedAddress}
            </p>
          )}
          {trimmedAddress && trimmedDescription && (
            <hr className="my-2.5 border-line" />
          )}
          {trimmedDescription && (
            <p>
              <span className="font-semibold text-muted">소개</span>
              <br />
              {trimmedDescription}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
