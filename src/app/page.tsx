"use client";

import { useEffect } from "react";
import { ensureSession, getHomePathByRole } from "@/entities/user";
import { useAppRouter } from "@/shared/lib/use-app-router";

export default function HomePage() {
  const router = useAppRouter();

  useEffect(() => {
    void ensureSession().then((session) => {
      if (!session) {
        router.replace("/login");
        return;
      }

      router.replace(getHomePathByRole(session.user.role));
    });
  }, [router]);

  return (
    <div className="shell-frame flex min-h-screen items-center justify-center bg-surface">
      <p className="text-[13px] text-muted">잠시만 기다려 주세요</p>
    </div>
  );
}
