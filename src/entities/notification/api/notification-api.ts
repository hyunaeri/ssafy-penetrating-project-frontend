import {
  fetchEventSource,
  type EventSourceMessage,
} from "@microsoft/fetch-event-source";
import { getAccessToken } from "@/entities/session";
import type {
  NotificationResponse,
  NotificationType,
} from "@/entities/notification/model/types";
import { getApiBaseUrl } from "@/shared/api";

const NOTIFICATION_TYPES: NotificationType[] = [
  "ORDER_STATUS",
  "ACHIEVEMENT",
  "COUPON",
  "RANKING",
  "SYSTEM",
];

function isNotificationLike(value: unknown): value is NotificationResponse {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<NotificationResponse>;
  return (
    typeof item.id === "number" &&
    typeof item.title === "string" &&
    typeof item.message === "string" &&
    typeof item.isRead === "boolean" &&
    typeof item.createdAt === "string" &&
    typeof item.type === "string" &&
    NOTIFICATION_TYPES.includes(item.type as NotificationType)
  );
}

function parseNotificationsResponse(data: unknown): NotificationResponse[] {
  if (Array.isArray(data)) {
    return data.filter(isNotificationLike);
  }

  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;
    for (const key of ["content", "items", "data", "notifications"]) {
      const nested = record[key];
      if (Array.isArray(nested)) {
        return nested.filter(isNotificationLike);
      }
    }
  }

  return [];
}

/** 로그인 사용자의 알림 히스토리 조회 */
export async function fetchNotifications(): Promise<NotificationResponse[]> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch(`${getApiBaseUrl()}/api/notifications`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as { message?: string };
    throw new Error(err.message ?? "알림을 불러오지 못했습니다.");
  }

  return parseNotificationsResponse(data);
}

/** 특정 알림 읽음 처리 */
export async function markNotificationAsRead(
  notificationId: number
): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch(
    `${getApiBaseUrl()}/api/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message ?? "알림 읽음 처리에 실패했습니다.");
  }
}

/** 전체 알림 읽음 처리 */
export async function markAllNotificationsAsRead(): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch(`${getApiBaseUrl()}/api/notifications/read-all`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message ?? "알림 읽음 처리에 실패했습니다.");
  }
}

type SubscribeOptions = {
  onNotification: (notification: NotificationResponse) => void;
  onConnect?: () => void;
  onError?: (error: unknown) => void;
};

const SSE_CONNECT_EVENT = "connect";
const SSE_NOTIFICATION_EVENT = "notification";

/** 재시도하면 안 되는 치명적 SSE 오류 (인증 실패 등). */
class FatalSseError extends Error {}

/**
 * 실시간 알림 SSE 구독.
 *
 * `@microsoft/fetch-event-source`로 Authorization 헤더를 실어 SSE를 구독한다.
 * 일시적 오류는 라이브러리 기본 재시도에 맡기고, 인증 실패 등 4xx는 재시도를 중단한다.
 * 반환된 함수를 호출하면 연결을 종료한다.
 */
export function subscribeNotifications(options: SubscribeOptions): () => void {
  const token = getAccessToken();
  if (!token) {
    return () => {};
  }

  const controller = new AbortController();

  void fetchEventSource(`${getApiBaseUrl()}/api/notifications/subscribe`, {
    headers: {
      Accept: "text/event-stream",
      Authorization: `Bearer ${token}`,
    },
    signal: controller.signal,
    // 백그라운드 탭에서도 연결을 유지한다.
    openWhenHidden: true,

    async onopen(response) {
      const contentType = response.headers.get("content-type") ?? "";

      if (response.ok && contentType.includes("text/event-stream")) {
        return;
      }

      // 4xx(인증 실패 등)는 재시도해도 의미가 없으므로 중단한다.
      if (response.status >= 400 && response.status < 500) {
        throw new FatalSseError(`SSE 연결 실패 (status: ${response.status})`);
      }

      throw new Error(`SSE 연결 실패 (status: ${response.status})`);
    },

    onmessage(msg: EventSourceMessage) {
      if (msg.event === SSE_CONNECT_EVENT) {
        options.onConnect?.();
        return;
      }

      if (msg.event !== SSE_NOTIFICATION_EVENT || !msg.data) {
        return;
      }

      try {
        const parsed: unknown = JSON.parse(msg.data);
        if (isNotificationLike(parsed)) {
          options.onNotification(parsed);
        }
      } catch {
        /* SSE 데이터 파싱 실패 시 무시 */
      }
    },

    onerror(error) {
      // 치명적 오류는 다시 throw해 라이브러리 재시도를 멈춘다.
      if (error instanceof FatalSseError) {
        options.onError?.(error);
        throw error;
      }

      // 그 외 일시적 오류는 알리고, 라이브러리 기본 재시도에 맡긴다(undefined 반환).
      options.onError?.(error);
    },
  }).catch((error) => {
    // 치명적 오류로 종료된 경우. abort로 인한 종료는 무시한다.
    if (!controller.signal.aborted) {
      options.onError?.(error);
    }
  });

  return () => {
    controller.abort();
  };
}
