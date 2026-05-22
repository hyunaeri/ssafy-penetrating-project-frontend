export function formatWon(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function formatReviewCount(count: number): string {
  if (count >= 1000) return `${Math.floor(count / 100) / 10}천+`;
  if (count >= 100) return `${Math.floor(count / 100) * 100}+`;
  return String(count);
}

export function formatDeliveryTime(
  value?: string | null,
  minutes?: number | null
): string | null {
  const trimmed = value?.trim();
  if (trimmed) return trimmed;
  if (typeof minutes === "number" && minutes > 0) {
    return `${minutes}분`;
  }
  return null;
}
