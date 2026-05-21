"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MobileShell,
  notifyError,
  notifySuccess,
  toastMessages,
} from "@/shared/ui";
import { fetchCurrentUser } from "@/entities/user";
import { setAccessToken } from "@/entities/session";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("로그인 처리 중입니다");

  useEffect(() => {
    const accessToken = searchParams?.get("accessToken");

    if (!accessToken) {
      setMessage("인증 정보를 찾을 수 없어요. 다시 시도해 주세요.");
      notifyError(toastMessages.login.failNoToken);
      const timer = setTimeout(() => router.replace("/login"), 2000);
      return () => clearTimeout(timer);
    }

    const complete = async () => {
      try {
        setAccessToken(accessToken);
        await fetchCurrentUser(accessToken);
        notifySuccess(toastMessages.login.success);
        router.replace("/main");
      } catch {
        setMessage("로그인에 실패했어요. 잠시 후 다시 시도해 주세요.");
        notifyError(toastMessages.login.fail);
        setTimeout(() => router.replace("/login"), 2000);
      }
    };

    void complete();
  }, [router, searchParams]);

  return (
    <MobileShell title="연동 중">
      <p className="text-[14px] text-muted">{message}</p>
    </MobileShell>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <MobileShell title="연동 중">
          <p className="text-[14px] text-muted">로그인 처리 중입니다</p>
        </MobileShell>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
