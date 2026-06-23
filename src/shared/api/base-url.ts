import { getBackendUrl } from "@/shared/api/backend";

/** 브라우저는 same-origin API 프록시, 서버는 백엔드 직접 호출. */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  return getBackendUrl();
}

/**
 * HttpOnly refreshToken 쿠키가 저장되는 백엔드 origin.
 * OAuth 리다이렉트는 api 도메인에서 쿠키를 심으므로, reissue·signup·logout은 브라우저가 백엔드로 직접 호출한다.
 */
export function getCookieAuthBaseUrl(): string {
  if (typeof window !== "undefined") {
    const url = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (!url) {
      throw new Error("NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
    }
    return url.replace(/\/$/, "");
  }
  return getBackendUrl();
}

export function getOAuthLoginUrl(): string {
  if (typeof window !== "undefined") {
    // OAuth state·세션은 api 도메인에서 처리해야 로그아웃 후 재로그인이 안정적이다.
    return `${getCookieAuthBaseUrl()}/oauth2/authorization/google`;
  }
  return `${getApiBaseUrl()}/api/login/oauth/google`;
}
