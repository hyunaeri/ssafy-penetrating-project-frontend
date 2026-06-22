"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { NotificationStreamProvider } from "@/features/notification";
import { useRoleGuard } from "@/shared/lib/use-role-guard";
import { PageTransition } from "@/shared/ui/page-transition";
import { BottomNav, BOTTOM_NAV_HEIGHT_PX } from "@/widgets/bottom-nav";
import { CUSTOMER_BOTTOM_NAV_ITEMS } from "@/widgets/bottom-nav/model/customer-items";

type CustomerAppShellProps = {
  children: ReactNode;
};

const FULL_SCREEN_PREFIXES = ["/stores/", "/payment/success", "/orders/"];

export function CustomerAppShell({ children }: CustomerAppShellProps) {
  const pathname = usePathname();
  const ready = useRoleGuard("customer");
  const hideBottomNav = FULL_SCREEN_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

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
      {!hideBottomNav && <BottomNav items={CUSTOMER_BOTTOM_NAV_ITEMS} />}
    </div>
  );
}
