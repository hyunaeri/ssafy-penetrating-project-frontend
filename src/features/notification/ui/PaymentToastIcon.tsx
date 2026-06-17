type PaymentToastIconProps = {
  size?: "sm" | "md";
};

export function PaymentToastIcon({ size = "md" }: PaymentToastIconProps) {
  const boxClass =
    size === "sm" ? "h-9 w-9 rounded-xl" : "h-11 w-11 rounded-2xl";
  const glyphSize = size === "sm" ? 18 : 22;

  return (
    <span
      className={`flex shrink-0 items-center justify-center bg-brand/10 text-brand-dark ${boxClass}`}
      aria-hidden
    >
      <svg
        width={glyphSize}
        height={glyphSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </svg>
    </span>
  );
}
