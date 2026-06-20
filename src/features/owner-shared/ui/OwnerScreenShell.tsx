import type { ReactNode } from "react";
import { BOTTOM_NAV_HEIGHT_PX } from "@/widgets/bottom-nav";

type OwnerScreenShellProps = {
  children: ReactNode;
};

export function OwnerScreenShell({ children }: OwnerScreenShellProps) {
  return (
    <div
      className="flex flex-col bg-surface"
      style={{ minHeight: `calc(100dvh - ${BOTTOM_NAV_HEIGHT_PX}px)` }}
    >
      {children}
    </div>
  );
}
