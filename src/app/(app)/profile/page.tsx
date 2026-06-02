"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "@/entities/user";
import { CartEntryButton } from "@/features/cart";
import { AlarmButton } from "@/features/notification";
import { ProfileContent, useProfile } from "@/features/profile";
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      await queryClient.invalidateQueries({ queryKey: ["favorites"] });
      notifySuccess(toastMessages.logout.success);
      router.replace("/login");
    },
    onError: () => {
      notifyError(toastMessages.logout.fail);
    },
  });

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <div className="flex min-h-full flex-col bg-surface">
      <BackHeader
        title="내 정보"
        trailing={
          <>
            <AlarmButton />
            <CartEntryButton />
          </>
        }
      />

      <div className="flex flex-1 flex-col px-5 py-6">
        <p className="mb-6 text-[14px] text-muted">
          프로필과 계정 정보를 확인할 수 있습니다.
        </p>

      {loading && (
        <p className="flex flex-1 items-center justify-center text-[14px] text-muted">
          정보를 불러오는 중입니다
        </p>
      )}

      {!loading && error && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <p className="text-[14px] text-red-600">{error}</p>
          <PrimaryButton type="button" variant="outline" onClick={() => void reload()}>
            다시 시도
          </PrimaryButton>
        </div>
      )}

      {!loading && user && <ProfileContent user={user} />}

      <div className="mt-8">
        <PrimaryButton
          type="button"
          variant="outline"
          onClick={() => void handleLogout()}
          disabled={logoutMutation.isPending}
        >
          로그아웃
        </PrimaryButton>
      </div>
      </div>
    </div>
  );
}
