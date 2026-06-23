import type {
  AdminLoginRequest,
  AdminLoginResponse,
} from "@/entities/admin-auth/model/types";
import { getApiBaseUrl } from "@/shared/api";

export async function loginAdmin(
  request: AdminLoginRequest
): Promise<AdminLoginResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    let message = "관리자 로그인에 실패했습니다.";
    try {
      const body = (await res.json()) as {
        message?: string;
        accessToken?: string;
      };
      if (body.message) message = body.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  const body = (await res.json()) as AdminLoginResponse & {
    data?: AdminLoginResponse;
  };

  if (body.data?.accessToken) {
    return { accessToken: body.data.accessToken, role: "ADMIN" };
  }

  return body;
}

export async function logoutAdmin(): Promise<void> {
  const { clearSession } = await import("@/entities/session");
  clearSession();
}
