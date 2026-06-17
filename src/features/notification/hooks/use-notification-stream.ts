"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subscribeNotifications } from "@/entities/notification";
import { NOTIFICATIONS_QUERY_KEY } from "@/features/notification/lib/query-keys";
import { shouldSkipSseOrderNotification } from "@/features/notification/lib/should-skip-sse-order-notification";
import { shouldStopNotificationStream } from "@/features/notification/lib/should-stop-notification-stream";
import { useNotificationStreamStore } from "@/features/notification/store/notification-stream-store";
import { notifyNotificationOnce } from "@/features/notification/lib/notify-notification";

/**
 * 진행 중인 주문이 있을 때만 실시간 알림 SSE를 구독한다.
 * 결제 직후(PAID·주문 대기) 알림은 프론트 토스트로 처리하고,
 * 이후 상태(승인·배달 시작·배달 완료)만 SSE로 받는다.
 */
export function useNotificationStream() {
  const queryClient = useQueryClient();
  const activeOrderId = useNotificationStreamStore((state) => state.activeOrderId);
  const stopStream = useNotificationStreamStore((state) => state.stopStream);

  useEffect(() => {
    if (activeOrderId == null) {
      return;
    }

    const unsubscribe = subscribeNotifications({
      onNotification: (notification) => {
        if (shouldSkipSseOrderNotification(notification)) {
          return;
        }

        notifyNotificationOnce(notification);
        void queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_QUERY_KEY,
        });

        if (shouldStopNotificationStream(notification)) {
          stopStream();
        }
      },
    });

    return () => {
      unsubscribe();
    };
  }, [activeOrderId, queryClient, stopStream]);
}
