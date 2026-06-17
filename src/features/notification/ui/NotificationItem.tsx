"use client";

import type { NotificationResponse } from "@/entities/notification";
import { formatNotificationTime } from "@/features/notification/lib/format-notification";
import { NotificationContent } from "@/features/notification/ui/NotificationContent";

type NotificationItemProps = {
  notification: NotificationResponse;
  onClick?: (notification: NotificationResponse) => void;
};

export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const { isRead, type, title, message, createdAt } = notification;
  const timeLabel = formatNotificationTime(createdAt);

  const content = (
    <NotificationContent
      type={type}
      title={title}
      message={message}
      timeLabel={timeLabel}
      showUnreadDot={!isRead}
      muted={isRead}
      variant="card"
    />
  );

  if (isRead) {
    return (
      <article className="rounded-2xl border border-line/60 bg-white px-4 py-3.5">
        <div className="flex items-start gap-3">{content}</div>
      </article>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onClick?.(notification)}
      className="relative w-full overflow-hidden rounded-2xl border border-line/80 bg-white px-4 py-3.5 text-left shadow-[0_6px_24px_rgba(43,45,66,0.08)] ring-1 ring-black/[0.03] transition-all active:scale-[0.995]"
    >
      <span
        className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-brand"
        aria-hidden
      />
      <div className="flex items-start gap-3 pl-1">{content}</div>
    </button>
  );
}
