import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

/**
 * Google OAuth 시작 URL.
 *
 * 서버 fetch 프록시는 백엔드 세션 쿠키가 브라우저에 전달되지 않아 OAuth가 깨진다.
 * 브라우저를 백엔드 `/oauth2/authorization/google`로 직접 보낸다.
 */
export async function GET(request: NextRequest) {
  try {
    const targetUrl = new URL(`${getBackendUrl()}/oauth2/authorization/google`);

    request.nextUrl.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    return NextResponse.redirect(targetUrl.toString(), 302);
  } catch (error) {
    console.error("Google OAuth redirect failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Google 로그인 연결에 실패했습니다.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
