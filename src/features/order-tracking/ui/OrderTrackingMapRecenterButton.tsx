type OrderTrackingMapRecenterButtonProps = {
  onClick: () => void;
};

export function OrderTrackingMapRecenterButton({
  onClick,
}: OrderTrackingMapRecenterButtonProps) {
  return (
    <button
      type="button"
      aria-label="경로 위치로 돌아가기"
      onClick={onClick}
      className="absolute right-4 top-[4.5rem] z-20 flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-ink/90 text-white shadow-[0_6px_20px_rgba(43,45,66,0.28)] backdrop-blur-sm transition-transform active:scale-95"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <circle
          cx="12"
          cy="12"
          r="7.25"
          stroke="currentColor"
          strokeWidth="1.7"
          opacity="0.55"
        />
        <path
          d="M12 6.75 15.6 16.1 12 13.55 8.4 16.1Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
