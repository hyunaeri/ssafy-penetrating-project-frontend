"use client";

import { useState } from "react";

type StoreInfoSectionProps = {
  name: string;
  description?: string | null;
  address?: string | null;
};

function FavoriteButton({
  pressed,
  onToggle,
}: {
  pressed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={pressed ? "찜 해제" : "찜하기"}
      aria-pressed={pressed}
      onClick={onToggle}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors active:scale-95 ${
        pressed
          ? "text-[#ff5a5f] hover:bg-[#fff0f0]"
          : "text-[#c8c8c8] hover:bg-surface hover:text-[#ff5a5f]"
      }`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={pressed ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="block overflow-visible"
        aria-hidden
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
}

export function StoreInfoSection({
  name,
  description,
  address,
}: StoreInfoSectionProps) {
  const [favorite, setFavorite] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const trimmedDescription = description?.trim();
  const trimmedAddress = address?.trim();

  return (
    <section className="border-b border-line/80 bg-white px-4 pb-4 pt-3">
      <div className="flex items-center gap-1">
        <h1 className="min-w-0 flex-1 py-1 text-[22px] font-bold leading-tight tracking-tight text-ink">
          {name}
        </h1>
        <FavoriteButton
          pressed={favorite}
          onToggle={() => setFavorite((prev) => !prev)}
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
