"use client";

import { useCallback, useEffect, useState } from "react";
import { getCurrentUser } from "@/entities/user";
import { generateOrderId } from "@/features/payment/lib/generate-order-id";
import { preparePayment } from "@/features/payment/api/prepare-payment";
import {
  getTossClientKey,
  loadTossPaymentsSdk,
} from "@/features/payment/lib/load-toss-payments";
import { savePendingPayment } from "@/features/payment/lib/payment-session";
import type { PaymentMethod } from "@/features/payment/model/types";
import type { CartOrderType } from "@/entities/cart/lib/parse-cart-response";

type UseRequestTossPaymentParams = {
  storeId: number;
  storeName: string;
  menuSummary: string;
  orderType: CartOrderType;
};

export function useRequestTossPayment({
  storeId,
  storeName,
  menuSummary,
  orderType,
}: UseRequestTossPaymentParams) {
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadTossPaymentsSdk()
      .then(() => {
        if (!cancelled) {
          setSdkReady(true);
          setSdkError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setSdkError(
            err instanceof Error ? err.message : "결제 SDK를 불러오지 못했습니다."
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const requestPayment = useCallback(
    async (method: PaymentMethod) => {
      if (!window.TossPayments) {
        throw new Error("결제 SDK가 준비되지 않았습니다.");
      }

      setPaying(true);

      try {
        const prepared = await preparePayment({
          storeId,
          couponId: null,
        });
        const origin = window.location.origin;

        savePendingPayment({
          paymentOrderId: prepared.orderId,
          orderId: prepared.tossOrderId,
          amount: prepared.amount,
          orderName: prepared.orderName,
          storeName: storeName.trim() || "매장",
          menuSummary: menuSummary.trim() || "주문",
          orderType,
        });

        let customerKey = `guest_${generateOrderId()}`;
        try {
          const user = await getCurrentUser();
          customerKey = `user_${user.id}`;
        } catch {
          /* 비로그인/조회 실패 시 guest 키 사용 */
        }

        const tossPayments = window.TossPayments(getTossClientKey());
        const payment = tossPayments.payment({ customerKey });

        const base = {
          amount: { currency: "KRW", value: prepared.amount },
          orderId: prepared.tossOrderId,
          orderName: prepared.orderName,
          successUrl: `${origin}/payment/success`,
          failUrl: `${origin}/payment/fail`,
        };

        if (method === "CARD") {
          await payment.requestPayment({
            method: "CARD",
            ...base,
            card: {
              useEscrow: false,
              flowMode: "DEFAULT",
            },
          });
          return;
        }

        await payment.requestPayment({
          method: "TRANSFER",
          ...base,
          transfer: {
            cashReceipt: { type: "소득공제" },
            useEscrow: false,
          },
        });
      } finally {
        setPaying(false);
      }
    },
    [menuSummary, orderType, storeId, storeName]
  );

  return {
    sdkReady,
    sdkError,
    paying,
    requestPayment,
  };
}
