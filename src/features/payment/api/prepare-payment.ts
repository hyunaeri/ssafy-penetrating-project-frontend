import { getAccessToken } from "@/entities/session";
import type {
  PaymentPrepareRequest,
  PaymentPrepareResponse,
} from "@/features/payment/model/types";

export async function preparePayment(
  request: PaymentPrepareRequest
): Promise<PaymentPrepareResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as { message?: string };
    throw new Error(err.message ?? "주문 생성에 실패했습니다.");
  }

  return data as PaymentPrepareResponse;
}
