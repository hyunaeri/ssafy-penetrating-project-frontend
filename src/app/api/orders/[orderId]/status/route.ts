import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";
import { getBearerToken, unauthorizedResponse } from "@/shared/api/proxy-auth";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

/** `PATCH /api/orders/[orderId]/status` — 주문 상태 변경 프록시. */
export async function PATCH(req: NextRequest, context: RouteContext) {
  const token = getBearerToken(req);
  if (!token) {
    return unauthorizedResponse();
  }

  const { orderId } = await context.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "요청 본문이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${getBackendUrl()}/api/v1/orders/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy order status update:", error);
    return NextResponse.json(
      { message: "주문 상태 변경 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
