"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatProviderLabel, logout, type UserResponse } from "@/entities/user";
import { CartEntryButton } from "@/features/cart";
import { AlarmButton } from "@/features/notification";
import { stopNotificationStream } from "@/features/notification/store/notification-stream-store";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { setNavigationDirection } from "@/shared/lib/navigation-direction";
import { useAppRouter } from "@/shared/lib/use-app-router";
import {
  BackHeader,
  notifyError,
  notifySuccess,
  PrimaryButton,
  toastMessages,
} from "@/shared/ui";

type ProfileMenuItem = {
  label: string;
  href: string;
  description?: string;
  icon: ReactNode;
};

function ChevronRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function GoogleProviderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92a8.78 8.78 0 0 0 2.68-6.61z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.16.29-1.71V4.96H.96a9 9 0 0 0 0 8.04l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.92 8.92 0 0 0 9 0 9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.42 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}

function DefaultProviderIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ProviderBadge({ provider }: { provider: string }) {
  const label = formatProviderLabel(provider);
  const isGoogle = provider.trim().toUpperCase() === "GOOGLE";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-[12px] font-semibold text-muted ring-1 ring-inset ring-line">
      {isGoogle ? <GoogleProviderIcon /> : <DefaultProviderIcon />}
      {label} 로그인
    </span>
  );
}

function ProfileAvatar({ user }: { user: UserResponse }) {
  const initial = user.nickname?.charAt(0) ?? "?";

  if (user.profileImageUrl) {
    return (
      <Image
        src={user.profileImageUrl}
        alt=""
        width={96}
        height={96}
        className="h-24 w-24 rounded-full object-cover ring-4 ring-brand-soft"
        unoptimized
      />
    );
  }

  return (
    <span className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-soft text-[28px] font-bold text-brand-dark ring-4 ring-brand-soft">
      {initial}
    </span>
  );
}

function ProfileMenuRow({
  item,
  onNavigate,
}: {
  item: ProfileMenuItem;
  onNavigate: (href: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(item.href)}
      className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-surface/80 active:bg-surface"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface text-brand-dark ring-1 ring-inset ring-line/80">
        {item.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold text-ink">{item.label}</span>
        {item.description && (
          <span className="mt-0.5 block text-[12px] text-muted">
            {item.description}
          </span>
        )}
      </span>
      <span className="shrink-0 text-muted">
        <ChevronRightIcon />
      </span>
    </button>
  );
}

const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  {
    label: "찜한 가게",
    href: "/favorite",
    description: "저장한 매장을 다시 볼 수 있어요",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 21s-6.716-4.284-9.193-7.86C.57 10.44 1.005 6.32 4.02 4.74c2.34-1.24 4.97-.18 6.48 1.86L12 6.9l1.5-1.3c1.51-2.04 4.14-3.1 6.48-1.86 3.015 1.58 3.45 5.7 1.213 8.4C18.716 16.716 12 21 12 21z" />
      </svg>
    ),
  },
  {
    label: "주문내역",
    href: "/orders",
    description: "지난 주문과 배달 상태를 확인해요",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h6" />
      </svg>
    ),
  },
  {
    label: "도감",
    href: "/catalog",
    description: "업적을 모아 수집 현황을 확인해요",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8M8 11h6" />
      </svg>
    ),
  },
];

export function ProfileScreen() {
  const router = useAppRouter();
  const queryClient = useQueryClient();
  const { user, loading, error, reload } = useProfile();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      stopNotificationStream();
      void queryClient.cancelQueries();
      queryClient.clear();
      setNavigationDirection("replace");
      notifySuccess(toastMessages.logout.success);
      router.replace("/login");
    },
    onError: () => {
      notifyError(toastMessages.logout.fail);
    },
  });

  const isLoggingOut = logoutMutation.isPending;
  const showProfile = !isLoggingOut && !loading && !error && user;

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <div className="screen-viewport bg-surface">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm">
        <BackHeader
          sticky={false}
          title="마이페이지"
          trailing={
            <>
              <AlarmButton />
              <CartEntryButton />
            </>
          }
        />
      </div>

      <div className="screen-body px-4 pb-8 pt-2">
        {isLoggingOut && (
          <div className="screen-state">
            <p className="text-[14px] text-muted">로그아웃하는 중입니다</p>
          </div>
        )}

        {!isLoggingOut && loading && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-24 w-24 animate-pulse rounded-full bg-white" />
            <div className="h-5 w-28 animate-pulse rounded-sm bg-white" />
            <div className="mt-4 h-40 w-full animate-pulse rounded-card bg-white" />
          </div>
        )}

        {!isLoggingOut && !loading && error && (
          <div className="screen-state gap-4">
            <p className="text-[14px] text-red-600">{error}</p>
            <PrimaryButton
              type="button"
              variant="outline"
              className="max-w-[200px]"
              onClick={() => void reload()}
            >
              다시 시도
            </PrimaryButton>
          </div>
        )}

        {showProfile && (
          <>
            <section className="flex flex-col items-center px-2 pb-6 pt-4">
              <ProfileAvatar user={user} />
              <h2 className="mt-4 text-[20px] font-bold text-ink">
                {user.nickname}
              </h2>
              <div className="mt-3">
                <ProviderBadge provider={user.provider} />
              </div>
            </section>

            <section className="soft-card overflow-hidden">
              {PROFILE_MENU_ITEMS.map((item, index) => (
                <div
                  key={item.href}
                  className={index > 0 ? "border-t border-line/70" : ""}
                >
                  <ProfileMenuRow item={item} onNavigate={handleNavigate} />
                </div>
              ))}
            </section>

            <div className="mt-6">
              <PrimaryButton
                type="button"
                variant="outline"
                onClick={() => logoutMutation.mutate()}
                disabled={isLoggingOut}
              >
                로그아웃
              </PrimaryButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
