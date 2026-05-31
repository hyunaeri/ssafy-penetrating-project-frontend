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
      className="fixed bottom-[5.25rem] z-20 flex h-11 w-11 flex-col items-center justify-center rounded-full bg-brand text-white shadow-float transition-transform hover:scale-105 active:scale-95 right-[max(1.25rem,calc((100%-430px)/2+1.25rem))]"
    >
      <span className="text-[9px] font-bold leading-none">▲</span>
      <span className="mt-0.5 text-[8px] font-bold leading-none tracking-wider">
        TOP
      </span>
    </button>
  );
}
