"use client";

import type { ReactNode } from "react";
import { NotificationStreamProvider } from "@/features/notification";
import { useRoleGuard } from "@/shared/lib/use-role-guard";
import { PageTransition } from "@/shared/ui/page-transition";
import { BottomNav, BOTTOM_NAV_HEIGHT_PX } from "@/widgets/bottom-nav";
import { OWNER_BOTTOM_NAV_ITEMS } from "@/widgets/bottom-nav/model/owner-items";

type OwnerAppShellProps = {
  children: ReactNode;
};

export function OwnerAppShell({ children }: OwnerAppShellProps) {
  const ready = useRoleGuard("owner");

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
      <div style={{ paddingBottom: BOTTOM_NAV_HEIGHT_PX }}>
        <PageTransition>{children}</PageTransition>
      </div>
      <BottomNav items={OWNER_BOTTOM_NAV_ITEMS} />
    </div>
  );
}
