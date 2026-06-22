"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "@/entities/user";
import { OwnerErrorState, OwnerPageHeader, OwnerScreenShell } from "@/features/owner-shared";
import { ProfileContent, useProfile } from "@/features/profile";
import { setNavigationDirection } from "@/shared/lib/navigation-direction";
import {
  notifyError,
  notifySuccess,
  PrimaryButton,
  toastMessages,
} from "@/shared/ui";

export function OwnerProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading, error, reload } = useProfile();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
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

  return (
    <OwnerScreenShell>
      <OwnerPageHeader title="내 정보" />

      <div className="screen-body px-5 py-6">
        <p className="mb-6 text-[14px] text-muted">
          점주 계정 정보를 확인할 수 있습니다.
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
          <OwnerErrorState
            message={error}
            onRetry={() => void reload()}
            className="flex-1"
          />
        )}

        {showProfile && <ProfileContent user={user} />}

        <div className="mt-8">
          <PrimaryButton
            type="button"
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={isLoggingOut}
          >
            로그아웃
          </PrimaryButton>
        </div>
      </div>
    </OwnerScreenShell>
  );
}
