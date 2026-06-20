"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/entities/session";
import {
  getCurrentUser,
  getHomePathByRole,
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
      if (!getAccessToken()) {
        router.replace("/login");
        return;
      }

      try {
        const user = await getCurrentUser();
        if (cancelled) return;

        const allowed =
          requiredRole === "customer"
            ? isCustomerRole(user.role)
            : isOwnerRole(user.role);

        if (!allowed) {
          router.replace(getHomePathByRole(user.role));
          return;
        }

        setReady(true);
      } catch {
        if (!cancelled) {
          router.replace("/login");
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [requiredRole, router]);

  return ready;
}
