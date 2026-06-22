"use client";

import { useState } from "react";
import { BackHeader } from "@/shared/ui";
import { useNotifications } from "@/features/notification/hooks/use-notifications";
import { NotificationItem } from "@/features/notification/ui/NotificationItem";

type TabKey = "unread" | "read";

export function NotificationScreen() {
  const [tab, setTab] = useState<TabKey>("unread");
  const {
    unread,
    read,
    unreadCount,
    loading,
    error,
    reload,
    markAsRead,
    markAllAsRead,
    markingAll,
  } = useNotifications();

  const list = tab === "unread" ? unread : read;

  return (
    <div className="screen-viewport flex flex-col bg-surface">
      <BackHeader
        title="알림"
        trailing={
          <button
            type="button"
            onClick={() => markAllAsRead()}
            disabled={markingAll || unreadCount === 0}
            className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-brand-dark transition-colors hover:bg-brand-soft disabled:opacity-40"
          >
            모두 읽음
          </button>
        }
      />

      <div className="flex border-b border-line/80 bg-white px-2">
        <TabButton
          active={tab === "unread"}
          label="안 읽음"
          count={unread.length}
          onClick={() => setTab("unread")}
        />
        <TabButton
          active={tab === "read"}
          label="읽음"
          count={read.length}
          onClick={() => setTab("read")}
        />
      </div>

      <div className="screen-body">
        {loading && (
          <div className="screen-state">
            <p className="text-[14px] text-muted">알림을 불러오는 중입니다</p>
          </div>
        )}

        {!loading && error && (
          <div className="screen-state gap-3">
            <p className="text-[14px] text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => void reload()}
              className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-ink"
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && list.length === 0 && (
          <div className="screen-state gap-2">
            <p className="text-[15px] font-bold text-ink">
              {tab === "unread"
                ? "읽지 않은 알림이 없어요"
                : "읽은 알림이 없어요"}
            </p>
            <p className="text-[13px] text-muted">
              새로운 소식이 오면 여기에서 확인할 수 있어요.
            </p>
          </div>
        )}

        {!loading && !error && list.length > 0 && (
          <ul className="flex flex-col gap-3 px-4 py-4">
            {list.map((notification) => (
              <li key={notification.id}>
                <NotificationItem
                  notification={notification}
                  onClick={(n) => markAsRead(n.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

type TabButtonProps = {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
};

function TabButton({ active, label, count, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex-1 px-3 py-3 text-[14px] font-semibold transition-colors ${
        active ? "text-brand-dark" : "text-muted"
      }`}
    >
      <span>
        {label}
        {count > 0 && (
          <span className={active ? "text-brand-dark" : "text-muted"}>
            {" "}
            {count}
          </span>
        )}
      </span>
      {active && (
        <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand" />
      )}
    </button>
  );
}
