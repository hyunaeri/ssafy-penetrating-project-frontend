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
      className="fixed bottom-[5.25rem] z-20 flex h-11 w-11 flex-col items-center justify-center border border-ink bg-ink text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] max-[430px]:right-5 min-[431px]:right-[calc(50%-195px)]"
    >
      <span className="text-[9px] font-bold leading-none">▲</span>
      <span className="mt-0.5 text-[8px] font-bold leading-none tracking-wider">
        TOP
      </span>
    </button>
  );
}
