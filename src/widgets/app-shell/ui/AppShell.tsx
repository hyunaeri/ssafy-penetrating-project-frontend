"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/entities/session";
import { BottomNav, BOTTOM_NAV_HEIGHT_PX } from "@/widgets/bottom-nav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-mobile items-center justify-center bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
        <p className="text-[14px] text-muted">불러오는 중입니다</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-mobile bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
      <div style={{ paddingBottom: BOTTOM_NAV_HEIGHT_PX }}>{children}</div>
      <BottomNav />
    </div>
  );
}
