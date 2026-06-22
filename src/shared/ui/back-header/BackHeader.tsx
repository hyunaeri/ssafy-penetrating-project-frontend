"use client";

import type { ReactNode } from "react";
import { useAppRouter } from "@/shared/lib/use-app-router";

type BackHeaderProps = {
  title: string;
  trailing?: ReactNode;
  showBack?: boolean;
  sticky?: boolean;
};

export function BackHeader({
  title,
  trailing,
  showBack = true,
  sticky = true,
}: BackHeaderProps) {
  const router = useAppRouter();

  return (
    <header
      className={`flex items-center gap-0.5 border-b border-line/80 bg-white/95 px-3 py-3.5 backdrop-blur-sm ${
        sticky ? "sticky top-0 z-10" : ""
      }`}
    >
      {showBack ? (
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
      ) : (
        <span className="w-10 shrink-0" aria-hidden />
      )}
      <h1 className="min-w-0 flex-1 text-[17px] font-bold tracking-tight text-ink">
        {title}
      </h1>
      {trailing != null && (
        <div className="flex shrink-0 items-center gap-0.5">{trailing}</div>
      )}
    </header>
  );
}
