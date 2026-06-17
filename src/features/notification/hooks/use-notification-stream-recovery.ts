"use client";

import { useEffect } from "react";
import { fetchMyOrders } from "@/entities/order";
import { getAccessToken } from "@/entities/session";
import { isActiveOrderStatus } from "@/features/notification/lib/is-active-order-status";
import { useNotificationStreamStore } from "@/features/notification/store/notification-stream-store";

/**
 * 새로고침 등으로 SSE 상태가 sessionStorage에 남아 있을 때,
 * 해당 주문이 아직 진행 중인지 확인하고 완료·취소됐으면 구독을 정리한다.
 */
export function useNotificationStreamRecovery() {
  const activeOrderId = useNotificationStreamStore((state) => state.activeOrderId);
  const stopStream = useNotificationStreamStore((state) => state.stopStream);

  useEffect(() => {
    if (activeOrderId == null || !getAccessToken()) return;

    let cancelled = false;

    void fetchMyOrders()
      .then((orders) => {
        if (cancelled) return;
        const order = orders.find((item) => item.id === activeOrderId);
        if (!order || !isActiveOrderStatus(order.status)) {
          stopStream();
        }
      })
      .catch(() => {
        /* 조회 실패 시 진행 중 주문일 수 있으므로 SSE는 유지 */
      });

    return () => {
      cancelled = true;
    };
  }, [activeOrderId, stopStream]);
}
