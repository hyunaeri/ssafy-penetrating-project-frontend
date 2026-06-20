"use client";

import type { ReactNode } from "react";
import { useAdminGuard } from "@/shared/lib/use-admin-guard";
import { AdminNav } from "@/features/admin-shared/ui/AdminNav";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const ready = useAdminGuard();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-[14px] text-muted">관리자 권한을 확인하는 중입니다</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminNav />
      <main className="min-w-0 flex-1 overflow-auto">{children}</main>
    </div>
  );
}
