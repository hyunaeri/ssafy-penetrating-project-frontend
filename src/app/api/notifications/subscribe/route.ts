import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

export const dynamic = "force-dynamic";

/**
 * `GET /api/notifications/subscribe` — 실시간 알림 SSE 스트림 프록시.
 *
 * EventSource는 헤더를 보낼 수 없어 클라이언트는 fetch 스트림으로 호출하며,
 * 이 라우트가 Authorization 헤더를 백엔드 `/api/v1/notifications/subscribe`로 전달하고
 * 응답 스트림을 그대로 흘려보낸다.
 */
export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${getBackendUrl()}/api/v1/notifications/subscribe`, {
      method: "GET",
      headers: {
        Authorization: token,
        Accept: "text/event-stream",
      },
      signal: req.signal,
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to proxy notification subscribe:", error);
    return NextResponse.json(
      { message: "알림 연결 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { message: "알림 연결에 실패했습니다." },
      { status: upstream.status || 502 }
    );
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
