import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";
import { getBearerToken, unauthorizedResponse } from "@/shared/api/proxy-auth";

type RouteContext = {
  params: Promise<{ storeId: string }>;
};

/** `GET /api/orders/stores/[storeId]` — 매장별 주문 목록 프록시. */
export async function GET(req: NextRequest, context: RouteContext) {
  const token = getBearerToken(req);
  if (!token) {
    return unauthorizedResponse();
  }

  const { storeId } = await context.params;

  try {
    const response = await fetch(
      `${getBackendUrl()}/api/v1/orders/stores/${storeId}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy store orders:", error);
    return NextResponse.json(
      { message: "주문 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
