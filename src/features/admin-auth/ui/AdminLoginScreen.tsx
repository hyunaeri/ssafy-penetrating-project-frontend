"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleLoginButton } from "@/features/auth/google-login";
import { LoginMobileShell } from "@/features/auth/login/ui/LoginMobileShell";
import { getAccessToken } from "@/entities/session";
import {
  getCurrentUser,
  getHomePathByRole,
  isAdminRole,
} from "@/entities/user";
import { useAppRouter } from "@/shared/lib/use-app-router";

export function AdminLoginScreen() {
  const router = useAppRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!getAccessToken()) {
        if (!cancelled) setCheckingSession(false);
        return;
      }

      try {
        const user = await getCurrentUser();
        if (cancelled) return;

        if (isAdminRole(user.role)) {
          router.replace("/admin");
          return;
        }

        router.replace(getHomePathByRole(user.role));
      } catch {
        if (!cancelled) setCheckingSession(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checkingSession) {
    return (
      <LoginMobileShell>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-[14px] text-muted">세션을 확인하는 중입니다</p>
        </div>
      </LoginMobileShell>
    );
  }

  return (
    <LoginMobileShell
      footer={
        <div className="space-y-3 text-center">
          <p className="text-[11px] leading-relaxed text-muted">
            등록되지 않은 계정으로 로그인하면 접근이 제한됩니다.
          </p>
          <p className="text-[12px] text-muted">
            고객 및 점주 이신가요?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-dark underline-offset-2 hover:underline"
            >
              일반 로그인
            </Link>
          </p>
        </div>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center px-2">
        <div className="relative inline-block">
          <h1
            className="font-euljiro -rotate-[4deg] text-[clamp(4.5rem,18vw,6rem)] leading-none tracking-wide text-brand-dark"
            aria-label="Whik Admin"
          >
            Whik
          </h1>
          <span className="absolute bottom-2 right-0 translate-x-3 font-euljiro text-[11px] font-medium text-muted">
            Admin
          </span>
        </div>

        <div className="mt-16 w-full">
          <GoogleLoginButton intent="admin" label="Google로 관리자 로그인" />
        </div>
      </div>
    </LoginMobileShell>
  );
}
