import { NextRequest, NextResponse } from "next/server";
import {
  forwardSetCookieHeaders,
  getRequestCookieHeader,
} from "@/shared/api/proxy-auth-cookies";
import { getBackendUrl } from "@/shared/api";

/** `POST /api/auth/reissue` — Refresh Token 쿠키로 Access Token 재발급. */
export async function POST(req: NextRequest) {
  try {
    const response = await fetch(`${getBackendUrl()}/api/v1/auth/reissue`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...getRequestCookieHeader(req),
      },
    });

    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
    };

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message ?? "토큰 재발급에 실패했습니다." },
        { status: response.status }
      );
    }

    const nextResponse = NextResponse.json(data);
    forwardSetCookieHeaders(response, nextResponse);
    return nextResponse;
  } catch (error) {
    console.error("Failed to reissue tokens:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
