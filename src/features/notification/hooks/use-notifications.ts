"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationResponse,
} from "@/entities/notification";
import { getAccessToken } from "@/entities/session";
import { NOTIFICATIONS_QUERY_KEY } from "@/features/notification/lib/query-keys";

export function useNotifications(enabled: boolean = true) {
  const queryClient = useQueryClient();

  const query = useQuery<NotificationResponse[], Error>({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: fetchNotifications,
    enabled: enabled && Boolean(getAccessToken()),
  });

  const notifications = useMemo(() => query.data ?? [], [query.data]);

  const { unread, read } = useMemo(() => {
    const unreadList: NotificationResponse[] = [];
    const readList: NotificationResponse[] = [];
    for (const item of notifications) {
      if (item.isRead) {
        readList.push(item);
      } else {
        unreadList.push(item);
      }
    }
    return { unread: unreadList, read: readList };
  }, [notifications]);

  const markAsRead = useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationAsRead(notificationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  return {
    notifications,
    unread,
    read,
    unreadCount: unread.length,
    loading: query.isLoading,
    error: query.isError ? query.error.message : null,
    reload: query.refetch,
    markAsRead: (id: number) => markAsRead.mutate(id),
    markAllAsRead: () => markAllAsRead.mutate(),
    markingAll: markAllAsRead.isPending,
  };
}
