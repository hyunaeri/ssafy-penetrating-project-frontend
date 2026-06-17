"use client";

import { useAppRouter } from "@/shared/lib/use-app-router";
import { HeaderIconButton } from "@/shared/ui/header-icon-link";
import { useNotifications } from "@/features/notification/hooks/use-notifications";

export function AlarmButton() {
  const router = useAppRouter();
  const { unreadCount } = useNotifications();

  const label =
    unreadCount > 0 ? `알림, 읽지 않은 ${unreadCount}건` : "알림";

  return (
    <div className="relative shrink-0">
      <HeaderIconButton label={label} onClick={() => router.push("/notifications")}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </HeaderIconButton>
      {unreadCount > 0 && (
        <span
          aria-hidden
          className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#d94f72] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );
}
