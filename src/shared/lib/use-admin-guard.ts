"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/entities/session";
import {
  getCurrentUser,
  getHomePathByRole,
  isAdminRole,
} from "@/entities/user";
import { useAppRouter } from "@/shared/lib/use-app-router";

const ADMIN_LOGIN_PATH = "/admin/login";

/**
 * 관리자 전용 가드. 소셜 로그인(/login)이 아닌 /admin/login으로 보낸다.
 */
export function useAdminGuard(): boolean {
  const router = useAppRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!getAccessToken()) {
        router.replace(ADMIN_LOGIN_PATH);
        return;
      }

      try {
        const user = await getCurrentUser();
        if (cancelled) return;

        if (!isAdminRole(user.role)) {
          router.replace(getHomePathByRole(user.role));
          return;
        }

        setReady(true);
      } catch {
        if (!cancelled) {
          router.replace(ADMIN_LOGIN_PATH);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return ready;
}
