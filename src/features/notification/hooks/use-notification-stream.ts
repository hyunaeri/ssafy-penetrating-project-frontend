"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subscribeNotifications } from "@/entities/notification";
import { getCurrentUser, isOwnerRole } from "@/entities/user";
import { NOTIFICATIONS_QUERY_KEY } from "@/features/notification/lib/query-keys";
import { notifyNotificationOnce } from "@/features/notification/lib/notify-notification";
import { shouldSkipSseOrderNotification } from "@/features/notification/lib/should-skip-sse-order-notification";
import { shouldStopNotificationStream } from "@/features/notification/lib/should-stop-notification-stream";
import { upsertNotificationInCache } from "@/features/notification/lib/upsert-notification-in-cache";
import { useNotificationStreamStore } from "@/features/notification/store/notification-stream-store";

/**
 * - 사장: 로그인 중 항상 SSE 구독 (신규 주문·상태 알림)
 * - 고객: 진행 중인 주문이 있을 때만 SSE 구독
 */
export function useNotificationStream() {
  const queryClient = useQueryClient();
  const activeOrderId = useNotificationStreamStore((state) => state.activeOrderId);
  const stopStream = useNotificationStreamStore((state) => state.stopStream);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    void getCurrentUser()
      .then((user) => {
        if (!cancelled) {
          setIsOwner(isOwnerRole(user.role));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsOwner(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const shouldSubscribe =
    isOwner === true || (isOwner === false && activeOrderId != null);

  useEffect(() => {
    if (!shouldSubscribe || isOwner == null) {
      return;
    }

    const unsubscribe = subscribeNotifications({
      onNotification: (notification) => {
        if (!isOwner && shouldSkipSseOrderNotification(notification)) {
          return;
        }

        notifyNotificationOnce(notification);
        upsertNotificationInCache(queryClient, notification);
        void queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_QUERY_KEY,
        });

        if (!isOwner && shouldStopNotificationStream(notification)) {
          stopStream();
        }
      },
    });

    return () => {
      unsubscribe();
    };
  }, [activeOrderId, isOwner, queryClient, shouldSubscribe, stopStream]);
}
