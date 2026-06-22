import type { NotificationType } from "@/entities/notification";
import { resolveNotificationDisplay } from "@/features/notification/lib/format-notification";
import { NotificationTypeIcon } from "@/features/notification/ui/NotificationTypeIcon";

type NotificationContentProps = {
  type: NotificationType;
  title: string;
  message: string;
  storeName?: string | null;
  timeLabel?: string;
  showUnreadDot?: boolean;
  muted?: boolean;
  variant?: "card" | "toast";
};

export function NotificationContent({
  type,
  title,
  message,
  storeName: storeNameFromApi,
  timeLabel,
  showUnreadDot = false,
  muted = false,
  variant = "card",
}: NotificationContentProps) {
  const isToast = variant === "toast";
  const { headline, storeName, body } = resolveNotificationDisplay(
    type,
    title,
    message,
    storeNameFromApi
  );

  return (
    <>
      <NotificationTypeIcon type={type} size={isToast ? "sm" : "md"} />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <p
            className={`min-w-0 flex-1 leading-snug ${
              isToast ? "truncate text-[13px]" : "text-[14px]"
            } ${
              body
                ? "font-bold text-ink"
                : muted
                  ? "font-normal text-muted"
                  : "font-medium text-ink/90"
            }`}
          >
            {headline}
          </p>
          {timeLabel && (
            <span className="mt-0.5 flex shrink-0 items-center gap-2">
              <span className="text-[11px] text-muted/60">{timeLabel}</span>
              {showUnreadDot && (
                <span
                  className="h-1.5 w-1.5 rounded-full bg-brand"
                  aria-label="읽지 않음"
                />
              )}
            </span>
          )}
        </div>

        {body && (
          <p
            className={`mt-1 leading-relaxed text-ink/85 ${
              isToast ? "line-clamp-2 text-[12px]" : "line-clamp-2 text-[13px]"
            } ${muted ? "text-muted/80" : ""}`}
          >
            {body}
          </p>
        )}

        {storeName && (
          <p
            className={`${body ? "mt-1.5" : "mt-1"} text-muted/75 ${
              isToast ? "text-[11px]" : "text-[12px]"
            }`}
          >
            {storeName}
          </p>
        )}
      </div>
    </>
  );
}
