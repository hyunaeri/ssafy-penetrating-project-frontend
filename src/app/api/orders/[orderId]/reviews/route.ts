import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

/** `POST /api/orders/[orderId]/reviews` — 리뷰 작성 (백엔드 `/api/v1/orders/{orderId}/reviews` 프록시). */
export async function POST(req: NextRequest, context: RouteContext) {
  const { orderId } = await context.params;
  const token = req.headers.get("authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

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
      `${getBackendUrl()}/api/v1/orders/${orderId}/reviews`,
      {
        method: "POST",
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
    console.error("Failed to proxy create review:", error);
    return NextResponse.json(
      { message: "리뷰 작성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
