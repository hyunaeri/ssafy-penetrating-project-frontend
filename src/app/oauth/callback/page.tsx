"use client";

import { Suspense, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  MobileShell,
  notifyError,
  notifySuccess,
  toastMessages,
} from "@/shared/ui";
import {
  ensureSession,
  getHomePathByRole,
  getLoginSuccessToast,
  isAdminRole,
} from "@/entities/user";
import { clearSession } from "@/entities/session";
import {
  clearOAuthIntent,
  getOAuthIntent,
} from "@/shared/lib/oauth-intent";

function OAuthCallbackContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("로그인 처리 중입니다");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const session = await ensureSession();
      if (!session) {
        throw new Error("토큰 재발급에 실패했습니다.");
      }
      return session.user;
    },
    onSuccess: async (user) => {
      const intent = getOAuthIntent();
      clearOAuthIntent();

      if (intent === "admin" && !isAdminRole(user.role)) {
        clearSession();
        notifyError(toastMessages.admin.notRegistered);
        router.replace("/admin/login");
        return;
      }

      queryClient.setQueryData(["currentUser"], user);
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
    completeLogin();
  }, [completeLogin]);

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
