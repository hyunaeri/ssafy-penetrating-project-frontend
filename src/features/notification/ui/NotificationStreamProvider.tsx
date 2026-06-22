"use client";

import { useEffect } from "react";
import { useNotificationStream } from "@/features/notification/hooks/use-notification-stream";
import { useNotificationStreamRecovery } from "@/features/notification/hooks/use-notification-stream-recovery";
import { useNotificationStreamStore } from "@/features/notification/store/notification-stream-store";

/**
 * 실시간 알림 SSE 구독.
 * - 사장: 항상 구독
 * - 고객: 진행 중 주문(`startNotificationStream`)이 있을 때만 구독
 */
export function NotificationStreamProvider() {
  const hydrate = useNotificationStreamStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useNotificationStreamRecovery();
  useNotificationStream();

  return null;
}
