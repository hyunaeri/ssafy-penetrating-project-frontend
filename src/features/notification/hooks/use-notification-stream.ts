"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subscribeNotifications } from "@/entities/notification";
import { useAccessToken, useSessionUser } from "@/entities/session";
import { isOwnerRole } from "@/entities/user";
import { NOTIFICATIONS_QUERY_KEY } from "@/features/notification/lib/query-keys";
import { notifyNotificationOnce } from "@/features/notification/lib/notify-notification";
import { shouldSkipSseOrderNotification } from "@/features/notification/lib/should-skip-sse-order-notification";
import { shouldStopNotificationStream } from "@/features/notification/lib/should-stop-notification-stream";
import { upsertNotificationInCache } from "@/features/notification/lib/upsert-notification-in-cache";
import { patchOrderStatusFromNotification } from "@/features/notification/lib/patch-order-status-from-notification";
import { useNotificationStreamStore } from "@/features/notification/store/notification-stream-store";
import { OWNER_ORDERS_QUERY_KEY } from "@/features/owner-orders/lib/owner-orders-query-key";

/**
 * - 사장: 로그인 중 항상 SSE 구독 (신규 주문·상태 알림)
 * - 고객: 진행 중인 주문이 있을 때만 SSE 구독
 */
export function useNotificationStream() {
  const queryClient = useQueryClient();
  const accessToken = useAccessToken();
  const user = useSessionUser();
  const activeOrderId = useNotificationStreamStore((state) => state.activeOrderId);
  const stopStream = useNotificationStreamStore((state) => state.stopStream);

  const isOwner = user != null && isOwnerRole(user.role);
  const shouldSubscribe =
    Boolean(accessToken) &&
    user != null &&
    (isOwner || activeOrderId != null);

  useEffect(() => {
    if (!shouldSubscribe) {
      return;
    }

    const unsubscribe = subscribeNotifications({
      onConnect: () => {
        void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
        if (isOwner) {
          void queryClient.refetchQueries({
            queryKey: OWNER_ORDERS_QUERY_KEY,
            type: "active",
          });
        }
      },
      onNotification: (notification) => {
        if (notification.type === "ORDER_STATUS") {
          patchOrderStatusFromNotification(queryClient, notification, {
            fallbackOrderId: activeOrderId,
            invalidateOwnerOrders: isOwner,
          });
        }

        if (!isOwner && shouldSkipSseOrderNotification(notification)) {
          return;
        }

        notifyNotificationOnce(notification);
        upsertNotificationInCache(queryClient, notification);

        if (!isOwner && shouldStopNotificationStream(notification)) {
          stopStream();
        }
      },
    });

    return () => {
      unsubscribe();
    };
  }, [
    accessToken,
    activeOrderId,
    isOwner,
    queryClient,
    shouldSubscribe,
    stopStream,
    user,
  ]);
}
