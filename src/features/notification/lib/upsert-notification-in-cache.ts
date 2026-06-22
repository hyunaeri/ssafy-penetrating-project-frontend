import type { QueryClient } from "@tanstack/react-query";
import type { NotificationResponse } from "@/entities/notification";
import { NOTIFICATIONS_QUERY_KEY } from "@/features/notification/lib/query-keys";

/** SSE로 받은 알림을 목록 캐시에 즉시 반영한다. */
export function upsertNotificationInCache(
  queryClient: QueryClient,
  notification: NotificationResponse
) {
  queryClient.setQueryData<NotificationResponse[]>(
    NOTIFICATIONS_QUERY_KEY,
    (current) => {
      const list = current ?? [];
      const index = list.findIndex((item) => item.id === notification.id);
      if (index >= 0) {
        const next = [...list];
        next[index] = notification;
        return next;
      }
      return [notification, ...list];
    }
  );
}
