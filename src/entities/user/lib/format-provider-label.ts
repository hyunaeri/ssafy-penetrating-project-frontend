const PROVIDER_LABELS: Record<string, string> = {
  GOOGLE: "Google",
  KAKAO: "Kakao",
  NAVER: "Naver",
};

/** OAuth provider enum 값을 화면 표시용 라벨로 변환한다. */
export function formatProviderLabel(provider: string): string {
  const key = provider.trim().toUpperCase();
  return PROVIDER_LABELS[key] ?? provider;
}
