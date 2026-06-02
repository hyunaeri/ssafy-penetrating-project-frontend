import type {
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  TossPaymentError,
} from "@/features/payment/model/types";
import { getAccessToken } from "@/entities/session";

/** 동일 결제에 대한 중복 승인 요청(React Strict Mode 등)을 하나의 요청으로 묶음 */
const inflightConfirm = new Map<string, Promise<ConfirmPaymentResponse>>();

const IDEMPOTENT_CONFIRM_CODES = new Set([
  "ALREADY_PROCESSED_PAYMENT",
  "ALREADY_COMPLETED_PAYMENT",
  "DUPLICATED_REQUEST",
]);

function isIdempotentConfirmError(err: TossPaymentError): boolean {
  if (err.code && IDEMPOTENT_CONFIRM_CODES.has(err.code)) {
    return true;
  }
  const message = err.message ?? "";
  return (
    message.includes("이미 처리") ||
    message.includes("이미 완료") ||
    message.includes("처리중인 요청") ||
    message.includes("결제 대기 상태가 아닙니다")
  );
}

async function postConfirm(
  request: ConfirmPaymentRequest
): Promise<ConfirmPaymentResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch("/api/payments/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const data: unknown = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = data as TossPaymentError;
    if (isIdempotentConfirmError(err)) {
      return (data as ConfirmPaymentResponse) ?? {};
    }
    throw new Error(err.message ?? "결제 승인에 실패했습니다.");
  }

  return data as ConfirmPaymentResponse;
}

export function confirmPayment(
  request: ConfirmPaymentRequest
): Promise<ConfirmPaymentResponse> {
  const key = `${request.paymentKey}:${request.orderId}`;
  const existing = inflightConfirm.get(key);
  if (existing) {
    return existing;
  }

  const promise = postConfirm(request).finally(() => {
    inflightConfirm.delete(key);
  });
  inflightConfirm.set(key, promise);
  return promise;
}
