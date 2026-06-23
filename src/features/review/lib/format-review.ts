const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatReviewRelativeDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) {
    return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
  }

  if (diffMs < MINUTE) return "방금";
  if (diffMs < HOUR) return `${Math.floor(diffMs / MINUTE)}분 전`;
  if (diffMs < DAY) return `${Math.floor(diffMs / HOUR)}시간 전`;
  if (diffMs < DAY * 7) return `${Math.floor(diffMs / DAY)}일 전`;

  const thisYear = now.getFullYear();
  const reviewYear = date.getFullYear();

  if (reviewYear === thisYear) {
    return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
  }
  if (reviewYear === thisYear - 1) return "작년";
  return `${reviewYear}년`;
}

export function formatRating(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return "0.0";
  return value.toFixed(1);
}

export function formatReviewCount(count: number | null | undefined) {
  const safe = typeof count === "number" && count >= 0 ? count : 0;
  return safe.toLocaleString("ko-KR");
}
