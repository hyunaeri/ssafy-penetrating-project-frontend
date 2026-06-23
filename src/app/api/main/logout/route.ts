import { NextRequest, NextResponse } from "next/server";
import {
  forwardSetCookieHeaders,
  getRequestCookieHeader,
} from "@/shared/api/proxy-auth-cookies";
import { getBackendUrl } from "@/shared/api";

/** `POST /api/main/logout` — 메인 페이지용 로그아웃 (백엔드 `/api/v1/auth/logout` 프록시). */
export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization");

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...getRequestCookieHeader(req),
    };
    if (token) headers.Authorization = token;

    const response = await fetch(`${getBackendUrl()}/api/v1/auth/logout`, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "로그아웃에 실패했습니다." },
        { status: response.status }
      );
    }

    const nextResponse = new NextResponse(null, { status: response.status });
    forwardSetCookieHeaders(response, nextResponse);
    return nextResponse;
  } catch (error) {
    console.error("Failed to logout:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
