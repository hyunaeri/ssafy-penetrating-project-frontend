type StarRatingProps = {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
};

type StarFill = "empty" | "half" | "full";

const STAR_PATH = "M12 2.5 14.9 9h7.1l-5.7 4.2 2.2 7-6.5-4.5L6.5 20.2l2.2-7L3 9h7.1L12 2.5Z";

function getStarFill(rating: number, starIndex: number): StarFill {
  const remaining = rating - starIndex;
  if (remaining >= 1) return "full";
  if (remaining >= 0.5) return "half";
  return "empty";
}

function StarIcon({ fill, size }: { fill: StarFill; size: "sm" | "md" }) {
  const dimension = size === "sm" ? 14 : 16;

  return (
    <span
      className="relative inline-flex shrink-0"
      style={{ width: dimension, height: dimension }}
      aria-hidden
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 24 24"
        className="text-line"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path d={STAR_PATH} />
      </svg>
      {fill !== "empty" && (
        <svg
          width={dimension}
          height={dimension}
          viewBox="0 0 24 24"
          className="absolute inset-0 text-amber-400"
          style={{
            clipPath: fill === "half" ? "inset(0 50% 0 0)" : undefined,
          }}
          fill="currentColor"
        >
          <path d={STAR_PATH} />
        </svg>
      )}
    </span>
  );
}

export function StarRating({
  rating,
  max = 5,
  size = "md",
  className = "",
}: StarRatingProps) {
  const safeRating = Math.max(0, Math.min(max, rating));
  const labelRating = Number.isFinite(safeRating)
    ? safeRating.toFixed(1)
    : "0.0";

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      aria-label={`별점 ${labelRating}점`}
    >
      {Array.from({ length: max }).map((_, index) => (
        <StarIcon
          key={index}
          fill={getStarFill(safeRating, index)}
          size={size}
        />
      ))}
    </span>
  );
}

type StarRatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function StarRatingInput({
  value,
  onChange,
  disabled,
}: StarRatingInputProps) {
  return (
    <div
      className="flex items-center justify-center gap-2"
      role="radiogroup"
      aria-label="별점 선택"
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= value;
        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={filled}
            aria-label={`${starValue}점`}
            disabled={disabled}
            onClick={() => onChange(starValue)}
            className="rounded-full p-1 transition-transform hover:scale-110 disabled:opacity-50"
          >
            <svg
              width={32}
              height={32}
              viewBox="0 0 24 24"
              aria-hidden
              className={filled ? "text-amber-400" : "text-line"}
              fill={filled ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={filled ? 0 : 1.5}
            >
              <path d={STAR_PATH} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
