import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

/** `GET /api/notifications` — 알림 히스토리 조회 (백엔드 `/api/v1/notifications` 프록시). */
export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(`${getBackendUrl()}/api/v1/notifications`, {
      method: "GET",
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy notifications list:", error);
    return NextResponse.json(
      { message: "알림 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
