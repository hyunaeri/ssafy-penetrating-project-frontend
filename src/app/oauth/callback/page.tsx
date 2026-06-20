"use client";

import { Suspense, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MobileShell,
  notifyError,
  notifySuccess,
  toastMessages,
} from "@/shared/ui";
import {
  fetchCurrentUser,
  getHomePathByRole,
  getLoginSuccessToast,
  isAdminRole,
} from "@/entities/user";
import { clearAccessToken, setAccessToken } from "@/entities/session";
import {
  clearOAuthIntent,
  getOAuthIntent,
} from "@/shared/lib/oauth-intent";

function OAuthCallbackContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("로그인 처리 중입니다");

  const loginMutation = useMutation({
    mutationFn: async (accessToken: string) => {
      setAccessToken(accessToken);
      return fetchCurrentUser(accessToken);
    },
    onSuccess: async (user) => {
      const intent = getOAuthIntent();
      clearOAuthIntent();

      if (intent === "admin" && !isAdminRole(user.role)) {
        clearAccessToken();
        notifyError(toastMessages.admin.notRegistered);
        router.replace("/admin/login");
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      await queryClient.invalidateQueries({ queryKey: ["favorites"] });
      notifySuccess(getLoginSuccessToast(user.role));
      router.replace(getHomePathByRole(user.role));
    },
    onError: () => {
      const intent = getOAuthIntent();
      clearOAuthIntent();
      setMessage("로그인에 실패했어요. 잠시 후 다시 시도해 주세요.");
      notifyError(toastMessages.login.fail);
      const fallback = intent === "admin" ? "/admin/login" : "/login";
      setTimeout(() => router.replace(fallback), 2000);
    },
  });

  const completeLogin = loginMutation.mutate;

  useEffect(() => {
    const accessToken = searchParams?.get("accessToken");

    if (!accessToken) {
      setMessage("인증 정보를 찾을 수 없어요. 다시 시도해 주세요.");
      notifyError(toastMessages.login.failNoToken);

      const intent = getOAuthIntent();
      clearOAuthIntent();
      const fallback = intent === "admin" ? "/admin/login" : "/login";
      const timer = setTimeout(() => router.replace(fallback), 2000);
      return () => clearTimeout(timer);
    }

    completeLogin(accessToken);
  }, [completeLogin, router, searchParams]);

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
