"use client";

import { AlarmButton } from "@/features/notification";
import { useProfile } from "@/features/profile/hooks/use-profile";

type OwnerHomeHeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function OwnerHomeHeader({ query, onQueryChange }: OwnerHomeHeaderProps) {
  const { user } = useProfile();
  const nickname = user?.nickname?.trim() || "사장님";

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-b from-brand to-brand-dark px-4 pb-3.5 pt-4 shadow-[0_4px_20px_rgba(31,181,176,0.18)]">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 text-white">
          <p className="text-[12px] font-medium text-white/80">매장 관리</p>
          <p className="line-clamp-1 text-[18px] font-bold tracking-tight">
            {nickname}님, 안녕하세요
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 text-white [&_.header-icon-trigger]:text-white [&_.header-icon-trigger:hover]:bg-white/15 [&_.header-icon-trigger:active]:bg-white/20">
          <AlarmButton />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-[0_4px_14px_rgba(31,181,176,0.18)]">
        <svg
          width="20"
          height="20"
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
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="주문·메뉴·매장 메뉴 검색"
          aria-label="매장 관리 메뉴 검색"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted/70 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
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
    </header>
  );
}
