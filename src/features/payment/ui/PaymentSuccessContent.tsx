"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  showOrderNotificationAfterPayment,
  startNotificationStream,
} from "@/features/notification";
import { OrderTrackingLoadingScreen } from "@/features/order-tracking/ui/OrderTrackingLoadingScreen";
import { getOrderTrackingPath } from "@/features/orders/lib/order-status-flow";
import { confirmPayment } from "@/features/payment/api/confirm-payment";
import { clearCheckoutOrderType } from "@/features/payment/lib/payment-checkout-session";
import {
  clearPendingPayment,
  getPendingPayment,
} from "@/features/payment/lib/payment-session";
import { useAppRouter } from "@/shared/lib/use-app-router";

type ConfirmState =
  | { status: "loading" }
  | { status: "success"; paymentOrderId: number }
  | { status: "error"; message: string };

export function PaymentSuccessContent() {
  const router = useAppRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<ConfirmState>({ status: "loading" });
  const confirmKeyRef = useRef<string | null>(null);
  const redirectedRef = useRef(false);

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
        const paymentOrderId = pending?.paymentOrderId ?? 0;
        if (paymentOrderId > 0) {
          startNotificationStream(paymentOrderId);
        }
        showOrderNotificationAfterPayment(pending);
        clearPendingPayment();
        clearCheckoutOrderType();
        setState({ status: "success", paymentOrderId });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "결제 승인에 실패했습니다.";
        setState({ status: "error", message });
      }
    };

    void run();
  }, [searchParams]);

  useEffect(() => {
    if (
      state.status !== "success" ||
      state.paymentOrderId <= 0 ||
      redirectedRef.current
    ) {
      return;
    }

    redirectedRef.current = true;
    router.replace(getOrderTrackingPath(state.paymentOrderId));
  }, [router, state]);

  if (state.status === "loading" || state.status === "success") {
    return <OrderTrackingLoadingScreen />;
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 bg-surface px-6 py-16 text-center">
      <p className="text-[16px] font-bold text-ink">결제를 완료하지 못했어요</p>
      <p className="text-[14px] text-muted">{state.message}</p>
      <Link href="/cart" className="brand-cta h-11 max-w-[200px] px-6">
        장바구니로
      </Link>
    </div>
  );
}
