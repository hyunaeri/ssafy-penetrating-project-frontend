"use client";

import { useState } from "react";
import { FavoriteButton, useFavoriteToggle } from "@/features/favorite";

type StoreInfoSectionProps = {
  storeId: number;
  name: string;
  description?: string | null;
  address?: string | null;
};

export function StoreInfoSection({
  storeId,
  name,
  description,
  address,
}: StoreInfoSectionProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const { favorited, toggle, statusLoading } = useFavoriteToggle(storeId);

  const trimmedDescription = description?.trim();
  const trimmedAddress = address?.trim();

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
