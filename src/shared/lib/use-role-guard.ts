"use client";

import { useEffect, useState } from "react";
import {
  ensureSession,
  getHomePathByRole,
  isAdminRole,
  isCustomerRole,
  isOwnerRole,
} from "@/entities/user";
import { useAppRouter } from "@/shared/lib/use-app-router";

export type AppRole = "customer" | "owner";

/**
 * 로그인·역할을 확인한 뒤 해당 Shell만 렌더링한다.
 * 역할이 맞지 않으면 role별 홈으로 보낸다.
 */
export function useRoleGuard(requiredRole: AppRole): boolean {
  const router = useAppRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const session = await ensureSession();
      if (!session) {
        router.replace("/login");
        return;
      }

      const user = session.user;
      if (cancelled) return;

      if (isAdminRole(user.role)) {
        router.replace(getHomePathByRole(user.role));
        return;
      }

      const allowed =
        requiredRole === "customer"
          ? isCustomerRole(user.role)
          : isOwnerRole(user.role);

      if (!allowed) {
        router.replace(getHomePathByRole(user.role));
        return;
      }

      setReady(true);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [requiredRole, router]);

  return ready;
}
