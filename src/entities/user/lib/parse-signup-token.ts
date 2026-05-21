import type { SignupTokenPreview } from "@/entities/user/model/types";

function decodeBase64UrlJson<T>(segment: string): T {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const json = new TextDecoder("utf-8").decode(bytes);
  return JSON.parse(json) as T;
}

/** 회원가입용 JWT payload를 디코드해 프로필 미리보기에 사용한다 (서명 검증 없음). */
export function parseSignupToken(token: string): SignupTokenPreview | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const decoded = decodeBase64UrlJson<{
      purpose?: string;
      email?: string;
      nickname?: string;
      profileImageUrl?: string | null;
      provider?: string;
    }>(payload);

    if (decoded.purpose !== "SIGNUP") return null;
    if (!decoded.email || !decoded.nickname || !decoded.provider) return null;

    return {
      email: decoded.email,
      nickname: decoded.nickname,
      profileImageUrl: decoded.profileImageUrl ?? null,
      provider: decoded.provider,
    };
  } catch {
    return null;
  }
}
