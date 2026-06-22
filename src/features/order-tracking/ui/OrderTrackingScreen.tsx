"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { CartOrderType } from "@/entities/cart/lib/parse-cart-response";
import { fetchStoreDetail } from "@/entities/store";
import { getCurrentUser } from "@/entities/user";
import { useOrderTracking } from "@/features/order-tracking/hooks/use-order-tracking";
import { OrderTrackingBottomSheet } from "@/features/order-tracking/ui/OrderTrackingBottomSheet";
import { OrderTrackingDraggableSheet } from "@/features/order-tracking/ui/OrderTrackingDraggableSheet";
import { OrderTrackingMapPlaceholder } from "@/features/order-tracking/ui/OrderTrackingMapPlaceholder";
import { useAppRouter } from "@/shared/lib/use-app-router";

const OrderTrackingMap = dynamic(
  () =>
    import("@/features/order-tracking/ui/OrderTrackingMap").then(
      (module) => module.OrderTrackingMap
    ),
  {
    ssr: false,
    loading: () => <OrderTrackingMapPlaceholder message={null} />,
  }
);

export type OrderTrackingContext = {
  paymentOrderId: number;
  amount: number;
  storeName: string;
  menuSummary: string;
  orderType: CartOrderType;
};

type OrderTrackingScreenProps = OrderTrackingContext & {
  closeHref?: string;
};

export function OrderTrackingScreen({
  paymentOrderId,
  amount,
  storeName,
  menuSummary,
  orderType,
  closeHref = "/main",
}: OrderTrackingScreenProps) {
  const router = useAppRouter();
  const reduceMotion = useReducedMotion();
  const { data: order } = useOrderTracking(paymentOrderId);
  const storeId = order?.storeId;
  const { data: storeDetail } = useQuery({
    queryKey: ["stores", "detail", storeId],
    queryFn: () => fetchStoreDetail(storeId!),
    enabled: storeId != null,
    staleTime: 60_000,
  });
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    void getCurrentUser()
      .then((user) => setAddress(user.address ?? null))
      .catch(() => setAddress(null));
  }, []);

  const status = order?.status ?? "PAID";
  const orderedAt = order?.orderedAt ?? new Date().toISOString();
  const displayAmount = order?.finalPrice ?? amount;
  const displayStoreName = order?.storeName?.trim() || storeName;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#dfe6ee]">
      {orderType === "delivery" ? (
        <OrderTrackingMap
          userAddress={address}
          storeAddress={storeDetail?.address ?? null}
        />
      ) : (
        <OrderTrackingMapPlaceholder message="픽업 주문은 지도를 제공하지 않아요" />
      )}

      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pb-3 pt-4">
        <button
          type="button"
          aria-label="닫기"
          onClick={() => router.replace(closeHref)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink shadow-soft backdrop-blur-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>

        <button
          type="button"
          className="rounded-full bg-white/95 px-4 py-2 text-[13px] font-semibold text-ink shadow-soft backdrop-blur-sm"
        >
          문의하기
        </button>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30"
        initial={reduceMotion ? false : { y: "100%" }}
        animate={{ y: 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 280, damping: 32, mass: 0.9 }
        }
      >
        <OrderTrackingDraggableSheet>
          <OrderTrackingBottomSheet
            storeName={displayStoreName}
            menuSummary={menuSummary}
            amount={displayAmount}
            orderType={orderType}
            address={address}
            status={status}
            orderedAt={orderedAt}
          />
        </OrderTrackingDraggableSheet>
      </motion.div>
    </div>
  );
}
