"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { failPayment } from "@/features/payment/api/fail-payment";
import { clearPendingPayment } from "@/features/payment/lib/payment-session";

export function PaymentFailContent() {
  const searchParams = useSearchParams();
  const reportKeyRef = useRef<string | null>(null);
  const code = searchParams.get("code");
  const message =
    searchParams.get("message") ?? "결제가 취소되었거나 실패했습니다.";
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const reportKey = `${orderId ?? ""}:${code ?? ""}:${message}`;
    if (reportKeyRef.current === reportKey) {
      return;
    }
    reportKeyRef.current = reportKey;

    if (orderId && code) {
      void failPayment({
        orderId,
        code,
        message,
      }).catch(() => {
        // 결제 실패 화면은 유지하고, 백엔드 보고 실패는 사용자 흐름을 막지 않는다.
      });
    }
    clearPendingPayment();
  }, [code, message, orderId]);

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-warm text-[28px]">
        !
      </span>
      <div>
        <h2 className="text-[18px] font-bold text-ink">결제에 실패했어요</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{message}</p>
        {code && (
          <p className="mt-1 text-[12px] text-muted/80">코드: {code}</p>
        )}
      </div>
      <div className="flex w-full max-w-[280px] flex-col gap-2">
        <Link href="/payment/checkout" className="brand-cta h-11 w-full px-6">
          다시 결제하기
        </Link>
        <Link
          href="/cart"
          className="flex h-11 w-full items-center justify-center rounded-button border border-line bg-white text-[15px] font-semibold text-ink"
        >
          장바구니로
        </Link>
      </div>
    </div>
  );
}
