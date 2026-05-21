"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/entities/user";
import { ProfileContent, useProfile } from "@/features/profile";
import {
  notifyError,
  notifySuccess,
  PrimaryButton,
  toastMessages,
} from "@/shared/ui";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, error, reload } = useProfile();

  const handleLogout = async () => {
    try {
      await logout();
      notifySuccess(toastMessages.logout.success);
      router.replace("/login");
    } catch {
      notifyError(toastMessages.logout.fail);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col px-5 py-10">
      <header className="mb-6">
        <h1 className="text-[22px] font-bold text-ink">내 정보</h1>
        <p className="mt-2 text-[14px] text-muted">프로필과 계정 정보를 확인할 수 있습니다.</p>
      </header>

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
        <PrimaryButton type="button" variant="outline" onClick={() => void handleLogout()}>
          로그아웃
        </PrimaryButton>
      </div>
    </div>
  );
}
