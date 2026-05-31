type IconProps = {
  className?: string;
};

export function ToastSuccessIcon({ className = "" }: IconProps) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-[0_2px_8px_rgba(42,193,188,0.25)] ${className}`}
      aria-hidden
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M4.5 9.25 7.35 12.1 13.5 5.9"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function ToastErrorIcon({ className = "" }: IconProps) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4a896] text-white shadow-[0_2px_8px_rgba(244,168,150,0.35)] ${className}`}
      aria-hidden
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M6 6 12 12M12 6 6 12"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
