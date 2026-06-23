"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "@/entities/notification";
import { useAccessToken } from "@/entities/session";
import { NOTIFICATIONS_QUERY_KEY } from "@/features/notification/lib/query-keys";

/** 헤더 뱃지용 — 전체 목록 분류 없이 unread count만 구독 */
export function useUnreadNotificationCount() {
  const accessToken = useAccessToken();

  const query = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: fetchNotifications,
    enabled: Boolean(accessToken),
    select: (notifications) =>
      notifications.filter((notification) => !notification.isRead).length,
    staleTime: 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    unreadCount: query.data ?? 0,
    loading: query.isLoading,
  };
}
