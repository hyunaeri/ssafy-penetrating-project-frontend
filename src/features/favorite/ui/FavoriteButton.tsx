"use client";

type FavoriteButtonProps = {
  pressed: boolean;
  disabled?: boolean;
  onToggle: () => void;
};

export function FavoriteButton({
  pressed,
  disabled,
  onToggle,
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      aria-label={pressed ? "찜 해제" : "찜하기"}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onToggle}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors active:scale-95 disabled:opacity-50 ${
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
