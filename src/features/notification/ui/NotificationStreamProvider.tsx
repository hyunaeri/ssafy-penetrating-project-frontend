"use client";

import { useEffect } from "react";
import { useNotificationStream } from "@/features/notification/hooks/use-notification-stream";
import { useNotificationStreamRecovery } from "@/features/notification/hooks/use-notification-stream-recovery";
import { useNotificationStreamStore } from "@/features/notification/store/notification-stream-store";

/**
 * 진행 중인 주문이 있을 때만 실시간 알림 SSE를 구독한다.
 * 결제 완료 시 `startNotificationStream`으로 활성화하고,
 * 승인·배달·완료 등 이후 상태 변경만 SSE로 받는다.
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
