import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

type ConfirmBody = {
  paymentKey?: string;
  orderId?: string;
  amount?: number | string;
};

/** `POST /api/payments/confirm` — 결제 승인 (백엔드 `/api/v1/payments/toss/confirm` 프록시). */
export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: ConfirmBody;

  try {
    body = (await req.json()) as ConfirmBody;
  } catch {
    return NextResponse.json(
      { message: "요청 본문이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  const paymentKey = body.paymentKey?.trim();
  const orderId = body.orderId?.trim();
  const amount = Number(body.amount);

  if (!paymentKey || !orderId || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { message: "결제 승인 정보가 올바르지 않습니다." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${getBackendUrl()}/api/v1/payments/toss/confirm`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const data: unknown = await response.json().catch(() => ({}));

    if (!response.ok) {
      const err = data as { message?: string; code?: string };
      return NextResponse.json(
        {
          message: err.message ?? "결제 승인에 실패했습니다.",
          code: err.code,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to proxy payment confirm:", error);
    return NextResponse.json(
      { message: "결제 승인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
