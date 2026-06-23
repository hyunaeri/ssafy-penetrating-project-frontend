"use client";

import { useEffect, useState } from "react";
import {
  ensureSession,
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
      const session = await ensureSession();
      if (!session) {
        router.replace(ADMIN_LOGIN_PATH);
        return;
      }

      const user = session.user;
      if (cancelled) return;

      if (!isAdminRole(user.role)) {
        router.replace(getHomePathByRole(user.role));
        return;
      }

      setReady(true);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return ready;
}
