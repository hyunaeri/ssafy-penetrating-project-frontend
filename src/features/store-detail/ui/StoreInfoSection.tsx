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

      <div className="mt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setInfoOpen((prev) => !prev)}
          className="text-[13px] font-medium text-muted underline-offset-2 hover:underline"
        >
          가게정보·원산지 {infoOpen ? "∧" : ">"}
        </button>
      </div>

      {infoOpen && (trimmedAddress || trimmedDescription) && (
        <div className="mt-3 rounded-2xl bg-surface px-3.5 py-3 text-[13px] leading-relaxed text-ink">
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
