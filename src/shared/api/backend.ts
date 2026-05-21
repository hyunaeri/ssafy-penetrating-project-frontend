/** Server/route proxy용 백엔드 origin (trailing slash 없음). */
export function getBackendUrl(): string {
  const url = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!url?.trim()) {
    throw new Error(
      "BACKEND_URL 또는 NEXT_PUBLIC_API_URL이 설정되지 않았습니다. .env.local을 확인하세요."
    );
  }
  return url.trim().replace(/\/$/, "");
}
