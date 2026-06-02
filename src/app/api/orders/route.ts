import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

/** `POST /api/orders` — 주문 생성 (백엔드 `/api/v1/orders` 프록시). */
export async function POST(req: NextRequest) {
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
    const response = await fetch(`${getBackendUrl()}/api/v1/orders`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy create order:", error);
    return NextResponse.json(
      { message: "주문 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/** `GET /api/orders?userId=:id` — 주문 이력 조회 (백엔드 `/api/v1/orders` 프록시). */
export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userIdParam = req.nextUrl.searchParams.get("userId");
  const userId = Number(userIdParam);
  if (!userIdParam || !Number.isFinite(userId) || userId <= 0) {
    return NextResponse.json(
      { message: "사용자 정보가 올바르지 않습니다." },
      { status: 400 }
    );
  }

  const target = new URL(`${getBackendUrl()}/api/v1/orders`);
  target.searchParams.set("userId", String(userId));

  try {
    const response = await fetch(target, {
      method: "GET",
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy orders list:", error);
    return NextResponse.json(
      { message: "주문 이력 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
