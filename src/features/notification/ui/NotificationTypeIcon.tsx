import type { NotificationType } from "@/entities/notification";
import { getNotificationTypeIconClass } from "@/features/notification/lib/format-notification";

type NotificationTypeIconProps = {
  type: NotificationType;
  size?: "sm" | "md";
};

export function NotificationTypeIcon({
  type,
  size = "md",
}: NotificationTypeIconProps) {
  const iconClass = getNotificationTypeIconClass(type);
  const boxClass =
    size === "sm" ? "h-9 w-9 rounded-xl" : "h-11 w-11 rounded-2xl";
  const glyphSize = size === "sm" ? 18 : 22;

  return (
    <span
      className={`flex shrink-0 items-center justify-center ${boxClass} ${iconClass}`}
      aria-hidden
    >
      <NotificationGlyph type={type} size={glyphSize} />
    </span>
  );
}

function NotificationGlyph({
  type,
  size,
}: {
  type: NotificationType;
  size: number;
}) {
  switch (type) {
    case "ORDER_STATUS":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="M6 6h15l-1.5 9h-12L6 6Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6 6 5 3H3" strokeLinecap="round" />
          <circle cx="9" cy="20" r="1" fill="currentColor" stroke="none" />
          <circle cx="18" cy="20" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "COUPON":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M4 8.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2.5" />
          <path d="M4 15.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2.5" />
          <path d="M8 12h.01M12 12h.01M16 12h.01" strokeLinecap="round" />
        </svg>
      );
    case "ACHIEVEMENT":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="M8 21h8M12 17v4M7.5 4.5 12 2l4.5 2.5L12 11 7.5 8.5Z"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "RANKING":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M4 18V9l4 2V9l4-3 4 3v2l4-2v9" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
        </svg>
      );
  }
}
