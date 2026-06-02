"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCartOrderSummary } from "@/entities/cart";
import type { CartOrderType } from "@/entities/cart/lib/parse-cart-response";
import { useCart } from "@/features/cart/hooks/use-cart";
import { getCheckoutOrderType } from "@/features/payment/lib/payment-checkout-session";
import { useRequestTossPayment } from "@/features/payment/hooks/use-request-toss-payment";
import type { PaymentMethod } from "@/features/payment/model/types";
import { formatWon } from "@/features/category-stores/lib/format-store-display";
import { isPaymentUserCancel } from "@/features/payment/lib/is-payment-user-cancel";
import { notifyError, PrimaryButton } from "@/shared/ui";

const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "CARD", label: "카드" },
  { id: "TRANSFER", label: "계좌이체" },
];

export function PaymentCheckoutScreen() {
  const { cart, loading, error, reload } = useCart();
  const [orderType] = useState<CartOrderType>(() => getCheckoutOrderType());
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("CARD");

  const order = useMemo(
    () => (cart ? getCartOrderSummary(cart, orderType) : null),
    [cart, orderType]
  );

  const { sdkReady, sdkError, paying, requestPayment } = useRequestTossPayment({
    storeId: cart?.storeId ?? 0,
    orderType,
  });

  useEffect(() => {
    if (!loading && cart && cart.items.length === 0) {
      window.location.replace("/cart");
    }
  }, [cart, loading]);

  if (loading) {
    return (
      <p className="px-4 py-16 text-center text-[14px] text-muted">
        결제 정보를 불러오는 중입니다
      </p>
    );
  }

  if (error || !cart || !order) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <p className="text-[14px] text-red-600">
          {error ?? "결제 정보를 불러오지 못했습니다."}
        </p>
        <PrimaryButton
          type="button"
          variant="outline"
          className="max-w-[200px]"
          onClick={() => void reload()}
        >
          다시 시도
        </PrimaryButton>
      </div>
    );
  }

  if (!order.meetsMinOrder) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <p className="text-[15px] font-semibold text-ink">
          최소주문금액을 충족하지 못했어요
        </p>
        <p className="text-[14px] text-muted">
          장바구니에서 메뉴를 더 담은 뒤 다시 시도해 주세요.
        </p>
        <Link href="/cart" className="brand-cta h-11 max-w-[200px] px-6">
          장바구니로
        </Link>
      </div>
    );
  }

  const handlePay = async () => {
    if (!sdkReady) {
      notifyError("결제 준비 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    if (!cart.storeId) {
      notifyError("주문 매장 정보가 올바르지 않습니다.");
      return;
    }

    try {
      await requestPayment(selectedMethod);
    } catch (err) {
      if (isPaymentUserCancel(err)) {
        notifyError("결제가 취소되었습니다.");
        return;
      }
      notifyError(err instanceof Error ? err.message : "결제 요청에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-5 pb-28">
      <section className="soft-card p-4">
        <h2 className="text-[15px] font-bold text-ink">주문 정보</h2>
        <p className="mt-2 text-[14px] font-semibold text-ink">
          {cart.storeName?.trim() ?? "매장"}
        </p>
        <ul className="mt-3 space-y-1.5 text-[13px] text-muted">
          {cart.items.map((line) => (
            <li key={line.id} className="flex justify-between gap-2">
              <span className="min-w-0 truncate">
                {line.menuName} × {line.quantity}
              </span>
              <span className="shrink-0 text-ink">
                {formatWon(line.unitPrice * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2 border-t border-line/80 pt-3 text-[14px]">
          <div className="flex justify-between text-muted">
            <span>메뉴 금액</span>
            <span>{formatWon(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>배달팁</span>
            <span>
              {orderType === "pickup"
                ? "픽업 시 0원"
                : order.deliveryFee === 0
                  ? "무료"
                  : formatWon(order.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between text-[16px] font-bold text-ink">
            <span>결제 예정 금액</span>
            <span className="text-brand-dark">{formatWon(order.total)}</span>
          </div>
        </div>
      </section>

      <section className="soft-card p-4">
        <h2 className="text-[15px] font-bold text-ink">결제 수단</h2>
        <div className="mt-3 flex gap-2">
          {PAYMENT_METHODS.map((method) => {
            const selected = selectedMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                className={`flex-1 rounded-2xl border px-3 py-3 text-[14px] font-semibold transition-colors ${
                  selected
                    ? "border-brand bg-brand-soft text-brand-dark"
                    : "border-line bg-white text-muted"
                }`}
              >
                {method.label}
              </button>
            );
          })}
        </div>
        {sdkError && (
          <p className="mt-3 text-[13px] text-red-600">{sdkError}</p>
        )}
      </section>

      <div className="fixed bottom-[64px] left-0 right-0 z-20 mx-auto w-full max-w-mobile border-t border-line/80 bg-white px-4 py-3.5 shadow-[0_-8px_32px_rgba(43,45,66,0.12)]">
        <button
          type="button"
          disabled={!sdkReady || paying}
          onClick={() => void handlePay()}
          className="brand-cta h-[52px] w-full text-[16px] font-bold disabled:opacity-60"
        >
          {paying ? "결제창 여는 중…" : `${formatWon(order.total)} 결제하기`}
        </button>
      </div>
    </div>
  );
}
