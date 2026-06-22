"use client";

import { useEffect } from "react";
import { fetchMyOrders } from "@/entities/order";
import { getAccessToken } from "@/entities/session";
import { getCurrentUser, isOwnerRole } from "@/entities/user";
import { isActiveOrderStatus } from "@/features/notification/lib/is-active-order-status";
import { useNotificationStreamStore } from "@/features/notification/store/notification-stream-store";

/**
 * 고객 주문 추적용 SSE 상태 복구.
 * 사장 계정은 진행 중인 단일 주문 추적을 하지 않으므로 스킵한다.
 */
export function useNotificationStreamRecovery() {
  const activeOrderId = useNotificationStreamStore((state) => state.activeOrderId);
  const stopStream = useNotificationStreamStore((state) => state.stopStream);

  useEffect(() => {
    if (activeOrderId == null || !getAccessToken()) {
      return;
    }

    let cancelled = false;
    let stopTimeoutId: ReturnType<typeof setTimeout> | undefined;

    void getCurrentUser()
      .then(async (user) => {
        if (cancelled || isOwnerRole(user.role)) {
          return;
        }

        const orders = await fetchMyOrders();
        if (cancelled) return;

        const order = orders.find((item) => item.id === activeOrderId);
        if (!order) {
          stopStream();
          return;
        }

        if (!isActiveOrderStatus(order.status)) {
          // 취소·완료 SSE 토스트를 받을 시간을 잠시 확보한다.
          stopTimeoutId = window.setTimeout(() => {
            if (!cancelled) {
              stopStream();
            }
          }, 5_000);
        }
      })
      .catch(() => {
        /* 조회 실패 시 진행 중 주문일 수 있으므로 SSE는 유지 */
      });

    return () => {
      cancelled = true;
      if (stopTimeoutId != null) {
        window.clearTimeout(stopTimeoutId);
      }
    };
  }, [activeOrderId, stopStream]);
}
