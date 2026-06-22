"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { NotificationStreamProvider } from "@/features/notification";
import { useRoleGuard } from "@/shared/lib/use-role-guard";
import { PageTransition } from "@/shared/ui/page-transition";
import { ScrollToTopFab } from "@/shared/ui/scroll-to-top";
import { BottomNav, BOTTOM_NAV_HEIGHT_PX } from "@/widgets/bottom-nav";
import { CUSTOMER_BOTTOM_NAV_ITEMS } from "@/widgets/bottom-nav/model/customer-items";

type CustomerAppShellProps = {
  children: ReactNode;
};

const FULL_SCREEN_PREFIXES = ["/stores/", "/payment/success", "/orders/"];

function shouldHideScrollToTop(pathname: string) {
  return (
    pathname.includes("/tracking") || pathname.startsWith("/payment/")
  );
}

function getScrollToTopBottomClass(pathname: string, hideBottomNav: boolean) {
  if (pathname.startsWith("/stores/")) {
    return "bottom-24 right-[max(1.25rem,calc((100%-430px)/2+1.25rem))]";
  }

  if (hideBottomNav) {
    return "bottom-5 right-[max(1.25rem,calc((100%-430px)/2+1.25rem))]";
  }

  return undefined;
}

export function CustomerAppShell({ children }: CustomerAppShellProps) {
  const pathname = usePathname();
  const ready = useRoleGuard("customer");
  const hideBottomNav = FULL_SCREEN_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const hideScrollToTop = shouldHideScrollToTop(pathname);

  if (!ready) {
    return (
      <div className="shell-frame flex min-h-screen items-center justify-center">
        <p className="text-[14px] text-muted">불러오는 중입니다</p>
      </div>
    );
  }

  return (
    <div
      className="shell-frame relative flex min-h-screen flex-col"
      style={
        {
          "--screen-viewport-height": hideBottomNav
            ? "100dvh"
            : `calc(100dvh - ${BOTTOM_NAV_HEIGHT_PX}px)`,
          ...(hideBottomNav ? {} : { paddingBottom: BOTTOM_NAV_HEIGHT_PX }),
        } as React.CSSProperties
      }
    >
      <NotificationStreamProvider />
      <PageTransition>{children}</PageTransition>
      <ScrollToTopFab
        enabled={!hideScrollToTop}
        bottomClassName={getScrollToTopBottomClass(pathname, hideBottomNav)}
      />
      {!hideBottomNav && <BottomNav items={CUSTOMER_BOTTOM_NAV_ITEMS} />}
    </div>
  );
}
