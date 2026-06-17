"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAppRouter } from "@/shared/lib/use-app-router";
import { getAccessToken } from "@/entities/session";
import { NotificationStreamProvider } from "@/features/notification";
import { PageTransition } from "@/shared/ui/page-transition";
import { BottomNav, BOTTOM_NAV_HEIGHT_PX } from "@/widgets/bottom-nav";

type AppShellProps = {
  children: ReactNode;
};

const FULL_SCREEN_PREFIXES = ["/stores/"];

export function AppShell({ children }: AppShellProps) {
  const router = useAppRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const hideBottomNav = FULL_SCREEN_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="shell-frame flex min-h-screen items-center justify-center">
        <p className="text-[14px] text-muted">불러오는 중입니다</p>
      </div>
    );
  }

  return (
    <div className="shell-frame relative min-h-screen">
      <NotificationStreamProvider />
      <div
        style={
          hideBottomNav ? undefined : { paddingBottom: BOTTOM_NAV_HEIGHT_PX }
        }
      >
        <PageTransition>{children}</PageTransition>
      </div>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
