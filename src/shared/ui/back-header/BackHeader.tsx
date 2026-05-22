"use client";

import { useRouter } from "next/navigation";

type BackHeaderProps = {
  title: string;
};

export function BackHeader({ title }: BackHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 flex items-center gap-0.5 border-b border-line bg-white px-4 py-3.5">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="이전 페이지로 돌아가기"
        className="-ml-1 flex shrink-0 items-center justify-center p-2 text-ink transition-colors hover:text-muted active:text-muted"
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
      <h1 className="min-w-0 flex-1 text-[17px] font-bold tracking-tight text-ink">
        {title}
      </h1>
    </header>
  );
}
