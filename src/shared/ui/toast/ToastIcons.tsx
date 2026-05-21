type IconProps = {
  className?: string;
};

export function ToastSuccessIcon({ className = "" }: IconProps) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-[0_1px_3px_rgba(22,163,74,0.35)] ${className}`}
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
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dc2626] text-white shadow-[0_1px_3px_rgba(220,38,38,0.35)] ${className}`}
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
