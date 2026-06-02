import { getAccessToken } from "@/entities/session";
import type { PaymentFailRequest } from "@/features/payment/model/types";

export async function failPayment(request: PaymentFailRequest): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    return;
  }

  const res = await fetch("/api/payments/fail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "결제 실패 처리에 실패했습니다.");
  }
}
