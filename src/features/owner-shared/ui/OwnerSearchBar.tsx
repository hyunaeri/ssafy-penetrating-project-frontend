type OwnerSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  variant?: "inline" | "section";
  onClear?: () => void;
};

export function OwnerSearchBar({
  value,
  onChange,
  placeholder,
  ariaLabel,
  variant = "inline",
  onClear,
}: OwnerSearchBarProps) {
  const input = (
    <div className="flex items-center gap-2 rounded-xl bg-surface px-3.5 py-2.5">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="shrink-0 text-muted"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="min-w-0 flex-1 bg-transparent text-[14px] text-ink placeholder:text-muted/70 focus:outline-none"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="검색어 지우기"
          className="shrink-0 text-[12px] font-semibold text-muted transition-colors hover:text-ink"
        >
          지우기
        </button>
      )}
    </div>
  );

  if (variant === "section") {
    return (
      <div className="border-b border-line/80 bg-white px-4 py-2.5">{input}</div>
    );
  }

  return input;
}
