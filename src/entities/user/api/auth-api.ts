import type {
  AuthTokenResponse,
  SignupRequest,
  UserResponse,
} from "@/entities/user/model/types";
import { parseUserResponse } from "@/entities/user/lib/parse-user-response";
import {
  clearSession,
  getAccessToken,
  getSessionUser,
  setSession,
  setSessionUser,
} from "@/entities/session";
import { getApiBaseUrl, getCookieAuthBaseUrl } from "@/shared/api";

let sessionRestorePromise: Promise<AuthTokenResponse | null> | null = null;

export function resetSessionRestore(): void {
  sessionRestorePromise = null;
}

export async function reissueTokens(): Promise<AuthTokenResponse> {
  const res = await fetch(`${getCookieAuthBaseUrl()}/api/v1/auth/reissue`, {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    let message = "토큰 재발급에 실패했습니다.";
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  const data = (await res.json()) as AuthTokenResponse;
  return {
    accessToken: data.accessToken,
    user: parseUserResponse(data.user),
  };
}

export async function ensureSession(): Promise<AuthTokenResponse | null> {
  const accessToken = getAccessToken();
  const user = getSessionUser();
  if (accessToken && user) {
    return { accessToken, user };
  }

  if (!sessionRestorePromise) {
    sessionRestorePromise = (async () => {
      try {
        const response = await reissueTokens();
        setSession(response.accessToken, response.user);
        return response;
      } catch {
        return null;
      } finally {
        sessionRestorePromise = null;
      }
    })();
  }

  return sessionRestorePromise;
}

export async function tryRestoreSession(): Promise<string | null> {
  const session = await ensureSession();
  return session?.accessToken ?? null;
}

export async function fetchCurrentUser(
  accessToken: string
): Promise<UserResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/main/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error("사용자 정보를 불러오지 못했습니다.");
  }

  return parseUserResponse(await res.json());
}

export async function getCurrentUser(): Promise<UserResponse> {
  const cachedUser = getSessionUser();
  const token = getAccessToken();

  if (token && cachedUser) {
    return cachedUser;
  }

  if (!token) {
    const session = await ensureSession();
    if (session?.user) {
      return session.user;
    }
    throw new Error("로그인이 필요합니다.");
  }

  const user = await fetchCurrentUser(token);
  setSessionUser(user);
  return user;
}

export async function completeSignup(
  request: SignupRequest
): Promise<AuthTokenResponse> {
  const res = await fetch(`${getCookieAuthBaseUrl()}/api/v1/auth/signup`, {
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

  const response = (await res.json()) as AuthTokenResponse;
  const session = {
    accessToken: response.accessToken,
    user: parseUserResponse(response.user),
  };
  setSession(session.accessToken, session.user);
  return session;
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${getCookieAuthBaseUrl()}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    /* 서버 로그아웃 실패 시에도 로컬 세션은 정리 */
  } finally {
    resetSessionRestore();
    clearSession();
  }
}
