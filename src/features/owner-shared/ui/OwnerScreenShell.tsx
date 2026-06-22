import type { ReactNode } from "react";

type OwnerScreenShellProps = {
  children: ReactNode;
};

export function OwnerScreenShell({ children }: OwnerScreenShellProps) {
  return (
    <div className="screen-viewport flex flex-col bg-surface">
      {children}
    </div>
  );
}
