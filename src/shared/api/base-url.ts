import { getBackendUrl } from "@/shared/api/backend";

/** 브라우저는 same-origin API 프록시, 서버는 백엔드 직접 호출. */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  return getBackendUrl();
}

export function getOAuthLoginUrl(): string {
  return `${getApiBaseUrl()}/api/login/oauth/google`;
}
