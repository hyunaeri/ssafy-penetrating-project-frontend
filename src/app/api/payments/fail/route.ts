import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

type FailBody = {
  orderId?: string;
  code?: string;
  message?: string;
};

/** `POST /api/payments/fail` — 결제 실패 처리 (백엔드 `/api/v1/payments/toss/fail` 프록시). */
export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: FailBody;
  try {
    body = (await req.json()) as FailBody;
  } catch {
    return NextResponse.json(
      { message: "요청 본문이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  const orderId = body.orderId?.trim();
  const code = body.code?.trim();
  const message = body.message?.trim();

  if (!orderId || !code || !message) {
    return NextResponse.json(
      { message: "결제 실패 정보가 올바르지 않습니다." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${getBackendUrl()}/api/v1/payments/toss/fail`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ orderId, code, message }),
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy payment fail:", error);
    return NextResponse.json(
      { message: "결제 실패 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
