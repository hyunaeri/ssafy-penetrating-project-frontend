"use client";

import Link from "next/link";
import { useEffect } from "react";
import { startNotificationStream } from "@/features/notification";
import { useOrderTracking } from "@/features/order-tracking/hooks/use-order-tracking";
import { OrderTrackingLoadingScreen } from "@/features/order-tracking/ui/OrderTrackingLoadingScreen";
import { OrderTrackingScreen } from "@/features/order-tracking/ui/OrderTrackingScreen";
import {
  getOrderMenuSummary,
  isOrderTrackable,
} from "@/features/orders/lib/order-status-flow";

type OrderTrackingByIdScreenProps = {
  orderId: number;
};

export function OrderTrackingByIdScreen({ orderId }: OrderTrackingByIdScreenProps) {
  const { data: order, isLoading, isError } = useOrderTracking(orderId);

  useEffect(() => {
    if (order && isOrderTrackable(order.status)) {
      startNotificationStream(order.id);
    }
  }, [order]);

  if (isLoading) {
    return <OrderTrackingLoadingScreen />;
  }

  if (isError || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 py-16 text-center">
        <p className="text-[16px] font-bold text-ink">
          주문 정보를 불러오지 못했어요
        </p>
        <p className="text-[14px] text-muted">
          잠시 후 다시 시도하거나 주문 내역에서 확인해 주세요.
        </p>
        <Link href="/orders" className="brand-cta h-11 max-w-[200px] px-6">
          주문 내역으로
        </Link>
      </div>
    );
  }

  return (
    <OrderTrackingScreen
      paymentOrderId={order.id}
      amount={order.finalPrice}
      storeName={order.storeName?.trim() || `매장 #${order.storeId}`}
      menuSummary={getOrderMenuSummary(order)}
      orderType="delivery"
      closeHref="/orders"
    />
  );
}
