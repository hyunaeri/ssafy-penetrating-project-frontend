"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  showOrderNotificationAfterPayment,
  startNotificationStream,
} from "@/features/notification";
import { confirmPayment } from "@/features/payment/api/confirm-payment";
import { clearCheckoutOrderType } from "@/features/payment/lib/payment-checkout-session";
import {
  clearPendingPayment,
  getPendingPayment,
} from "@/features/payment/lib/payment-session";
import { formatWon } from "@/features/category-stores/lib/format-store-display";

type ConfirmState =
  | { status: "loading" }
  | { status: "success"; amount: number; orderId: string }
  | { status: "error"; message: string };

export function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<ConfirmState>({ status: "loading" });
  const confirmKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amountParam = searchParams.get("amount");

    if (!paymentKey || !orderId || !amountParam) {
      setState({
        status: "error",
        message: "결제 정보가 올바르지 않습니다.",
      });
      return;
    }

    const amount = Number(amountParam);
    if (!Number.isFinite(amount)) {
      setState({ status: "error", message: "결제 금액이 올바르지 않습니다." });
      return;
    }

    const pending = getPendingPayment();
    if (
      pending &&
      (pending.orderId !== orderId || pending.amount !== amount)
    ) {
      setState({
        status: "error",
        message: "주문 정보가 일치하지 않습니다. 장바구니에서 다시 시도해 주세요.",
      });
      return;
    }

    const confirmKey = `${paymentKey}:${orderId}`;
    if (confirmKeyRef.current === confirmKey) {
      return;
    }
    confirmKeyRef.current = confirmKey;

    const run = async () => {
      try {
        await confirmPayment({ paymentKey, orderId, amount });
        if (pending?.paymentOrderId) {
          startNotificationStream(pending.paymentOrderId);
        }
        showOrderNotificationAfterPayment(pending);
        clearPendingPayment();
        clearCheckoutOrderType();
        setState({ status: "success", amount, orderId });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "결제 승인에 실패했습니다.";
        setState({ status: "error", message });
      }
    };

    void run();
  }, [searchParams]);

  if (state.status === "loading") {
    return (
      <p className="px-4 py-16 text-center text-[14px] text-muted">
        결제 승인 처리 중입니다
      </p>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <p className="text-[16px] font-bold text-ink">결제를 완료하지 못했어요</p>
        <p className="text-[14px] text-muted">{state.message}</p>
        <Link href="/cart" className="brand-cta h-11 max-w-[200px] px-6">
          장바구니로
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-[28px]">
        ✓
      </span>
      <div>
        <h2 className="text-[18px] font-bold text-ink">결제를 완료했어요</h2>
        <p className="mt-2 text-[14px] text-muted">
          주문번호 <span className="font-mono text-ink">{state.orderId}</span>
        </p>
        <p className="mt-1 text-[20px] font-bold text-brand-dark">
          {formatWon(state.amount)}
        </p>
      </div>
      <div className="flex w-full max-w-[280px] flex-col gap-2">
        <Link href="/orders" className="brand-cta h-11 w-full px-6">
          주문 내역 보기
        </Link>
        <Link
          href="/main"
          className="flex h-12 w-full items-center justify-center rounded-button border border-line bg-white text-[15px] font-semibold text-ink"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
