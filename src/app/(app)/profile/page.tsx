"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "@/entities/user";
import { CartEntryButton } from "@/features/cart";
import { AlarmButton } from "@/features/notification";
import { stopNotificationStream } from "@/features/notification/store/notification-stream-store";
import { ProfileContent, useProfile } from "@/features/profile";
import { setNavigationDirection } from "@/shared/lib/navigation-direction";
import {
  BackHeader,
  notifyError,
  notifySuccess,
  PrimaryButton,
  toastMessages,
} from "@/shared/ui";

export default function ProfilePage() {
  const router = useRouter();
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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isLoggingOut = logoutMutation.isPending;
  const showProfile = !isLoggingOut && !loading && !error && user;

  return (
    <div className="screen-viewport flex flex-col bg-surface">
      <BackHeader
        title="내 정보"
        trailing={
          <>
            <AlarmButton />
            <CartEntryButton />
          </>
        }
      />

      <div className="screen-body px-5 py-6">
        <p className="mb-6 text-[14px] text-muted">
          프로필과 계정 정보를 확인할 수 있습니다.
        </p>

        {isLoggingOut && (
          <div className="screen-state">
            <p className="text-[14px] text-muted">로그아웃하는 중입니다</p>
          </div>
        )}

        {!isLoggingOut && loading && (
          <div className="screen-state">
            <p className="text-[14px] text-muted">정보를 불러오는 중입니다</p>
          </div>
        )}

        {!isLoggingOut && !loading && error && (
          <div className="screen-state gap-4">
            <p className="text-[14px] text-red-600">{error}</p>
            <PrimaryButton
              type="button"
              variant="outline"
              onClick={() => void reload()}
            >
              다시 시도
            </PrimaryButton>
          </div>
        )}

        {showProfile && <ProfileContent user={user} />}

        <div className="mt-8">
          <PrimaryButton
            type="button"
            variant="outline"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            로그아웃
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
