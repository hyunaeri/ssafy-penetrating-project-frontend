"use client";

type ScrollToTopButtonProps = {
  visible: boolean;
  onClick: () => void;
};

export function ScrollToTopButton({ visible, onClick }: ScrollToTopButtonProps) {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="맨 위로"
      className="fixed bottom-[5.25rem] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white shadow-float transition-transform hover:scale-105 active:scale-95 right-[max(1.25rem,calc((100%-430px)/2+1.25rem))]"
    >
      <span className="flex -translate-y-px flex-col items-center gap-1.5 leading-none">
        <svg
          width="10"
          height="6"
          viewBox="0 0 12 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="shrink-0"
        >
          <path d="M1 6 6 1l5 5" />
        </svg>
        <span className="text-[10px] font-bold tracking-wider">TOP</span>
      </span>
    </button>
  );
}
