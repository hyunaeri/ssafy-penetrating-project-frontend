import type {
  AuthTokenResponse,
  SignupRequest,
  UserResponse,
} from "@/entities/user/model/types";
import { clearAccessToken, getAccessToken } from "@/entities/session";
import { getApiBaseUrl } from "@/shared/api";

export async function fetchCurrentUser(
  accessToken: string
): Promise<UserResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/main/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error("사용자 정보를 불러오지 못했습니다.");
  }

  return res.json();
}

export async function getCurrentUser(): Promise<UserResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }
  return fetchCurrentUser(token);
}

export async function completeSignup(
  request: SignupRequest
): Promise<AuthTokenResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    let message = "회원가입에 실패했습니다.";
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  return res.json();
}

export async function logout(): Promise<void> {
  const token = getAccessToken();

  try {
    await fetch(`${getApiBaseUrl()}/api/main/logout`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    });
  } finally {
    clearAccessToken();
  }
}
