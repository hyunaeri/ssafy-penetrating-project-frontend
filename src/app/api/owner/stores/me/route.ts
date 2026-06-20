import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";
import { getBearerToken, unauthorizedResponse } from "@/shared/api/proxy-auth";

/** `GET /api/owner/stores/me` — 점주 본인 매장 조회 프록시. */
export async function GET(req: NextRequest) {
  const token = getBearerToken(req);
  if (!token) {
    return unauthorizedResponse();
  }

  try {
    const response = await fetch(`${getBackendUrl()}/api/v1/owner/stores/me`, {
      method: "GET",
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy owner my store:", error);
    return NextResponse.json(
      { message: "매장 정보 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
