"use client";

import { useEffect } from "react";
import { getAccessToken } from "@/entities/session";
import { getCurrentUser, getHomePathByRole } from "@/entities/user";
import { useAppRouter } from "@/shared/lib/use-app-router";

export default function HomePage() {
  const router = useAppRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    void getCurrentUser()
      .then((user) => {
        router.replace(getHomePathByRole(user.role));
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  return (
    <div className="shell-frame flex min-h-screen items-center justify-center bg-surface">
      <p className="text-[13px] text-muted">잠시만 기다려 주세요</p>
    </div>
  );
}
